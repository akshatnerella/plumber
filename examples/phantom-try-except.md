# Example: The Phantom Try/Except

## The patchwork version

Wrapped in try/except for every possible exception, just in case.

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

**What went wrong:** `TypeError` and `AttributeError` shouldn't be possible here — if `config` is None or not a dict, that's a bug that should surface loudly, not get swallowed silently. The catch-all is hiding problems, not handling them.

**Plumber diagnosis:**
- Root cause: defensive coding against scenarios that indicate real bugs
- Design flaw: yes — errors that shouldn't happen should raise, not return None
- What to delete: all three except clauses

## The simple version

```python
def get_config(key):
    return config.get(key)
```

One line. The stdlib already handles the missing key case. If `config` is broken, it crashes loudly — which is the right behavior.
