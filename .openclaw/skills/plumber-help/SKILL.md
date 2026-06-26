---
name: plumber-help
description: "Quick reference for plumber's modes and commands. One-shot display."
homepage: https://github.com/akshatnerella/plumber
license: MIT
---

# Plumber Help

Display this reference card when invoked. One-shot, do NOT change mode or persist anything.

## Levels

| Level | Trigger | What changes |
|-------|---------|-------------|
| **Lite** | `/plumber lite` | Writes the fix, flags the cleaner redesign in one line. You decide. |
| **Full** | `/plumber` | Ladder enforced: root cause → design check → remove → simplest. Default. |
| **Ultra** | `/plumber ultra` | Won't write a line until root cause is identified. Challenges whether the problem should exist. |

Level sticks until changed or session end.

## Commands

| Command | What it does |
|---------|-------------|
| `/plumber [lite\|full\|ultra\|off]` | Toggle mode and intensity |
| `/plumber-diagnose` | Explicit step-by-step root cause breakdown before acting |
| `/plumber-review` | Review current diff for patchwork and complexity debt |
| `/plumber-audit` | Whole-repo patchwork audit, ranked by impact |
| `/plumber-help` | This card |

## Deactivate

Say "stop plumber" or "normal mode". Resume anytime with `/plumber`.
`/plumber off` also works.

## More

Full docs + examples: https://github.com/akshatnerella/plumber
