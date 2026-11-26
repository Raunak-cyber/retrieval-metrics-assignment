# Retrieval Metrics Mini Project

A small Node.js evaluation tool comparing keyword search and semantic search using **Mean Reciprocal Rank (MRR)** and **Recall@10**.

## Project files

- `eval.js` — implements reciprocal rank, rank lookup, the evaluation loop, and Markdown output.
- `test-set.csv` — 10 test queries and their relevant post IDs.
- `search-results.json` — top-10 rankings returned by both search systems.
- `posts-dataset.csv` — the post dataset referenced by the IDs.

## Metrics

Reciprocal rank is the inverse of the 1-based rank of the first relevant result. If no relevant result appears in the top 10, its reciprocal rank is 0.

- **MRR** is the average reciprocal rank across all test queries.
- **Recall@10** is the fraction of queries for which at least one relevant result appears in the top 10.

## Run the evaluation

Requires Node.js. No external packages or API keys are needed.

```bash
node eval.js
```

## Results

| Query | Keyword rank | Semantic rank |
|---|---:|---:|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |

## Interpretation

Semantic search performs better overall on both metrics: it has a higher MRR (0.67 vs 0.30) and finds a relevant result for all 10 queries (Recall@10 of 1.00 vs 0.60). Keyword search wins on the Redis-versus-Memcached comparison and the SQL-versus-NoSQL choice, where exact technical terms strongly signal the relevant content; it also places the ACID result at rank 2. Semantic search is stronger on natural-language problem descriptions and paraphrases, such as stale Redis data, adding pgvector to an existing table, slow queries after indexing, and background jobs failing after deployments. The results suggest semantic search handles varied wording and symptom-based queries more reliably, while keyword search remains useful for precise terminology. A team could retain both systems in a hybrid search setup because their strengths complement each other and exact-term matches can still benefit users.

## Source

Based on the Kalvium Community [Retrieval Metrics Mini Project](https://github.com/kalviumcommunity/retrieval-metrics-mini-project).
