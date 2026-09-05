# Entity Field Mapping Notes

This mapping aligns the approved `v1.0` contract entities with internal schema entities for adapter implementation. Internal schemas must preserve contract field names, requiredness, enum values, numeric bounds, and string constraints unless a stricter internal constraint is called out here.

## DQ_SCAN_RUN
- Contract origin: `ExtractResponse.scan_run` / `DqScanRun`.
- Internal file: `schema/entities/dq-scan-run.schema.json`.
- `scan_run_id`, `contract_version`, `source_system`, `source_env`, `started_at_utc`, `status`, `extracted_entity_count`, `evaluated_rule_count`, `correlation_id`: direct contract parity.
- `completed_at_utc`, `overall_score`: optional at ingest, required when `status=completed`.
- Adapter notes: extract creates the run envelope; score updates `evaluated_rule_count` and `overall_score`; publish links back through `scan_run_id`.

## DQ_ENTITY_SNAPSHOT
- Contract origin: `ExtractResponse.snapshots[]` / `DqEntitySnapshot`.
- Internal file: `schema/entities/dq-entity-snapshot.schema.json`.
- `snapshot_id`: internal surrogate generated during extract and propagated into score/publish joins.
- `scan_run_id`: FK to `DQ_SCAN_RUN.scan_run_id`.
- `entity_logical_name`: contract enum is `account/contact/lead/opportunity`; opportunity adapter enablement is tagged in `pending-dataverse-confirmation.md`.
- `entity_primary_id`: Dataverse row id carried as a non-empty string to allow GUID-shaped and test fixture identifiers before live validation.
- `entity_primary_name`: mapped from Dataverse primary-name conventions; field source and max length require live metadata confirmation.
- `owner_principal_id`: mapped from Dataverse owner lookup; user/team ownership behavior requires live confirmation.
- `region_code`: source field may vary by tenant/business unit and is optional until confirmed.
- `ingest_hash`: SHA-256 hex of normalized extracted field payload.
- `pii_policy_tag`: field policy classification from ADR-008.

## DQ_RULE_RESULT
- Contract origin: `ScoreResponse.rule_results[]` / `DqRuleResult`.
- Internal file: `schema/entities/dq-rule-result.schema.json`.
- Rule outcome rows map one-to-one with scoring evaluations per snapshot.
- `scan_run_id` and `snapshot_id` must reference the same scan-run scope.
- `rule_id`, `rule_version`, `severity`, `status`, `reason_code`, `message`, `evaluated_at_utc`: direct scoring output fields.
- `score_impact` is signed numeric contribution to rollup; passing outcomes must not be negative.

## DQ_SCORE_SUMMARY
- Contract origin: `ScoreResponse.score_summary` / `DqScoreSummary`.
- Internal file: `schema/entities/dq-score-summary.schema.json`.
- Single summary row per scan run.
- `overall_score`, `completeness_score`, `consistency_score`, and `validity_score` are bounded 0..100.
- `fail_count`, `warn_count`, and `pass_count` are non-negative and must not all be zero for persisted completed summaries.
- `score_band` follows threshold table maintained by scoring policy.

## DQ_PUBLISH_EVENT
- Contract origin: `PublishResponse.publish_event` / `DqPublishEvent`.
- Internal file: `schema/entities/dq-publish-event.schema.json`.
- Publish attempts map to destination-specific delivery outcomes.
- `scan_run_id` is always required; `snapshot_id` is optional for run-level publish events.
- `destination`, `publish_status`, `attempt_count`: direct publish lifecycle fields.
- `destination_record_id`: required for successful Dataverse write-back events, pending final destination field metadata.
- `published_at_utc`: required for successful Dataverse writes.
- `error_code` and `error_message`: sanitized failure details; failed events require `error_code`.
- `attempt_count` is monotonic per event lifecycle.
