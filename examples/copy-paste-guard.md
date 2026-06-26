# Example: The Copy-Paste Guard

## The patchwork version

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

**What went wrong:** The guard isn't the wrong idea — the location is. Every new function needs the same check added manually. One day someone forgets. That's the bug.

**Plumber diagnosis:**
- Root cause: unverified users are reaching functions they should never reach
- Design flaw: yes — the filter belongs at the entry point, not inside every function
- What to delete: all three `if not user.email_verified` guards

## The simple version

```python
# plumber: @require_verified_email on the route — unverified users never reach these
def send_email(user): ...
def send_notification(user): ...
def send_sms(user): ...
```

One guard at the route level. Every current and future function is covered automatically.
