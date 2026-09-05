# Extract Integration Test Cases

## Integration point mapping
- Contract operationId: `extractSnapshots` (`POST /extract`)
- Adapter method: `extract(req: ExtractRequest)`

## Case EXTRACT-001 Happy path (account + contact)
- Setup:
  - Stub service is running with default fixtures.
  - Auth token accepted by stub environment.
- Input:
```json
{
  "source_env": "dev",
  "correlation_id": "corr-2026-05-14-001",
  "entity_logical_names": ["account", "contact"]
}
```
- Expected output:
  - HTTP `200` and `ok=true`.
  - `scan_run.scan_run_id=11111111-1111-1111-1111-111111111111`.
  - `snapshots` contains account + contact fixtures with deterministic IDs.
- Pass criteria:
  - Response schema matches `ExtractResponse`.
  - `extracted_entity_count` equals returned snapshot count.
- Fail criteria:
  - Missing `scan_run` object, wrong schema types, or count mismatch.

## Case EXTRACT-002 Invalid entity list
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "source_env": "dev",
  "correlation_id": "corr-2026-05-14-002",
  "entity_logical_names": ["account", "invalid_entity"]
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `extract_invalid_entities`.
- Pass criteria:
  - Error payload matches `ErrorResponse` with deterministic code.
- Fail criteria:
  - Non-400 status or mismatched error code.

## Case EXTRACT-003 Missing source environment
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "source_env": "",
  "correlation_id": "corr-2026-05-14-003",
  "entity_logical_names": ["account"]
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `extract_invalid_source_env`.
- Pass criteria:
  - Validation blocks empty `source_env`.
- Fail criteria:
  - Request succeeds or returns a different validation error.

## Coverage gaps
- Gap: no contract-path simulation for D365 throttling/timeouts/retryable 5xx on extract.
- Follow-up owner: FoundingEngineer.
- Follow-up action: add stub mode(s) for transient upstream failure and retry headers to validate retry policy.
