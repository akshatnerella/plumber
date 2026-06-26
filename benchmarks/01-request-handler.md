# Benchmark 01 — Request Handler

**Task:** Write a Python function that accepts user data arriving as raw bytes, a JSON string, or a parsed dict. Validate required fields (`user_id: int`, `action: "create"|"update"|"delete"`, `payload: dict`). Return a response dict with `status` and `data` or `message`.

**Method:** Two agents, same model, same task, same prompt — one with Plumber active, one without.

---

## Hard Numbers

| Metric | Without Plumber | With Plumber | Delta |
|--------|----------------|--------------|-------|
| Lines of code | 17 | 14 | -18% |
| Conditions (if/elif/else) | 8 | 6 | -25% |
| `isinstance` checks | 5 | 3 | -40% |
| try/except blocks | 1 | 1 | — |
| Functions defined | 1 | 1 | — |
| Tokens used | 17,060 | 20,781 | +22%† |

† Plumber agent made 3 tool calls during this run, inflating token count. Controlled benchmarks (03–05) show ~1% overhead.

---

## Output: Without Plumber

```python
import json

def handle_request(data):
    try:
        if isinstance(data, bytes):
            data = json.loads(data)
        if isinstance(data, str):
            data = json.loads(data)
        if not isinstance(data, dict):
            return {"status": "error", "message": "data must be bytes, str, or dict"}

        uid = data.get("user_id")
        action = data.get("action")
        payload = data.get("payload")

        if not isinstance(uid, int):
            return {"status": "error", "message": "user_id must be an integer"}
        if action not in ("create", "update", "delete"):
            return {"status": "error", "message": "action must be one of: create, update, delete"}
        if not isinstance(payload, dict):
            return {"status": "error", "message": "payload must be a dict"}

        return {"status": "ok", "data": {"user_id": uid, "action": action, "payload": payload}}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

---

## Output: With Plumber

```python
import json

def handle_request(data):
    # plumber: normalize to dict first, validate once — not per-format branching
    try:
        if isinstance(data, (bytes, str)):
            data = json.loads(data)
    except json.JSONDecodeError as e:
        return {"status": "error", "message": f"Invalid JSON: {e}"}

    if not isinstance(data, dict):
        return {"status": "error", "message": "Request must be a JSON object"}

    errors = []
    if type(data.get("user_id")) is not int:
        errors.append("user_id must be an integer")
    if data.get("action") not in {"create", "update", "delete"}:
        errors.append("action must be one of: create, update, delete")
    if not isinstance(data.get("payload"), dict):
        errors.append("payload must be a dict")

    if errors:
        return {"status": "error", "message": "; ".join(errors)}
    return {"status": "ok", "data": data}
```

---

## Diff Analysis

### 1. Isinstance branching collapsed
Without Plumber wrote two separate `if isinstance` checks for `bytes` and `str` — each one deserializing the same way. Plumber collapsed them into one branch: `isinstance(data, (bytes, str))`. Same result, half the code, one fewer path to test.

### 2. Exception scope
Without Plumber wrapped the entire function in `except Exception as e`. This swallows real bugs — a `KeyError`, a bad `.get()`, a logic error — and surfaces them as "error" responses instead of crashes. Plumber caught only `json.JSONDecodeError`, which is the only exception that can reasonably occur at that line.

### 3. Error accumulation
Without Plumber returns on the first validation failure. The caller has to fix one error, retry, find the next error, repeat. Plumber collects all validation errors before returning — one round trip, full picture.

### 4. Response reconstruction
Without Plumber rebuilt the response dict field by field: `{"user_id": uid, "action": action, "payload": payload}`. Plumber returned `data` directly. The validation already confirmed the shape is correct — no need to restate it.

### 5. Boolean gotcha (caught by Plumber only)
`isinstance(True, int)` returns `True` in Python. Without Plumber's `isinstance(uid, int)` check would accept `True` and `False` as valid `user_id` values. Plumber used `type(data.get("user_id")) is not int`, which correctly rejects booleans. Defensive coding missed the edge case; root-cause thinking caught it.

---

## Key Insight

The numbers (-18% LOC, -40% isinstance checks) show a cleaner diff. But the real difference is in what didn't get written: a catch-all exception handler that hides bugs, redundant deserialization branches, and a field-by-field response reconstruction that just re-asserts what validation already proved. Plumber didn't write less code by being terse — it wrote less code by not solving problems that shouldn't exist.
