import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const schemaRoot = path.join(repoRoot, 'crm-data-quality/schema');
const entitiesRoot = path.join(schemaRoot, 'entities');
const fixturesRoot = path.join(schemaRoot, 'fixtures');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const expectedEntitySchemas = [
  'dq-scan-run.schema.json',
  'dq-entity-snapshot.schema.json',
  'dq-rule-result.schema.json',
  'dq-score-summary.schema.json',
  'dq-publish-event.schema.json'
];

function assertCompletedRunInvariants(scanRun) {
  if (scanRun.status === 'running') {
    assert.equal(Object.hasOwn(scanRun, 'completed_at_utc'), false, 'running scan run must not have completed_at_utc');
  }
  if (scanRun.status === 'completed') {
    assert.equal(typeof scanRun.overall_score, 'number', 'completed scan run must include overall_score');
  }
}

function assertCrossEntityInvariants(fixture) {
  const runId = fixture.scan_run.scan_run_id;
  const runVersion = fixture.scan_run.contract_version;

  for (const snapshot of fixture.snapshots) {
    assert.equal(snapshot.scan_run_id, runId, 'snapshot.scan_run_id must match scan_run.scan_run_id');
  }

  const snapshotIds = new Set(fixture.snapshots.map((item) => item.snapshot_id));

  for (const result of fixture.rule_results) {
    assert.equal(result.scan_run_id, runId, 'rule_result.scan_run_id must match scan_run.scan_run_id');
    assert.ok(snapshotIds.has(result.snapshot_id), 'rule_result.snapshot_id must reference existing snapshot');
    assert.equal(runVersion, fixture.scan_run.contract_version, 'contract version must remain consistent for run-scoped fixture');
  }

  assert.equal(fixture.score_summary.scan_run_id, runId, 'score_summary.scan_run_id must match scan_run.scan_run_id');

  for (const event of fixture.publish_events) {
    assert.equal(event.scan_run_id, runId, 'publish_event.scan_run_id must match scan_run.scan_run_id');
    if (Object.hasOwn(event, 'snapshot_id')) {
      assert.ok(snapshotIds.has(event.snapshot_id), 'publish_event.snapshot_id must reference existing snapshot');
    }
  }
}

test('bounded entity schemas are present', () => {
  const actual = fs.readdirSync(entitiesRoot).filter((file) => file.endsWith('.json')).sort();
  assert.deepEqual(actual, expectedEntitySchemas.sort());
});

test('bounded entity fixture satisfies cross-entity invariants', () => {
  const fixture = readJson(path.join(fixturesRoot, 'bounded-entity-valid.json'));
  assertCompletedRunInvariants(fixture.scan_run);
  assertCrossEntityInvariants(fixture);
});
