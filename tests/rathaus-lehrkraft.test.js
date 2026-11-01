"use strict";

// Lehrkraftansicht je Fall und Reset mit Bestätigung. Die echte rathaus-ui.js läuft gegen einen kleinen DOM-Ersatz.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");
const KEY = "verwaltung-ausbildung.rathaus.v1";
const KEY_H = "verwaltung-ausbildung.rathaus.hochbetrieb.v1";
const FORTSCHRITT = "verwaltung-ausbildung.fortschritt.v1";
const hb = require("../js/rathaus-hochbetrieb.js");
const luca = require("../js/rathaus-kern.js");
const navi = require("../js/rathaus-navigation.js");
const lk = require("../js/rathaus-lehrkraft.js");

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "",
    appendChild(c) { this.children.push(c); return c; },
    append() { Array.from(arguments).forEach((c) => this.children.push(c)); },
    get firstChild() { return this.children[0] || null; },
    removeChild(c) { this.children.splice(this.children.indexOf(c), 1); },
    setAttribute(n, w) { this.attrs[n] = String(w); },
    getAttribute(n) { return this.attrs[n] === undefined ? null : this.attrs[n]; },
    removeAttribute(n) { delete this.attrs[n]; },
    addEventListener(n, f) { this.handlers[n] = f; },
    focus() {}
  };
}
function alle(k) {
  return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []);
}
function text(k) {
  return [k.textContent].concat(k.children.map(text)).join(" ");
}

function start(speicher) {
  const store = Object.assign({}, speicher);
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-unterleiste", "rathaus-brotkrumen", "rathaus-ansage"].forEach((id) => {
    ids[id] = knoten("div");
    ids[id].id = id;
  });
  const document = {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => ids[id] || alle(ids.hauptinhalt).find((k) => k.id === id) || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: lk,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => { store[k] = String(w); },
      removeItem: (k) => { delete store[k]; },
      clear() { throw new Error("localStorage.clear darf nicht benutzt werden"); }
    },
    location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    setTimeout(fn) { fn(); return 1; },
    addEventListener() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), { window, document });
  const haupt = ids.hauptinhalt;
  const finde = (fn) => alle(haupt).find(fn) || null;
  return {
    store, ids, sicht: () => text(haupt),
    ueberschrift: () => finde((k) => k.id === "ansicht-titel").textContent,
    knopf: (beschriftung) => finde((k) => k.tag === "button" && k.textContent === beschriftung),
    nach: (id) => finde((k) => k.id === id)
  };
}

const lucaAktiv = () => ({
  [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, gelesen: true, antwort: "Entwurf Luca", bewertungsstand: luca.BEWERTUNGSSTAND }),
  [KEY_H]: JSON.stringify({ gelesen: true, antwort: "Entwurf Noelle", bewertungsstand: hb.BEWERTUNGSSTAND }),
  [FORTSCHRITT]: '{"lf1":true}'
});

const noelleAktiv = () => ({
  [KEY]: JSON.stringify({ aktiverFall: "noelle", gelesen: true, antwort: "Entwurf Luca", bewertungsstand: luca.BEWERTUNGSSTAND }),
  [KEY_H]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, gelesen: true, antwort: "Entwurf Noelle", bewertungsstand: hb.BEWERTUNGSSTAND }),
  [FORTSCHRITT]: '{"lf1":true}'
});

test("Anzeigedaten: Überschrift nennt den Fallnamen, beide Fälle unterscheiden sich", () => {
  const l = lk.fallAnsicht(luca);
  const n = lk.fallAnsicht(hb);
  assert.equal(l.ueberschrift, "Lehrkraftansicht – Fall Luca Berger");
  assert.equal(n.ueberschrift, "Lehrkraftansicht – Fall Noelle Kranz");
  assert.notDeepEqual(l.sachverhalt, n.sachverhalt);
  assert.notDeepEqual(l.typischeFehler, n.typischeFehler);
  assert.notEqual(l.musterantwort.mustertext, n.musterantwort.mustertext);
  assert.ok(l.sachverhalt.some((z) => z.includes("17")), "Lucas Alter aus den Falldaten");
  assert.ok(n.sachverhalt.some((z) => z.includes("19")), "Noelles Alter aus den Falldaten");
});

test("Anzeigedaten: Musterantwort, Kriterien und Quellen sind getrennte Felder aus der Lösung des Falls", () => {
  [[luca, lk.fallAnsicht(luca)], [hb, lk.fallAnsicht(hb)]].forEach(([kern, a]) => {
    const l = kern.lehrkraftLoesung();
    assert.equal(a.musterantwort.mustertext, l.mustertext);
    assert.deepEqual(a.kriterien, l.kriterien);
    assert.deepEqual(a.quellen, l.quellen);
    assert.ok(a.typischeFehler.length > 0);
    assert.ok(a.lernziele.length > 0);
  });
});

test("Fehlende Fachangaben werden als nicht gesondert hinterlegt gekennzeichnet", () => {
  assert.equal(lk.FEHLT, "im Fall nicht gesondert hinterlegt");
  assert.ok(lk.fallAnsicht(luca).lernzieleHinweis.includes("nicht gesondert hinterlegt"));
});

test("Reset-Text nennt nur den gewählten Fall als Ziel, nicht den anderen", () => {
  const l = lk.fallAnsicht(luca);
  const n = lk.fallAnsicht(hb);
  const fl = lk.resetFrage(l.fallName, l.betreff);
  const fn = lk.resetFrage(n.fallName, n.betreff);
  assert.ok(fl.includes("Luca Berger") && !fl.includes("Noelle"));
  assert.ok(fn.includes("Noelle Kranz") && !fn.includes("Luca"));
  assert.ok(fl.includes("andere Personalamt-Vorgang") && fl.includes("Fortschritt auf der Plattform"));
});

test("Oberfläche: Lehrkraftansicht zeigt für Luca und Noelle die jeweilige Überschrift und getrennte Abschnitte", () => {
  const sl = start(lucaAktiv());
  assert.equal(sl.ueberschrift(), "Lehrkraftansicht – Fall Luca Berger");
  const sn = start(noelleAktiv());
  assert.equal(sn.ueberschrift(), "Lehrkraftansicht – Fall Noelle Kranz");
  [sl, sn].forEach((s) => {
    const t = s.sicht();
    ["Sachverhalt", "Besondere Lernziele dieses Falls", "Typische Fehler in diesem Fall", "Musterantwort", "Bewertungskriterien", "Rechtsquellen und Rechtsstand"].forEach((abschnitt) => {
      assert.ok(t.includes(abschnitt), abschnitt);
    });
    assert.ok(t.includes("Keine echte Rollenprüfung"), "Warnung bleibt");
  });
  assert.ok(sn.sicht().includes(hb.lehrkraftLoesung().mustertext));
  assert.equal(sn.sicht().includes(luca.lehrkraftLoesung().mustertext), false);
});

test("Reset: Rückfrage nennt den Fallnamen, Abbrechen ändert nichts", () => {
  const s = start(noelleAktiv());
  const vorher = JSON.stringify(s.store);
  s.knopf("Fall Noelle Kranz für einen neuen Durchlauf zurücksetzen").handlers.click();
  const frage = s.nach("reset-frage");
  assert.ok(frage.textContent.includes("Noelle Kranz"));
  assert.equal(frage.textContent.includes("Luca"), false);
  s.knopf("Abbrechen").handlers.click();
  assert.equal(JSON.stringify(s.store), vorher, "Speicher unverändert");
  assert.equal(s.nach("reset-bestaetigung"), null, "Rückfrage ist geschlossen");
});

test("Reset bestätigt: nur der aktive Fall wird gelöscht, der andere Fall und der Plattformfortschritt bleiben", () => {
  const s = start(noelleAktiv());
  s.knopf("Fall Noelle Kranz für einen neuen Durchlauf zurücksetzen").handlers.click();
  s.knopf("Ja, Fall Noelle Kranz zurücksetzen").handlers.click();
  const noelle = JSON.parse(s.store[KEY_H]);
  assert.equal(noelle.antwort, "");
  assert.equal(noelle.gelesen, false);
  const lucaGespeichert = JSON.parse(s.store[KEY]);
  assert.equal(lucaGespeichert.antwort, "Entwurf Luca");
  assert.equal(lucaGespeichert.gelesen, true);
  assert.equal(s.store[FORTSCHRITT], '{"lf1":true}');

  const s2 = start(lucaAktiv());
  s2.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen").handlers.click();
  s2.knopf("Ja, Fall Luca Berger zurücksetzen").handlers.click();
  assert.equal(JSON.parse(s2.store[KEY]).antwort, "");
  assert.equal(JSON.parse(s2.store[KEY_H]).antwort, "Entwurf Noelle");
  assert.equal(s2.store[FORTSCHRITT], '{"lf1":true}');
});

test("Quelltext: kein localStorage.clear in der Oberfläche, Skript vor rathaus-ui.js eingebunden", () => {
  const ui = fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8");
  assert.equal(/localStorage\.clear\(/.test(ui), false);
  const html = fs.readFileSync(path.join(wurzel, "module/rathaus.html"), "utf8");
  assert.ok(html.indexOf("rathaus-lehrkraft.js") > 0);
  assert.ok(html.indexOf("rathaus-lehrkraft.js") < html.indexOf("rathaus-ui.js"));
});
