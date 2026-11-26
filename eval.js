// Evaluate keyword and semantic search using MRR and Recall@10.
// Run with: node eval.js
// No external packages are required.
const fs = require('fs');
const path = require('path');

function loadTestSet(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/).slice(1);
  return lines.map((line) => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}

const testSet = loadTestSet(path.join(__dirname, 'test-set.csv'));
const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'search-results.json'), 'utf8'));

function rankOf(rankedIds, correctIds) {
  const index = rankedIds.findIndex((id) => correctIds.includes(id));
  return index === -1 ? null : index + 1;
}

function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank === null ? 0 : 1 / rank;
}

const keywordRRs = [];
const semanticRRs = [];
let keywordHits = 0;
let semanticHits = 0;

const rows = testSet.map(({ query, correctIds }) => {
  const queryResults = results[query];
  if (!queryResults || !Array.isArray(queryResults.keyword) || !Array.isArray(queryResults.semantic)) {
    throw new Error('Missing or invalid search results for query: ' + query);
  }

  const keywordRank = rankOf(queryResults.keyword, correctIds);
  const semanticRank = rankOf(queryResults.semantic, correctIds);
  const keywordRR = reciprocalRank(queryResults.keyword, correctIds);
  const semanticRR = reciprocalRank(queryResults.semantic, correctIds);

  keywordRRs.push(keywordRR);
  semanticRRs.push(semanticRR);
  if (keywordRR > 0) keywordHits++;
  if (semanticRR > 0) semanticHits++;

  return {
    query,
    keywordRank: keywordRank === null ? 'miss' : keywordRank,
    semanticRank: semanticRank === null ? 'miss' : semanticRank
  };
});

const queryCount = testSet.length;
const average = (values) => values.reduce((sum, value) => sum + value, 0) / queryCount;
const keywordMRR = average(keywordRRs);
const semanticMRR = average(semanticRRs);
const keywordRecall = keywordHits / queryCount;
const semanticRecall = semanticHits / queryCount;

console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---:|---:|');
for (const row of rows) {
  console.log('| ' + row.query + ' | ' + row.keywordRank + ' | ' + row.semanticRank + ' |');
}
console.log(
  '| **Summary** | **MRR ' + keywordMRR.toFixed(2) + ' · Recall@10 ' + keywordRecall.toFixed(2) +
  '** | **MRR ' + semanticMRR.toFixed(2) + ' · Recall@10 ' + semanticRecall.toFixed(2) + '** |'
);
