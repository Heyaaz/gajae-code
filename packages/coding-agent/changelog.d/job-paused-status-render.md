### Fixed

- The `job` tool result renderer no longer drops the whole component render when a snapshot carries the `paused` status of a folded background job. `Unknown theme color: undefined` came from `statusToColor` returning `undefined` for a status outside its switch, which `formatBadge` then handed to `theme.fg`; paused and unknown snapshot statuses now resolve to a defined icon (`pending`) and badge color (`muted`), and paused jobs sort directly after running jobs.
