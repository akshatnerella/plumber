# Example: Factorial

Source: "Why Writing Simple Code is Painfully Hard" (codemunk)

## The patchwork version

Unnecessary type checks and an iterative loop obscure what factorial actually is.

```python
def factorial(n):
    if not isinstance(n, int):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
```

**What went wrong:** The function is defending against callers it shouldn't have. The type check and negative guard are patches over a trust boundary problem. The iterative loop obscures the mathematical definition.

**Plumber diagnosis:**
- Root cause: caller contract not enforced at the boundary; function trying to be its own gatekeeper
- Design flaw: yes — validate at entry points, not inside every function
- What to delete: `isinstance` check, `ValueError` guard (validate upstream), iterative loop

## The simple version

```python
def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)
```

Two lines. Matches the mathematical definition exactly. The recursion IS the algorithm — no translation layer between the concept and the code.

**Which one would you rather debug six months from now?**
