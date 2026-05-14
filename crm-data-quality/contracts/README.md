# CRM-DQ Contracts

This directory contains the versioned contract package for CRM data-quality operations.

## Versioning policy

- Current baseline: `v1.0`.
- Additive-only changes (new optional fields, new non-breaking enums) are minor updates (`v1.x`).
- Removals, type changes, stricter required fields, or breaking enum changes require a major update (`v2.0`).
- OpenAPI and JSON Schema artifacts must move in lockstep for each contract version.

## Package layout

- `d365-crm-dq-api.yaml`: OpenAPI 3.1 interface contract for `extract`, `score`, and `publish`.
- `schemas/common-v1.schema.json`: shared primitive and enum definitions, including error envelope.
- `schemas/entities-v1.schema.json`: canonical entity definitions (`DQ_SCAN_RUN`, `DQ_ENTITY_SNAPSHOT`, `DQ_RULE_RESULT`, `DQ_SCORE_SUMMARY`, `DQ_PUBLISH_EVENT`).
- `schemas/operations-v1.schema.json`: request/response models for each operation.
- `schemas/index-v1.schema.json`: package index that composes operation schemas.
- `examples/*.json`: valid payload examples for each operation and one error envelope case.

## Schema conventions

- All operation payloads use `additionalProperties: false` to keep request/response surfaces explicit.
- Required fields are listed in each schema `required` array; omitted fields are optional.
- IDs use `uuid` format except source system record identifiers, which remain opaque strings.
- Timestamps are RFC3339 UTC (`date-time`).
- Entity scope follows ADR-001 (`account`, `contact`, `lead`, `opportunity`) for `v1.0` baseline.

## Error envelope

Error responses use a stable envelope:

- `error_code` (required): machine-readable, deterministic category.
- `message` (required): human-readable summary.
- `correlation_id` (required): tracing id from inbound request context.
- `details` (optional): field-level validation entries (`field`, `issue`).

This envelope is reusable across `extract`, `score`, and `publish` errors.

## Validation

See `contract-validation.md` for lint and schema validation commands. CI should fail when examples no longer validate against their corresponding schemas.
