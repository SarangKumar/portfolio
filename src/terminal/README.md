# CMD

Public command ribbon for the portfolio. It sits in the page flow **above the footer**: a thin bar when closed, and about **40% of the viewport height** when open.

This is not a shell, admin console, or private career tool. Phase 1 ships two commands. New commands belong in the registry, not in the panel UI.

## Layout

```
header
main
CMD ribbon  ← closed: ~2.5rem; open: 40dvh
footer
```

- Closed: full-width ribbon with the `CMD` label. Click or `Ctrl/Cmd + \`` opens it.
- Open: the same ribbon stays as the header; the log and prompt fill the remaining height.
- `Escape` closes the panel. Output history is kept until `clear`.
- The panel is an in-page region, not a modal overlay, so Tab continues into the footer.

UI: `src/features/terminal/public-terminal.tsx` (loaded with `next/dynamic`, `ssr: false`).

## Architecture

```
UI (public-terminal)
  → parseCommand
  → executeCommand(registry)
  → formatCommandResult
  → render lines
```

| Piece                           | Location                            |
| ------------------------------- | ----------------------------------- |
| Parse, history, execute, format | `src/terminal`                      |
| Command registry                | `src/terminal/registry.ts`          |
| Public command set              | `src/terminal/commands/public.ts`   |
| Copy                            | `messages/en/terminal.json`         |
| Open / command analytics        | `terminal_open`, `terminal_command` |

Do not import next-intl routing from unit tests. Command handlers return structured results; the UI maps `summaryKey` to translated strings.

## Commands

| Command | Aliases        | Behavior                 |
| ------- | -------------- | ------------------------ |
| `help`  | `?`            | List registered commands |
| `clear` | `cls`, `reset` | Clear the log            |

Unknown input prints the translated `unknown` message. Empty submit is a no-op.

## Adding a command

1. Add a `CommandDefinition` in `src/terminal/commands/`.
2. Register it from `public.ts` (or pass it into `createPublicCommandRegistry` in tests).
3. Add `commands.<name>` copy in `messages/en/terminal.json`.
4. Run `npm run i18n:build`.
5. Cover parse/execute in `tests/unit/terminal.test.ts`.

Keep handlers free of React. Do not read secrets, analytics dumps, or unpublished private career data from this surface.
