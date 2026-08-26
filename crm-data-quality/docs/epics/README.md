# CRM-DQ Epic Decomposition (Eng-4)

Parent issue: [VER-287](/VER/issues/VER-287)

## Child epics

1. [VER-311](/VER/issues/VER-311) — CRM-DQ Epic 1 — Contracts Baseline
- Output artifacts: `crm-data-quality/contracts/README.md`, `crm-data-quality/contracts/schemas/*.json`, `crm-data-quality/contracts/examples/*.json`
- Acceptance focus: contract completeness, schema validation, error envelope clarity, versioning.

2. [VER-312](/VER/issues/VER-312) — CRM-DQ Epic 2 — Schema and Entity Models
- Output artifacts: `crm-data-quality/schema/README.md`, `crm-data-quality/schema/entities/*.json`, `crm-data-quality/schema/mappings/*.md`
- Acceptance focus: model parity with contracts and explicit live-env metadata assumptions.

3. [VER-313](/VER/issues/VER-313) — CRM-DQ Epic 3 — Stub Adapter Implementation
- Output artifacts: `crm-data-quality/adapters/d365-stub.ts`, `crm-data-quality/adapters/fixtures/*.json`, `crm-data-quality/adapters/README.md`
- Acceptance focus: deterministic contract-aligned behavior for no-env testing.

4. [VER-314](/VER/issues/VER-314) — CRM-DQ Epic 4 — CI and Non-Env Test Gates
- Output artifacts: `.github/workflows/crm-dq-ci.yml`, `crm-data-quality/tests/unit/*`, `crm-data-quality/tests/contract/*`
- Acceptance focus: PR merge gates for lint/unit/contract checks without live-env credentials.

5. [VER-315](/VER/issues/VER-315) — CRM-DQ Epic 5 — Acceptance and Readiness Matrix
- Output artifacts: `crm-data-quality/tests/acceptance-matrix.md`, `crm-data-quality/tests/performance-thresholds.md`, `crm-data-quality/docs/release-readiness-checklist.md`
- Acceptance focus: traceability and measurable pre-env vs env-required exit criteria.

6. [VER-316](/VER/issues/VER-316) — CRM-DQ Epic 6 — Live-Env Validation and Parity
- Output artifacts: `crm-data-quality/docs/live-env/handshake-checklist.md`, `crm-data-quality/docs/live-env/validation-evidence.md`, `crm-data-quality/docs/live-env/parity-gap-log.md`
- Acceptance focus: tenant/auth handshake, live validation evidence, parity-gap logging.

## Dependency ordering

- `VER-311` -> `VER-312` -> `VER-313` -> `VER-314` -> `VER-315` -> `VER-316`
- Additional dependency edges:
- `VER-313` also depends on `VER-312` and `VER-311`.
- `VER-315` depends on `VER-311`, `VER-312`, `VER-313`, and `VER-314`.
- `VER-316` depends on `VER-314` and `VER-315`.

## Critical-path risk minimization

- No-env execution starts immediately on contracts/schema/stub/CI/readiness tracks.
- Live-env work is intentionally isolated to `VER-316`, after non-env quality gates are in place.
- This staging reduces environment-day risk by front-loading deterministic validation and artifact readiness.
