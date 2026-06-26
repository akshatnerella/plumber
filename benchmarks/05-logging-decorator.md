# Benchmark 05 — Add Logging to 5 Route Handlers

**Task:** Add entry/success/error logging (using Python's `logging` module) to 5 existing route handler functions: `get_user`, `create_user`, `update_user`, `delete_user`, `list_users`.

**Method:** Two agents, same model, same task, same prompt — one with Plumber active, one without.

---

## Hard Numbers

| Metric | Without Plumber | With Plumber | Delta |
|--------|----------------|--------------|-------|
| Lines of code | 30 | 39 | +30% |
| Conditions | 0 | 0 | — |
| try/except blocks | 1 | 1 | — |
| Functions defined | 6 | 7 | — |
| Tokens used | 17,200 | 17,398 | +1.2% |

> Both agents wrote a decorator. The LOC gap is entirely explained by Plumber including full function bodies; Vanilla wrote stubs.

---

## Output: Without Plumber

```python
import logging
import functools

logger = logging.getLogger(__name__)

def _log(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        logger.info("%s called with args=%s kwargs=%s", fn.__name__, args, kwargs)
        try:
            result = fn(*args, **kwargs)
            logger.info("%s returned %s", fn.__name__, result)
            return result
        except Exception as e:
            logger.error("%s raised %s", fn.__name__, e)
            raise
    return wrapper

@_log
def get_user(user_id: int): ...

@_log
def create_user(name: str, email: str): ...

@_log
def update_user(user_id: int, data: dict): ...

@_log
def delete_user(user_id: int): ...

@_log
def list_users(): ...
```

---

## Output: With Plumber

```python
import logging
import functools

logger = logging.getLogger(__name__)

# plumber: one decorator covers all 3 logging requirements for all 5 handlers
def log_call(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        logger.info("%s called with args=%s kwargs=%s", fn.__name__, args, kwargs)
        try:
            result = fn(*args, **kwargs)
            logger.info("%s returned %s", fn.__name__, result)
            return result
        except Exception as e:
            logger.error("%s raised %s", fn.__name__, e)
            raise
    return wrapper

@log_call
def get_user(user_id: int):
    return db.query(User).filter_by(id=user_id).first()

@log_call
def create_user(name: str, email: str):
    user = User(name=name, email=email)
    db.add(user)
    db.commit()
    return user

@log_call
def update_user(user_id: int, data: dict):
    user = db.query(User).filter_by(id=user_id).first()
    for k, v in data.items():
        setattr(user, k, v)
    db.commit()
    return user

@log_call
def delete_user(user_id: int):
    user = db.query(User).filter_by(id=user_id).first()
    db.delete(user)
    db.commit()

@log_call
def list_users():
    return db.query(User).all()
```

---

## Diff Analysis

### 1. Both converged on the decorator pattern
Neither agent copy-pasted try/except into all five functions. Both immediately recognised that a decorator was the right abstraction. This is the benchmark's headline: **for well-established patterns, Plumber provides no structural advantage** — the vanilla agent already knows the correct answer.

### 2. Naming: `_log` vs `log_call`
Vanilla used `_log` — the leading underscore signals a private/internal helper. Plumber used `log_call` — a descriptive public name. Both work. `log_call` is more readable at the call site (`@log_call` reads like English; `@_log` reads like an implementation detail).

### 3. Decorator explains itself
Plumber added `# plumber: one decorator covers all 3 logging requirements for all 5 handlers`. This documents *why* the structure was chosen — not what the code does, but the design intent. Useful for reviewers who might otherwise wonder why a decorator was added instead of inline logging.

### 4. LOC gap is function bodies
Vanilla wrote stubs (`...`) for the handler functions. Plumber kept the original implementations. The 9-line gap is entirely the function bodies — not a meaningful structural difference.

---

## Key Insight

This benchmark defines Plumber's ceiling. When a task has a well-known correct pattern (N functions needing cross-cutting logic → decorator), both agents converge. Plumber's value is proportional to how ambiguous the task is — the more the path of least resistance leads to patchwork, the more the diagnostic ladder redirects it. On tasks with a clear canonical solution, the delta approaches zero.
