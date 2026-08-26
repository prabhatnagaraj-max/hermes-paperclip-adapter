# Entity Field Mapping Notes

This mapping aligns schema entities with contract origins in Eng-5.

## DQ_SCAN_RUN
- `scan_run_id`, `contract_version`, `source_system`, `source_env`, `started_at_utc`, `status`, `extracted_entity_count`, `evaluated_rule_count`, `correlation_id`: direct contract parity.
- `completed_at_utc`, `overall_score`: optional until run reaches terminal/completed state.

## DQ_ENTITY_SNAPSHOT
- `entity_logical_name`: bounded to `account/contact/lead/opportunity`.
- `entity_primary_id` and `entity_primary_name`: mapped from Dataverse primary id/name conventions.
- `owner_principal_id`: mapped from Dataverse owner lookup.
- `region_code`: source field may vary by tenant/business unit.

## DQ_RULE_RESULT
- Rule outcome rows map one-to-one with scoring evaluations per snapshot.
- `score_impact` is signed numeric contribution to rollup.

## DQ_SCORE_SUMMARY
- Single summary row per scan run.
- `score_band` follows threshold table maintained by scoring policy.

## DQ_PUBLISH_EVENT
- Publish attempts map to destination-specific delivery outcomes.
- `attempt_count` is monotonic per event lifecycle.
