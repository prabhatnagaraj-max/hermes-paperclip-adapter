import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const thisDir = dirname(fileURLToPath(import.meta.url));
const contractsRoot = join(thisDir, "../../contracts");

function loadJson(relativePath) {
  const absolutePath = join(contractsRoot, relativePath);
  const raw = readFileSync(absolutePath, "utf8");
  return JSON.parse(raw);
}

function assertVersionAndCorrelation(envelope) {
  assert.match(envelope.contract_version, /^v\d+\.\d+$/);
  assert.equal(typeof envelope.correlation_id, "string");
  assert.ok(envelope.correlation_id.length > 0);
}

test("schemas and examples are valid JSON", () => {
  const files = [
    "schemas/common.json",
    "schemas/error-response.json",
    "schemas/extract.json",
    "schemas/score.json",
    "schemas/publish.json",
    "examples/extract-success.json",
    "examples/extract-failure.json",
    "examples/score-success.json",
    "examples/score-failure.json",
    "examples/publish-success.json",
    "examples/publish-failure.json"
  ];

  for (const file of files) {
    assert.doesNotThrow(() => loadJson(file), `expected JSON parse success: ${file}`);
  }
});

test("common schema limits canonical entities to ADR-001 scope", () => {
  const common = loadJson("schemas/common.json");
  assert.deepEqual(common.$defs.entityLogicalName.enum, ["account", "contact", "lead"]);
});

test("success examples use success envelopes without error payload", () => {
  const extract = loadJson("examples/extract-success.json");
  const score = loadJson("examples/score-success.json");
  const publish = loadJson("examples/publish-success.json");

  for (const payload of [extract, score, publish]) {
    assertVersionAndCorrelation(payload);
    assert.equal(payload.response.status, "success");
    assert.equal(Object.hasOwn(payload.response, "error"), false);
  }
});

test("failure examples use error envelopes with machine code", () => {
  const extract = loadJson("examples/extract-failure.json");
  const score = loadJson("examples/score-failure.json");
  const publish = loadJson("examples/publish-failure.json");

  for (const payload of [extract, score, publish]) {
    assertVersionAndCorrelation(payload);
    assert.equal(payload.response.status, "error");
    assert.match(payload.response.error.code, /^[a-z0-9_]+$/);
    assert.equal(Object.hasOwn(payload.response, "publish_events"), false);
  }
});
