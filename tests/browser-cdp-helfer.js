"use strict";

// Gemeinsamer Helfer für die echten Browserprüfungen (Linux-Chrome, direkt über file://).
// Kein Test im Sinne von `node --test tests/*.test.js`; wird von tests/browser-*.js verwendet.
// Eigenes temporäres Profil, dynamischer Debug-Port, vollständiges Aufräumen auch bei Abbruch.
// Node >= 22 (eingebauter WebSocket und fetch).

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");

const WURZEL = path.join(__dirname, "..");

function freierPort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
    s.on("error", reject);
  });
}

function warte(ms) { return new Promise((r) => setTimeout(r, ms)); }

function chromePfad() {
  const kandidaten = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
  return kandidaten.filter(Boolean).find((p) => fs.existsSync(p));
}

// Chrome speichert den Seitenzoom je Host im Profil. Mit "partition.default_zoom_level" wird der
// ECHTE Browserzoom gesetzt (Zoomstufe = ln(Faktor)/ln(1,2)); Layoutbreite = Fensterbreite / Faktor.
function zoomStufe(prozent) { return Math.log(prozent / 100) / Math.log(1.2); }

async function starteBrowser(optionen) {
  const o = optionen || {};
  const exe = chromePfad();
  if (!exe) throw new Error("Kein Chrome/Chromium gefunden (CHROME_BIN setzen).");
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "rathaus-ds-"));
  if (o.zoomProzent) {
    fs.mkdirSync(path.join(profil, "Default"), { recursive: true });
    fs.writeFileSync(path.join(profil, "Default", "Preferences"), JSON.stringify({
      partition: { default_zoom_level: { x: zoomStufe(o.zoomProzent) } }
    }));
  }
  const port = await freierPort();
  const args = [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--no-first-run", "--disable-extensions",
    "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=" + port,
    "--user-data-dir=" + profil, "--window-size=" + (o.breite || 1280) + "," + (o.hoehe || 900),
    "about:blank"
  ];
  const kind = spawn(exe, args, { stdio: "ignore", detached: false });
  let beendet = false;
  function aufraeumen() {
    if (beendet) return;
    beendet = true;
    try { kind.kill("SIGKILL"); } catch (e) { /* schon beendet */ }
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* egal */ }
  }
  ["exit", "SIGINT", "SIGTERM", "SIGHUP"].forEach((s) => process.on(s, () => { aufraeumen(); if (s !== "exit") process.exit(130); }));

  let tabs = null;
  for (let i = 0; i < 60 && !tabs; i++) {
    try {
      const l = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
      tabs = l.find((t) => t.type === "page");
    } catch (e) { await warte(250); }
  }
  if (!tabs) { aufraeumen(); throw new Error("Chrome-DevTools nicht erreichbar."); }
  const ws = new WebSocket(tabs.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const offen = new Map();
  const konsole = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.method === "Runtime.exceptionThrown") konsole.push(m.params.exceptionDetails.text + " " + (m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description || ""));
    if (!m.id) return;
    const p = offen.get(m.id);
    offen.delete(m.id);
    if (!p) return;
    if (m.error) p.reject(new Error(JSON.stringify(m.error))); else p.resolve(m.result);
  };
  const call = (method, params) => new Promise((resolve, reject) => {
    const n = ++id;
    offen.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params: params || {} }));
  });
  const ev = async (expr) => {
    const r = await call("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await call("Page.enable");
  await call("Runtime.enable");

  async function oeffne(relativ) {
    const url = "file://" + path.join(WURZEL, relativ);
    await call("Page.navigate", { url });
    for (let i = 0; i < 80; i++) {
      await warte(100);
      try { if (await ev("document.readyState") === "complete") break; } catch (e) { /* Seite lädt */ }
    }
    await warte(150);
  }
  async function neuLaden() {
    await call("Page.reload");
    for (let i = 0; i < 80; i++) {
      await warte(100);
      try { if (await ev("document.readyState") === "complete") break; } catch (e) { /* Seite lädt */ }
    }
    await warte(150);
  }
  async function schliessen() {
    try { ws.close(); } catch (e) { /* egal */ }
    aufraeumen();
  }
  return { call, ev, oeffne, neuLaden, schliessen, konsole, warte };
}

// Ergebnisliste mit Abbruch bei erstem Fehler.
function pruefer(titel) {
  const ergebnisse = [];
  function check(name, ok, detail) {
    ergebnisse.push({ name, ok: !!ok, detail: ok ? undefined : detail });
    console.log((ok ? "OK   " : "FAIL ") + name + (ok ? "" : "  " + JSON.stringify(detail)));
    if (!ok) { const e = new Error(titel + ": " + name); e.pruefung = true; throw e; }
  }
  return { check, ergebnisse };
}

module.exports = { starteBrowser, pruefer, warte, WURZEL, zoomStufe };
