import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const schemaRoot = path.join(repoRoot, 'crm-data-quality/schema');
const entitiesRoot = path.join(schemaRoot, 'entities');
const fixturesRoot = path.join(schemaRoot, 'fixtures');
const contractsRoot = path.join(repoRoot, 'crm-data-quality/contracts/schemas');

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

const contractEntityMap = {
  'dq-scan-run.schema.json': 'dqScanRun',
  'dq-entity-snapshot.schema.json': 'dqEntitySnapshot',
  'dq-rule-result.schema.json': 'dqRuleResult',
  'dq-score-summary.schema.json': 'dqScoreSummary',
  'dq-publish-event.schema.json': 'dqPublishEvent'
};

const contractEntities = readJson(path.join(contractsRoot, 'entities-v1.schema.json'));
const contractCommon = readJson(path.join(contractsRoot, 'common-v1.schema.json'));

function resolveContractProperty(property) {
  if (!property.$ref) return property;

  const [, pointer] = property.$ref.split('#/');
  const segments = pointer.split('/');
  let current = property.$ref.startsWith('common-v1.schema.json')
    ? contractCommon
    : contractEntities;

  for (const segment of segments) {
    current = current[segment];
  }

  return current;
}

function assertEquivalentConstraint(contractProperty, internalProperty, fieldPath) {
  const resolved = resolveContractProperty(contractProperty);

  if (resolved.type) {
    assert.equal(internalProperty.type, resolved.type, `${fieldPath} type must match contract`);
  }
  if (resolved.enum) {
    assert.deepEqual(internalProperty.enum, resolved.enum, `${fieldPath} enum must match contract`);
  }
  if (resolved.minimum !== undefined) {
    assert.equal(internalProperty.minimum, resolved.minimum, `${fieldPath} minimum must match contract`);
  }
  if (resolved.maximum !== undefined) {
    assert.equal(internalProperty.maximum, resolved.maximum, `${fieldPath} maximum must match contract`);
  }
  if (resolved.minLength !== undefined) {
    assert.equal(internalProperty.minLength, resolved.minLength, `${fieldPath} minLength must match contract`);
  }
  if (resolved.maxLength !== undefined) {
    assert.equal(internalProperty.maxLength, resolved.maxLength, `${fieldPath} maxLength must match contract`);
  }
  if (resolved.pattern !== undefined) {
    assert.equal(internalProperty.pattern, resolved.pattern, `${fieldPath} pattern must match contract`);
  }
  if (resolved.format === 'uuid') {
    assert.equal(internalProperty.type, 'string', `${fieldPath} uuid must be a string internally`);
    assert.match(internalProperty.pattern, /\[0-9a-fA-F\]\{8\}/, `${fieldPath} must encode uuid shape`);
  }
  if (resolved.format === 'date-time') {
    assert.equal(internalProperty.type, 'string', `${fieldPath} date-time must be a string internally`);
    assert.equal(internalProperty.format, 'date-time', `${fieldPath} format must match contract`);
  }
}

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

test('internal entity schemas preserve approved contract constraints', () => {
  for (const [fileName, contractDefName] of Object.entries(contractEntityMap)) {
    const internal = readJson(path.join(entitiesRoot, fileName));
    const contract = contractEntities.$defs[contractDefName];

    assert.equal(internal.additionalProperties, false, `${fileName} must reject uncontracted fields`);
    assert.deepEqual(internal.required, contract.required, `${fileName} required fields must match contract`);
    assert.deepEqual(
      Object.keys(internal.properties).sort(),
      Object.keys(contract.properties).sort(),
      `${fileName} properties must match contract`
    );

    for (const [fieldName, contractProperty] of Object.entries(contract.properties)) {
      assertEquivalentConstraint(contractProperty, internal.properties[fieldName], `${fileName}.${fieldName}`);
    }
  }
});

test('bounded entity fixture satisfies cross-entity invariants', () => {
  const fixture = readJson(path.join(fixturesRoot, 'bounded-entity-valid.json'));
  assertCompletedRunInvariants(fixture.scan_run);
  assertCrossEntityInvariants(fixture);
});
