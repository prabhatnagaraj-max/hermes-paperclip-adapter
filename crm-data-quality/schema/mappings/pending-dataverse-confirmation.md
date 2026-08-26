# Pending Dataverse Metadata Confirmation

Fields below are intentionally marked for live Dataverse metadata confirmation during environment handshake work.

- `DQ_ENTITY_SNAPSHOT.owner_principal_id`
  - Pending: confirm user-owned vs team-owned GUID behavior across entities.
- `DQ_ENTITY_SNAPSHOT.region_code`
  - Pending: confirm canonical source (`businessunit`, custom field, or derived mapping) per tenant.
- `DQ_ENTITY_SNAPSHOT.entity_primary_name`
  - Pending: confirm max-length and source field for each logical name (`name` vs `fullname` patterns).
- `DQ_PUBLISH_EVENT.destination_record_id`
  - Pending: confirm write-back id surface for each destination mode and retry behavior.
- `DQ_PUBLISH_EVENT.error_code` / `error_message`
  - Pending: finalize stable failure taxonomy from Dataverse publish adapter.
- `DQ_SCAN_RUN.source_env`
  - Pending: confirm final environment naming convention (`Dev/Test/Prod` vs environment GUID labels).
