"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const k = require("../js/bwl-kern.js");

test("Referenzfall Angebot: alle Zwischenwerte in Cent", () => {
  const r = k.referenzAngebot();
  assert.equal(r.ok, true);
  assert.equal(r.positionssumme, 285000);
  assert.equal(r.handlungskosten, 19950);
  assert.equal(r.selbstkosten, 304950);
  assert.equal(r.gewinn, 15248); // 152,475 wird kaufmännisch aufgerundet
  assert.equal(r.netto, 320198);
  assert.equal(k.fmt(r.netto), "3.201,98");
});

test("Rechenweg nennt Bezugsbasen", () => {
  const text = k.referenzAngebot().steps.join("\n");
  assert.match(text, /auf die Positionssumme/);
  assert.match(text, /auf die Selbstkosten/);
});

test("Rundung: genau ein halber Cent wird aufgerundet, darunter abgerundet", () => {
  assert.equal(k.percentFein(5, 1000), 1);  // 0,5 Cent
  assert.equal(k.percentFein(4, 1000), 0);  // 0,4 Cent
  assert.equal(k.percentFein(15, 1000), 2); // 1,5 Cent
  assert.equal(k.percentFein(14, 1000), 1);
  assert.equal(k.percentFein(0, 1900), 0);
});

test("Positionsbetrag mit Nachkommamenge wird einmal gerundet", () => {
  const r = k.angebot({ positionen: [{ menge: "1,5", einzelpreis: "0,01" }], handlungskostenSatz: "0", gewinnSatz: "0" });
  assert.equal(r.positionssumme, 2); // 1,5 Cent -> 2 Cent
  const s = k.angebot({ positionen: [{ menge: "0,333", einzelpreis: "10,00" }], handlungskostenSatz: "0", gewinnSatz: "0" });
  assert.equal(s.positionssumme, 333);
});

test("Große Werte laufen nicht über und werden abgelehnt", () => {
  const r = k.angebot({ positionen: [{ menge: "1000000", einzelpreis: "1.000.000.000,00" }], handlungskostenSatz: "0", gewinnSatz: "0" });
  assert.equal(r.ok, false);
  assert.match(r.error, /zu groß/);
});

test("Geldeingabe: Komma, Tausenderpunkt, Fehlerfälle", () => {
  assert.deepEqual(k.money("1.234,50"), { ok: true, cents: 123450 });
  assert.equal(k.money("12,5").cents, 1250);
  assert.equal(k.money("12.50").ok, false);
  assert.equal(k.money("12,505").ok, false);
  assert.equal(k.money("-3").ok, false);
  assert.equal(k.money("").ok, false);
  assert.equal(k.money("abc").ok, false);
  assert.equal(k.money("0,00").cents, 0);
});

test("Prozentsatz und Menge: Grenzen", () => {
  assert.equal(k.rate("100").ok, true);
  assert.equal(k.rate("100,01").ok, false);
  assert.equal(k.rate("7,5").hundertstel, 750);
  assert.equal(k.rate("").ok, false);
  assert.equal(k.qty("1,5").milli, 1500);
  assert.equal(k.qty("1,5555").ok, false);
  assert.equal(k.qty("-1").ok, false);
});

test("Angebot: leere Zeilen werden ignoriert, ohne Position Fehler, mehr als 6 abgelehnt", () => {
  assert.equal(k.angebot({ positionen: [{ menge: "", einzelpreis: "" }], handlungskostenSatz: "7", gewinnSatz: "5" }).ok, false);
  const sieben = Array.from({ length: 7 }, () => ({ menge: "1", einzelpreis: "1,00" }));
  assert.equal(k.angebot({ positionen: sieben, handlungskostenSatz: "0", gewinnSatz: "0" }).ok, false);
  const e = k.angebot({ positionen: [{ menge: "2", einzelpreis: "abc" }], handlungskostenSatz: "0", gewinnSatz: "0" });
  assert.equal(e.ok, false);
  assert.match(e.error, /^Position 1:/);
  assert.equal(k.angebot({ positionen: [{ menge: "1", einzelpreis: "1,00" }], handlungskostenSatz: "", gewinnSatz: "5" }).ok, false);
});

test("Gewinn: Zuschlag und Differenz sind getrennte Wege, Verlust wird benannt", () => {
  const z = k.gewinn({ weg: "zuschlag", basis: "3.049,50", satz: "5" });
  assert.equal(z.gewinn, 15248);
  const d = k.gewinn({ weg: "differenz", erloes: "3.201,98", kosten: "3.049,50" });
  assert.equal(d.gewinn, 15248);
  const v = k.gewinn({ weg: "differenz", erloes: "100,00", kosten: "120,00" });
  assert.equal(v.gewinn, -2000);
  assert.match(v.steps.join(" "), /Verlust/);
  assert.equal(k.gewinn({ weg: "differenz", erloes: "100,00", kosten: "" }).ok, false);
});

test("Rabatt: Prozent und Betrag, Rabatt über Basis abgelehnt", () => {
  const p = k.rabatt({ basis: "1.000,00", art: "prozent", satz: "10" });
  assert.equal(p.rabatt, 10000);
  assert.equal(p.ergebnis, 90000);
  const b = k.rabatt({ basis: "1.000,00", art: "betrag", betrag: "100,00" });
  assert.equal(b.ergebnis, 90000);
  assert.equal(k.rabatt({ basis: "50,00", art: "betrag", betrag: "50,01" }).ok, false);
  assert.equal(k.rabatt({ basis: "50,00", art: "betrag", betrag: "50,00" }).ergebnis, 0);
  assert.equal(k.rabatt({ basis: "", art: "prozent", satz: "10" }).ok, false);
});

test("Netto und Brutto: beide Richtungen, Summe stimmt immer", () => {
  const nb = k.steuer({ betrag: "100,00", satz: "19", richtung: "netto-zu-brutto" });
  assert.equal(nb.steuer, 1900);
  assert.equal(nb.brutto, 11900);
  const bn = k.steuer({ betrag: "119,00", satz: "19", richtung: "brutto-zu-netto" });
  assert.equal(bn.netto, 10000);
  assert.equal(bn.steuer, 1900);
  for (const brutto of ["0,01", "0,99", "1,19", "99,99", "1234,56"]) {
    const r = k.steuer({ betrag: brutto, satz: "7", richtung: "brutto-zu-netto" });
    assert.equal(r.netto + r.steuer, r.brutto);
  }
  assert.equal(k.steuer({ betrag: "100,00", satz: "0" }).brutto, 10000);
});

test("Positionen hinzufügen und entfernen", () => {
  assert.equal(k.positionenHinzufuegen(1), 2);
  assert.equal(k.positionenHinzufuegen(6), 6);
  assert.equal(k.positionenHinzufuegen("x"), 1);
  const z = [{ name: "a" }, { name: "b" }, { name: "c" }];
  assert.deepEqual(k.positionenEntfernen(z, 1).map((p) => p.name), ["a", "c"]);
  assert.equal(k.positionenEntfernen(z, 0).length, 3); // erste Position bleibt
});

test("Kern enthält keine externen Zugriffe", () => {
  const src = require("node:fs").readFileSync(require.resolve("../js/bwl-kern.js"), "utf8");
  assert.doesNotMatch(src, /https?:\/\/|fetch\(|XMLHttpRequest|document\./);
});

/* Akzeptierte Geldformate (money):
   - ohne Gruppierung: 12, 12,5, 12,50, 1234,56, 0,00
   - mit Tausenderpunkten: erste Gruppe 1 bis 3 Ziffern, danach jeweils genau 3 Ziffern, z. B. 1.234,56 oder 1.234.567,89
   - das Dezimalzeichen ist ausschließlich das Komma, höchstens zwei Nachkommastellen
   - führende und nachfolgende Leerzeichen werden ignoriert, Leerzeichen innerhalb der Zahl nicht
   Alles andere wird mit Fehlermeldung abgelehnt, nichts wird stillschweigend entfernt. */
test("Geldeingabe: gültige deutsche Formate", () => {
  const gueltig = {
    "12": 1200, "12,00": 1200, "12,5": 1250, "1234,56": 123456, "1.234,56": 123456,
    "1.234.567,89": 123456789, "999,99": 99999, "0,00": 0, "1.000": null, " 12,50 ": 1250
  };
  for (const [text, cents] of Object.entries(gueltig)) {
    if (cents === null) continue; // "1.000" ohne Komma bleibt wie bisher abgelehnt (siehe unten)
    const r = k.money(text);
    assert.equal(r.ok, true, text);
    assert.equal(r.cents, cents, text);
  }
});

test("Geldeingabe: fehlerhafte Tausendergruppierung wird abgelehnt", () => {
  for (const text of ["1.2,00", "12..,50", "1..234,00", ".234,00", "1234.567,00", "12.34,00", "1.23,00", "1.2345,00", "1.234.56,00", "1.234.,50", "1.234,"]) {
    const r = k.money(text);
    assert.equal(r.ok, false, text);
    assert.equal(typeof r.error, "string", text);
    assert.ok(r.error.length > 0, text);
  }
});

test("Geldeingabe: mehrere Dezimaltrennzeichen, Buchstaben, Sonderzeichen, unvollständig", () => {
  const ungueltig = [
    "1,2,3", "12,50,00", "1,234,56", ",", ",50", "12,", "1.", ".", "..",
    "12a", "a12", "1,5o", "12,50 Euro", "EUR 12,50", "12 €", "€12", "1e3", "1,0e1",
    "12-50", "12;50", "12'50", "12/50", "12_50", "(12,50)", "+12,50", "-12,50", "12,50%",
    "1 2,00", "1 234,56", "12,5 0", "\u00a012\u00a0,00", "١٢,٠٠", "NaN", "Infinity", "0x10"
  ];
  for (const text of ungueltig) {
    const r = k.money(text);
    assert.equal(r.ok, false, JSON.stringify(text));
    assert.equal(typeof r.error, "string", JSON.stringify(text));
  }
  assert.equal(k.money(null).ok, false);
  assert.equal(k.money(undefined).ok, false);
});

test("Geldeingabe: fehlerhafte Eingabe liefert in keiner Rechenart ein Ergebnis", () => {
  const schlecht = "1.2,00";
  assert.equal(k.angebot({ positionen: [{ menge: "1", einzelpreis: schlecht }], handlungskostenSatz: "7", gewinnSatz: "5" }).ok, false);
  assert.equal(k.gewinn({ weg: "zuschlag", basis: schlecht, satz: "5" }).ok, false);
  assert.equal(k.gewinn({ weg: "differenz", erloes: schlecht, kosten: "1,00" }).ok, false);
  assert.equal(k.gewinn({ weg: "differenz", erloes: "100,00", kosten: schlecht }).ok, false);
  assert.equal(k.rabatt({ basis: schlecht, art: "prozent", satz: "10" }).ok, false);
  assert.equal(k.rabatt({ basis: "100,00", art: "betrag", betrag: schlecht }).ok, false);
  assert.equal(k.steuer({ betrag: schlecht, satz: "19" }).ok, false);
});

test("Menge und Prozentsatz: nichts wird still entfernt oder umgedeutet", () => {
  for (const t of ["1 5", "1.5", "1.234", "1,2,3", "1,5555", "a1", "1a", "-1", "", ",5", "5,", "1e2"]) {
    assert.equal(k.qty(t).ok, false, "qty " + JSON.stringify(t));
  }
  for (const t of ["5%7", "1 5", "7.5", "%5", "5%%", "5 %%", "1,2,3", "abc", "7,555", "-5", "5,", ",5", "1e1"]) {
    assert.equal(k.rate(t).ok, false, "rate " + JSON.stringify(t));
  }
  assert.equal(k.qty(" 3 ").milli, 3000);
  assert.equal(k.qty("1,5").milli, 1500);
  assert.equal(k.rate("19,00 %").hundertstel, 1900);
  assert.equal(k.rate("7%").hundertstel, 700);
  assert.equal(k.rate("7,5").hundertstel, 750);
});
