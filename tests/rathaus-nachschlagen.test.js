"use strict";

// Prüft die Nachschlagekarte im Personalamt. Die echte rathaus-ui.js läuft gegen einen kleinen DOM-Ersatz.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const wurzel = path.join(__dirname, "..");
const KEY = "verwaltung-ausbildung.rathaus.v1";
const luca = require("../js/rathaus-kern.js");
const hb = require("../js/rathaus-hochbetrieb.js");
const navi = require("../js/rathaus-navigation.js");
const karte = require("../js/rathaus-nachschlagen.js");

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "", tabIndex: undefined,
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
function alle(k) {
  return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []);
}
function text(k) {
  return [k.textContent].concat(k.children.map(text)).join(" ");
}

function start(speicher, hash) {
  const store = Object.assign({}, speicher);
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-bereiche", "lehrkraft-status", "rathaus-unterleiste", "rathaus-brotkrumen"].forEach((id) => {
    ids[id] = knoten("div");
    ids[id].id = id;
  });
  const document = {
    readyState: "complete",
    createElement: knoten,
    getElementById: (id) => ids[id] || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: require("../js/rathaus-lehrkraft.js"),
    RATHAUS_NACHSCHLAGEN: karte,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => { store[k] = String(w); },
      removeItem: (k) => { delete store[k]; }
    },
    location: { hash: hash || "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    setTimeout() {},
    addEventListener() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), { window, document });
  return {
    store,
    ids,
    sicht: () => text(ids.hauptinhalt),
    knoepfe: () => alle(ids.hauptinhalt).filter((k) => k.tag === "button"),
    unter: () => alle(ids["rathaus-unterleiste"]).filter((k) => k.tag === "button").map((k) => k.textContent),
    klick(beschriftung) {
      const treffer = alle(ids.hauptinhalt).filter((k) => k.tag === "button" && k.textContent === beschriftung);
      assert.ok(treffer[0], "Knopf fehlt: " + beschriftung);
      treffer[0].handlers.click();
    }
  };
}

const personal = (extra) => ({
  [KEY]: JSON.stringify(Object.assign({ ansicht: "personal", bewertungsstand: luca.BEWERTUNGSSTAND }, extra))
});

test("Karte enthält die vereinbarten Grundlagen", () => {
  const t = karte.gesamtText();
  [
    "Berufsschule", "Betrieb", "IHK", "Handwerkskammer",
    "Auszubildende", "Ausbildende",
    "Freistellung", "§ 15", "BBiG",
    "§ 11", "Textform", "wesentlichen Inhalt", "ausgehändigt",
    "§ 20", "Probezeit", "mindestens einen Monat", "höchstens vier Monate",
    "Jugendarbeitsschutzgesetz"
  ].forEach((wort) => assert.ok(t.includes(wort), "fehlt: " + wort));
});

test("Quellenzeile, Übungshinweis, Rechtsstand und Länderhinweis stehen in der Karte", () => {
  const t = karte.gesamtText();
  assert.ok(t.includes("nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026"));
  assert.ok(t.includes("Übung, keine Rechtsberatung"));
  assert.ok(t.includes("Rechtsstand 01.11.2026"));
  assert.ok(t.includes("Länderregeln zur Schulpflicht sind hier nicht dargestellt"));
});

test("Karte verrät keine Lösung und nennt keine Fall- oder Namensdaten", () => {
  const t = karte.gesamtText();
  [/\bLuca\b/, /\bNoelle\b/, /\bHolm\b/, /\bLang\b/, /richtige Entscheidung/i, /Karte B/, /Musterbrief/i, /Musterlösung/i,
    /Personalmangel/i, /Hochbetrieb/i, /fünf Stunden/i, /5 Stunden/, /\/home/, /\.js\b/, /\.md\b/i, /Scan/i,
    /Arbeitsnotiz/i, /IBAN/i, /Kontonummer/i, /luca|noelle|hochbetrieb/i].forEach((muster) => {
    assert.equal(muster.test(t), false, "verboten: " + muster);
  });
  assert.equal(/Berufsschule[^.]*(fällt|fallen) [^.]*aus/i.test(t), false);
});

test("Karte behauptet keine überholte Formvorschrift als heutiges Recht", () => {
  const t = karte.gesamtText();
  assert.equal(/eigenhändig/i.test(t), false);
  assert.equal(/nur schriftlich/i.test(t), false);
  assert.equal(/2008/.test(t), false);
});

test("Karte liefert eine Kopie und ändert sich von außen nicht", () => {
  const a = karte.karte();
  a.titel = "verändert";
  a.abschnitte.length = 0;
  assert.notEqual(karte.karte().titel, "verändert");
  assert.ok(karte.karte().abschnitte.length >= 6);
});

test("Hash #nachschlagen wird erkannt, #lehrkraft bleibt abgelehnt", () => {
  assert.equal(navi.hashZuAnsicht("#nachschlagen"), "nachschlagen");
  assert.equal(navi.hashZuAnsicht("nachschlagen"), "nachschlagen");
  assert.equal(navi.hashZuAnsicht("#lehrkraft"), null);
  assert.ok(navi.istAnsicht("nachschlagen"));
});

test("Personalamt-Unternavigation zeigt die zwei Vorgänge nur in Personalamt-Ansichten; Nachschlagen bleibt Arbeitsfläche", () => {
  ["personal", "post", "akte", "vorgang", "nachschlagen"].forEach((a) => {
    assert.deepEqual(navi.personalUnternavigation(a).map((e) => e.label), ["Luca Berger", "Noelle Kranz"], a);
  });
  ["stadt", "lehrkraft", "unbekannt"].forEach((a) => {
    assert.deepEqual(navi.personalUnternavigation(a), [], a);
  });
  assert.ok(navi.istAnsicht("nachschlagen"), "die Ansicht nachschlagen bleibt erhalten");
  assert.equal(navi.leistenEbene("nachschlagen"), "personal");
});

test("Brotkrumen der Karte führen über Stadt und Personalamt, Rückziel zur Stadt bleibt", () => {
  const k = navi.brotkrumen("nachschlagen");
  assert.deepEqual(k.map((x) => x.label), ["Rathaus Sonnenthal", "Personalamt", "Nachschlagen"]);
  assert.equal(k[0].ziel, "stadt");
  assert.equal(k[1].ziel, "personal");
  assert.equal(k[2].ziel, null);
  assert.deepEqual(navi.rueckziel("nachschlagen"), { ansicht: "personal", modus: null, label: "Zurück zum Personalamt" });
});

test("Lehrkraft bleibt ohne Personalamt-Kind, geschlossene Ämter ohne Aktion", () => {
  assert.ok(!navi.personalUnternavigation("personal").some((e) => e.ansicht === "lehrkraft"));
  assert.ok(!navi.HASH_ANSICHTEN.includes("lehrkraft"));
  assert.equal(navi.leistenEbene("lehrkraft"), null);
  navi.aemter().filter((a) => a.id !== "personal" && a.id !== "buergerbuero").forEach((a) => {
    assert.equal(a.benutzbar, false);
    assert.equal(a.ansicht, null);
  });
});

test("Übersicht des Personalamts hat einen Knopf zur Karte", () => {
  const s = start(personal());
  const knopf = s.knoepfe().find((k) => k.textContent === "Nachschlagekarte öffnen");
  assert.ok(knopf, "Knopf fehlt");
  assert.equal(knopf.type, "button");
});

test("Öffnen der Karte markiert nichts als gelesen, erledigt keinen Schritt und lässt den Entwurf stehen", () => {
  const entwurf = "Mein Entwurf der Antwort an die Auszubildende.";
  const s = start(personal({ antwort: entwurf, entscheidung: "", gruende: [] }));
  s.klick("Nachschlagekarte öffnen");
  const roh = JSON.parse(s.store[KEY]);
  assert.equal(roh.ansicht, "nachschlagen");
  assert.notEqual(roh.gelesen, true);
  assert.notEqual(roh.akteGelesen, true);
  assert.equal(roh.antwort, entwurf);
  assert.notEqual(roh.abgeschlossen, true);
  assert.equal(roh.letzteAuswertung, null);
  // Die Schrittanzeige gehört zum Vorgang und erscheint in der allgemeinen Karte nicht.
  assert.equal(s.ids["rathaus-fortschritt"].hidden, true);
  assert.equal(s.ids["rathaus-fortschritt"].children.length, 0);
});

test("Öffnen der Karte über den Hash ändert weder Lesestand noch Entwurf", () => {
  const entwurf = "Noch nicht fertiger Entwurf.";
  const s = start(personal({ antwort: entwurf }), "#nachschlagen");
  const roh = JSON.parse(s.store[KEY]);
  assert.equal(roh.ansicht, "nachschlagen");
  assert.notEqual(roh.gelesen, true);
  assert.notEqual(roh.akteGelesen, true);
  assert.equal(roh.antwort, entwurf);
});

test("Eine schon gelesene Nachricht bleibt beim Öffnen der Karte gelesen, eine ungelesene ungelesen", () => {
  const a = start(personal({ gelesen: true, akteGelesen: true }));
  a.klick("Nachschlagekarte öffnen");
  const roh = JSON.parse(a.store[KEY]);
  assert.equal(roh.gelesen, true);
  assert.equal(roh.akteGelesen, true);
});

test("Kartenansicht: Überschrift fokussierbar, Knöpfe sind button, Unternavigation zeigt Nachschlagen", () => {
  const s = start(personal(), "#nachschlagen");
  const h2 = alle(s.ids.hauptinhalt).find((k) => k.tag === "h2");
  assert.ok(h2);
  assert.equal(h2.id, "ansicht-titel");
  assert.equal(h2.tabIndex, -1);
  assert.ok(s.knoepfe().length >= 6, "Sprungknöpfe der Karte");
  s.knoepfe().forEach((k) => assert.equal(k.type, "button"));
  assert.ok(alle(s.ids.hauptinhalt).filter((k) => k.tag === "h3").length >= 6);
  assert.ok(s.unter().includes("Luca Berger"), "die Fallleiste zeigt die Vorgänge des Amts");
  assert.equal(s.knoepfe().some((k) => k.textContent === "Zurück zum Personalamt"), false, "kein zweiter Rücksprung im Inhalt");
  assert.ok(alle(s.ids["rathaus-brotkrumen"]).some((k) => k.id === "rathaus-zurueck" && k.textContent === "Zurück zum Personalamt"));
});

test("Kartenansicht in der Oberfläche zeigt keine Pfade, Kennungen oder Lösungen", () => {
  const s = start(personal(), "#nachschlagen");
  const t = s.sicht();
  [/\/home/, /\.js\b/, /\bLuca\b/, /\bNoelle\b/, /Musterbrief/i, /Karte B/].forEach((m) => assert.equal(m.test(t), false, String(m)));
  assert.ok(t.includes("Rechtsstand 01.11.2026"));
  assert.equal(t.includes(luca.lehrkraftLoesung().mustertext), false);
  assert.equal(t.includes(hb.lehrkraftLoesung().mustertext), false);
});

test("Zurück zum Personalamt führt zur Übersicht", () => {
  const s = start(personal(), "#nachschlagen");
  alle(s.ids["rathaus-brotkrumen"]).find((k) => k.id === "rathaus-zurueck").handlers.click();
  assert.equal(JSON.parse(s.store[KEY]).ansicht, "personal");
});

test("rathaus.html bindet die Karte vor der Oberfläche ein", () => {
  const html = fs.readFileSync(path.join(wurzel, "module/rathaus.html"), "utf8");
  assert.ok(html.includes("rathaus-nachschlagen.js"));
  assert.ok(html.indexOf("rathaus-nachschlagen.js") < html.indexOf("rathaus-ui.js"));
});

test("Katalog und Fortschritt sind gegenüber 85e0e3c unverändert", () => {
  // Navigation, Startseite und Plattformmodell wurden im NAVIGATION REBUILD bewusst umgebaut
  // (siehe tests/navigation-rebuild.test.js). Katalog-IDs und Fortschrittsspeicher bleiben geschützt.
  const dateien = ["js/module-daten.js", "js/fortschritt.js"];
  const diff = execFileSync("git", ["diff", "--name-only", "85e0e3cc694bd0574c7f5fc1f6b4145e5165abbd", "--"].concat(dateien), { cwd: wurzel }).toString().trim();
  assert.equal(diff, "");
});

test("Fall- und Bewertungsdateien sind gegenüber 85e0e3c unverändert", () => {
  const basis = "85e0e3cc694bd0574c7f5fc1f6b4145e5165abbd";
  const diff = execFileSync("git", ["diff", "--name-only", basis, "--", "js/rathaus-hochbetrieb.js"], { cwd: wurzel }).toString().trim();
  assert.equal(diff, "");
  // rathaus-kern.js: nur die Funktion hilfe darf abweichen.
  const ohneHilfe = (text) => text.replace(/  function hilfe\(stufe\) \{[\s\S]*?\n  \}\n\n  function hilfeWechsel/, "  function hilfeWechsel");
  const alt = execFileSync("git", ["show", basis + ":js/rathaus-kern.js"], { cwd: wurzel }).toString();
  const neu = fs.readFileSync(path.join(wurzel, "js/rathaus-kern.js"), "utf8");
  assert.notEqual(ohneHilfe(alt), alt, "Funktion hilfe nicht gefunden (alt)");
  assert.notEqual(ohneHilfe(neu), neu, "Funktion hilfe nicht gefunden (neu)");
  assert.equal(ohneHilfe(neu), ohneHilfe(alt));
});
