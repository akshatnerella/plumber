# Example: Sum Function

Source: "Why Writing Simple Code is Painfully Hard" (codemunk)

## The patchwork version

Ten lines of error handling for a function that should be one line.

```python
def sum_numbers(numbers):
    total = 0
    for item in numbers:
        try:
            cleaned = str(item).strip()
            if cleaned:
                total += float(cleaned)
        except (ValueError, TypeError):
            continue
    return total
```

**What went wrong:** The function is handling inputs it was never meant to receive. Strings with spaces, non-numeric types, empty strings — none of these should reach a `sum_numbers` function. The error handling is a patch over a bad caller contract.

**Plumber diagnosis:**
- Root cause: callers passing unclean data instead of cleaning data before calling
- Design flaw: yes — the function is doing two jobs: cleaning and summing
- What to delete: the entire try/catch, the string coercion, the strip — these belong upstream

## The simple version

```python
def sum_numbers(numbers):
    return sum(numbers)
```

One line. Uses the stdlib. Trusts its caller. If the caller passes garbage, that's a bug in the caller — fix it there, not here.

**The deeper fix:** find wherever this function is called with unclean data and clean the data at that source. Don't let garbage travel deep into your call stack.
