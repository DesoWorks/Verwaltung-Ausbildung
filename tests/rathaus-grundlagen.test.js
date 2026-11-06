"use strict";

// Refit A: Der Grundlagen-Block steht in B02, B03, B04 sichtbar vor der ersten bewerteten Frage,
// ohne Auswahlfelder und ohne Optionskennungen. Läuft gegen die echten UI-Dateien mit kleinem DOM-Ersatz.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "",
    disabled: false, checked: false, value: "", name: "", tabIndex: 0,
    appendChild(c) { this.children.push(c); return c; },
    append() { Array.from(arguments).forEach((c) => this.children.push(c)); },
    get firstChild() { return this.children[0] || null; },
    removeChild(c) { this.children.splice(this.children.indexOf(c), 1); },
    setAttribute(n, w) { this.attrs[n] = String(w); },
    getAttribute(n) { return this.attrs[n] === undefined ? null : this.attrs[n]; },
    removeAttribute(n) { delete this.attrs[n]; },
    addEventListener(n, f) { this.handlers[n] = f; },
    focus() {},
    querySelector(t) { return alle(this).find((x) => x.tag === t) || null; }
  };
}
function alle(k) { return k.children.reduce((l, c) => l.concat([c], alle(c)), []); }
function text(k) { return [k.textContent].concat(k.children.map(text)).join(" "); }

function rendere(kernDatei, uiDatei, uiName, kernName) {
  const store = {};
  const ids = {};
  const document = {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => ids[id] || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    [kernName]: require("../js/" + kernDatei),
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => { store[k] = String(w); },
      removeItem: (k) => { delete store[k]; }
    },
    confirm: () => false, location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} }, setTimeout: (f) => { f(); return 1; }, addEventListener() {}
  };
  const kontext = { window, document };
  vm.createContext(kontext);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "js/rathaus-aufgabenfluss.js"), "utf8"), kontext);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "js/" + uiDatei), "utf8"), kontext);
  const host = knoten("div");
  window[uiName].zeichne(host, { ansicht: "buerger", modus: "fall", wechsle() {} });
  return host;
}

const FAELLE = [
  { name: "B02", kern: "rathaus-b02.js", ui: "rathaus-b02-ui.js", uiName: "RATHAUS_B02_UI", kernName: "RATHAUS_B02", beispiel: "Das ist nicht dieselbe Sache wie die Anmeldung nach einem Einzug" },
  { name: "B03", kern: "rathaus-b03.js", ui: "rathaus-b03-ui.js", uiName: "RATHAUS_B03_UI", kernName: "RATHAUS_B03", beispiel: "Ein privater Arbeitgeber ist keine Behörde. Ein gewöhnlicher Bürojob begründet kein erweitertes Zeugnis." },
  { name: "B04", kern: "rathaus-b04.js", ui: "rathaus-b04-ui.js", uiName: "RATHAUS_B04_UI", kernName: "RATHAUS_B04", beispiel: "Bloßes Unbehagen ohne Tatsachen genügt nicht für eine Auskunftssperre." }
];

FAELLE.forEach((f) => {
  test(f.name + ": sichtbarer Grundlagen-Block steht vor der ersten bewerteten Frage", () => {
    const host = rendere(f.kern, f.ui, f.uiName, f.kernName);
    const alles = alle(host);
    const block = alles.find((k) => k.className === "aufgabenfluss-grundlagen");
    assert.ok(block, "Grundlagen-Block fehlt");
    assert.notEqual(block.hidden, true);
    const ersteFrage = alles.find((k) => k.tag === "fieldset" || k.tag === "input");
    assert.ok(ersteFrage, "bewertete Frage fehlt im Test-DOM");
    assert.ok(alles.indexOf(block) < alles.indexOf(ersteFrage), "Block muss vor der ersten Frage stehen");
    assert.equal(alle(block).filter((k) => k.tag === "input" || k.tag === "fieldset").length, 0, "keine Auswahlfelder im Block");
    const t = text(block);
    assert.ok(t.includes("Beispiel (wird nicht bewertet)"));
    assert.ok(t.includes(f.beispiel), "Mini-Beispiel aus dem Plan fehlt");
    assert.ok(t.includes("nachschlagbar"));
  });

  test(f.name + ": vor der Auswertung steht keine Mehrfachauswahl-Rückmeldung", () => {
    const t = text(rendere(f.kern, f.ui, f.uiName, f.kernName));
    ["Richtig ausgewählt", "Falsch ausgewählt", "Relevante Antwort fehlt"].forEach((s) => assert.ok(!t.includes(s), s));
  });
});

// Refit A, zweite Runde: Mehrfachauswahl nach der Auswertung in B03 und B04, nur aus den vorhandenen richtig-Flags.
["B03", "B04"].forEach((name) => {
  const f = FAELLE.find((x) => x.name === name);
  const kern = require("../js/" + f.kern);
  const kat = kern.katalog();
  const feld = Object.keys(kat).find((k) => kat[k].art === "mehrfach" && kat[k].optionen.every((o) => typeof o.richtig === "boolean"));
  const bereichIndex = kern.BEREICHE.findIndex((b) => b.felder.indexOf(feld) >= 0);
  const optionen = kat[feld].optionen;
  const richtig = optionen.filter((o) => o.richtig);
  const falsch = optionen.find((o) => !o.richtig && !o.optional);

  function bis(nachAuswertung) {
    const host = rendere(f.kern, f.ui, f.uiName, f.kernName);
    const eingaben = () => alle(host).filter((k) => k.tag === "input" && k.type === "checkbox" && /-(.+)$/.test(k.name) && k.name.endsWith("-" + feld));
    const waehle = (opt) => {
      const input = eingaben().find((i) => i.value === opt.id);
      input.checked = true;
      input.handlers.change();
    };
    nachAuswertung({ host, waehle });
    return host;
  }
  function oeffneBereich(host) {
    const chip = alle(host).find((k) => k.tag === "button" && k.textContent.indexOf((bereichIndex + 1) + ". ") === 0);
    chip.handlers.click();
  }
  function auswerten(host) {
    alle(host).find((k) => k.tag === "button" && k.textContent === "Auswertung prüfen").handlers.click();
  }

  test(name + ": nach der Auswertung trennt die Rückmeldung Richtig ausgewählt, Falsch ausgewählt und Relevante Antwort fehlt", () => {
    assert.ok(feld && bereichIndex >= 0, "Mehrfachfeld mit richtig-Flags erwartet");
    const host = bis(({ host, waehle }) => {
      waehle(richtig[0]);
      waehle(falsch);
      auswerten(host);
    });
    oeffneBereich(host);
    const box = alle(host).find((k) => k.className === "aufgabenfluss-mehrfach");
    assert.ok(box, "Mehrfach-Rückmeldung fehlt");
    const t = text(box);
    ["Richtig ausgewählt", "Falsch ausgewählt", "Relevante Antwort fehlt"].forEach((s) => assert.ok(t.includes(s), s));
    const nach = (kopf) => {
      const i = t.indexOf(kopf);
      const rest = t.slice(i + kopf.length);
      const ende = ["Richtig ausgewählt", "Falsch ausgewählt", "Relevante Antwort fehlt"].map((w) => rest.indexOf(w)).filter((n) => n >= 0);
      return ende.length ? rest.slice(0, Math.min.apply(null, ende)) : rest;
    };
    assert.ok(nach("Richtig ausgewählt").includes(richtig[0].text));
    assert.ok(nach("Falsch ausgewählt").includes(falsch.text));
    if (richtig.length > 1) assert.ok(nach("Relevante Antwort fehlt").includes(richtig[1].text));
    assert.ok(!nach("Richtig ausgewählt").includes(falsch.text), "falsche Option nicht unter richtig");
    optionen.forEach((o) => assert.ok(!t.includes(o.id) || o.text.includes(o.id), "keine Optionskennung sichtbar: " + o.id));
  });

  test(name + ": optionale Zusatzoption wird nicht als falsch ausgewählt gezeigt", () => {
    const optional = optionen.find((o) => o.optional);
    if (!optional) return;
    const host = bis(({ host, waehle }) => {
      richtig.forEach(waehle);
      waehle(optional);
      auswerten(host);
    });
    oeffneBereich(host);
    const box = alle(host).find((k) => k.className === "aufgabenfluss-mehrfach");
    if (box) assert.ok(!text(box).includes(optional.text.concat("x")), "Platzhalter");
    const unterFalsch = alle(host).filter((k) => k.className === "aufgabenfluss-mehrfach-liste")[1];
    assert.ok(!unterFalsch || !text(unterFalsch).includes(optional.text));
  });
});
