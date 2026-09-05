# CRM-DQ Epic Decomposition (Eng-4)

Parent issue: [VER-299](/VER/issues/VER-299)
Program parent: [VER-280](/VER/issues/VER-280)

## Execution sequence and ownership

| Seq | Epic | Owner | Env tag | Depends on | Primary outcomes |
| --- | --- | --- | --- | --- | --- |
| 1 | Epic 1 — Contracts Baseline | CodexCoder | pre-env executable | None | Canonical contract schemas and examples for extract/score/publish |
| 2 | Epic 2 — Schema and Entity Models | CodexCoder | pre-env executable | Epic 1 | Canonical entity schema + mapping docs aligned to contracts |
| 3 | Epic 3 — Stub Adapter Implementation | CodexCoder | pre-env executable | Epic 1, Epic 2 | Deterministic D365 stub adapter with fixtures and adapter docs |
| 4 | Epic 4 — CI and Non-Env Test Gates | CodexCoder | pre-env executable | Epic 3 | CI workflow enforcing lint/unit/contract gates without live credentials |
| 5 | Epic 5 — Acceptance and Readiness Matrix | CodexCoder | pre-env executable | Epic 1, Epic 2, Epic 3, Epic 4 | Traceable acceptance matrix and readiness checklist |
| 6 | Epic 6 — Live-Env Validation and Parity | FoundingEngineer + CodexCoder | env-dependent | Epic 4, Epic 5 | Tenant/auth handshake evidence, live validation proof, parity gap log |

## Dependency notes

- Critical path: Epic 1 -> Epic 2 -> Epic 3 -> Epic 4 -> Epic 5 -> Epic 6.
- Parallelizable work before env access:
  - Epic 2 can begin with drafted contracts but must converge after Epic 1 finalization.
  - Epic 5 can draft early, but final acceptance mapping depends on Epic 4 evidence.
- Environment-dependent boundary:
  - Only Epic 6 requires live Dataverse tenant/auth prerequisites.
  - Epics 1–5 are designed to be fully executable without live env access.

## Risk hotspots

- Contract/schema drift risk between Epic 1 and Epic 2 if versioning and invariants are not locked before stub implementation.
- Test determinism risk in Epic 3/4 if fixture sets do not reflect ADR error taxonomy and retry semantics.
- Late environment onboarding risk in Epic 6 if tenant auth prerequisites are missing; mitigated by front-loading Epics 1–5.
- Acceptance traceability risk if Epic 5 does not map each acceptance clause back to concrete artifacts and tests.

## Child epic links

- Epic 1 issue: [VER-317](/VER/issues/VER-317) — CRM-DQ Epic 1 — Contracts Baseline
- Epic 2 issue: [VER-318](/VER/issues/VER-318) — CRM-DQ Epic 2 — Schema and Entity Models
- Epic 3 issue: [VER-319](/VER/issues/VER-319) — CRM-DQ Epic 3 — Stub Adapter Implementation
- Epic 4 issue: [VER-320](/VER/issues/VER-320) — CRM-DQ Epic 4 — CI and Non-Env Test Gates
- Epic 5 issue: [VER-321](/VER/issues/VER-321) — CRM-DQ Epic 5 — Acceptance and Readiness Matrix
- Epic 6 issue: [VER-322](/VER/issues/VER-322) — CRM-DQ Epic 6 — Live-Env Validation and Parity
