# Union Data

`public/data` contains public, source data used by the dashboard.

## Common rules

- Keep source values as recorded. Do not replace or delete historical records.
- Use `YYYY-MM-DD` for observation dates and `YYYY-MM` for monthly periods.
- Add records only when observed. Do not create placeholder records for missing months.
- Add an optional `source` or `note` when the origin or context needs to be retained.
- Do not store personal, account, or otherwise non-public information here.

## Data files

### `union-profile.json`

Contains stable union settings: `name`, `id`, and `maxMembers`.

### `sync-level-history.json`

Contains `snapshots`. Each snapshot has:

- `period`: target month in `YYYY-MM`
- `recordedAt`: observation date in `YYYY-MM-DD`
- `levels`: observed sync levels
- `source` and `note`: optional context

To add a new record, append a snapshot. If there are multiple records for the same month, the dashboard uses the record with the latest `recordedAt`.

### `raid-results.json`

Contains one result record per union raid. Record the existing raid score fields and, when available, add `bossProgress`:

- `reachedLevel`: the final boss level being challenged when the raid ended
- `progressPercent`: progression on that boss level, from 0 to 100

Do not add `bossProgress` for raids with unavailable data. The dashboard displays these records as `—`, rather than treating them as unattempted or failed.

Future time-series data should use a separate file by domain, such as `membership-history.json` or `activity-history.json`.
