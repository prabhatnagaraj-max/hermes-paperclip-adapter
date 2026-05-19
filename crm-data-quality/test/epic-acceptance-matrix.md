# CRM-DQ Epic Acceptance Matrix (QA-3)

Parent issue: [VER-293](/VER/issues/VER-293)  
Program parent: [VER-280](/VER/issues/VER-280)

## Purpose

Define explicit, testable acceptance criteria for each CRM-DQ child epic and map each criterion to concrete QA cases and CI checks.

## Matrix

| Epic | Criterion ID | Measurable acceptance statement (pass/fail) | QA case mapping | CI/test check mapping | Evidence artifacts |
| --- | --- | --- | --- | --- | --- |
| Epic 1 - Contracts Baseline ([VER-317](/VER/issues/VER-317)) | E1-AC1 | **Pass** if OpenAPI contract defines extract, score, and publish operations with request/response schemas and shared error envelope; **Fail** if any operation/schema/envelope section is missing. | `test/cases/extract.md`, `test/cases/score.md`, `test/cases/publish.md` (request/response coverage) | `tests/unit/contracts-baseline.test.mjs`, `tests/unit/contracts-schema-validation.test.mjs` | `contracts/d365-crm-dq-api.yaml`, `contracts/contract-validation.md`, `contracts/schemas/*` |
| Epic 1 - Contracts Baseline ([VER-317](/VER/issues/VER-317)) | E1-AC2 | **Pass** if example payloads parse and validate against schema baselines; **Fail** on any parse or schema-validation error. | `test/cases/extract.md`, `test/cases/score.md`, `test/cases/publish.md` (example payload checks) | `tests/unit/contracts-schema-validation.test.mjs` | `contracts/examples/*.json`, `contracts/schemas/validation/*.json` |
| Epic 2 - Schema and Entity Models ([VER-318](/VER/issues/VER-318)) | E2-AC1 | **Pass** if entity-contract mapping covers all contract domain objects and fields with no unmapped required fields; **Fail** if coverage gaps exist. | QA document review against contract objects in `test/cases/*.md` | `tests/unit/contracts-schema-validation.test.mjs` (schema/entity alignment guard) | `docs/schema/entity-contracts.md`, `docs/schema/er-diagram.md`, `contracts/schemas/entities-v1.schema.json` |
| Epic 2 - Schema and Entity Models ([VER-318](/VER/issues/VER-318)) | E2-AC2 | **Pass** if ER relationships and cardinality assumptions are explicitly documented and consistent with schema definitions; **Fail** if conflicts are unresolved. | QA architecture review checklist under QA-1 plan | CI doc-validation not yet automated (tracked in [VER-320](/VER/issues/VER-320)) | `docs/schema/er-diagram.md`, `docs/schema/entity-contracts.md` |
| Epic 3 - Stub Adapter Implementation ([VER-319](/VER/issues/VER-319)) | E3-AC1 | **Pass** if deterministic stub returns stable extract/score/publish outputs for identical inputs across repeated runs; **Fail** if outputs drift. | `test/cases/extract.md`, `test/cases/score.md`, `test/cases/publish.md` (stub behavior assertions) | `tests/unit/d365-stub.test.ts`, `tests/unit/d365-stub-service.test.mjs` | `adapters/d365-stub.ts`, `stubs/d365-stub-service.mjs`, `adapters/README.md` |
| Epic 3 - Stub Adapter Implementation ([VER-319](/VER/issues/VER-319)) | E3-AC2 | **Pass** if adapter error behavior matches contract error envelope expectations; **Fail** on envelope shape/status-code mismatch. | Error scenarios in `test/cases/*.md` | `tests/unit/d365-stub.test.ts` | `contracts/examples/error-response.json`, `adapters/d365-stub.ts` |
| Epic 4 - CI and Non-Env Test Gates ([VER-320](/VER/issues/VER-320)) | E4-AC1 | **Pass** if non-env unit/contract checks run as merge-gate checks and fail PRs on regression; **Fail** if checks are missing or non-blocking. | QA gate validation in `test/PLAN.md` section 5 | Implemented workflow gate `.github/workflows/crm-dq-ci.yml`; executable checks: `tests/unit/*.test.*` | `test/PLAN.md`, `.github/workflows/crm-dq-ci.yml` |
| Epic 4 - CI and Non-Env Test Gates ([VER-320](/VER/issues/VER-320)) | E4-AC2 | **Pass** if local deterministic test lane mirrors CI-required checks; **Fail** if local and CI required checks diverge. | QA-1 pre-env lane audit | `tests/unit/d365-stub.test.ts`, `tests/unit/d365-stub-service.test.mjs`, `tests/unit/contracts-*.mjs` | `test/PLAN.md`, `docs/environment-dependency-map.md` |
| Epic 5 - Acceptance and Readiness Matrix ([VER-321](/VER/issues/VER-321)) | E5-AC1 | **Pass** if all six child epics are represented with measurable acceptance criteria mapped to QA + CI checks; **Fail** if any epic is missing or non-measurable. | QA-3 matrix completeness review | Document verification in PR and issue review; CI not applicable for markdown semantics | `test/epic-acceptance-matrix.md` |
| Epic 5 - Acceptance and Readiness Matrix ([VER-321](/VER/issues/VER-321)) | E5-AC2 | **Pass** if pre-env and env-dependent closure boundaries are explicit and traceable; **Fail** if environment dependency split is ambiguous. | QA-1/QA-3 cross-review | CI doc-validation not yet automated (tracked in [VER-320](/VER/issues/VER-320)) | `docs/environment-dependency-map.md`, `test/PLAN.md` |
| Epic 6 - Live-Env Validation and Parity ([VER-322](/VER/issues/VER-322)) | E6-AC1 | **Pass** if tenant handshake/auth and live validation evidence are captured with reproducible steps and outcomes; **Fail** if evidence is missing or non-reproducible. | Env-dependent QA cases in `test/cases/*.md` + live-run evidence package | CI execution not applicable until env credentials are available | `docs/live-env/handshake-checklist.md` (planned), `docs/live-env/validation-evidence.md` (planned) |
| Epic 6 - Live-Env Validation and Parity ([VER-322](/VER/issues/VER-322)) | E6-AC2 | **Pass** if stub-vs-live parity gaps are logged with severity, owner, and disposition; **Fail** if any identified gap lacks ownership or next step. | QA parity review during env-dependent lane | CI check not applicable; tracked as issue evidence gate | `docs/live-env/parity-gap-log.md` (planned) |

## Notes

- Epic 6 criteria are env-dependent and cannot be closed by pre-env-only evidence.
- CI workflow path for Epic 4 is implemented at `.github/workflows/crm-dq-ci.yml`.
