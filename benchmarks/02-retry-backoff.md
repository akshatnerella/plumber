# Benchmark 02 — Retry with Exponential Backoff

**Task:** Add retry logic with exponential backoff to an existing API fetch function. Retry up to 3 times on failure, waiting 1s, 2s, 4s between attempts. Raise the last exception if all retries fail.

**Method:** Two agents, same model, same task, same prompt — one with Plumber active, one without.

---

## Hard Numbers

| Metric | Without Plumber | With Plumber | Delta |
|--------|----------------|--------------|-------|
| Lines of code | 12 | 12 | — |
| Conditions | 1 | 1 | — |
| try/except blocks | 1 | 1 | — |
| sleep calls | 1 | 1 | — |
| Sentinel variables | 1 | 0 | **-100%** |
| Hardcoded delay list | yes | no | **eliminated** |

> LOC is tied. The numbers don't capture the difference — the qualitative analysis does.

---

## Output: Without Plumber

```python
import requests
import time

def fetch_user(user_id: int) -> dict:
    last_exc = None
    for delay in [None, 1, 2, 4]:
        if delay:
            time.sleep(delay)
        try:
            response = requests.get(f"https://api.example.com/users/{user_id}")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            last_exc = e
    raise last_exc
```

---

## Output: With Plumber

```python
import requests
import time

def fetch_user(user_id: int) -> dict:
    for attempt in range(4):
        try:
            response = requests.get(f"https://api.example.com/users/{user_id}")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)  # plumber: 2^0=1, 2^1=2, 2^2=4
```

---

## Diff Analysis

### 1. Sentinel variable eliminated
Vanilla introduces `last_exc = None` to track the last exception across loop iterations, then `raise last_exc` at the end. If the loop exits without an exception somehow, `raise None` is a `TypeError`. Plumber has no sentinel — it re-raises inside the `except` block using the bare `raise`, which always has the current exception in context. Zero state, zero risk.

### 2. Formula over hardcoded list
Vanilla encodes delays as `[None, 1, 2, 4]` — four hand-typed values. Changing to 5 retries means editing the list and figuring out the next delay. Plumber uses `2 ** attempt` — the math defines the sequence. Changing to 5 retries means changing `range(4)` to `range(5)`. The delays follow automatically.

### 3. The `if delay:` guard
Because the first element of Vanilla's list is `None`, it needs `if delay: time.sleep(delay)` to skip the sleep on attempt 1. This is a symptom of the list approach — a guard added to handle an awkward representation. Plumber doesn't need this guard because sleep only runs inside the `except` block, after a failure.

### 4. Raise location
Vanilla raises after the loop ends — the exception is stored in a variable and re-thrown at the bottom. Plumber raises at the point of failure, inside the handler where the exception lives. The code reads in execution order: try → fail → last attempt? raise.

---

## Key Insight

Both are 12 lines. The difference is structural: Vanilla represents the backoff as a list of magic numbers and needs a sentinel and a guard to make it work. Plumber represents it as a formula and needs neither. When someone changes the retry count, Vanilla requires understanding and editing the list; Plumber requires changing one integer. The formula is simpler than the list even though both produce the same output.
