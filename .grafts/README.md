# .grafts

Each directory here is a **graft**: a local modification to an upstream package, described
for both humans and coding agents. See `<id>/graft.md` for why each one exists, which
invariants it guarantees, and how its oracle verifies them.

- `graft status` — list grafts and anchor health
- `graft sync` — re-verify grafts against a new upstream version
