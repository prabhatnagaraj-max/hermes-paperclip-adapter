import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const schemasDir = path.join(repoRoot, 'crm-data-quality/contracts/schemas');
const examplesDir = path.join(repoRoot, 'crm-data-quality/contracts/examples');

const schemaByFile = new Map();
for (const file of fs.readdirSync(schemasDir)) {
  if (file.endsWith('.json')) {
    schemaByFile.set(file, JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf8')));
  }
}

const checks = [
  ['extract-request.json', 'extract-request.json'],
  ['extract-response.json', 'extract-response.json'],
  ['score-request.json', 'score-request.json'],
  ['score-response.json', 'score-response.json'],
  ['publish-request.json', 'publish-request.json'],
  ['publish-response.json', 'publish-response.json'],
  ['error-response.json', 'error-response.json']
];

function resolveRef(ref) {
  const [filePart, pointerPart] = ref.split('#');
  const targetFile = filePart.length ? filePart : null;
  const schemaRoot = targetFile ? schemaByFile.get(path.basename(targetFile)) : null;
  const root = schemaRoot ?? (() => { throw new Error(`Unsupported ref: ${ref}`); })();
  if (!pointerPart || pointerPart === '') return root;
  const parts = pointerPart.split('/').filter(Boolean);
  let node = root;
  for (const part of parts) node = node[part];
  return node;
}

function validate(schema, value, at = '$') {
  if (schema.$ref) return validate(resolveRef(schema.$ref), value, at);

  if (schema.type === 'object') {
    assert.equal(typeof value, 'object', `${at} must be object`);
    assert.notEqual(value, null, `${at} must not be null`);
    assert.equal(Array.isArray(value), false, `${at} must be object`);

    const props = schema.properties ?? {};
    for (const req of schema.required ?? []) {
      assert.ok(Object.hasOwn(value, req), `${at}.${req} is required`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        assert.ok(Object.hasOwn(props, key), `${at}.${key} is not allowed`);
      }
    }
    for (const [key, childSchema] of Object.entries(props)) {
      if (Object.hasOwn(value, key)) validate(childSchema, value[key], `${at}.${key}`);
    }
  }

  if (schema.type === 'array') {
    assert.ok(Array.isArray(value), `${at} must be array`);
    if (schema.minItems !== undefined) assert.ok(value.length >= schema.minItems, `${at} must have at least ${schema.minItems} items`);
    for (let i = 0; i < value.length; i += 1) validate(schema.items, value[i], `${at}[${i}]`);
  }

  if (schema.type === 'string') {
    assert.equal(typeof value, 'string', `${at} must be string`);
    if (schema.minLength !== undefined) assert.ok(value.length >= schema.minLength, `${at} must have minLength ${schema.minLength}`);
    if (schema.maxLength !== undefined) assert.ok(value.length <= schema.maxLength, `${at} must have maxLength ${schema.maxLength}`);
    if (schema.pattern !== undefined) assert.ok(new RegExp(schema.pattern).test(value), `${at} must match ${schema.pattern}`);
  }

  if (schema.type === 'integer') {
    assert.equal(Number.isInteger(value), true, `${at} must be integer`);
    if (schema.minimum !== undefined) assert.ok(value >= schema.minimum, `${at} must be >= ${schema.minimum}`);
    if (schema.maximum !== undefined) assert.ok(value <= schema.maximum, `${at} must be <= ${schema.maximum}`);
  }

  if (schema.type === 'number') {
    assert.equal(typeof value, 'number', `${at} must be number`);
    if (schema.minimum !== undefined) assert.ok(value >= schema.minimum, `${at} must be >= ${schema.minimum}`);
    if (schema.maximum !== undefined) assert.ok(value <= schema.maximum, `${at} must be <= ${schema.maximum}`);
  }

  if (schema.enum) {
    assert.ok(schema.enum.includes(value), `${at} must be one of ${schema.enum.join(',')}`);
  }
}

test('contract examples validate against schemas', () => {
  for (const [schemaFile, exampleFile] of checks) {
    const schema = schemaByFile.get(schemaFile);
    const payload = JSON.parse(fs.readFileSync(path.join(examplesDir, exampleFile), 'utf8'));
    validate(schema, payload);
  }
});
