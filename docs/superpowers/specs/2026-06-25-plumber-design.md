# Plumber — Design Spec
*2026-06-25*

> "An idiot admires complexity, a genius admires simplicity."

## Overview

Plumber is a Claude Code plugin that forces genuinely simple solutions over
easy-looking patchwork. Inspired by the core insight that simple and easy are
not the same thing: simple means low complexity and clear structure; easy means
familiar, short, quick to write. Claude defaults to easy. Plumber corrects that.

The persona: a plumber fixes the pipe, not the floor. They diagnose where the
actual leak is. They do not duct-tape over the symptom and call it done.

## Problem Being Solved

Claude's default behavior under pressure is patchwork — adding conditionals to
handle edge cases, layering error handling over design flaws, writing compact
code that looks clean but hides structural problems. This is "easy" code
masquerading as simple code. The root cause is never examined.

Plumber intervenes before and after code is written to enforce root-cause
thinking and genuine simplicity.

## Core Behavior

Silent by default. The diagnostic ladder runs internally before every code
change. No narration unless explicitly requested via `/plumber-diagnose`.

### The Diagnostic Ladder (runs silently before every code change)

1. **What is the actual problem?** Not the symptom reported — the root cause.
2. **Is this fix covering a design flaw?** If yes — fix the design, not the symptom.
3. **Am I adding complexity to work around existing complexity?** If yes — stop and redesign.
4. **Am I handling scenarios that don't need to exist?** Delete them.
5. **What can I remove without losing core functionality?**
6. **Is this solution simple, or just compact?** Short ≠ simple.
7. Write the minimum. Then refactor. Then refactor again.

Intentional redesigns are marked with a `plumber:` comment so they read as
intent, not accident.

### Intensity Levels

| Level | Behavior |
|-------|----------|
| **lite** | Writes the fix, flags "this is a patch — here's the cleaner redesign" in one line. User decides. |
| **full** | Runs the ladder silently, redesigns instead of patching by default. Default mode. |
| **ultra** | Won't write a line until root cause is identified. Challenges whether the problem should exist at all. |
| **off** | Reverts to default Claude behavior. |

## Commands

| Command | Purpose |
|---------|---------|
| `/plumber [lite\|full\|ultra\|off]` | Toggle mode and intensity |
| `/plumber-diagnose` | Show explicit step-by-step root cause breakdown before acting |
| `/plumber-review` | Review current diff/code for patchwork and complexity debt |
| `/plumber-audit` | Scan whole codebase for accumulated patches masking design flaws |
| `/plumber-help` | Quick command reference |

### `/plumber-diagnose` Output Format

```
Root cause:        [what's actually broken, not the symptom]
Design flaw?       [yes/no — if yes, what's wrong structurally]
Patch or redesign? [decision + one-line reason]
What to delete:    [anything unnecessary]
Solution:          [the genuinely simple fix]
```

### `/plumber-review` Flags

- Lines that patch instead of fix
- Conditionals added to handle symptoms of a deeper problem
- Error handling for scenarios that shouldn't occur
- Complexity added to work around existing complexity

### `/plumber-audit` Output

Full codebase scan producing:
- Functions with patchwork layered over design flaws
- Files with growing conditional complexity (sign of accumulated patches)
- Suggested redesigns ranked by impact

## File Structure

```
plumber/
  .claude-plugin/
    plugin.json
  commands/
    plumber.toml
    plumber-diagnose.toml
    plumber-review.toml
    plumber-audit.toml
    plumber-help.toml
  skills/
    plumber/
      SKILL.md
  examples/
    factorial.md
    sum-function.md
  README.md
  LICENSE
```

## README Examples

### Factorial (from "Why Writing Simple Code is Painfully Hard")

**Patchwork version** — unnecessary checks, extra loops, obscured intent:
```python
def factorial(n):
    if not isinstance(n, int):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
```

**Plumber version** — simple, expressive, focuses on the essence:
```python
def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)
```

### Sum Function (from the same talk)

**Patchwork version** — 10 lines of error handling for a task that should be 1:
```python
def sum_numbers(numbers):
    total = 0
    for item in numbers:
        try:
            cleaned = str(item).strip()
            if cleaned:
                total += float(cleaned)
        except (ValueError, TypeError):
            continue
    return total
```

**Plumber version** — trust the caller, solve the actual problem:
```python
def sum_numbers(numbers):
    return sum(numbers)
```

## Relationship to Ponytail

Ponytail and Plumber are complementary, not overlapping:

- **Ponytail** asks: *does this need to exist at all?* (YAGNI, reuse first)
- **Plumber** asks: *is what exists actually simple?* (root cause, no patchwork)

Both can run together without conflict — they operate at different layers. Ponytail governs *whether* to write code; plumber governs *how* to write it. A one-liner that ponytail approves can still be patchwork that plumber redesigns.

## Design Decisions

- **Silent by default**: matches ponytail's approach — no friction in day-to-day use
- **`plumber:` comments**: marks redesigns as intentional, same pattern as `ponytail:`
- **`/plumber-diagnose` on demand**: transparency when you need it, silence when you don't
- **Intensity levels**: gives users control based on urgency and context
