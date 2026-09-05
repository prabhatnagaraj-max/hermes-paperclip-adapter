# Pending Dataverse Metadata Confirmation

Fields below are intentionally marked for live Dataverse metadata confirmation during environment handshake work.

- `ASSUMPTION[DV-ENTITY-OPPORTUNITY]` `DQ_ENTITY_SNAPSHOT.entity_logical_name=opportunity`
  - Pending: reconcile ADR-001 three-entity scope (`account/contact/lead`) with the approved contract enum that includes `opportunity`; confirm whether the adapter enables opportunity immediately or gates it for post-handshake parity.
- `ASSUMPTION[DV-OWNER-PRINCIPAL]` `DQ_ENTITY_SNAPSHOT.owner_principal_id`
  - Pending: confirm user-owned vs team-owned GUID behavior across entities.
- `ASSUMPTION[DV-REGION-SOURCE]` `DQ_ENTITY_SNAPSHOT.region_code`
  - Pending: confirm canonical source (`businessunit`, custom field, or derived mapping) per tenant.
- `ASSUMPTION[DV-PRIMARY-NAME]` `DQ_ENTITY_SNAPSHOT.entity_primary_name`
  - Pending: confirm max-length and source field for each logical name (`name` vs `fullname` patterns).
- `ASSUMPTION[DV-PUBLISH-DESTINATION-ID]` `DQ_PUBLISH_EVENT.destination_record_id`
  - Pending: confirm write-back id surface for each destination mode and retry behavior.
- `ASSUMPTION[DV-PUBLISH-ERROR-TAXONOMY]` `DQ_PUBLISH_EVENT.error_code` / `error_message`
  - Pending: finalize stable failure taxonomy from Dataverse publish adapter.
- `ASSUMPTION[DV-ENV-LABEL]` `DQ_SCAN_RUN.source_env`
  - Pending: confirm final environment naming convention (`Dev/Test/Prod` vs environment GUID labels).
