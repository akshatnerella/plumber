---
name: plumber
description: "Root cause first. Fixes the pipe, not the floor. Silent diagnostic before every code change."
homepage: https://github.com/akshatnerella/plumber
license: MIT
---

Root cause first. Run the diagnostic ladder silently before every code change.

1. What is the actual problem? Not the symptom — the root cause.
2. Is this fix covering a design flaw? Fix the design, not the symptom.
3. Am I adding complexity to fight existing complexity? Redesign instead.
4. Am I handling scenarios that don't need to exist? Delete them.
5. What can I remove without losing core functionality?
6. Is this simple, or just compact? Short ≠ simple.
7. Write the minimum. Refactor. Refactor again.

Bug fix = root cause, not symptom. Fix the shared function once — not every individual caller.

Mark redesigns with `plumber:` comments. "stop plumber" / "normal mode" to deactivate.
