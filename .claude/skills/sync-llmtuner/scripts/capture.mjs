#!/usr/bin/env node
// Captures real screenshots of the llm-tuner desktop app and CLI for the showcase page.
// Usage: node capture.mjs --llmtuner <path-to-llmtuner-repo> --out <screenshots-dir>
// Runs llm-tuner with an isolated XDG_CONFIG_HOME so the user's settings and presets are never touched.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const CHILD_TIMEOUT_MS = 15000;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--llmtuner') out.llmtuner = argv[++i];
    else if (argv[i] === '--out') out.out = argv[++i];
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Asks the OS for an unused port so the capture never attaches to a server the user already runs.
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function guardAlive(child, name) {
  return () => {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`${name} exited early (code ${child.exitCode}, signal ${child.signalCode})`);
    }
  };
}

// The guard runs outside the try so a dead child fails fast instead of timing out.
async function poll(fn, timeoutMs, label, guard) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    guard?.();
    try {
      const value = await fn();
      if (value) return value;
    } catch { /* not ready yet */ }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const bin of candidates) {
    try {
      await fs.access(bin);
      return bin;
    } catch { /* try next */ }
  }
  throw new Error('Chrome or Chromium not found. Set CHROME_BIN.');
}

class Cdp {
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => resolve(new Cdp(ws)), { once: true });
      ws.addEventListener('error', () => reject(new Error('CDP connection failed')), { once: true });
    });
  }

  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.closed = false;
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (!msg.id) return;
      const entry = this.pending.get(msg.id);
      if (!entry) return;
      clearTimeout(entry.timer);
      this.pending.delete(msg.id);
      if (msg.error) entry.reject(new Error(msg.error.message));
      else entry.resolve(msg.result);
    });
    ws.addEventListener('close', () => this.failAll(new Error('CDP connection closed')));
    ws.addEventListener('error', () => this.failAll(new Error('CDP connection error')));
  }

  failAll(error) {
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    this.pending.clear();
    this.closed = true;
  }

  send(method, params = {}, timeoutMs = 30000) {
    if (this.closed || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error('CDP connection closed'));
    }
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP ${method} timed out after ${timeoutMs} ms`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    this.ws.close();
  }
}

async function evaluate(cdp, expression) {
  const res = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (res.exceptionDetails) throw new Error(res.exceptionDetails.text);
  return res.result.value;
}

async function waitFor(cdp, expression, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (cdp.closed) throw new Error('CDP connection closed');
    try {
      if (await evaluate(cdp, expression)) return;
    } catch { /* page still loading */ }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function setViewport(cdp, width, height, scale) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });
  await sleep(300);
}

async function screenshot(cdp, file, { width, height, scale }) {
  await setViewport(cdp, width, height, scale);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(file, Buffer.from(data, 'base64'));
}

// ---------- Terminal capture ----------

// Runs the CLI in a pseudo-terminal. Rejects instead of returning output when the run
// timed out, exited with an error (non-interrupted runs), or never printed `expect`,
// so a broken CLI can never overwrite a committed screenshot.
function runTerminal(llmtuner, args, env, { interruptAfterMs, expect }) {
  const quoted = args.map((a) => `'${a.replaceAll("'", "'\\''")}'`).join(' ');
  const command = `node '${path.join(llmtuner, 'src/cli/index.js')}' ${quoted}`.trim();
  const label = `llm-tuner ${args.join(' ')}`.trim();
  return new Promise((resolve, reject) => {
    const child = spawn('script', ['-qfec', command, '/dev/null'], { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    let stderr = '';
    let timedOut = false;
    child.stdout.on('data', (chunk) => { output += chunk.toString('utf8'); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf8'); });
    const timers = [];
    if (interruptAfterMs) timers.push(setTimeout(() => child.stdin.write('\x03'), interruptAfterMs));
    timers.push(setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, (interruptAfterMs ?? CHILD_TIMEOUT_MS) + 4000));
    child.on('error', (error) => {
      timers.forEach(clearTimeout);
      reject(new Error(`${label}: could not start script (${error.message})`));
    });
    child.on('close', (code) => {
      timers.forEach(clearTimeout);
      const tail = stripAnsi(`${output}\n${stderr}`).trim().split('\n').slice(-8).join('\n');
      if (timedOut) return reject(new Error(`${label}: timed out\n${tail}`));
      if (!interruptAfterMs && code !== 0) return reject(new Error(`${label}: exited with code ${code}\n${tail}`));
      if (!stripAnsi(output).includes(expect)) return reject(new Error(`${label}: expected output "${expect}" not found\n${tail}`));
      resolve(output);
    });
  });
}

const PALETTE = ['#4b5563', '#ff5f56', '#27c93f', '#ffbd2e', '#3b82f6', '#c678dd', '#00e5ff', '#e6edf3'];

const escapeHtml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\x1b/g, '');

function applySgr(state, params) {
  const codes = params === '' ? [0] : params.split(';').map(Number);
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === 0) Object.assign(state, { color: null, bold: false, dim: false, italic: false, underline: false });
    else if (c === 1) state.bold = true;
    else if (c === 2) state.dim = true;
    else if (c === 3) state.italic = true;
    else if (c === 4) state.underline = true;
    else if (c === 22) { state.bold = false; state.dim = false; }
    else if (c === 23) state.italic = false;
    else if (c === 24) state.underline = false;
    else if (c === 39) state.color = null;
    else if (c >= 30 && c <= 37) state.color = PALETTE[c - 30];
    else if (c >= 90 && c <= 97) state.color = PALETTE[c - 90];
    else if (c === 38 || c === 48) {
      const isFg = c === 38;
      if (codes[i + 1] === 5) {
        const n = codes[i + 2];
        if (isFg && n >= 0 && n <= 15) state.color = PALETTE[n % 8];
        i += 2;
      } else if (codes[i + 1] === 2) {
        if (isFg) state.color = `rgb(${codes[i + 2]},${codes[i + 3]},${codes[i + 4]})`;
        i += 4;
      }
    }
    // 40-49 and 100-107 (backgrounds) are ignored.
  }
}

function styleOf(state) {
  const parts = [];
  if (state.color) parts.push(`color:${state.color}`);
  if (state.bold) parts.push('font-weight:700');
  if (state.dim) parts.push('opacity:0.6');
  if (state.italic) parts.push('font-style:italic');
  if (state.underline) parts.push('text-decoration:underline');
  return parts.join(';');
}

function ansiToHtml(text) {
  const clean = text.replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, '');
  const state = { color: null, bold: false, dim: false, italic: false, underline: false };
  const lines = [];
  for (let raw of clean.split('\n')) {
    raw = raw.replace(/\r$/, '');
    if (raw.includes('\r')) raw = raw.slice(raw.lastIndexOf('\r') + 1);
    if (stripAnsi(raw).includes('^C')) continue;
    let html = '';
    let i = 0;
    while (i < raw.length) {
      if (raw[i] === '\x1b') {
        const m = /^\x1b\[([0-9;?]*)([A-Za-z])/.exec(raw.slice(i));
        if (m) {
          if (m[2] === 'm') applySgr(state, m[1]);
          i += m[0].length;
        } else {
          i += 1;
        }
        continue;
      }
      let j = i;
      while (j < raw.length && raw[j] !== '\x1b') j++;
      const chunk = escapeHtml(raw.slice(i, j));
      const style = styleOf(state);
      html += style ? `<span style="${style}">${chunk}</span>` : chunk;
      i = j;
    }
    lines.push(html);
  }
  const isBlank = (l) => stripAnsi(l.replace(/<[^>]+>/g, '')).trim() === '';
  while (lines.length && isBlank(lines[0])) lines.shift();
  while (lines.length && isBlank(lines[lines.length - 1])) lines.pop();
  return lines.join('\n');
}

function terminalDocument(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#090e15}
pre{margin:0;padding:24px 28px;color:#e6edf3;font-family:'Ubuntu Mono','DejaVu Sans Mono',monospace;font-size:14px;line-height:1.45;white-space:pre-wrap;width:760px;box-sizing:border-box}
</style></head><body><pre>${body}</pre></body></html>`;
}

// ---------- Main ----------

async function main() {
  const { llmtuner, out } = parseArgs(process.argv.slice(2));
  if (!llmtuner || !out) {
    console.error('Usage: node capture.mjs --llmtuner <path-to-llmtuner-repo> --out <screenshots-dir>');
    process.exitCode = 1;
    return;
  }

  const serverEntry = path.join(llmtuner, 'src/web/server.js');
  const cliEntry = path.join(llmtuner, 'src/cli/index.js');
  for (const entry of [serverEntry, cliEntry]) {
    try {
      await fs.access(entry);
    } catch {
      console.error(`Not an llm-tuner checkout: missing ${entry}`);
      process.exitCode = 1;
      return;
    }
  }

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'llmtuner-capture-'));
  const children = [];
  let cdp;
  try {
    await fs.mkdir(path.join(tmp, 'config'), { recursive: true });
    // Screenshots go to a staging folder and reach `out` only after every capture succeeded,
    // so a failed run never overwrites a committed screenshot.
    const staging = path.join(tmp, 'shots');
    await fs.mkdir(staging, { recursive: true });
    const serverPort = await getFreePort();
    const childEnv = {
      ...process.env,
      XDG_CONFIG_HOME: path.join(tmp, 'config'),
      PORT: String(serverPort),
      FORCE_COLOR: '1',
      COLUMNS: '80',
      LINES: '40',
    };

    const server = spawn(process.execPath, [serverEntry], { env: childEnv, stdio: 'ignore' });
    children.push(server);
    const serverAlive = guardAlive(server, 'llm-tuner desktop server');
    const serverUrl = `http://127.0.0.1:${serverPort}/`;
    await poll(async () => (await fetch(serverUrl)).ok, 20000, 'the desktop server', serverAlive);

    const chrome = await findChrome();
    const chromeProfile = path.join(tmp, 'chrome');
    // Port 0 lets Chrome pick a free port and report it in DevToolsActivePort.
    const browser = spawn(chrome, [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${chromeProfile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--window-size=1200,860',
      'about:blank',
    ], { stdio: 'ignore' });
    children.push(browser);
    const browserAlive = guardAlive(browser, 'Chrome');
    const debugPort = await poll(async () => {
      const [port] = (await fs.readFile(path.join(chromeProfile, 'DevToolsActivePort'), 'utf8')).split('\n');
      return Number(port) || null;
    }, 20000, 'Chrome DevTools port', browserAlive);
    const target = await poll(async () => {
      const list = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      return list.find((t) => t.type === 'page');
    }, 20000, 'Chrome DevTools', browserAlive);

    cdp = await Cdp.connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    // The site is dark-only; match it regardless of the theme the isolated profile resolves to.
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });

    // Desktop app
    const desktop = { width: 1200, height: 860, scale: 2 };
    await setViewport(cdp, desktop.width, desktop.height, desktop.scale);
    await cdp.send('Page.navigate', { url: serverUrl });
    await waitFor(cdp, "document.querySelector('.mcp-btn') !== null");
    await sleep(800);
    await screenshot(cdp, path.join(staging, '01-engine-selection.png'), desktop);

    await evaluate(cdp, "document.querySelector('.mcp-btn').click()");
    await waitFor(cdp, `(() => {
      const m = document.querySelector('#mcp-modal');
      return m && !m.hidden && document.querySelectorAll('#mcp-agents-list > *').length > 0;
    })()`);
    await sleep(800);
    await screenshot(cdp, path.join(staging, '06-mcp-modal.png'), desktop);

    // CLI
    const cliCaptures = [
      { file: 'cli-01-menu.png', args: [], interruptAfterMs: 4000, expect: 'Select a command' },
      { file: 'cli-05-help.png', args: ['--help'], expect: 'Usage: llm-tuner' },
      { file: 'cli-06-mcp.png', args: ['/mcp'], interruptAfterMs: 6000, expect: 'MCP server' },
    ];
    for (const capture of cliCaptures) {
      const raw = await runTerminal(llmtuner, capture.args, childEnv, capture);
      // Show the standard Linux config path instead of the isolated temp dir.
      const html = terminalDocument(ansiToHtml(raw.replaceAll(childEnv.XDG_CONFIG_HOME, '~/.config')));
      await setViewport(cdp, 760, 400, 2);
      await cdp.send('Page.navigate', { url: 'about:blank' });
      await sleep(300);
      const { frameTree } = await cdp.send('Page.getFrameTree');
      await cdp.send('Page.setDocumentContent', { frameId: frameTree.frame.id, html });
      await sleep(300);
      const height = await evaluate(cdp, "Math.ceil(document.querySelector('pre').getBoundingClientRect().height)");
      await screenshot(cdp, path.join(staging, capture.file), { width: 760, height, scale: 2 });
    }

    // Publish. Copy then rename per file: the temp dir can be on another filesystem, and the
    // rename keeps each screenshot from ever being half-written.
    await fs.mkdir(out, { recursive: true });
    for (const file of await fs.readdir(staging)) {
      const dest = path.join(out, file);
      await fs.copyFile(path.join(staging, file), `${dest}.tmp`);
      await fs.rename(`${dest}.tmp`, dest);
      console.log(`captured ${dest}`);
    }
  } finally {
    cdp?.close();
    await Promise.all(children.map((child) => new Promise((resolve) => {
      if (child.exitCode !== null || child.signalCode !== null) return resolve();
      child.once('exit', resolve);
      child.kill('SIGKILL');
    })));
    // Chrome helper processes can still be flushing the profile for a moment after exit.
    await fs.rm(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
