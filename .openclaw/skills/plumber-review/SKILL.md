---
name: plumber-review
description: "Review a diff for patchwork. Finds design flaws being covered, phantom error handling, complexity fighting complexity."
homepage: https://github.com/akshatnerella/plumber
license: MIT
---

Review code changes for patchwork only, not correctness. One line per finding.

## Format

`L<line>: <tag> <what is patched>. <redesign>.`

Tags:

- `patch:` fix covering a design flaw. Name the flaw.
- `complexity:` code added to fight existing complexity. Name the root.
- `phantom:` error handling for a scenario that shouldn't exist.
- `shrink:` same logic, genuinely simpler structure. Show the simpler form.

## Examples

✅ `L22-45: patch: null guard hiding upstream caller passing wrong type. Fix the caller.`

✅ `L8: phantom: try/catch around code that can't throw. Remove.`

✅ `L31-60: complexity: retry logic working around a non-idempotent API. Make the API idempotent.`

✅ `L14-28: shrink: manual recursion reimplementing reduce. sum(items), 1 line.`

## Scoring

End with: `root causes addressable: <N>.`

If nothing to fix: `Clean pipes. Ship.`

## Boundaries

Scope: patchwork and complexity only. Correctness bugs and security are out of scope. Lists findings, applies nothing. One-shot.
