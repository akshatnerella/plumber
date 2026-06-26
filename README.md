<p align="center">
  <img src="assets/plumber.png" width="200" alt="Plumber">
</p>

<h1 align="center">Plumber</h1>

<p align="center">
  <em>An idiot admires complexity, a genius admires simplicity.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/akshatnerella/plumber?style=flat-square&color=1a1a2e&label=stars" alt="Stars">
  <img src="https://img.shields.io/badge/works%20with-10%20agents-1a1a2e?style=flat-square" alt="Works with 10 agents">
  <img src="https://img.shields.io/badge/license-MIT-1a1a2e?style=flat-square" alt="MIT">
</p>

---

Your AI agent doesn't fix bugs. It patches them. Conditionals on top of conditionals, error handling for things that shouldn't happen, complexity added to fight existing complexity. Every ticket gets a bandage. The pipe keeps leaking.

**Plumber fixes the pipe.**

## Before / after

**The null crash**

You report a null crash. Your agent adds three null checks.

```python
def get_user_name(user):
    if user is None:
        return "Unknown"
    if not hasattr(user, 'name'):
        return "Unknown"
    if user.name is None:
        return "Unknown"
    return user.name
```

Plumber finds the unauthenticated route that should never have passed null here and kills it at the source.

```python
# plumber: fixed the route guard — null shouldn't reach this function
def get_user_name(user):
    return user.name
```

---

**The copy-paste guard**

The same check ends up in every function because nobody fixed the caller.

```python
def send_email(user):
    if not user.email_verified:
        return
    ...

def send_notification(user):
    if not user.email_verified:
        return
    ...

def send_sms(user):
    if not user.email_verified:
        return
    ...
```

Plumber puts one guard where it belongs and removes the rest.

```python
# plumber: @require_verified_email on the route — unverified users never reach these
def send_email(user): ...
def send_notification(user): ...
def send_sms(user): ...
```

---

**The phantom try/except**

Your agent wraps everything in try/except just in case.

```python
def get_config(key):
    try:
        return config[key]
    except KeyError:
        return None
    except TypeError:
        return None
    except AttributeError:
        return None
```

Plumber uses the one line the stdlib already provides.

```python
def get_config(key):
    return config.get(key)
```

---

**The isinstance chain**

Your agent makes a function accept "anything" instead of fixing what calls it.

```python
def process(data):
    if isinstance(data, str):
        data = json.loads(data)
    elif isinstance(data, bytes):
        data = json.loads(data.decode())
    elif isinstance(data, list):
        data = {"items": data}
    return transform(data)
```

Plumber normalizes at the boundary and keeps the function clean.

```python
# plumber: deserialize at the API layer — process() only ever sees a dict
def process(data: dict):
    return transform(data)
```

## How it works

Before touching any code, the agent runs this silently:

```
1. What is the actual problem?         (not the symptom)
2. Is this patch covering a design flaw?   → fix the design
3. Adding complexity to fight complexity?  → redesign
4. Handling cases that shouldn't exist?    → delete them
5. What can be removed?                → strip it
6. Simple or just compact?             short ≠ simple
7. Write the minimum. Refactor. Repeat.
```

Redesigns are marked `plumber:` so they read as intent, not accident.

## Install

**Claude Code**
```
/plugin marketplace add akshatnerella/plumber
/plugin install plumber@plumber
```

For Codex, Cursor, Windsurf, Cline, Kiro, Copilot, OpenCode, and more — see [INSTALLATION.md](INSTALLATION.md).

## Commands

| Command | |
|---------|--|
| `/plumber [lite \| full \| ultra \| off]` | Set intensity |
| `/plumber-diagnose` | Show root cause breakdown before acting |
| `/plumber-review` | Flag patchwork in the current diff |
| `/plumber-audit` | Scan the whole repo for accumulated patches |

`/plumber ultra` for when the codebase has wronged you personally.

---

[MIT](LICENSE)
