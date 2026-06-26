# plumber

> **"An idiot admires complexity, a genius admires simplicity."**

A Claude Code plugin that forces genuine simplicity over patchwork code. A plumber fixes the pipe — not the floor.

Simple and easy are not the same thing. Easy code is familiar and fast to write. Simple code has low complexity and clear structure. AI agents default to easy. Plumber corrects that.

---

## The Problem

Left unchecked, AI agents write "cover your ass" code: conditionals layered over conditionals, error handling for scenarios that shouldn't exist, complexity added to fight existing complexity. Every patch hides the real problem one layer deeper.

```python
# What the agent writes
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

# What a plumber writes
def sum_numbers(numbers):
    return sum(numbers)
```

The first version looks careful. It's patchwork. The callers are passing bad data and instead of fixing the callers, the function absorbs the damage. Ten lines defending against a problem that lives upstream.

---

## How It Works

Before writing or modifying any code, plumber runs this diagnostic silently:

1. **What is the actual problem?** Not the symptom — the root cause.
2. **Is this fix covering a design flaw?** Fix the design, not the symptom.
3. **Am I adding complexity to fight existing complexity?** Redesign instead.
4. **Am I handling scenarios that don't need to exist?** Delete them.
5. **What can I remove without losing core functionality?**
6. **Is this simple, or just compact?** Short ≠ simple.
7. Write the minimum. Then refactor. Then refactor again.

Intentional redesigns are marked with a `plumber:` comment so they read as intent, not accident.

---

## Installation

### Claude Code
```
/plugin marketplace add akshatnerella/plumber
/plugin install plumber@plumber
```
(Send as two separate prompts)

### Codex
```
codex plugin marketplace add akshatnerella/plumber
```

### GitHub Copilot CLI
Copy `.github/copilot-instructions.md` into your project.

### Cursor
Copy `.cursor/rules/plumber.mdc` into your project.

### Windsurf
Copy `.windsurf/rules/plumber.md` into your project.

### Kiro
Copy `.kiro/steering/plumber.md` into your project.

### Cline
Copy `.clinerules/plumber.md` into your project.

### OpenCode
Add to `opencode.json`:
```json
{ "plugin": ["@akshatnerella/plumber"] }
```

### Any agent (Codex, GitHub Copilot, Aider)
Copy `AGENTS.md` into your project root.

---

## Commands

| Command | What it does |
|---------|-------------|
| `/plumber [lite\|full\|ultra\|off]` | Toggle mode and intensity |
| `/plumber-diagnose` | Explicit step-by-step root cause breakdown before acting |
| `/plumber-review` | Review current diff for patchwork and complexity debt |
| `/plumber-audit` | Whole-repo patchwork audit, ranked by impact |
| `/plumber-help` | Quick reference |

---

## Intensity Levels

| Level | Behavior |
|-------|----------|
| **lite** | Writes the fix, flags "this is a patch — here's the cleaner redesign" in one line. You decide. |
| **full** | Runs the ladder silently, redesigns instead of patching. **Default.** |
| **ultra** | Won't write a line until root cause is identified. Challenges whether the problem should exist at all. |

Example: "Fix this null check that keeps crashing."

- **lite**: "Added null guard. FYI: the crash is a symptom — the caller shouldn't be passing null here."
- **full**: "Removed the null check. Fixed the caller that was passing null — the guard was hiding a logic error upstream."
- **ultra**: "Why is null reaching this function? Fix the upstream logic. If null is a valid state, model it explicitly."

---

## `/plumber-diagnose` Format

When you want to see the reasoning:

```
Root cause:        what is actually broken, not the symptom
Design flaw?       yes/no — if yes, what is wrong structurally
Patch or redesign? decision + one-line reason
What to delete:    anything unnecessary
Solution:          the genuinely simple fix
```

---

## `/plumber-review` Tags

```
L<line>: patch      fix covering a design flaw. Name the flaw.
L<line>: complexity  code added to fight existing complexity.
L<line>: phantom    error handling for a scenario that shouldn't exist.
L<line>: shrink     same logic, genuinely simpler structure.
```

Ends with: `root causes addressable: N.` or `Clean pipes. Ship.`

---

## Examples

### Factorial

```python
# Patchwork — patches a caller contract problem inside the wrong function
def factorial(n):
    if not isinstance(n, int):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

# plumber: validate at boundaries, not inside every function
def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)
```

### Sum function

```python
# Patchwork — absorbing bad caller data instead of fixing the caller
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

# plumber: trust the caller; fix the caller if it sends garbage
def sum_numbers(numbers):
    return sum(numbers)
```

---

## Works Alongside Ponytail

Plumber and [ponytail](https://github.com/DietrichGebert/ponytail) are complementary:

- **Ponytail** asks: *does this need to exist at all?* (YAGNI, reuse first)
- **Plumber** asks: *is what exists actually simple?* (root cause, no patchwork)

Both can run in the same session without conflict. Ponytail governs *whether* to write code; plumber governs *how* to write it.

---

## License

MIT