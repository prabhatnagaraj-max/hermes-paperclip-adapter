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
- Shared schema enums and primitive constraints: `crm-data-quality/contracts/schemas/_defs.json`

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
- Cross-entity foreign key and run-consistency invariants
- Contract-version and terminal-state invariants
