# Publish Integration Test Cases

## Integration point mapping
- Contract operationId: `publishResults` (`POST /publish`)
- Adapter method: `publish(req: PublishRequest)`

## Case PUBLISH-001 Happy path to Dataverse
- Setup:
  - Score case has produced fixture scan run `11111111-1111-1111-1111-111111111111`.
  - Stub service default behavior.
- Input:
```json
{
  "scan_run_id": "11111111-1111-1111-1111-111111111111",
  "destination": "dataverse",
  "attempt_count": 1
}
```
- Expected output:
  - HTTP `200` and `ok=true`.
  - `publish_event.publish_status=succeeded`.
  - Dataverse destination generates `destination_record_id=dv-writeback-101`.
- Pass criteria:
  - Response schema matches `PublishResponse`.
  - Attempt count and destination are echoed correctly in event payload.
- Fail criteria:
  - Wrong publish status, missing event payload, or wrong destination mapping.

## Case PUBLISH-002 Invalid attempt count
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "scan_run_id": "11111111-1111-1111-1111-111111111111",
  "destination": "dataverse",
  "attempt_count": 0
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `publish_invalid_attempt_count`.
- Pass criteria:
  - Validation enforces `attempt_count >= 1`.
- Fail criteria:
  - Non-400 status or wrong error code.

## Case PUBLISH-003 Unknown scan run id
- Setup:
  - Stub service default behavior.
- Input:
```json
{
  "scan_run_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "destination": "queue",
  "attempt_count": 1
}
```
- Expected output:
  - HTTP `400` and `ok=false`.
  - Error code `publish_unknown_scan_run`.
- Pass criteria:
  - Unknown runs are rejected before publish event is generated.
- Fail criteria:
  - Publish event created for unknown run.

## Coverage gaps
- Gap: no modeled partial-write or dead-letter transition (`publish_status=failed|dead_lettered`) in current fixtures.
- Follow-up owner: FoundingEngineer.
- Follow-up action: add publish failure fixtures for destination outage and retry exhaustion, then add cases for dead-letter behavior.
