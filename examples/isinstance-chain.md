# Example: The isinstance Chain

## The patchwork version

The function accepts "anything" instead of fixing what calls it.

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

**What went wrong:** Every new caller that passes a different type gets a new branch added. The function is doing two jobs — deserializing and processing — and it keeps growing. The real problem is callers sending unclean data.

**Plumber diagnosis:**
- Root cause: callers passing raw/unserialized data instead of normalizing before calling
- Design flaw: yes — deserialization belongs at the API boundary, not inside business logic
- What to delete: all three isinstance branches

## The simple version

```python
# plumber: deserialize at the API layer — process() only ever sees a dict
def process(data: dict):
    return transform(data)
```

Clean input contract. The function does one thing. Adding a new caller doesn't require touching this function.
