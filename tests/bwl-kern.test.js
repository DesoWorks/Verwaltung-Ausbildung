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
