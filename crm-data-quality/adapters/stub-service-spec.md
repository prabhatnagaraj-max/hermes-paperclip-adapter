# D365 Stub Service Specification (VER-286)

## Purpose

This document defines deterministic stub behavior for the CRM-DQ D365 integration contract in `contracts/d365-crm-dq-api.yaml`.

Scope is limited to the three planned D365 interaction endpoints:
- `POST /extract`
- `POST /score`
- `POST /publish`

## Contract Version

- Contract line: `v1.x`
- Current version used by fixtures: `v1.0`
- Backward compatibility: additive-only changes within `v1.x`

## Deterministic Fixture Constants

Stub logic (`stubs/d365-stub-service.mjs`) uses fixed IDs/timestamps to keep tests and local runs stable.

- `scan_run_id`: `11111111-1111-1111-1111-111111111111`
- `snapshot_id` (account): `22222222-2222-2222-2222-222222222222`
- `snapshot_id` (contact): `33333333-3333-3333-3333-333333333333`
- `score_summary_id`: `44444444-4444-4444-4444-444444444444`
- `rule_result_id` pass/warn: `55555555-5555-5555-5555-555555555555`, `66666666-6666-6666-6666-666666666666`
- `publish_event_id`: `77777777-7777-7777-7777-777777777777`
- `started_at_utc`: `2026-05-14T12:00:00Z`
- `completed_at_utc`: `2026-05-14T12:03:00Z`
- `evaluated_at_utc`: `2026-05-14T12:01:30Z`
- `published_at_utc`: `2026-05-14T12:03:00Z`

## Endpoint Behavior Map

### `POST /extract`

Request contract:
- Schema: `components.schemas.ExtractRequest`
- Required fields: `source_env`, `correlation_id`, `entity_logical_names`
- Supported entities: `account`, `contact`, `lead`, `opportunity`

Success (`200`):
- Shape: `components.schemas.ExtractResponse`
- Returns deterministic `scan_run` plus filtered `snapshots`
- Fixture examples:
  - `contracts/examples/extract-request-v1.json`
  - `contracts/examples/extract-response-v1.json`

Failure (`400`):
- Shape: `components.schemas.ErrorResponse`
- Error codes:
  - `extract_invalid_source_env`
  - `extract_invalid_entities`
- Fixture example: `contracts/examples/extract-failure.json`

### `POST /score`

Request contract:
- Schema: `components.schemas.ScoreRequest`
- Required fields: `scan_run_id`, `contract_version`

Success (`200`):
- Shape: `components.schemas.ScoreResponse`
- Returns deterministic `rule_results` and `score_summary`
- Fixture examples:
  - `contracts/examples/score-request-v1.json`
  - `contracts/examples/score-response-v1.json`

Failure (`400`):
- Shape: `components.schemas.ErrorResponse`
- Error codes:
  - `score_invalid_contract_version`
  - `score_unknown_scan_run`
- Fixture example: `contracts/examples/score-failure.json`

### `POST /publish`

Request contract:
- Schema: `components.schemas.PublishRequest`
- Required fields: `scan_run_id`, `destination`, `attempt_count`
- Supported destinations: `dataverse`, `lakehouse`, `queue`

Success (`200`):
- Shape: `components.schemas.PublishResponse`
- Returns deterministic `publish_event`
- `destination_record_id` is `dv-writeback-101` when destination is `dataverse`, otherwise `dest-record-101`
- Fixture examples:
  - `contracts/examples/publish-request-v1.json`
  - `contracts/examples/publish-response-v1.json`

Failure (`400`):
- Shape: `components.schemas.ErrorResponse`
- Error codes:
  - `publish_invalid_destination`
  - `publish_invalid_attempt_count`
  - `publish_unknown_scan_run`
- Fixture example: `contracts/examples/publish-failure.json`

## Error Envelope

All endpoint failures return a shared error contract:
- Schema: `components.schemas.ErrorResponse`
- Required fields:
  - `error_code` (machine-readable)
  - `message` (operator-readable)

## Traceability Matrix

- OpenAPI contract: `contracts/d365-crm-dq-api.yaml`
- Stub implementation: `stubs/d365-stub-service.mjs`
- Unit tests:
  - `tests/unit/d365-stub-service.test.mjs`
  - `tests/unit/contracts-baseline.test.mjs`
  - `tests/unit/contracts-schema-validation.test.mjs`
