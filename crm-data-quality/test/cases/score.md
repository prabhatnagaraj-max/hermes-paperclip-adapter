# Score Integration Test Cases

## Integration point mapping
- Contract operationId: `scoreSnapshots` (`POST /score`)
- Adapter method: `score(req: ScoreRequest)`

## Case SCORE-001 Happy path with known scan run
- Setup:
  - Extract case has produced fixture scan run `11111111-1111-1111-1111-111111111111`.
  - Contract version fixed at `v1.0`.
- Input:
```json
{
  "scan_run_id": "11111111-1111-1111-1111-111111111111",
  "contract_version": "v1.0"
}
```
- Expected output:
  - HTTP `200` and `ok=true`.
  - Two `rule_results` entries with deterministic IDs.
  - `score_summary.overall_score=92` and `score_band=excellent`.
- Pass criteria:
  - Response schema matches `ScoreResponse`.
  - Deterministic summary fields match fixture values.
- Fail criteria:
  - Missing score summary or incorrect score-band calculation.

## Case SCORE-002 Invalid contract version
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "scan_run_id": "11111111-1111-1111-1111-111111111111",
  "contract_version": "v2.0"
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `score_invalid_contract_version`.
- Pass criteria:
  - Request is rejected with the expected validation error.
- Fail criteria:
  - Request succeeds or emits different error semantics.

## Case SCORE-003 Unknown scan run id
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "scan_run_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "contract_version": "v1.0"
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `score_unknown_scan_run`.
- Pass criteria:
  - Unknown run IDs are blocked and surfaced as contract error payload.
- Fail criteria:
  - Non-error response for unknown scan run.

## Coverage gaps
- Gap: no explicit rule-evaluation engine exceptions or partial-scoring failure path.
- Follow-up owner: FoundingEngineer.
- Follow-up action: introduce failure fixture for rule-eval execution fault and verify downstream incident telemetry fields.
