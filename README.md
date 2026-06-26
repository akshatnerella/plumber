<p align="center">
  <img src="assets/plumber.png" width="220" alt="Plumber, root cause first">
</p>

<h1 align="center">Plumber</h1>

<p align="center">
  <em>An idiot admires complexity, a genius admires simplicity.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/akshatnerella/plumber?style=flat-square&color=1a1a2e&label=stars" alt="Stars">
  <img src="https://img.shields.io/github/v/release/akshatnerella/plumber?style=flat-square&color=1a1a2e&label=release" alt="Release">
  <img src="https://img.shields.io/badge/works%20with-10%20agents-1a1a2e?style=flat-square" alt="Works with 10 agents">
  <img src="https://img.shields.io/badge/license-MIT-1a1a2e?style=flat-square" alt="MIT license">
</p>

---

You know the type. Shows up with a toolbox, not a theory. Looks at the leak, finds the pipe, fixes the pipe. Doesn't mop the floor and call it a fix.

Your AI agent is not a plumber. It patches. It layers conditionals over conditionals, adds error handling for scenarios that shouldn't exist, wraps complexity around existing complexity. Every ticket gets a bandage. The pipe keeps leaking.

Plumber puts the real fix inside your agent.

## Before / after

You report a null crash. Your agent adds a null check.

```python
# what your agent writes
def get_user_name(user):
    if user is None:
        return "Unknown"
    if not hasattr(user, 'name'):
        return "Unknown"
    if user.name is None:
        return "Unknown"
    return user.name
```

With plumber:

```python
# plumber: null was coming from get_current_user() on unauthenticated routes — fixed the route guard
def get_user_name(user):
    return user.name
```

The null check wasn't the fix. It was a patch over an unauthenticated route that should never have reached this function. One fix upstream, zero guards downstream.

More examples in [examples/](examples/).

## How it works

Before writing or modifying any code, the agent runs this diagnostic silently:

```
1. What is the actual problem?          not the symptom — the root cause
2. Is this fix covering a design flaw?  fix the design, not the symptom
3. Adding complexity to fight           redesign instead
   existing complexity?
4. Handling scenarios that shouldn't    delete them
   exist?
5. What can be removed without          strip it
   losing core functionality?
6. Simple, or just compact?             short ≠ simple
7. Only then: write the minimum.        then refactor. then refactor again.
```

The ladder runs *after* it reads the code and traces the real flow — never instead of reading. Bug fix = root cause, not symptom: grep every caller of the function you touch and fix the shared root once.

Intentional redesigns are marked with a `plumber:` comment so they read as intent, not accident.

## Install

### Claude Code

```
/plugin marketplace add akshatnerella/plumber
```
```
/plugin install plumber@plumber
```
(Send as two separate prompts)

### Codex

```bash
codex plugin marketplace add akshatnerella/plumber
```

Open `/plugins`, select the Plumber marketplace, and install Plumber.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add akshatnerella/plumber
copilot plugin install plumber@plumber
```

### OpenCode

Add to `opencode.json`:

```json
{ "plugin": ["@akshatnerella/plumber"] }
```

### OpenClaw

```bash
clawhub install plumber
```

### Cursor, Windsurf, Cline, Kiro, GitHub Copilot (editor), Aider

Copy the matching rules file from this repo:

| Tool | File |
|------|------|
| Cursor | [`.cursor/rules/plumber.mdc`](.cursor/rules/plumber.mdc) |
| Windsurf | [`.windsurf/rules/plumber.md`](.windsurf/rules/plumber.md) |
| Cline | [`.clinerules/plumber.md`](.clinerules/plumber.md) |
| Kiro | [`.kiro/steering/plumber.md`](.kiro/steering/plumber.md) |
| GitHub Copilot | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |
| Any agent | [`AGENTS.md`](AGENTS.md) |

### Uninstall

| Host | Command |
|------|---------|
| Claude Code | `/plugin remove plumber` |
| Codex | `codex plugin remove plumber` |
| Cursor / Windsurf / Cline / etc. | Delete the copied rule file |

## Commands

| Command | What it does |
|---------|-------------|
| `/plumber [lite \| full \| ultra \| off]` | Set the intensity, or turn it off |
| `/plumber-diagnose` | Show the full root cause breakdown before acting |
| `/plumber-review` | Review the current diff for patchwork |
| `/plumber-audit` | Audit the whole repo for accumulated patches |
| `/plumber-help` | Quick reference |

## Intensity levels

| Level | Behavior |
|-------|----------|
| **lite** | Writes the fix, flags the cleaner redesign in one line. You decide. |
| **full** | Runs the ladder silently, redesigns instead of patching. **Default.** |
| **ultra** | Won't write a line until root cause is identified. Challenges whether the problem should exist at all. |

`/plumber ultra` exists for when the codebase has wronged you personally.

## `/plumber-diagnose`

When you want to see the reasoning instead of just the output:

```
Root cause:        what is actually broken, not the symptom
Design flaw?       yes/no — if yes, what is wrong structurally
Patch or redesign? decision + one-line reason
What to delete:    anything unnecessary
Solution:          the genuinely simple fix
```

## `/plumber-review` tags

```
L<line>: patch      fix covering a design flaw. Name the flaw.
L<line>: complexity  code added to fight existing complexity.
L<line>: phantom    error handling for a scenario that shouldn't exist.
L<line>: shrink     same logic, genuinely simpler structure.
```

Ends with `root causes addressable: N.` or `Clean pipes. Ship.`

## FAQ

**Does it need a config file?**  
No. Works out of the box. `/plumber off` to silence it, `/plumber` to resume.

**What if the patch is genuinely the right call?**  
Sometimes it is. Use `/plumber lite` — it writes the fix and tells you in one line what the cleaner alternative looks like. You decide.

**What's the difference between simple and easy?**  
Easy is familiar and fast to write. Simple has low complexity and clear structure. A regex is easy. A proper parser is simple. Your agent optimizes for easy. Plumber corrects that.

**Why "plumber"?**  
A plumber fixes the pipe. Not the floor.

## License

[MIT](LICENSE)

## Star History

<a href="https://www.star-history.com/akshatnerella/plumber#history">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=akshatnerella/plumber&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=akshatnerella/plumber&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=akshatnerella/plumber&type=Date" />
 </picture>
</a>
