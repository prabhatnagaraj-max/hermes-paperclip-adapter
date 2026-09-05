# CRM-DQ D365 Integration Test Cases

This folder contains QA test cases per D365 integration point.

## Coverage map
- `extract.md`: contract operation `extractSnapshots`; adapter method `extract`.
- `score.md`: contract operation `scoreSnapshots`; adapter method `score`.
- `publish.md`: contract operation `publishResults`; adapter method `publish`.

## Fixture baseline
- Contract: `crm-data-quality/contracts/d365-crm-dq-api.yaml`
- Stub service: `crm-data-quality/stubs/d365-stub-service.mjs`
- Adapter: `crm-data-quality/adapters/d365-stub.ts`
