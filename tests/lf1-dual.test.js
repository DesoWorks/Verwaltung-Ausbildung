"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const wurzel = path.join(__dirname, "..");
const lies = (datei) => fs.readFileSync(path.join(wurzel, datei), "utf8");
const dual = require("../js/lf1-dual.js");

/* Unabhängiger Schlüssel des Tests (aus dem Bauplan), nicht aus dem Modul gelesen. */
const RICHTIG = { a1: "a", a2: "b", a3: "c", a4: "a", a5: "c", k1: "b", k2: "a", k3: "c", k4: "b" };
const A = ["a1", "a2", "a3", "a4", "a5"];
const K = ["k1", "k2", "k3", "k4"];
const ALLE = A.concat(K);
const falscheWahl = (id) => ["a", "b", "c"].find((w) => w !== RICHTIG[id]);

function stand(ueberschreibung) {
  const s = dual.leer();
  ALLE.forEach((id) => dual.antworten(s, id, RICHTIG[id]));
  Object.keys(ueberschreibung || {}).forEach((id) => dual.antworten(s, id, ueberschreibung[id]));
  return s;
}

function speicher(werfen) {
  const daten = {};
  return {
    daten,
    getItem: (k) => (k in daten ? daten[k] : null),
    setItem: (k, v) => { if (werfen) throw new Error("verweigert"); daten[k] = v; },
    removeItem: (k) => { delete daten[k]; }
  };
}

test("alle neun Antworten richtig: fünf plus vier Flags, Abschluss erst nach Auswertung und Abschlussschritt", () => {
  const s = stand();
  ALLE.forEach((id) => assert.strictEqual(dual.status(s, id), "unbeantwortet", id));
  assert.strictEqual(dual.abschlussMoeglich(s), false);
  dual.auswerten(s, A);
  assert.strictEqual(dual.uebungFreigegeben(s), true);
  assert.strictEqual(dual.abschlussMoeglich(s), false);
  dual.auswerten(s, K);
  assert.strictEqual(dual.kontrolleBestanden(s), true);
  const flags = dual.flags(s);
  assert.deepStrictEqual(Object.keys(flags).length, 9);
  Object.keys(flags).forEach((name) => assert.strictEqual(flags[name], true, name));
  assert.deepStrictEqual(Object.keys(dual.flags(s, A)), ["lernorteErkannt", "betrieblichesLernenErkannt", "grundlagenUnterschieden", "lernorteVerknuepft", "klaerungGewaehlt"]);
  assert.strictEqual(dual.abgeschlossen(s), false);
  assert.strictEqual(dual.abschlussVersuchen(s), true);
  assert.strictEqual(dual.abgeschlossen(s), true);
  assert.strictEqual(dual.fortschritt(s), 100);
});

ALLE.forEach((id) => {
  test("nur " + id + " falsch: genau dieser Block falsch, Flag false, Abschluss gesperrt", () => {
    const s = stand({ [id]: falscheWahl(id) });
    dual.auswerten(s, ALLE);
    ALLE.forEach((andere) => {
      assert.strictEqual(dual.status(s, andere), andere === id ? "falsch" : "richtig", andere);
    });
    const flags = dual.flags(s);
    assert.strictEqual(Object.values(flags).filter((w) => !w).length, 1);
    assert.strictEqual(dual.abschlussVersuchen(s), false);
    assert.strictEqual(dual.abgeschlossen(s), false);
    const ansicht = dual.ansicht(s, id);
    assert.ok(ansicht.statusText.includes("Noch nicht richtig"));
    if (id.charAt(0) === "a") assert.ok(ansicht.hinweis && ansicht.hinweis.length > 5);
    assert.strictEqual(dual.ansicht(s, id).aufloesung !== null, id.charAt(0) === "k");
  });

  test("nur " + id + " fehlt: unbeantwortet statt falsch, übrige Blöcke werden bewertet, Abschluss gesperrt", () => {
    const s = stand();
    delete s.answers[id];
    const ids = id.charAt(0) === "a" ? A : K;
    const res = dual.auswerten(s, ids);
    assert.deepStrictEqual(res.fehlend, [id]);
    assert.strictEqual(dual.status(s, id), "unbeantwortet");
    assert.notStrictEqual(dual.status(s, id), "falsch");
    ids.filter((x) => x !== id).forEach((x) => assert.strictEqual(dual.status(s, x), "richtig", x));
    assert.strictEqual(dual.flags(s)[dual.FRAGEN.find((f) => f.id === id).flag], false);
    assert.strictEqual(dual.abschlussVersuchen(s), false);
    assert.strictEqual(dual.ansicht(s, id).hinweis, null);
  });
});

test("alle Pflichtfelder leer: alles unbeantwortet, kein falsch, Fortschritt 0", () => {
  const s = dual.leer();
  const res = dual.auswerten(s, ALLE);
  assert.strictEqual(res.fehlend.length, 9);
  ALLE.forEach((id) => assert.strictEqual(dual.status(s, id), "unbeantwortet"));
  assert.strictEqual(dual.fortschritt(s), 0);
  assert.strictEqual(dual.abschlussVersuchen(s), false);
});

test("veraltet: Änderung nach Auswertung betrifft nur den geänderten Block und sperrt den Abschluss", () => {
  const s = stand();
  dual.auswerten(s, ALLE);
  dual.abschlussVersuchen(s);
  assert.strictEqual(dual.abgeschlossen(s), true);
  dual.antworten(s, "a3", falscheWahl("a3"));
  assert.strictEqual(dual.status(s, "a3"), "veraltet");
  ALLE.filter((id) => id !== "a3").forEach((id) => assert.strictEqual(dual.status(s, id), "richtig", id));
  assert.strictEqual(dual.abgeschlossen(s), false);
  assert.strictEqual(dual.abschlussMoeglich(s), false);
  assert.strictEqual(dual.flags(s).grundlagenUnterschieden, false);
  const v = dual.ansicht(s, "a3");
  assert.ok(v.statusText.includes("bitte erneut auswerten"));
  assert.strictEqual(v.hinweis, null);
  assert.strictEqual(v.aufloesung, null);
  dual.auswerten(s, ["a3"]);
  assert.strictEqual(dual.status(s, "a3"), "falsch");
  dual.antworten(s, "a3", RICHTIG.a3);
  assert.strictEqual(dual.status(s, "a3"), "veraltet", "die frühere Bewertung galt für eine andere Antwort");
  dual.auswerten(s, ["a3"]);
  assert.strictEqual(dual.status(s, "a3"), "richtig");
  assert.strictEqual(dual.abgeschlossen(s), false, "der Abschluss bleibt gesperrt, bis er erneut erreicht wird");
  assert.strictEqual(dual.abschlussVersuchen(s), true);
});

test("veraltet in der Kontrolle blendet die Auflösung des früheren Versuchs aus", () => {
  const s = stand();
  dual.auswerten(s, K);
  assert.ok(dual.ansicht(s, "k1").aufloesung);
  dual.antworten(s, "k1", "a");
  assert.strictEqual(dual.status(s, "k1"), "veraltet");
  assert.strictEqual(dual.ansicht(s, "k1").aufloesung, null);
});

test("vorzeitig: vor der Auswertung weder Hinweis noch Auflösung noch Richtig/Falsch", () => {
  const s = stand();
  ALLE.forEach((id) => {
    const v = dual.ansicht(s, id);
    assert.strictEqual(v.status, "unbeantwortet", id);
    assert.strictEqual(v.hinweis, null, id);
    assert.strictEqual(v.aufloesung, null, id);
    assert.strictEqual(v.meldung, "", id);
    assert.ok(!/Richtig|richtig/.test(v.statusText.replace("Noch nicht", "")), id);
  });
  const leerStand = dual.leer();
  ALLE.forEach((id) => assert.strictEqual(dual.ansicht(leerStand, id).hinweis, null));
});

test("vorzeitig: HTML und Fragenoptionen enthalten keine Lösungstexte und keine Vorauswahl", () => {
  const html = lies("module/lf1-dual.html");
  dual.FRAGEN.forEach((f) => {
    if (f.hinweis) assert.ok(!html.includes(f.hinweis), f.id + " Hinweis im HTML");
    if (f.aufloesung) assert.ok(!html.includes(f.aufloesung), f.id + " Auflösung im HTML");
    f.hilfen && f.hilfen.forEach((h) => assert.ok(!html.includes(h), f.id + " Hilfe im HTML"));
    f.options.forEach((o) => assert.ok(!html.includes(o.label), f.id + " Antworttext im HTML"));
    assert.ok(!("correct" in f) && !("richtig" in f) && !("loesung" in f), f.id);
    f.options.forEach((o) => assert.deepStrictEqual(Object.keys(o).sort(), ["label", "value"]));
  });
  assert.ok(!/Richtig ist [abc]/.test(html));
  assert.ok(!/\bchecked\b/.test(html));
  assert.ok(!Object.prototype.hasOwnProperty.call(dual, "SCHLUESSEL"));
});

test("Hilfen: zwei Stufen, nacheinander, ohne Einfluss auf die Bewertung", () => {
  const s = stand();
  dual.auswerten(s, A);
  assert.strictEqual(dual.ansicht(s, "a1").hilfen.length, 0);
  assert.strictEqual(dual.hilfeAufrufen(s, "a1"), 1);
  assert.strictEqual(dual.hilfeAufrufen(s, "a1"), 2);
  assert.strictEqual(dual.hilfeAufrufen(s, "a1"), 2);
  assert.strictEqual(dual.ansicht(s, "a1").hilfen.length, 2);
  assert.strictEqual(dual.ansicht(s, "a2").hilfen.length, 0);
  assert.strictEqual(dual.status(s, "a1"), "richtig");
  assert.strictEqual(dual.hilfeAufrufen(s, "k1"), 0, "die Lernkontrolle hat keine Hilfen");
  dual.FRAGEN.filter((f) => f.id.charAt(0) === "k").forEach((f) => assert.ok(!f.hilfen));
  dual.FRAGEN.filter((f) => f.id.charAt(0) === "a").forEach((f) => assert.strictEqual(f.hilfen.length, 2));
});

test("Speicherung: Rundlauf, falsche Schema-Version, beschädigt, verweigert", () => {
  const s = stand();
  dual.auswerten(s, ALLE);
  dual.hilfeAufrufen(s, "a2");
  dual.abschlussVersuchen(s);
  const sp = speicher(false);
  assert.strictEqual(dual.speichern(sp, s), true);
  assert.ok(Object.prototype.hasOwnProperty.call(sp.daten, "verwaltung-ausbildung.lf1-dual.v1"));
  const geladen = dual.laden(sp);
  ALLE.forEach((id) => assert.strictEqual(dual.status(geladen, id), "richtig", id));
  assert.strictEqual(geladen.hilfen.a2, 1);
  assert.strictEqual(dual.abgeschlossen(geladen), true);

  const roh = JSON.parse(sp.daten[dual.KEY]);
  roh.answers.a1 = "b";
  sp.daten[dual.KEY] = JSON.stringify(roh);
  const veraltet = dual.laden(sp);
  assert.strictEqual(dual.status(veraltet, "a1"), "veraltet");
  assert.strictEqual(dual.abgeschlossen(veraltet), false);

  roh.answers.a1 = "a";
  roh.finish = true;
  roh.bewertet.k3 = "a";
  sp.daten[dual.KEY] = JSON.stringify(roh);
  assert.strictEqual(dual.abgeschlossen(dual.laden(sp)), false, "ein manipulierter Abschluss zählt nicht");

  sp.daten[dual.KEY] = JSON.stringify(Object.assign({}, roh, { v: 99 }));
  assert.deepStrictEqual(dual.laden(sp).answers, {});
  sp.daten[dual.KEY] = "{kaputt";
  assert.deepStrictEqual(dual.laden(sp).answers, {});
  sp.daten[dual.KEY] = JSON.stringify({ v: 1, answers: { a1: "zzz", x9: "a" }, bewertet: "text", hilfen: { a1: 99 } });
  const bereinigt = dual.laden(sp);
  assert.deepStrictEqual(bereinigt.answers, {});
  assert.deepStrictEqual(bereinigt.hilfen, {});

  assert.strictEqual(dual.speichern(speicher(true), s), false, "Speicherfehler wird gemeldet, nicht verschwiegen");
  assert.deepStrictEqual(dual.laden({ getItem() { throw new Error("verweigert"); } }).answers, {});
});

test("Freitext wird nicht bewertet und standardmäßig nicht gespeichert", () => {
  const s = stand();
  s.notizen = { start: "Geheime Notiz", transfer: "Zweite Notiz" };
  assert.ok(!dual.serialisieren(s).includes("Geheime Notiz"));
  s.notizenSpeichern = true;
  assert.ok(dual.serialisieren(s).includes("Geheime Notiz"));
  assert.strictEqual(dual.parsen(dual.serialisieren(s)).notizen.transfer, "Zweite Notiz");
  s.notizenSpeichern = false;
  const zurueck = dual.parsen(dual.serialisieren(s));
  assert.deepStrictEqual(zurueck.notizen, {});
  s.notizen = { start: "x", transfer: "y" };
  dual.auswerten(s, ALLE);
  assert.strictEqual(dual.anzahlRichtig(s), 9, "Notizen verändern die Bewertung nicht");
});

test("Seite: Kopfdaten, Skriptkette wie lf1-rolle, Formularsemantik, kein fetch", () => {
  const html = lies("module/lf1-dual.html");
  const rolle = lies("module/lf1-rolle.html");
  assert.ok(html.includes('<body data-page="lf1-dual" data-base="../">'));
  assert.ok(html.includes('class="skip-link" href="#hauptinhalt"'));
  const kette = (text) => text.match(/<script src="[^"]+"><\/script>/g);
  assert.deepStrictEqual(kette(html), kette(rolle).map((z) => z.replace("lf1-rolle.js", "lf1-dual.js")));
  assert.ok(!/<button(?![^>]*type="button")/.test(html), "jeder Knopf ist type=button");
  assert.ok(html.includes('<meta name="viewport"'));
  const js = lies("js/lf1-dual.js");
  assert.ok(!/\bfetch\s*\(/.test(js) && !/XMLHttpRequest/.test(js));
  assert.ok(js.includes('"verwaltung-ausbildung.lf1-dual.v1"'));
  assert.ok(js.includes('createElement("fieldset")') && js.includes('createElement("legend")'));
  assert.ok(js.includes('input.type = "radio"'));
  assert.ok(!/password|passwort/i.test(js + html));
  assert.ok(!/ersetzt (die )?Verordnung vom 11\.12\.2013|BüroMKfAusbV.{0,40}2013/.test(html));
  [dual.STATUS_TEXT.richtig, dual.STATUS_TEXT.falsch, dual.STATUS_TEXT.veraltet].forEach((t) => assert.ok(/[\u2713\u2717\u21BB]/.test(t) && /[A-Za-zäöü]{5}/.test(t)));
});

test("Rechtsgrenzen: gelesene Quellen benannt, Rahmenlehrplan als nicht gelesen gekennzeichnet", () => {
  const html = lies("module/lf1-dual.html");
  assert.ok(html.includes("nichtamtlichen Wiedergabe auf gesetze-im-internet.de"));
  assert.ok(html.includes("08.11.2026"));
  assert.ok(html.includes("§ 1 Absatz 3 BBiG") && html.includes("§ 14 Absatz 1 Nummer 4 BBiG"));
  assert.ok(html.includes("BGBl. 2025 I Nr. 62"));
  assert.ok(html.includes("Funktionsorientierung"));
  assert.ok(/Nicht gelesen:<\/strong> der schulische Rahmenlehrplan/.test(html));
  assert.ok(html.includes("§ 2 BBiG") && html.includes("sonstige Berufsbildungseinrichtungen"));
  assert.ok(html.includes("§ 4 Absatz 5 BBiG"));
  assert.ok(html.includes("https://www.gesetze-im-internet.de/bbig_2005/__2.html"));
  assert.ok(html.includes("Keine Rechtsberatung") || html.includes("keine Rechtsberatung"));
});

test("Navigation: lf1-dual steht direkt nach lf1-rolle und verweist auf eine vorhandene Datei", () => {
  global.window = global;
  delete require.cache[require.resolve("../js/module-daten.js")];
  require("../js/module-daten.js");
  const finde = (wert, id) => {
    if (!wert || typeof wert !== "object") return null;
    if (wert.id === id && Array.isArray(wert.unterthemen)) return wert;
    for (const v of Object.values(wert)) { const t = finde(v, id); if (t) return t; }
    return null;
  };
  const feld = finde(global.MODULE_DATEN, "lf1");
  assert.ok(feld);
  const ids = feld.unterthemen.map((u) => u.id);
  assert.strictEqual(ids.indexOf("lf1-dual"), ids.indexOf("lf1-rolle") + 1);
  assert.strictEqual(ids.length, 9);
  const eintrag = feld.unterthemen[ids.indexOf("lf1-dual")];
  assert.strictEqual(eintrag.page, "lf1-dual");
  assert.strictEqual(eintrag.typ, "lektion");
  assert.ok(fs.existsSync(path.join(wurzel, eintrag.datei)));
  assert.ok(fs.existsSync(path.join(wurzel, "js/lf1-dual.js")));
});
