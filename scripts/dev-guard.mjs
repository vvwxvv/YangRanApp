#!/usr/bin/env node
/**
 * dev-guard — stop a second `next dev` from corrupting `.next`.
 *
 * Two dev servers on the same project directory share one `.next` and overwrite
 * each other's build manifest. The browser then asks for chunk files that no
 * longer exist and Next reports it as "[object Event]" / "ChunkLoadError" while
 * the page sits on "Loading...".
 *
 * Runs as `predev`, so `npm run dev` always ends up with exactly one server for
 * this project. Only processes serving THIS folder are touched.
 */

import { execSync } from 'node:child_process';
import { realpathSync } from 'node:fs';

const PORTS = [3000, 3001, 3002, 3003, 3004, 3005, 3010, 3011];

const run = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

let projectDir = process.cwd();
try {
  projectDir = realpathSync(projectDir);
} catch {
  /* keep cwd */
}

const pids = new Set();
for (const port of PORTS) {
  for (const pid of run(`lsof -ti tcp:${port} -sTCP:LISTEN`).split('\n')) {
    const clean = pid.trim();
    if (clean) pids.add(clean);
  }
}

let killed = 0;
for (const pid of pids) {
  if (Number(pid) === process.pid || Number(pid) === process.ppid) continue;

  const command = run(`ps -o command= -p ${pid}`);
  if (!/next(-server)?\s+dev|next dev/i.test(command) && !/next-server/.test(command)) continue;

  const cwd = run(`lsof -a -p ${pid} -d cwd -Fn`).split('\n').find((l) => l.startsWith('n'));
  const dir = cwd ? cwd.slice(1) : '';
  if (dir && dir !== projectDir) continue;

  try {
    process.kill(Number(pid), 'SIGKILL');
    killed += 1;
    console.log(`[dev-guard] stopped stale dev server pid ${pid} (${dir || 'unknown cwd'})`);
  } catch {
    /* already gone */
  }
}

if (killed === 0) {
  console.log('[dev-guard] no other dev server for this project');
}
