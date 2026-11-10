# Decision Point: A game for Postgres solution accelerator

## Introduction

**Decision Point: A game for Postgres** is a developer game about architecture decisions for PostgreSQL-based AI applications and agents. This companion solution accelerator uses Basket IQ, a fictional shopping agent for Contoso, to demonstrate how to:

- Improve product discovery with hybrid search.
- Keep recommendations current when the product catalog changes.
- Scale the retrieval layer as traffic and data volume grow.

The tutorial uses Azure HorizonDB, a generally available, fully managed PostgreSQL-compatible database with independent compute and storage scaling.

This repository is intended as a learning environment and proof of concept. Review the security, networking, availability, and capacity requirements before adapting it for production.

## Table of contents

- [Start with an Azure free account](#start-with-an-azure-free-account)
- [What you will build](#what-you-will-build)
- [Prerequisites](#prerequisites)
- [Tutorial](#tutorial)
- [Cost guidance](#cost-guidance)
- [References](#references)

## Start with an Azure free account

1. Go to [Create your Azure free account](https://azure.microsoft.com/free/).
2. Sign in with a Microsoft or GitHub account.
3. Complete identity verification. Azure requires a phone number and a non-prepaid credit or debit card. A temporary authorization hold may appear during verification.
4. Open the [Azure portal](https://portal.azure.com/) and confirm that the free-trial subscription is selected.

New customers receive a $200 Azure credit that can be used for up to 30 days. The account also includes limited quantities of selected services that are free for 12 months or always free. Offers and service eligibility can change.

Azure does not charge the card unless you choose to move to pay-as-you-go. To keep using the account after the credit expires or is consumed, you must move to pay-as-you-go. If you upgrade before day 30, the unused credit remains available until the original 30-day period ends.

Before deploying:

- Confirm that Azure HorizonDB is available in your selected region.
- Review current pricing on the [Azure HorizonDB product page](https://azure.microsoft.com/products/horizondb).
- Estimate any Microsoft Foundry model usage separately.
- Create a budget and alerts in Azure Cost Management. Budget alerts notify you about spending but do not stop resources automatically.

The tutorial is designed to minimize cost, but it does not guarantee that every deployment will remain within the $200 credit.

## What you will build

The accelerator uses a small retail catalog and an agent that answers product questions.

```text
User
  |
Basket IQ application
  |
  +-- BM25 keyword search
  +-- DiskANN vector search
  +-- Structured catalog filters
  +-- Reciprocal Rank Fusion
  |
Azure HorizonDB
```

The tutorial covers:

1. Hybrid search with BM25, vector similarity, structured filters, and Reciprocal Rank Fusion.
2. A catalog-refresh process that updates embeddings when products change.
3. Performance improvements using DiskANN advanced filtering, optional spherical quantization, compute scaling, and read replicas.

## Prerequisites

- An Azure subscription with enough remaining credit for the selected resources
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- [PostgreSQL extension for Visual Studio Code](https://learn.microsoft.com/azure/postgresql/development/vs-code-extension/postgresql-extension-overview) (recommended), or PostgreSQL command-line tools such as `psql`
- An embedding model available through Microsoft Foundry or the application
- A small product catalog with product text, price, availability, and other filterable attributes

Use the smallest HorizonDB configuration that supports the tutorial. Start with one compute replica and add readable replicas only when testing scale-out.

## Tutorial

### 1. Create the HorizonDB cluster

Install the HorizonDB Azure CLI extension:

```bash
az extension add --name horizondb
```

Create a resource group:

```bash
az group create \
  --name <resource-group> \
  --location <location>
```

Create the cluster:

```bash
az horizondb create \
  --resource-group <resource-group> \
  --name <cluster-name> \
  --location <location> \
  --version 17 \
  --administrator-login <admin-user> \
  --administrator-login-password <password> \
  --v-cores 2
```

Configure public access and a firewall rule in the Azure portal, or use Private Link for private connectivity. Follow the [HorizonDB cluster quickstart](https://learn.microsoft.com/azure/horizondb/configure-maintain/quickstart-create-cluster) for the current networking steps.

For the lowest-cost tutorial path:

- Deploy to one region.
- Start with one compute replica.
- Use a small sample catalog.
- Place all tutorial resources in a dedicated resource group.

### 2. Enable the search extensions

HorizonDB allowlists PostgreSQL extensions through a parameter group.

Create a parameter group:

```bash
az horizondb parameter-group create \
  --location <location> \
  --resource-group <resource-group> \
  --name <parameter-group-name> \
  --version 17 \
  --parameters \
    azure.extensions="vector,pg_diskann,pg_textsearch" \
    shared_preload_libraries="pg_textsearch" \
  --apply-immediately true \
  --description "Decision Point search extensions"
```

Connect the parameter group to the cluster:

```bash
az horizondb update \
  --resource-group <resource-group> \
  --name <cluster-name> \
  --parameter-group <parameter-group-name>
```

Connect to the application database and create the extensions:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_diskann CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_textsearch;
```

The installable extension name for pgvector is `vector`. DiskANN is provided by the separate `pg_diskann` extension.

### 3. Create the product catalog

The embedding dimension must match the embedding model used by the application. This example uses 1,536 dimensions.

```sql
CREATE TABLE products (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku         TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL,
    category    TEXT,
    color       TEXT,
    price       NUMERIC(10,2),
    is_active   BOOLEAN NOT NULL DEFAULT true,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    embedding   VECTOR(1536)
);

CREATE INDEX idx_products_bm25
    ON products
    USING bm25 (description)
    WITH (text_config = 'english');

CREATE INDEX idx_products_diskann
    ON products
    USING diskann (embedding vector_cosine_ops);

CREATE INDEX idx_products_filters
    ON products (is_active, category, price);
```

Generate embeddings in the application or use the AI functions available for HorizonDB. Store one embedding for each active product and regenerate it when the searchable product text changes.

### 4. Build hybrid product search

For each query:

1. Generate a query embedding.
2. Run BM25 search for exact terms, product names, and SKUs.
3. Run DiskANN vector search for semantic similarity.
4. Apply filters such as availability, category, price, and color.
5. Merge the two ranked lists with Reciprocal Rank Fusion.
6. Optionally rerank the small final candidate set before returning it to the agent.

The following query expects `:query_text` and `:query_vector` parameters from the application:

```sql
WITH bm25_results AS (
    SELECT id,
           ROW_NUMBER() OVER (
               ORDER BY description <@> to_bm25query(
                   :query_text,
                   'idx_products_bm25')
           ) AS bm25_rank
    FROM products
    WHERE is_active = true
      AND price <= :max_price
    ORDER BY description <@> to_bm25query(
        :query_text,
        'idx_products_bm25')
    LIMIT 50
),
vector_results AS (
    SELECT id,
           ROW_NUMBER() OVER (
               ORDER BY embedding <=> :query_vector
           ) AS vector_rank
    FROM products
    WHERE is_active = true
      AND price <= :max_price
    ORDER BY embedding <=> :query_vector
    LIMIT 50
)
SELECT p.id,
       p.sku,
       p.name,
       p.price,
       (1.0 / (60 + COALESCE(b.bm25_rank, 1000))) +
       (1.0 / (60 + COALESCE(v.vector_rank, 1000))) AS rrf_score
FROM products p
LEFT JOIN bm25_results b ON b.id = p.id
LEFT JOIN vector_results v ON v.id = p.id
WHERE b.id IS NOT NULL OR v.id IS NOT NULL
ORDER BY rrf_score DESC
LIMIT 10;
```

DiskANN advanced filtering applies structured predicates during the vector-index search. This helps preserve recall when queries include selective catalog filters.

### 5. Keep the catalog fresh

Treat the product catalog as the source of truth. The agent should not recommend products that are inactive, deleted, or waiting for an embedding refresh.

A simple refresh process is:

1. Track catalog changes with the `updated_at` value.
2. Select new or changed products.
3. Generate a new embedding from the current product text.
4. Update the embedding and refresh timestamp in one controlled job.
5. Set `is_active = false` when a product is discontinued.
6. Filter inactive products from every search query.
7. Test a product removal, price change, and description change before publishing the refreshed catalog.

For a small deployment, run the refresh process from the application or on a schedule.

HorizonDB also supports AI pipelines for durable chunking, embedding, extraction, generation, and ranking workflows. An `on_change` pipeline can process catalog updates incrementally, checkpoint work, retry failures, and resume after interruption. Review the [AI pipelines documentation](https://learn.microsoft.com/azure/horizondb/ai/ai-pipelines) before using this option because it requires additional extensions and model configuration.

### 6. Prepare for scale

Measure search quality and latency before changing the architecture.

- Use DiskANN rather than exact vector scans as the catalog grows.
- Keep filters in the vector query so DiskANN can apply advanced filtering.
- Limit model reranking to a small final candidate set.
- Use an external connection pooler when the application opens many database connections.
- Scale vCores when CPU or memory is the constraint. Scaling compute restarts the compute replicas and drops existing connections.
- Add readable replicas for read-heavy workloads.
- Send writes and reads that require the latest committed data to the read-write endpoint.
- Send eligible read-only search traffic to the load-balanced read-only endpoint.

All compute replicas in a HorizonDB cluster share the same storage and compute configuration. Adding a readable replica increases both read capacity and compute cost.

For high-dimensional or large vector indexes, consider spherical quantization:

```sql
CREATE INDEX idx_products_diskann_sq
ON products
USING diskann (embedding vector_cosine_ops)
WITH (
    spherical_quantized = true,
    sq_bits = 4,
    sq_training_samples = 25000
);
```

Choose quantization settings only after measuring recall, index size, and latency with representative catalog data.

### 7. Clean up

Remove the tutorial resources when you finish:

```bash
az group delete \
  --name <resource-group> \
  --yes \
  --no-wait
```

Only run this command when the resource group contains resources created for this tutorial. Disable deletion protection first if it was enabled on the cluster.

## Cost guidance

The $200 Azure credit is a spending limit for the free-trial period, not a guarantee that every version of this architecture will fit within the credit.

The lowest-cost path uses:

- One two-vCore HorizonDB cluster with one compute replica
- A small catalog
- Limited embedding and reranking requests
- No additional readable replicas
- One short-lived deployment

Additional replicas, model usage, larger compute configurations, storage, and long-running resources increase cost. Check pricing and regional availability before deployment, monitor credit usage, and delete the resource group afterward.

## References

- [Azure free account](https://azure.microsoft.com/free/)
- [Azure HorizonDB](https://azure.microsoft.com/products/horizondb)
- [Create an Azure HorizonDB cluster](https://learn.microsoft.com/azure/horizondb/configure-maintain/quickstart-create-cluster)
- [Allow extensions in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/extensions/how-to-allow-extensions)
- [Create parameter groups](https://learn.microsoft.com/azure/horizondb/parameters/how-to-parameter-groups-create)
- [Connect clusters to parameter groups](https://learn.microsoft.com/azure/horizondb/parameters/how-to-parameter-groups-connect)
- [Full-text search with pg_textsearch](https://learn.microsoft.com/azure/horizondb/ai/full-text-search)
- [Hybrid search in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/ai/hybrid-search)
- [DiskANN in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/ai/vector-index-diskann)
- [AI functions in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/ai/ai-functions)
- [AI pipelines in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/ai/ai-pipelines)
- [Compute replicas in Azure HorizonDB](https://learn.microsoft.com/azure/horizondb/configure-maintain/concepts-compute-replicas)
