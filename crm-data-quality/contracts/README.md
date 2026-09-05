# CRM-DQ Contracts (v1)

This package defines versioned JSON interface contracts for CRM Data Quality (`extract`, `score`, `publish`) and is the baseline for schema generation, stubs, and contract tests.

## Versioning

- Current contract line: `v1.x`
- Compatibility rule: additive-only fields and enum expansions are minor bumps (`v1.x`); removals/type changes/semantic breaks require a major bump (`v2.0`).
- Every top-level operation envelope includes `contract_version` and `correlation_id`.

## Layout

- `schemas/common.json`: shared domain definitions and canonical entities
- `schemas/extract.json`: extract operation request/response envelope
- `schemas/score.json`: score operation request/response envelope
- `schemas/publish.json`: publish operation request/response envelope
- `schemas/error-response.json`: shared error payload envelope
- `examples/*-success.json`: schema-conforming success examples
- `examples/*-failure.json`: schema-conforming failure examples
- `d365-crm-dq-api.yaml`: OpenAPI surface contract aligned to these schemas

## Canonical Invariants and ADR Alignment

- ADR-001 (`docs/adr/ADR-001.md`): entity scope is constrained to `account`, `contact`, `lead` in `common.json#/\$defs/entityLogicalName`.
- ADR-002 (`docs/adr/ADR-002.md`): operations are strictly segmented into `extract`, `score`, and `publish` envelopes.
- ADR-003 (`docs/adr/ADR-003.md`): transport-level contracts are auth-agnostic and assume service-to-service identity; no user-token fields are exposed in operation payloads.
- ADR-004 (`docs/adr/ADR-004.md`): extract requests require `watermark_from_utc` and optionally `watermark_to_utc` to support incremental sync and bounded reconciliation.
- ADR-005 (`docs/adr/ADR-005.md`): all contracts enforce semantic version strings via `^v[0-9]+\\.[0-9]+$` and require explicit `contract_version`.

## Error Semantics

All non-success responses use a consistent envelope (`error-response.json`):

- `error.code` (required): machine-readable code (snake case)
- `error.message` (required): operator-safe message
- `error.details` (optional): structured array of field-level or business-rule violations
- `correlation_id` (required): trace identifier propagated across operations

## Validation

This baseline includes six example envelopes (success + failure for extract/score/publish).
Minimal local verification for this epic is JSON parse integrity and envelope-level assertions in `tests/contract/contracts-baseline.test.mjs`.
