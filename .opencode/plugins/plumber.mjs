// plumber — OpenCode plugin.
//
// Injects the plumber ruleset into every chat's system prompt at the active
// intensity, persists /plumber mode switches, and registers slash commands.
//
// OpenCode loads this as a server plugin — add it to your opencode.json:
//   { "plugin": ["@akshatnerella/plumber"] }

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INSTRUCTIONS = {
  lite: `You are a plumber. A plumber fixes the pipe — not the floor. Run the diagnostic silently. When done: write the fix, then flag in one line if it's a patch and what the cleaner redesign looks like. User decides.`,
  full: `You are a plumber. A plumber fixes the pipe — not the floor. Before writing or modifying any code, run this diagnostic silently:
1. What is the actual problem? Not the symptom — the root cause.
2. Is this fix covering a design flaw? Fix the design, not the symptom.
3. Am I adding complexity to fight existing complexity? Redesign instead.
4. Am I handling scenarios that don't need to exist? Delete them.
5. What can I remove without losing core functionality?
6. Is this simple, or just compact? Short ≠ simple.
7. Write the minimum. Refactor. Refactor again.
Bug fix = root cause, not symptom. Fix the shared function once. Mark redesigns with plumber: comments.`,
  ultra: `You are a plumber in ultra mode. Do not write a single line of code until the root cause is fully identified and stated. Challenge whether the problem should exist at all. Redesign instead of patch. Every conditional is a question: why does this case exist?`,
};

const statePath = path.join(
  process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
  'opencode',
  '.plumber-active',
);

function readMode() {
  try {
    const mode = fs.readFileSync(statePath, 'utf8').trim();
    return ['lite', 'full', 'ultra', 'off'].includes(mode) ? mode : 'full';
  } catch {
    return 'full';
  }
}

function writeMode(mode) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, mode);
}

export default async ({ client } = {}) => {
  return {
    config: async (config) => {
      if (!config.command) config.command = {};
      const commandDir = path.join(__dirname, '..', 'command');
      try {
        for (const file of fs.readdirSync(commandDir).filter((f) => f.endsWith('.md'))) {
          const name = path.basename(file, '.md');
          const content = fs.readFileSync(path.join(commandDir, file), 'utf8');
          const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
          if (match) {
            const description = match[1].match(/description:\s*(.+)/)?.[1]?.trim();
            config.command[name] = { description, template: match[2].trim() };
          }
        }
      } catch {}
    },

    'experimental.chat.system.transform': async (_input, output) => {
      const mode = readMode();
      if (mode === 'off') return;
      output.system.push(INSTRUCTIONS[mode] || INSTRUCTIONS.full);
    },

    'command.execute.before': async (input) => {
      if (!input || input.command !== 'plumber') return;
      const mode = (input.arguments || '').trim();
      writeMode(['lite', 'full', 'ultra', 'off'].includes(mode) ? mode : 'full');
    },
  };
};
