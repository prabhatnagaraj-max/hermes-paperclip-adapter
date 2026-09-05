# CRM-DQ Schema and Entity Models

This folder defines the bounded canonical entity model for CRM data quality (`v1.0`) used by pre-environment validation.

## Bounded entities
- `DQ_SCAN_RUN`
- `DQ_ENTITY_SNAPSHOT`
- `DQ_RULE_RESULT`
- `DQ_SCORE_SUMMARY`
- `DQ_PUBLISH_EVENT`

## Source of truth
- Contract field definitions and invariants: `crm-data-quality/docs/schema/entity-contracts.md`
- Approved contract model: `crm-data-quality/contracts/schemas/entities-v1.schema.json`
- Shared schema enums and primitive constraints: `crm-data-quality/contracts/schemas/common-v1.schema.json`

## Layout
- `entities/*.json`: entity-level schemas aligned to Eng-5 canonical contracts.
- `mappings/*.md`: field mapping notes including Dataverse metadata confirmation gaps.
- `fixtures/*.json`: bounded fixture dataset used by unit validation tests.

## Validation
Run:

```bash
cd repo
node --test crm-data-quality/tests/unit/schema-entity-models.test.mjs
```

The test validates:
- Bounded entity coverage
- Contract-to-internal field, requiredness, and constraint parity
- Cross-entity foreign key and run-consistency invariants
- Contract-version and terminal-state invariants

## Constraint encoding
- `DQ_SCAN_RUN`: completed runs require `overall_score` and `completed_at_utc`; running runs cannot carry `completed_at_utc`.
- `DQ_RULE_RESULT`: passing rule outcomes cannot reduce score.
- `DQ_SCORE_SUMMARY`: completed summaries must include at least one pass, warn, or fail count.
- `DQ_PUBLISH_EVENT`: successful Dataverse publishes require a destination record id and publish timestamp; failed publishes require an error code.

`DQ_REMEDIATION_ACTION` is documented in the Eng-5 design notes as an optional future score output, but it is not part of the approved `v1.0` persisted contract schema. It should be added only through the ADR-005 additive contract process.
