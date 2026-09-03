# CMD

Public command ribbon for the portfolio. It sits in the page flow **above the footer**: a thin bar when closed, and about **40% of the viewport height** when open.

This is not a full admin dashboard. Phase 1 ships public commands plus a hidden, password-gated analytics folder in CMD.

## Layout

```
header
main
CMD ribbon  ← closed: ~2.5rem; open: 40dvh
footer
```

- Closed: full-width ribbon with the `CMD` label, sticky to the bottom of the viewport (sits on top of the footer). Click or `Ctrl/Cmd + \`` opens it.
- Open: the same ribbon stays as the header; the log and prompt fill the remaining height. The panel stays sticky while you scroll or move between pages.
- Session (open state, log, history, cwd) is kept in memory for the tab so client navigations do not reset CMD.
- `Escape` closes the panel. Output history is kept until `clear`.
- The panel is an in-page region, not a modal overlay, so Tab continues into the footer.

UI: `src/features/terminal/public-terminal.tsx`, mounted client-side from `public-terminal-lazy.tsx` after a matching ribbon placeholder.

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

## Hidden analytics folder

Not listed by `help`. Password is `ANALYTICS_VAULT_PASSWORD` (server-only). The client never reads that env var; unlock POSTs to `/api/analytics/vault` and stores an httpOnly cookie.

```
ls
unlock analytics <password>
ls
cat summary
cat json
lock
```

| Command                       | Behavior                                |
| ----------------------------- | --------------------------------------- |
| `ls`                          | Show `analytics/` as locked or unlocked |
| `unlock analytics <password>` | Unlock, then `cd` into `/analytics`     |
| `cd analytics` / `cd ..`      | Enter folder only while unlocked        |
| `cat summary` / `cat json`    | Normal view or JSON of in-memory events |
| `lock` / `pwd`                | Relock; print cwd                       |

Unlock attempts are rate limited. The command stays visible while typing; only the password after `unlock analytics ` is masked. Submitted passwords are not written to the log or command history. If the env var is unset, the folder stays unavailable.

## Adding a command

1. Add a `CommandDefinition` in `src/terminal/commands/`.
2. Register it from `public.ts` (or pass it into `createPublicCommandRegistry` in tests).
3. Add `commands.<name>` copy in `messages/en/terminal.json`.
4. Run `npm run i18n:build`.
5. Cover parse/execute in `tests/unit/terminal.test.ts`.

Keep handlers free of React. Do not put the vault password in client code. Analytics dumps require an unlocked server session.
