---
name: plumber-diagnose
description: "Show explicit root cause diagnosis before writing any code."
homepage: https://github.com/akshatnerella/plumber
license: MIT
---

Run the plumber diagnostic explicitly before writing any code. Show your work.

## Format

```
Root cause:        [what is actually broken, not the symptom]
Design flaw?       [yes/no — if yes, what is wrong structurally]
Patch or redesign? [decision + one-line reason]
What to delete:    [anything unnecessary]
Solution:          [the genuinely simple fix]
```

Do not write code until the diagnosis is shown. One-shot diagnostic, then implement.
