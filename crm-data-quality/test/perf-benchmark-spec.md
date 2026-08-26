# CRM-DQ QA-4 Performance Benchmark Spec (Pre-Env)

Parent issue: [VER-294](/VER/issues/VER-294)

## 1. Objective

Define a non-environment benchmark standard for CRM-DQ that can run in local dev and CI using deterministic stubs, producing comparable latency and throughput evidence before live D365 access is available.

## 2. Workloads Under Test

Endpoints:
- `GET /dq/health`
- `POST /dq/validate-record`
- `POST /dq/validate-batch`

Input sizes:
- Small: 1 record, 8-12 fields.
- Medium: 25 records, mixed field density.
- Large: 100 records, max expected pre-env batch size.

Traffic profiles:
- Baseline: 5 RPS for 3 minutes.
- Stress: 20 RPS for 5 minutes.
- Spike: 40 RPS for 30 seconds after warm-up.

## 3. Pre-Env SLO Targets (Provisional)

### Latency targets

- `GET /dq/health`
  - Baseline/stress: p95 <= 80 ms, p99 <= 120 ms.
- `POST /dq/validate-record`
  - Baseline: p95 <= 250 ms, p99 <= 400 ms.
  - Stress: p95 <= 350 ms.
- `POST /dq/validate-batch` (100 records)
  - Baseline: p95 <= 900 ms, p99 <= 1300 ms.
  - Stress: p95 <= 1200 ms.

### Throughput and reliability targets

- Baseline: sustain >= 5 RPS with error rate < 0.5%.
- Stress: sustain >= 20 RPS aggregate with error rate < 1.0%.
- Spike recovery: return to baseline latency envelope within 60 seconds.

### Rationale

- `validate-record` must stay interactive for operational workflows.
- `validate-batch` must remain predictable for CI and pre-commit usage.
- Stress/spike limits are set to expose queueing and event-loop contention early.

## 4. Non-Env Benchmark Method

Tooling:
- Load generator: `k6`.
- System under test: stub-backed CRM-DQ service with deterministic fixtures and fixed seed data.
- Output: raw k6 output + normalized per-run summary.

Procedure:
1. Start CRM-DQ with stub adapter and deterministic fixture seed.
2. Run a 60-second warm-up (excluded from scoring).
3. Execute baseline, stress, then spike profiles.
4. Repeat each profile 3 times.
5. Record median and worst-run metrics for each SLO dimension.
6. Save host/runtime metadata and git SHA with results.

Required run metadata:
- Date/time.
- Git commit SHA.
- CPU cores, memory, OS.
- Runtime/tool versions.
- Run location: local or CI.

## 5. Pass/Fail Risk Bands

| Band | Criteria | Disposition |
| --- | --- | --- |
| Green | All SLO targets met and error budgets met | Accept benchmark run and proceed. |
| Yellow | One latency target miss <= 20% or stress error 1.0%-2.0% | Create follow-up issue and mitigation; proceed with caution. |
| Red | Any latency miss > 20%, throughput below floor, or error > 2.0% | Block release lane for affected workflow until fixed and re-run. |

## 6. Evidence Artifacts

Store each benchmark run in:
- `crm-data-quality/test/evidence/benchmarks/<YYYY-MM-DD>/`

Minimum artifacts:
- `summary.md` with per-profile pass/fail.
- Raw k6 output files for all repetitions.
- `metadata.json` with host/runtime/run configuration.

## 7. Explicit Env-Validation Gaps

The following cannot be validated in pre-env runs and require live D365 execution:
- Dataverse network/auth latency overhead.
- API throttling behavior and retry/backoff realism.
- Performance impact of representative live tenant data volume and indexing.
- Final SLO sign-off for production-facing commitments.

Live-env calibration rule:
- Re-run the same profile set in live env and update targets when live p95/p99 differs by > 15% from stub baseline.

Owner split:
- FoundingEngineer: tenant/auth/data prerequisites.
- CodexCoder: execute benchmark scripts, compare deltas, publish evidence.
