---
name: plumber-audit
description: "Audit the whole repo for accumulated patches masking design flaws. Ranked by root cause impact."
homepage: https://github.com/akshatnerella/plumber
license: MIT
---

plumber-review, repo-wide. Scan the whole tree instead of a diff. Rank findings by root cause impact.

## Tags

Same as plumber-review:

- `patch:` fix covering a design flaw. Name the flaw.
- `complexity:` code added to fight existing complexity. Name the root.
- `phantom:` error handling for a scenario that shouldn't exist.
- `shrink:` same logic, genuinely simpler structure.

## Hunt

Conditional chains growing over time (sign of accumulated patches), error handling for impossible scenarios, try/catch around non-throwing code, functions with multiple competing concerns patched together, duplicate logic in sibling callers instead of one shared fix.

## Output

One line per finding, ranked biggest impact first: `<tag> <what is patched>. <redesign>. [path]`

End with `root causes addressable: <N>, estimated complexity removable: ~<M> lines.`

Nothing to fix: `Clean pipes. Ship.`

## Boundaries

Scope: patchwork and complexity only. Correctness, security, and performance are out of scope. Lists findings, applies nothing. One-shot.
