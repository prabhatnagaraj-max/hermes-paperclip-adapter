# CRM-DQ Epic Acceptance Matrix (QA-3)

Parent: [VER-280](/VER/issues/VER-280)  
Issue: [VER-305](/VER/issues/VER-305)

## Purpose

Define explicit, testable acceptance criteria for each CRM-DQ epic and map each criterion to concrete verification evidence. `Mandatory` criteria are required for epic closure. `Stretch` criteria improve confidence/readiness but are not strict closure gates.

## Matrix

| Epic | Acceptance criterion | Class | Verification check | Evidence artifact(s) |
| --- | --- | --- | --- | --- |
| Epic 1 - Contracts Baseline | OpenAPI/contract document defines extract, score, and publish endpoints with request/response models and a consistent error envelope. | Mandatory | Spec lint/review passes and all endpoint + schema sections exist. | `contracts/d365-crm-dq-api.yaml`, `contracts/contract-validation.md` |
| Epic 1 - Contracts Baseline | Contract validation guidance includes how to validate schema examples and error cases. | Stretch | Documentation review confirms runnable validation steps are documented. | `contracts/contract-validation.md` |
| Epic 2 - Schema and Entity Models | Entity mapping is documented from contract payload fields to canonical CRM-DQ entities. | Mandatory | Mapping table coverage review confirms each contract domain object is represented. | `docs/schema/entity-contracts.md` |
| Epic 2 - Schema and Entity Models | ER diagram remains consistent with mapping assumptions and relationship cardinality notes. | Stretch | Diagram/manual review validates no unresolved relationship gaps. | `docs/schema/er-diagram.md` |
| Epic 3 - Stub Adapter Implementation | D365 stub adapter returns deterministic outputs for extract/score/publish flows aligned to contract semantics. | Mandatory | Unit tests pass for positive-path flow behavior. | `adapters/d365-stub.ts`, `tests/unit/d365-stub.test.ts`, `tests/unit/d365-stub-service.test.mjs` |
| Epic 3 - Stub Adapter Implementation | Stub behavior documentation includes deterministic fixture assumptions and usage instructions. | Stretch | README review confirms setup/usage constraints are documented. | `adapters/README.md`, `stubs/d365-stub-service.mjs` |
| Epic 4 - CI and Non-Env Test Gates | Non-env unit checks for adapter and service entrypoints run cleanly in local/CI context. | Mandatory | Execute unit tests and confirm zero failures. | `tests/unit/d365-stub.test.ts`, `tests/unit/d365-stub-service.test.mjs` |
| Epic 4 - CI and Non-Env Test Gates | CI workflow enforces lint/unit/contract checks as merge gates. | Stretch | Workflow definition includes required jobs and failure gates. | `.github/workflows/crm-dq-ci.yml` |
| Epic 5 - Acceptance and Readiness Matrix | Acceptance matrix maps all epic criteria to measurable checks and concrete artifacts. | Mandatory | Coverage review verifies all six epics are represented with explicit checks and evidence. | `docs/qa/epic-acceptance-matrix.md` |
| Epic 5 - Acceptance and Readiness Matrix | Release readiness checklist distinguishes pre-env vs env-required exit criteria. | Mandatory | Checklist review confirms explicit environment dependency split. | `docs/environment-dependency-map.md`, `crm-data-quality/docs/release-readiness-checklist.md` (planned artifact from [VER-315](/VER/issues/VER-315)) |
| Epic 6 - Live-Env Validation and Parity | Live tenant handshake, auth flow, and validation evidence are captured with reproducible steps. | Mandatory | Evidence package review validates handshake checklist + outcome traces. | `crm-data-quality/docs/live-env/handshake-checklist.md` (planned artifact from [VER-316](/VER/issues/VER-316)), `crm-data-quality/docs/live-env/validation-evidence.md` (planned artifact from [VER-316](/VER/issues/VER-316)) |
| Epic 6 - Live-Env Validation and Parity | Parity gaps between stub and live behavior are logged with owner and disposition. | Mandatory | Gap log review verifies each mismatch has severity and owner/next action. | `crm-data-quality/docs/live-env/parity-gap-log.md` (planned artifact from [VER-316](/VER/issues/VER-316)) |

## Review Notes for FoundingEngineer

- CI workflow path `.github/workflows/crm-dq-ci.yml` now exists and should be used as the Epic 4 merge-gate reference artifact.
- Epic 5 planned artifacts in decomposition reference `crm-data-quality/tests/*` and `crm-data-quality/docs/release-readiness-checklist.md`; current repo root already is `crm-data-quality`, so final path conventions should be normalized to avoid double-prefix ambiguity.
- Epic 6 evidence artifacts are intentionally marked as planned because this workspace is pre-env; acceptance closure for those rows should require real environment-backed evidence and not placeholder docs.
- If desired, we can add column-level pass/fail status fields in a follow-up once epic owners begin attaching concrete run evidence.
