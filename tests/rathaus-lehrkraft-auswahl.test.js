"use strict";

// Lehrkraftansicht 2.0: eine Auswahl, immer nur ein vollständiger Fall. Die echte rathaus-ui.js läuft gegen einen kleinen DOM-Ersatz.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");
const luca = require("../js/rathaus-kern.js");
const hb = require("../js/rathaus-hochbetrieb.js");
const navi = require("../js/rathaus-navigation.js");
const lk = require("../js/rathaus-lehrkraft.js");
const b1 = require("../js/rathaus-buergerbuero.js");
const b2 = require("../js/rathaus-b02.js");
const b3 = require("../js/rathaus-b03.js");
const b4 = require("../js/rathaus-b04.js");

const KEY = "verwaltung-ausbildung.rathaus.v1";
const KEY_H = "verwaltung-ausbildung.rathaus.hochbetrieb.v1";
const FORTSCHRITT = "verwaltung-ausbildung.fortschritt";

const FAELLE = [
  { id: "luca", label: "Luca Berger", gruppe: "Personalamt", muster: () => luca.lehrkraftLoesung().mustertext },
  { id: "noelle", label: "Noelle Kranz", gruppe: "Personalamt", muster: () => hb.lehrkraftLoesung().mustertext },
  { id: "b01", label: "B01 – Samira Yilmaz", gruppe: "Bürgerbüro", muster: () => b1.lehrkraft().musterantwort },
  { id: "b02", label: "B02 – Alex Weber", gruppe: "Bürgerbüro", muster: () => b2.lehrkraft().musterantwort },
  { id: "b03", label: "B03 – Robin Keller", gruppe: "Bürgerbüro", muster: () => b3.lehrkraft().musterantwort },
  { id: "b04", label: "B04 – Mira Hoffmann", gruppe: "Bürgerbüro", muster: () => b4.lehrkraft().musterantwort }
];

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "",
    value: "", selected: false, label: "", disabled: false, checked: false, name: "", tabIndex: 0,
    appendChild(c) { this.children.push(c); return c; },
    append() { Array.from(arguments).forEach((c) => this.children.push(c)); },
    get firstChild() { return this.children[0] || null; },
    get lastChild() { return this.children[this.children.length - 1] || null; },
    removeChild(c) { this.children.splice(this.children.indexOf(c), 1); },
    setAttribute(n, w) { this.attrs[n] = String(w); },
    getAttribute(n) { return this.attrs[n] === undefined ? null : this.attrs[n]; },
    removeAttribute(n) { delete this.attrs[n]; },
    addEventListener(n, f) { this.handlers[n] = f; },
    focus() { knoten.fokussiert.push(this.id || this.tag); },
    querySelector(t) { return alle(this).find((x) => x.tag === t) || null; }
  };
}
knoten.fokussiert = [];
function alle(k) { return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []); }
function text(k) { return [k.textContent].concat(k.children.map(text)).join(" "); }

function start(speicher) {
  knoten.fokussiert = [];
  const store = Object.assign({}, speicher);
  const geschrieben = [];
  const entfernt = [];
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-bereiche", "lehrkraft-status", "rathaus-unterleiste", "rathaus-brotkrumen", "rathaus-ansage"].forEach((id) => {
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
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, w) => { geschrieben.push(k); store[k] = String(w); },
    removeItem: (k) => { entfernt.push(k); delete store[k]; }
  };
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: lk,
    RATHAUS_BUERGERBUERO: b1,
    RATHAUS_B02: b2,
    RATHAUS_B03: b3,
    RATHAUS_B04: b4,
    localStorage,
    confirm: () => false,
    location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    setTimeout: (f) => { f(); return 1; },
    clearTimeout() {},
    addEventListener() {}
  };
  const kontext = { window, document, localStorage };
  vm.createContext(kontext);
  ["rathaus-buergerbuero-ui.js", "rathaus-b02-ui.js", "rathaus-b03-ui.js", "rathaus-b04-ui.js", "rathaus-ui.js"].forEach((datei) => {
    vm.runInContext(fs.readFileSync(path.join(wurzel, "js", datei), "utf8"), kontext);
  });
  const haupt = ids.hauptinhalt;
  const api = {
    store, geschrieben, entfernt, haupt, ids,
    sicht: () => text(haupt),
    nach: (id) => alle(haupt).find((k) => k.id === id) || null,
    auswahl: () => alle(haupt).find((k) => k.tag === "select" && k.id === "lehrkraft-fall"),
    knopf: (beschriftung) => alle(haupt).find((k) => k.tag === "button" && k.textContent === beschriftung) || null,
    waehle(id) {
      const a = api.auswahl();
      a.value = id;
      a.handlers.change();
    }
  };
  return api;
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

test("Auswahl: ein natives select mit Beschriftung, sechs Optionen in zwei Gruppen", () => {
  const s = start(lucaAktiv());
  const auswahl = s.auswahl();
  assert.ok(auswahl, "select#lehrkraft-fall fehlt");
  const beschriftung = alle(s.haupt).find((k) => k.tag === "label" && k.attrs["for"] === "lehrkraft-fall");
  assert.ok(beschriftung && beschriftung.textContent.length > 0, "Beschriftung fehlt");
  const gruppen = auswahl.children.filter((k) => k.tag === "optgroup");
  assert.deepEqual(gruppen.map((g) => g.label), ["Personalamt", "Bürgerbüro"]);
  assert.deepEqual(gruppen[0].children.map((o) => o.textContent), ["Luca Berger", "Noelle Kranz"]);
  assert.deepEqual(gruppen[1].children.map((o) => o.textContent), ["B01 – Samira Yilmaz", "B02 – Alex Weber", "B03 – Robin Keller", "B04 – Mira Hoffmann"]);
  assert.equal(alle(auswahl).filter((k) => k.tag === "option").length, 6);
  assert.equal(auswahl.value, "luca");
  assert.equal(alle(auswahl).filter((k) => k.tag === "option" && k.selected).length, 1, "genau eine Option ist gewählt");
  assert.equal(alle(s.haupt).filter((k) => k.tag === "button" && FAELLE.some((f) => f.label === k.textContent)).length, 0, "keine Buttonwand");
});

test("Immer nur ein Fall vollständig: die Musterlösungen vermischen sich nicht", () => {
  const s = start(lucaAktiv());
  FAELLE.forEach((f) => assert.ok(f.muster().length > 20, "Musterlösung vorhanden: " + f.id));
  FAELLE.forEach((gewaehlt) => {
    s.waehle(gewaehlt.id);
    const t = s.sicht();
    assert.ok(t.includes(gewaehlt.muster()), "eigene Musterlösung: " + gewaehlt.id);
    FAELLE.filter((f) => f.id !== gewaehlt.id).forEach((fremd) => {
      assert.equal(t.includes(fremd.muster()), false, fremd.id + " darf bei " + gewaehlt.id + " nicht sichtbar sein");
    });
    assert.equal(s.auswahl().value, gewaehlt.id);
    assert.ok(t.includes("Angezeigter Fall"), "sichtbarer Satz zum offenen Fall");
    assert.equal(t.includes("Vorhandene Übungsfälle"), false);
  });
});

test("Überschrift: Personalfälle heißen weiter „Lehrkraftansicht – Fall NAME“", () => {
  const s = start(lucaAktiv());
  assert.equal(s.nach("ansicht-titel").textContent, "Lehrkraftansicht – Fall Luca Berger");
  s.waehle("noelle");
  assert.equal(s.nach("ansicht-titel").textContent, "Lehrkraftansicht – Fall Noelle Kranz");
  s.waehle("b02");
  assert.ok(s.nach("ansicht-titel").textContent.includes("B02"));
});

test("Anfangswahl: aktiver Lernfall Noelle öffnet Noelle, sonst Luca", () => {
  assert.equal(start(noelleAktiv()).auswahl().value, "noelle");
  assert.equal(start(lucaAktiv()).auswahl().value, "luca");
});

test("Wechsel schreibt nichts, löscht nichts, wechselt den Lernfall nicht und lässt den Fokus auf der Auswahl", () => {
  const s = start(noelleAktiv());
  const vorher = JSON.stringify(s.store);
  const geschriebenVorher = s.geschrieben.length;
  const fokusVorher = knoten.fokussiert.length;
  ["luca", "b01", "b02", "b03", "b04", "noelle"].forEach((id) => s.waehle(id));
  assert.equal(JSON.stringify(s.store), vorher, "Speicher unverändert");
  assert.equal(s.geschrieben.length, geschriebenVorher, "kein setItem durch den Wechsel");
  assert.deepEqual(s.entfernt, [], "kein removeItem durch den Wechsel");
  assert.equal(JSON.parse(s.store[KEY]).aktiverFall, "noelle", "Lernfall bleibt Noelle");
  assert.equal(knoten.fokussiert.length, fokusVorher, "kein Fokussprung, der Fokus bleibt auf dem select");
});

test("Rücksetzen gibt es nur bei Personalfällen und nur für den angezeigten Fall", () => {
  const s = start(lucaAktiv());
  assert.ok(s.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen"));
  assert.equal(s.knopf("Fall Noelle Kranz für einen neuen Durchlauf zurücksetzen"), null);
  s.waehle("b01");
  assert.equal(alle(s.haupt).filter((k) => k.tag === "button" && /zurücksetzen/.test(k.textContent)).length, 0, "kein Reset-Knopf bei B01");
});

test("Reset des angezeigten, nicht aktiven Falls Noelle: nur Noelle wird gelöscht, Luca und Fortschritt bleiben", () => {
  const s = start(lucaAktiv());
  s.waehle("noelle");
  s.knopf("Fall Noelle Kranz für einen neuen Durchlauf zurücksetzen").handlers.click();
  assert.deepEqual(s.entfernt, [], "die Rückfrage allein löscht nichts");
  s.knopf("Ja, Fall Noelle Kranz zurücksetzen").handlers.click();
  assert.deepEqual(s.entfernt, [KEY_H]);
  assert.equal(JSON.parse(s.store[KEY]).antwort, "Entwurf Luca");
  assert.equal(JSON.parse(s.store[KEY]).gelesen, true);
  assert.equal(s.store[FORTSCHRITT], '{"lf1":true}');
  assert.equal(s.geschrieben.includes(KEY), false, "der aktive Lernstand wird nicht neu geschrieben");
  assert.equal(s.auswahl().value, "noelle", "Die Anzeige bleibt beim zurückgesetzten Fall");
});

test("Reset des angezeigten, nicht aktiven Falls Luca: Noelles Speicher und die Wahl des aktiven Vorgangs bleiben", () => {
  const s = start(noelleAktiv());
  s.waehle("luca");
  s.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen").handlers.click();
  s.knopf("Ja, Fall Luca Berger zurücksetzen").handlers.click();
  assert.equal(JSON.parse(s.store[KEY_H]).antwort, "Entwurf Noelle", "Noelle bleibt");
  const alt = JSON.parse(s.store[KEY]);
  assert.equal(alt.aktiverFall, "noelle", "Noelle bleibt der aktive Vorgang");
  assert.equal(alt.antwort, undefined, "Lucas Entwurf ist gelöscht");
  assert.equal(s.store[FORTSCHRITT], '{"lf1":true}');
});

test("Reset des aktiven Falls löscht weiter nur dessen Speicher", () => {
  const s = start(lucaAktiv());
  s.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen").handlers.click();
  s.knopf("Ja, Fall Luca Berger zurücksetzen").handlers.click();
  assert.equal(JSON.parse(s.store[KEY]).antwort, "");
  assert.equal(JSON.parse(s.store[KEY_H]).antwort, "Entwurf Noelle");
  assert.equal(s.store[FORTSCHRITT], '{"lf1":true}');
});

test("Ein Wechsel schließt eine offene Rückfrage, ohne etwas zu löschen", () => {
  const s = start(lucaAktiv());
  s.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen").handlers.click();
  assert.ok(s.nach("reset-bestaetigung"));
  s.waehle("noelle");
  assert.equal(s.nach("reset-bestaetigung"), null);
  assert.deepEqual(s.entfernt, []);
});

test("Lernansichten zeigen weder Auswahl noch Musterlösung noch „Vorhandene Übungsfälle“", () => {
  const roh = lucaAktiv();
  roh[KEY] = JSON.stringify({ ansicht: "vorgang", gelesen: true, akteGelesen: true, bewertungsstand: luca.BEWERTUNGSSTAND });
  const s = start(roh);
  assert.equal(s.auswahl() || null, null);
  FAELLE.forEach((f) => assert.equal(s.sicht().includes(f.muster()), false, f.id));
  assert.equal(s.sicht().includes("Vorhandene Übungsfälle"), false);
});

test("Ein fehlendes Bürgerbüro-Modul fehlt in der Auswahl und wird nicht erfunden", () => {
  const roh = lucaAktiv();
  const store = Object.assign({}, roh);
  const geladen = start(store);
  assert.equal(alle(geladen.auswahl()).filter((k) => k.tag === "option").length, 6);
  // Nur Personalamt: gleiche Oberfläche ohne die drei Bürgerbüro-UI-Skripte.
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-bereiche", "lehrkraft-status", "rathaus-unterleiste", "rathaus-brotkrumen"].forEach((id) => { ids[id] = knoten("div"); ids[id].id = id; });
  const document = { readyState: "complete", createElement: knoten, createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }), getElementById: (id) => ids[id] || null, querySelectorAll: () => [], addEventListener() {} };
  const window = {
    RATHAUS_KERN: luca, RATHAUS_HOCHBETRIEB: hb, RATHAUS_NAVIGATION: navi, RATHAUS_LEHRKRAFT: lk,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem() {}, removeItem() {} },
    location: { hash: "", pathname: "/rathaus.html", search: "" }, history: { replaceState() {} }, setTimeout() {}, addEventListener() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), { window, document });
  const optionen = alle(ids.hauptinhalt).filter((k) => k.tag === "option").map((k) => k.textContent);
  assert.deepEqual(optionen, ["Luca Berger", "Noelle Kranz"]);
});

test("CSS: Auswahl mindestens 44 px hoch, volle Breite, erbt die Schrift", () => {
  const css = fs.readFileSync(path.join(wurzel, "css", "rathaus.css"), "utf8");
  const regel = css.match(/\.rathaus-fallwahl select\s*\{[^}]*\}/);
  assert.ok(regel, "Regel für die Auswahl fehlt");
  assert.ok(/min-height:\s*44px/.test(regel[0]));
  assert.ok(/width:\s*100%/.test(regel[0]));
  assert.ok(/font:\s*inherit/.test(regel[0]));
  assert.ok(/box-sizing:\s*border-box/.test(regel[0]));
});

test("Quelltext: Wechsel der Auswahl ruft weder aktiviereFall noch speichern noch Neuladen", () => {
  const ui = fs.readFileSync(path.join(wurzel, "js", "rathaus-ui.js"), "utf8");
  const von = ui.indexOf('auswahl.addEventListener("change"');
  assert.ok(von > 0);
  const handler = ui.slice(von, ui.indexOf("});", von) + 3);
  assert.ok(!/aktiviereFall|speichern\(|location|reload|zeichnen\(\)|fokus\(/.test(handler), handler);
  assert.ok(/ansage\(/.test(handler), "Ansage für den neuen Fall");
});
