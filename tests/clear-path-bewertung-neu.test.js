"use strict";

// OPERATION CLEAR PATH: Regressionstests für veraltete Bewertungen (LF1 Vertrag und LF1 Dual)
// und für die Neu-Markierung in der Lernfeldübersicht.
// Die echten Skripte laufen gegen einen kleinen DOM-Ersatz; jsdom ist im Projekt nicht installiert.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");
const quelle = (datei) => fs.readFileSync(path.join(wurzel, datei), "utf8");

function neuerDom(seite) {
  const ids = {};
  const alleKnoten = [];
  const dokHandler = {};

  function knoten(tag) {
    let id = "";
    let text = "";
    const k = {
      tag, className: "", children: [], attrs: {}, handlers: {}, hidden: false, type: "", name: "", value: "",
      checked: false, tabIndex: 0, href: "", open: false, dataset: {}, style: {},
      get id() { return id; },
      set id(w) { id = w; if (w) ids[w] = k; },
      get textContent() { return text + k.children.map((c) => c.textContent).join(""); },
      set textContent(w) { text = String(w); k.children = []; },
      classList: { add(n) { k.className = (k.className ? k.className + " " : "") + n; } },
      appendChild(c) { k.children.push(c); return c; },
      append() { Array.from(arguments).forEach((c) => k.children.push(c)); },
      setAttribute(n, w) { k.attrs[n] = String(w); },
      getAttribute(n) { return k.attrs[n] === undefined ? null : k.attrs[n]; },
      removeAttribute(n) { delete k.attrs[n]; },
      addEventListener(n, f) { k.handlers[n] = f; },
      focus() {}, scrollIntoView() {},
      querySelector() { return null; },
      closest() { return null; }
    };
    alleKnoten.push(k);
    return k;
  }

  const body = knoten("body");
  body.attrs["data-page"] = seite || "";
  const document = {
    readyState: "complete", body,
    createElement: knoten,
    getElementById(id) {
      if (!ids[id]) { const k = knoten("div"); k.id = id; }
      return ids[id];
    },
    querySelectorAll(sel) {
      const radio = /^input\[type="radio"\]\[name="(.+)"\]$/.exec(sel);
      if (radio) return alleKnoten.filter((k) => k.tag === "input" && k.type === "radio" && k.name === radio[1]);
      const eingabe = /^input\[name="(.+)"\]$/.exec(sel);
      if (eingabe) return alleKnoten.filter((k) => k.tag === "input" && k.name === eingabe[1]);
      return [];
    },
    addEventListener(n, f) { dokHandler[n] = f; }
  };
  return { document, ids, alleKnoten, dokHandler, knoten };
}

function laufen(dom, dateien, extra) {
  const speicher = {};
  const window = Object.assign({
    document: dom.document,
    localStorage: {
      getItem: (k) => (k in speicher ? speicher[k] : null),
      setItem: (k, w) => { speicher[k] = String(w); },
      removeItem: (k) => { delete speicher[k]; }
    },
    scrollTo() {}, confirm: () => true
  }, extra || {});
  window.window = window;
  const ctx = vm.createContext(window);
  dateien.forEach((d) => vm.runInContext(quelle(d), ctx, { filename: d }));
  return window;
}

// ---------- LF1 Vertrag ----------

function vertragStart() {
  const dom = neuerDom("lf1-vertrag");
  laufen(dom, ["js/lf1-vertrag.js"]);
  const wahl = (name, wert) => {
    const r = dom.knoten("input");
    r.type = "radio"; r.name = name; r.value = wert;
    return r;
  };
  // Die Seite besitzt die Optionsfelder bereits; hier legen wir die benötigten an.
  const radios = {};
  [["duration", "fits"], ["probation", "clarify"], ["pay_details", "clarify"], ["record_owner", "clarify"],
    ["materials", "clarify"], ["record_support", "fits"],
    ["lc_document", "text_content"], ["lc_probation", "three"], ["lc_end", "announcement"],
    ["lc_end", "exam_day"]].forEach(([n, w]) => { radios[n + "=" + w] = wahl(n, w); });
  const aendern = (n, w) => dom.dokHandler.change({ target: radios[n + "=" + w] });
  const aktion = (name) => dom.dokHandler.click({
    target: { closest: () => ({ getAttribute: () => name }) }
  });
  return { dom, aendern, aktion, text: (id) => dom.document.getElementById(id).textContent };
}

test("LF1 Vertrag: Eine geänderte Kontrollantwort lässt „Bestanden.“ nicht stehen", () => {
  const u = vertragStart();
  u.aendern("lc_document", "text_content");
  u.aendern("lc_probation", "three");
  u.aendern("lc_end", "announcement");
  u.aktion("kontrolle");
  assert.ok(u.text("kontrolle-ergebnis").includes("Bestanden."), "Ausgangslage: bestanden");
  u.aendern("lc_end", "exam_day");
  assert.equal(u.text("kontrolle-ergebnis"), "Antwort geändert – bitte erneut auswerten.");
  assert.ok(!u.text("kontrolle-ergebnis").includes("Bestanden."));
});

test("LF1 Vertrag: Eine geänderte Kontrollantwort lässt das Ergebnis der Vertragsübung unberührt", () => {
  const u = vertragStart();
  ["duration=fits", "probation=clarify", "pay_details=clarify", "record_owner=clarify", "materials=clarify", "record_support=fits"]
    .forEach((p) => { const [n, w] = p.split("="); u.aendern(n, w); });
  u.aktion("auswerten");
  const vorher = u.text("vertrag-ergebnis");
  assert.ok(vorher.includes("6 von 6"), "Ausgangslage: Übung ausgewertet");
  u.aendern("lc_end", "exam_day");
  assert.equal(u.text("vertrag-ergebnis"), vorher);
});

test("LF1 Vertrag: Eine geänderte Übungsantwort leert weiter nur das Übungsergebnis", () => {
  const u = vertragStart();
  ["duration=fits", "probation=clarify", "pay_details=clarify", "record_owner=clarify", "materials=clarify", "record_support=fits"]
    .forEach((p) => { const [n, w] = p.split("="); u.aendern(n, w); });
  u.aktion("auswerten");
  u.aendern("duration", "fits");
  assert.equal(u.text("vertrag-ergebnis"), "");
});

// ---------- LF1 Dual ----------

function dualStart() {
  const dom = neuerDom("lf1-dual");
  const win = laufen(dom, ["js/lf1-dual.js"], { LERNFORTSCHRITT: { benachrichtigen() {} } });
  const dual = win.LF1_DUAL;
  const feld = (id) => dom.document.getElementById(id);
  const waehle = (frage, wert) => {
    const input = dom.alleKnoten.find((k) => k.tag === "input" && k.name === frage && k.value === wert);
    assert.ok(input, "Auswahl fehlt: " + frage + "=" + wert);
    input.checked = true;
    input.handlers.change();
  };
  return { dual, dom, feld, waehle };
}

test("LF1 Dual: Nach einer Antwortänderung zeigt die sichtbare Übungszusammenfassung die veraltete Bewertung", () => {
  const u = dualStart();
  ["a1=a", "a2=b", "a3=c", "a4=a", "a5=c"].forEach((p) => { const [f, w] = p.split("="); u.waehle(f, w); });
  u.feld("uebung-pruefen").handlers.click();
  const box = u.feld("uebung-ergebnis");
  assert.equal(box.hidden, false);
  assert.ok(box.textContent.includes("5 von 5 aktuell richtig"), "Ausgangslage: " + box.textContent);
  u.waehle("a1", "b");
  assert.ok(box.textContent.includes("4 von 5 aktuell richtig"), "Zusammenfassung muss neu berechnet sein: " + box.textContent);
  assert.ok(box.textContent.includes("1 Bewertung(en) veraltet – bitte erneut auswerten."), box.textContent);
});

test("LF1 Dual: Die Lernkontrolle-Zusammenfassung wird ebenfalls aktualisiert, die Übung bleibt unberührt", () => {
  const u = dualStart();
  ["a1=a", "a2=b", "a3=c", "a4=a", "a5=c", "k1=b", "k2=a", "k3=c", "k4=b"].forEach((p) => { const [f, w] = p.split("="); u.waehle(f, w); });
  u.feld("uebung-pruefen").handlers.click();
  u.feld("kontrolle-pruefen").handlers.click();
  const uebung = u.feld("uebung-ergebnis").textContent;
  u.waehle("k2", "b");
  const kontrolle = u.feld("kontrolle-ergebnis").textContent;
  assert.ok(kontrolle.includes("3 von 4 aktuell richtig"), kontrolle);
  assert.ok(kontrolle.includes("veraltet – bitte erneut auswerten."), kontrolle);
  assert.equal(u.feld("uebung-ergebnis").textContent, uebung);
});

test("LF1 Dual: Ein noch nicht angezeigtes Ergebnis wird durch eine Antwortänderung nicht eingeblendet", () => {
  const u = dualStart();
  u.waehle("a1", "a");
  assert.equal(u.feld("uebung-ergebnis").textContent, "");
});

// ---------- Neu-Markierung ----------

test("Neu-Markierung: genau lf1-dual, lf1-vertrag und lf1-beendigung tragen neu: true", () => {
  const dom = neuerDom("");
  const win = laufen(dom, ["js/module-daten.js"]);
  const lektionen = [];
  (win.MODULE_DATEN || []).forEach((jahr) => (jahr.module || []).forEach((feld) => (feld.unterthemen || []).forEach((l) => lektionen.push(l))));
  const neu = lektionen.filter((l) => l.neu === true).map((l) => l.id).sort();
  assert.deepEqual(neu, ["lf1-beendigung", "lf1-dual", "lf1-vertrag"]);
  assert.equal(lektionen.filter((l) => "neu" in l && l.neu !== true).length, 0);
});

test("Neu-Markierung: Übersicht zeigt den Text „Neu“ nur an den drei Lektionen, unabhängig vom Abschluss", () => {
  const dom = neuerDom("");
  dom.document.getElementById("jahre");
  const abgeschlossen = new Set(["lf1-dual"]);
  laufen(dom, ["js/module-daten.js", "js/plattform-navigation.js", "js/startseite.js"], {
    LERNFORTSCHRITT: {
      abgeschlossen: (id) => abgeschlossen.has(id),
      abschlusszeichen: () => { const z = dom.knoten("span"); z.className = "abschlusszeichen"; z.textContent = "✓"; return z; }
    },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} }
  });
  const waagerecht = (k) => [k].concat(...k.children.map(waagerecht));
  const wurzel = dom.document.getElementById("jahre");
  const alle = waagerecht(wurzel);
  const zeilen = alle.filter((k) => k.className === "modul-titelzeile");
  assert.ok(zeilen.length > 10, "Lektionszeilen vorhanden: " + zeilen.length);
  const mitNeu = zeilen.filter((z) => z.children.some((c) => c.className === "lektion-neu"))
    .map((z) => z.children.find((c) => c.className === "unterthema-titel").textContent).sort();
  assert.deepEqual(mitNeu, ["Der Ausbildungsvertrag", "Freistellung und Beendigung", "Zwei Lernorte"]);
  alle.filter((k) => k.className === "lektion-neu").forEach((n) => assert.equal(n.textContent, "Neu"));
  const dual = zeilen.find((z) => z.children.some((c) => c.textContent === "Zwei Lernorte"));
  assert.ok(dual.children.some((c) => c.className === "abschlusszeichen"), "Abschlusszeichen bleibt neben der Neu-Markierung");
  assert.ok(dual.children.some((c) => c.className === "lektion-neu"));
});

test("Neu-Markierung: Stylesheet gibt der Markierung einen Rahmen und lesbare Textfarbe", () => {
  const css = quelle("css/startseite.css");
  const regel = /\.lektion-neu\s*\{([^}]*)\}/.exec(css);
  assert.ok(regel, ".lektion-neu fehlt");
  assert.ok(/border:\s*2px solid/.test(regel[1]));
  assert.ok(/color:\s*var\(--farbe-text\)/.test(regel[1]));
});
