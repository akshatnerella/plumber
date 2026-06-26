# Benchmark 03 — Config Loader

**Task:** Write a `load_config()` function that merges configuration from three sources in priority order: hardcoded defaults → `config.yaml` → environment variables. Cast `APP_PORT` to int, `APP_DEBUG` to bool. Return a plain dict.

**Method:** Two agents, same model, same task, same prompt — one with Plumber active, one without.

---

## Hard Numbers

| Metric | Without Plumber | With Plumber | Delta |
|--------|----------------|--------------|-------|
| Lines of code | 11 | 11 | — |
| Conditions | 4 | 4 | — |
| try/except blocks | 0 | 0 | — |
| isinstance checks | 0 | 0 | — |
| Unique binding variables | 3 (`host`, `port`, `debug`) | 1 (`v`) | **-67%** |
| Bool parsed as positive check | no | yes | **safer** |
| Tokens used | 17,089 | 17,275 | +1.1% |

> LOC and conditions are tied. Differences are in correctness and intent clarity.

---

## Output: Without Plumber

```python
import os
import yaml

def load_config():
    config = {"host": "localhost", "port": 8080, "debug": False}

    if os.path.exists("config.yaml"):
        with open("config.yaml") as f:
            config.update(yaml.safe_load(f) or {})

    if host := os.getenv("APP_HOST"):
        config["host"] = host
    if port := os.getenv("APP_PORT"):
        config["port"] = int(port)
    if debug := os.getenv("APP_DEBUG"):
        config["debug"] = debug.lower() not in ("0", "false", "no", "")

    return config
```

---

## Output: With Plumber

```python
import os
import yaml

def load_config():
    # plumber: merge chain — defaults < file < env, last writer wins
    cfg = {"host": "localhost", "port": 8080, "debug": False}

    if os.path.exists("config.yaml"):
        with open("config.yaml") as f:
            cfg.update(yaml.safe_load(f) or {})

    if v := os.environ.get("APP_HOST"):  cfg["host"]  = v
    if v := os.environ.get("APP_PORT"):  cfg["port"]  = int(v)
    if v := os.environ.get("APP_DEBUG"): cfg["debug"] = v.lower() in ("1", "true", "yes")

    return cfg
```

---

## Diff Analysis

### 1. Variable binding
Vanilla creates three separate named bindings — `host`, `port`, `debug` — one per env var. Plumber reuses a single `v` across all three. The variable name carries no information here (`host` is the value of `APP_HOST`, which the reader already knows from the key). One consistent binding is cleaner and makes the pattern visible — these three lines are doing the same thing.

### 2. Boolean parsing: negative vs positive
Vanilla checks `debug.lower() not in ("0", "false", "no", "")` — a negative check with an explicit empty string in the set. Plumber checks `v.lower() in ("1", "true", "yes")` — a positive check. The difference: with Vanilla, any unrecognized string (e.g. `APP_DEBUG=yes` or `APP_DEBUG=enabled`) evaluates to `True`. With Plumber, unrecognized strings default to `False`, which is the correct safe default for a debug flag.

### 3. Design comment
Plumber adds `# plumber: merge chain — defaults < file < env, last writer wins` — a single line that explains the design intent of the whole function. This isn't defensive documentation; it's a signal that the structure was chosen deliberately, not arrived at by accident.

### 4. `os.getenv` vs `os.environ.get`
Vanilla uses `os.getenv()`, which is a thin wrapper around `os.environ.get()`. Plumber goes direct. Same result, one fewer indirection.

---

## Key Insight

This benchmark shows Plumber's effect when the structure is already close to correct. Both functions work. The differences are in the details: a safer boolean default, a single reused binding that makes the pattern legible, and a comment that names the design. None of these are dramatic. Collectively they represent the difference between code that was written to pass the task and code that was written to be read.
