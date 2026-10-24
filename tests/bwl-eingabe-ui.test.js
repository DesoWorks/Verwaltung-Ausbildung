"use strict";
/* Oberflächentest ohne Browser: lädt die echte js/bwl-werkstatt-ui.js gegen einen minimalen DOM-Ersatz.
   Belegt: Bei ungültiger Eingabe erscheint eine verständliche Fehlermeldung und kein Ergebnis. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function baueUmgebung() {
  const registry = new Map();
  class El {
    constructor(tag) {
      this.tag = tag; this.children = []; this.attrs = {}; this.listeners = {};
      this.hidden = false; this.value = ""; this.textContent = ""; this.className = "";
      this.disabled = false; this._id = ""; this.focused = false;
    }
    get id() { return this._id; }
    set id(v) { this._id = v; registry.set(v, this); }
    setAttribute(k, v) { this.attrs[k] = v; }
    appendChild(c) { this.children.push(c); return c; }
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
    focus() { this.focused = true; }
    fire(t) { (this.listeners[t] || []).forEach((f) => f({ preventDefault() {} })); }
  }
  const document = {
    createElement: (tag) => new El(tag),
    getElementById: (id) => { if (!registry.has(id)) { const e = new El("div"); e.id = id; } return registry.get(id); },
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const window = { BWL_KERN: require("../js/bwl-kern.js") };
  const ctx = vm.createContext({ window, document });
  vm.runInContext(fs.readFileSync(path.join(root, "js/bwl-werkstatt-ui.js"), "utf8"), ctx);
  const $ = (id) => document.getElementById(id);
  $("bwl-art").value = "angebot";
  return { $ };
}

function rechne(ui, menge, preis) {
  ui.$("p1-menge").value = menge;
  ui.$("p1-preis").value = preis;
  ui.$("an-hk").value = "7";
  ui.$("an-gw").value = "5";
  ui.$("bwl-form").fire("submit");
}

test("Oberfläche: gültiger Betrag zeigt Ergebnis, kein Fehler", () => {
  const ui = baueUmgebung();
  rechne(ui, "2", "1.234,56");
  assert.equal(ui.$("bwl-fehler").hidden, true);
  assert.equal(ui.$("bwl-ergebnis").hidden, false);
});

test("Oberfläche: 1.2,00 zeigt verständliche Fehlermeldung und kein Ergebnis", () => {
  const ui = baueUmgebung();
  rechne(ui, "2", "1.234,56"); // vorher ein gültiges Ergebnis
  assert.equal(ui.$("bwl-ergebnis").hidden, false);
  rechne(ui, "2", "1.2,00");
  assert.equal(ui.$("bwl-ergebnis").hidden, true, "altes Ergebnis darf nicht stehen bleiben");
  assert.equal(ui.$("bwl-fehler").hidden, false);
  assert.match(ui.$("bwl-fehler").textContent, /^Position 1: Der Tausenderpunkt steht an der falschen Stelle/);
  assert.equal(ui.$("bwl-fehler").focused, true);
});

test("Oberfläche: ungültige Menge und ungültiger Prozentsatz zeigen Fehler statt Ergebnis", () => {
  let ui = baueUmgebung();
  rechne(ui, "1 5", "10,00");
  assert.equal(ui.$("bwl-ergebnis").hidden, true);
  assert.match(ui.$("bwl-fehler").textContent, /^Position 1: Gib eine Menge/);
  ui = baueUmgebung();
  ui.$("p1-menge").value = "1"; ui.$("p1-preis").value = "10,00";
  ui.$("an-hk").value = "5%7"; ui.$("an-gw").value = "5";
  ui.$("bwl-form").fire("submit");
  assert.equal(ui.$("bwl-ergebnis").hidden, true);
  assert.match(ui.$("bwl-fehler").textContent, /^Handlungskostenzuschlag: /);
});
