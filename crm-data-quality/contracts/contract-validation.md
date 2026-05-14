# CRM-DQ Contract Validation

## Contract files

- `d365-crm-dq-api.yaml`: OpenAPI 3.1 interface contract for `extract`, `score`, `publish`.
- `schemas/*.json`: versioned JSON schemas for common types, entities, operations, and package index.
- `examples/*.json`: example payloads that must validate against corresponding operation/entity schemas.

## Validate OpenAPI

```bash
npx @redocly/cli lint crm-data-quality/contracts/d365-crm-dq-api.yaml
```

## Validate JSON examples against schemas

Run from repo root:

```bash
npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/extractRequest \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/extract-request-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/extractResponse \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/extract-response-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/scoreRequest \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/score-request-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/scoreResponse \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/score-response-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/publishRequest \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/publish-request-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/publishResponse \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/publish-response-v1.json

npx --yes ajv-cli validate --spec=draft2020 \
  -s crm-data-quality/contracts/schemas/operations-v1.schema.json#/$defs/errorResponse \
  -r crm-data-quality/contracts/schemas/common-v1.schema.json \
  -r crm-data-quality/contracts/schemas/entities-v1.schema.json \
  -d crm-data-quality/contracts/examples/error-response-v1.json
```

## Stub usage

Stub implementation and deterministic fixtures are in:

- `crm-data-quality/stubs/d365-stub-service.mjs`

Run the local stub smoke tests:

```bash
node --test crm-data-quality/tests/unit/d365-stub-service.test.mjs
```
