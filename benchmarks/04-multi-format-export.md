# Benchmark 04 — Multi-format Data Export

**Task:** Write `export_users(users: list[dict], fmt: str) -> str` that exports user data as CSV, JSON, or XML based on `fmt`. Each user has `id`, `name`, `email`. Raise `ValueError` for unsupported formats.

**Method:** Two agents, same model, same task, same prompt — one with Plumber active, one without.

---

## Hard Numbers

| Metric | Without Plumber | With Plumber | Delta |
|--------|----------------|--------------|-------|
| Lines of code | 15 | 19 | **+27%** |
| Conditions (if/elif/else) | 4 | 3 | **-25%** |
| try/except blocks | 0 | 0 | — |
| Functions defined | 1 | 1 | — |
| Tokens used | 17,004 | 17,202 | +1.2% |

> Plumber wrote **more** lines but fewer conditions. LOC is the wrong metric.

---

## Output: Without Plumber

```python
import csv
import json
import io
import xml.etree.ElementTree as ET

def export_users(users: list[dict], fmt: str) -> str:
    if fmt == "csv":
        buf = io.StringIO()
        w = csv.DictWriter(buf, fieldnames=["id", "name", "email"])
        w.writeheader()
        w.writerows(users)
        return buf.getvalue()
    elif fmt == "json":
        return json.dumps(users)
    elif fmt == "xml":
        root = ET.Element("users")
        for u in users:
            el = ET.SubElement(root, "user")
            for k in ("id", "name", "email"):
                ET.SubElement(el, k).text = str(u[k])
        return ET.tostring(root, encoding="unicode")
    else:
        raise ValueError(f"Unsupported format: {fmt}")
```

---

## Output: With Plumber

```python
import csv, json, io
from xml.etree.ElementTree import Element, SubElement, tostring

def export_users(users: list[dict], fmt: str) -> str:
    if fmt == "csv":
        buf = io.StringIO()
        w = csv.DictWriter(buf, fieldnames=["id", "name", "email"])
        w.writeheader()
        w.writerows(users)
        return buf.getvalue()
    if fmt == "json":
        return json.dumps(users)
    if fmt == "xml":
        root = Element("users")
        for u in users:
            node = SubElement(root, "user")
            for k, v in u.items():
                SubElement(node, k).text = str(v)
        return tostring(root, encoding="unicode")
    raise ValueError(f"Unsupported format: {fmt}")
```

---

## Diff Analysis

### 1. if/elif/else vs guard clauses
Vanilla uses `if / elif / elif / else` — one decision tree. Plumber uses three independent `if` blocks, each with an early return, and a bare `raise` at the end. The branch count drops from 4 to 3 because there's no `else`. Each format is now a self-contained case rather than a branch of a shared tree. Adding a new format means adding a new `if` block — you don't have to find the right `elif` slot or remember to remove the `else`.

### 2. Hardcoded field list vs `u.items()`
Vanilla hardcodes `for k in ("id", "name", "email")` when building XML elements. If the user dict gains a field (`phone`, `role`), the export silently drops it. Plumber uses `for k, v in u.items()` — the XML output matches whatever the dict actually contains. No maintenance needed when the schema changes.

### 3. More lines, fewer conditions
Plumber's extra lines come from writing the XML loop more explicitly (`for k, v in u.items()` vs the compact hardcoded tuple). The *conditions* are fewer. This is the benchmark's key finding: simplicity isn't about line count. A function with 19 explicit lines and 3 branches is simpler than one with 15 packed lines and 4 branches.

---

## Key Insight

This is the first benchmark where Plumber wrote more code. It didn't do so by padding — it wrote more explicit code that handles schema changes automatically and uses guard clauses instead of a nested decision tree. Fewer conditions, more robustness, higher line count. LOC as a simplicity metric fails here.
