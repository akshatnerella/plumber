# Installation

## Claude Code

```
/plugin marketplace add akshatnerella/plumber
/plugin install plumber@plumber
```

(Send as two separate prompts)

## Codex

```bash
codex plugin marketplace add akshatnerella/plumber
```

Open `/plugins`, select the Plumber marketplace, and install Plumber.

## GitHub Copilot CLI

```bash
copilot plugin marketplace add akshatnerella/plumber
copilot plugin install plumber@plumber
```

## OpenCode

Add to `opencode.json`:

```json
{ "plugin": ["@akshatnerella/plumber"] }
```

## OpenClaw

```bash
clawhub install plumber
```

## Cursor

Copy [`.cursor/rules/plumber.mdc`](.cursor/rules/plumber.mdc) into your project.

## Windsurf

Copy [`.windsurf/rules/plumber.md`](.windsurf/rules/plumber.md) into your project.

## Cline

Copy [`.clinerules/plumber.md`](.clinerules/plumber.md) into your project.

## Kiro

Copy [`.kiro/steering/plumber.md`](.kiro/steering/plumber.md) into your project.

## GitHub Copilot (editor)

Copy [`.github/copilot-instructions.md`](.github/copilot-instructions.md) into your project.

## Any agent (Aider, Codex, etc.)

Copy [`AGENTS.md`](AGENTS.md) into your project root.

## Uninstall

| Host | Command |
|------|---------|
| Claude Code | `/plugin remove plumber` |
| Codex | `codex plugin remove plumber` |
| Cursor / Windsurf / Cline / etc. | Delete the copied rule file |
