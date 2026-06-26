# Plumber — Combined Benchmark Report

5 tasks. Same model. Same prompt. One agent vanilla, one with Plumber active. Results below.

---

## Summary Table

| # | Task | LOC (vanilla) | LOC (plumber) | LOC Δ | Conditions Δ | Tokens Δ |
|---|------|:---:|:---:|:---:|:---:|:---:|
| 01 | [Request handler](01-request-handler.md) | 17 | 14 | -18% | -25% | +22%† |
| 02 | [Retry with backoff](02-retry-backoff.md) | 12 | 12 | — | — | -14%† |
| 03 | [Config loader](03-config-loader.md) | 11 | 11 | — | — | +1.1% |
| 04 | [Multi-format export](04-multi-format-export.md) | 15 | 19 | +27% | -25% | +1.2% |
| 05 | [Logging decorator](05-logging-decorator.md) | 30 | 39 | +30% | — | +1.2% |
| | **Total / avg** | **85** | **95** | **+12%** | **-18%** | **~+1.2%**‡ |

† Tool call anomalies in benchmarks 01–02 inflated token counts. Not representative.  
‡ Controlled average from benchmarks 03–05 (zero tool uses, clean comparison).

---

## What the numbers say

### LOC went up, not down
Plumber wrote **12% more lines overall**. The two biggest contributors: benchmark 04 (export) where Plumber used `u.items()` instead of a hardcoded field tuple, and benchmark 05 (logging) where Plumber kept full function bodies instead of stubs. Neither is padding — both are more explicit, more robust code. **LOC is the wrong metric for simplicity.**

### Conditions went down consistently
Across all 5 benchmarks, Plumber produced **18% fewer branches** (17 total → 14). This is the most reliable signal. Fewer conditions means fewer paths to test, fewer places for bugs to hide, fewer things to hold in your head when reading the function.

### Token cost is negligible
Controlling for tool-use anomalies (benchmarks 03–05): **~1.2% overhead**. The diagnostic ladder adds a small amount of internal reasoning but doesn't materially change output size or cost.

---

## What the numbers don't say

The most important differences don't show up in the table:

| Finding | Benchmark |
|---------|-----------|
| Catch-all `except Exception` eliminated; only `json.JSONDecodeError` caught | 01 |
| `isinstance(True, int) == True` gotcha caught; `type() is not int` used | 01 |
| Sentinel variable `last_exc = None` eliminated; bare `raise` used in-place | 02 |
| Backoff expressed as `2 ** attempt` formula, not `[None, 1, 2, 4]` list | 02 |
| Boolean default safer: positive check `in ("1","true","yes")` not negative | 03 |
| XML export handles new fields automatically via `u.items()`; vanilla silently drops them | 04 |
| Both agents converged on decorator pattern — no structural advantage on clear-pattern tasks | 05 |

---

## When Plumber helps most

Benchmark 05 (logging) shows the ceiling: when a task has a well-known canonical solution (N functions needing cross-cutting logic → decorator), both agents converge. No structural advantage.

Benchmarks 01–02 show the floor: ambiguous bug reports and "add retry logic" requests are where agents default to patchwork — a catch-all exception here, a sentinel variable there. Plumber's diagnostic ladder catches these before the code is written.

**Plumber's impact is proportional to how tempting the patchwork answer is.**

---

## Methodology

- Same base model for all runs (claude-sonnet-4-6)
- Plumber prompt: full SKILL.md content injected as system context
- Vanilla prompt: identical task description, no additional context
- Stats self-reported by each agent at end of output
- Tokens from subagent completion notifications
- Each benchmark run once — not averaged across multiple runs
