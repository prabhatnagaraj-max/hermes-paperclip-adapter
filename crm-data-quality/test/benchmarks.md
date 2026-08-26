# CRM-DQ QA-4 Performance Benchmarks (Pre-Env Plan)

Parent issues: [VER-306](/VER/issues/VER-306), [VER-294](/VER/issues/VER-294), [VER-280](/VER/issues/VER-280)

## 1. Purpose and Scope

This document defines pre-environment benchmark targets and a repeatable measurement method for CRM-DQ stub-backed workflows. These targets are provisional and intended to reduce release risk before live Dataverse validation is available.

In scope:
- Latency and throughput targets for deterministic stub-backed API workflows.
- Repeatable benchmark procedure and run evidence requirements.
- Risk categories tied to threshold outcomes.
- Live-environment calibration plan for final threshold sign-off.

Out of scope:
- Final production SLA commitments before live-env validation.
- Hardware-dependent capacity limits outside the benchmark host profile defined below.

## 2. Benchmark Workload Profile

### Workflows under test

- `GET /dq/health` lightweight readiness path.
- `POST /dq/validate-record` single-record validation path.
- `POST /dq/validate-batch` bounded batch validation path.

### Input shapes

- Small payload: 1 record, 8-12 fields, no nested arrays.
- Medium payload: 25 records, realistic mixed field density.
- Large payload: 100 records, max expected pre-env batch size.

### Traffic profiles

- Baseline profile: steady-state `5 RPS` for 3 minutes.
- Stress profile: sustained `20 RPS` for 5 minutes.
- Spike profile: burst to `40 RPS` for 30 seconds after warm-up.

## 3. Measurement Method and Tooling

Tooling:
- HTTP load generator: `k6` script checked in with benchmark artifacts.
- Service under test: local stub-backed CRM-DQ service with fixed seed fixtures.
- Capture outputs: per-run JSON summary + raw `k6` output committed as evidence.

Repeatable run protocol:
1. Start stub service with deterministic seed data.
2. Run warm-up for 60 seconds (excluded from scoring).
3. Execute baseline, stress, and spike profiles in that order.
4. Repeat each profile 3 times and record median + worst run.
5. Store timestamp, git commit SHA, host profile, and results in evidence output.

Host profile template for every run:
- CPU cores, memory, OS version.
- Node/runtime versions.
- Whether run was local laptop or CI runner.

## 4. Pre-Env Benchmark Targets (Provisional)

These targets are calibrated for stub-backed flows and are not final live-env SLAs.

### Latency targets

- `GET /dq/health`: p95 <= 80 ms, p99 <= 120 ms (baseline and stress).
- `POST /dq/validate-record`: p95 <= 250 ms, p99 <= 400 ms (baseline), p95 <= 350 ms (stress).
- `POST /dq/validate-batch` (100 records): p95 <= 900 ms, p99 <= 1300 ms (baseline), p95 <= 1200 ms (stress).

Rationale:
- Targets keep single-record validation interactive for operator workflows.
- Batch target preserves predictable processing for pre-commit and CI gate use.
- Stress allowances account for event-loop contention under burst concurrency.

### Throughput targets

- Baseline: sustain `>= 5 RPS` for all workflows with error rate `< 0.5%`.
- Stress: sustain `>= 20 RPS` aggregate with error rate `< 1.0%`.
- Spike: recover to baseline latency envelope within 60 seconds after burst.

## 5. Threshold-to-Risk Mapping

| Outcome | Trigger | Release risk | Disposition |
| --- | --- | --- | --- |
| Green | All latency and throughput targets met; error budget met | Low | Proceed with current release lane. |
| Yellow | One latency target missed by <= 20% OR stress error rate 1.0%-2.0% | Medium | Proceed only with documented mitigation and follow-up issue. |
| Red | Any latency target missed by > 20%, throughput below floor, OR error rate > 2.0% | High | Block release for affected workflow until remediation + re-run pass. |

## 6. Evidence Requirements

Each benchmark execution must produce:
- Run summary markdown with profile-by-profile results.
- Raw `k6` output files for all runs.
- Environment metadata (host profile + runtime versions).
- Pass/fail status per threshold with explicit risk category.

Suggested evidence location:
- `crm-data-quality/test/evidence/benchmarks/<YYYY-MM-DD>/`

## 7. Live-Env Calibration Plan

Owner: FoundingEngineer for tenant/auth prerequisites; CodexCoder for execution and evidence packaging.

Prerequisites:
- Dataverse endpoint + service principal auth path.
- Representative seeded dataset profile (record counts and field distributions).
- Preliminary SLA expectations for customer-facing operations.

Calibration steps:
1. Re-run same profiles against live env using masked test data.
2. Compare stub and live medians/p95/p99 deltas by endpoint.
3. Update targets where live behavior differs materially (> 15%).
4. Record final threshold sign-off in [VER-294](/VER/issues/VER-294) and link evidence.

Exit condition for final benchmark sign-off:
- Live-env run evidence complete.
- Thresholds re-baselined (if needed) and approved by FoundingEngineer.
- No unresolved Red outcomes in final run set.
