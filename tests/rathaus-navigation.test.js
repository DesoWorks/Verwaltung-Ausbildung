"use strict";
const test = require("node:test");
const assert = require("node:assert");
const nav = require("../js/rathaus-navigation.js");

const labels = (liste) => liste.map((k) => k.label);

test("Hash #stadt und #vorgang werden erkannt", () => {
  assert.strictEqual(nav.hashZuAnsicht("#stadt"), "stadt");
  assert.strictEqual(nav.hashZuAnsicht("#vorgang"), "vorgang");
  assert.strictEqual(nav.hashZuAnsicht("#personal"), "personal");
  assert.strictEqual(nav.hashZuAnsicht("#post"), "post");
  assert.strictEqual(nav.hashZuAnsicht("#akte"), "akte");
});

test("#lehrkraft und unbekannte Hashes werden abgelehnt", () => {
  ["#lehrkraft", "lehrkraft", "#", "", "#müll", "#__proto__", "#stadt/../x", null, undefined, 5, {}].forEach((h) => {
    assert.strictEqual(nav.hashZuAnsicht(h), null, String(h));
  });
});

test("Hash-Auswertung ist rein und verändert keine Falldaten", () => {
  const fall = { gelesen: true, entscheidung: "B", gruende: ["x"], antwort: "text", abgeschlossen: true };
  const vorher = JSON.stringify(fall);
  nav.hashZuAnsicht("#vorgang");
  nav.hashZuAnsicht("#stadt");
  nav.hashZuAnsicht("#lehrkraft");
  assert.strictEqual(JSON.stringify(fall), vorher);
  assert.strictEqual(typeof nav.hashZuAnsicht("#vorgang"), "string");
});

test("Brotkrumen von post, akte und vorgang enthalten Stadt und Personalamt, nie Lehrkraft", () => {
  ["post", "akte", "vorgang"].forEach((a) => {
    const k = nav.brotkrumen(a);
    assert.deepStrictEqual(labels(k).slice(0, 2), ["Stadtverwaltung", "Personalamt"]);
    assert.strictEqual(k.length, 3);
    assert.strictEqual(k[0].ziel, "stadt");
    assert.strictEqual(k[1].ziel, "personal");
    assert.strictEqual(k[2].ziel, null, "letztes Glied nur Text");
    assert.ok(!labels(k).some((l) => /Lehrkraft/.test(l)));
  });
});

test("Brotkrumen von stadt und personal", () => {
  assert.deepStrictEqual(nav.brotkrumen("stadt"), [{ label: "Stadtverwaltung", ziel: null }]);
  const p = nav.brotkrumen("personal");
  assert.deepStrictEqual(labels(p), ["Stadtverwaltung", "Personalamt"]);
  assert.strictEqual(p[0].ziel, "stadt");
  assert.strictEqual(p[1].ziel, null);
});

test("Brotkrumen der Lehrkraftansicht ohne Personalamt", () => {
  const k = nav.brotkrumen("lehrkraft");
  assert.deepStrictEqual(labels(k), ["Stadtverwaltung", "Lehrkraftansicht"]);
  assert.strictEqual(k[0].ziel, "stadt");
  assert.strictEqual(k[1].ziel, null);
});

test("Rückziel jeder Nicht-Stadt-Ansicht ist stadt", () => {
  nav.ANSICHTEN.filter((a) => a !== "stadt").forEach((a) => {
    assert.deepStrictEqual(nav.rueckziel(a), { ansicht: "stadt", label: "Zur Stadtübersicht" }, a);
  });
  assert.strictEqual(nav.rueckziel("stadt"), null);
});

test("Hashes #buerger und #buerger-karte werden erkannt, #lehrkraft bleibt abgelehnt", () => {
  assert.strictEqual(nav.hashZuAnsicht("#buerger"), "buerger");
  assert.strictEqual(nav.hashZuAnsicht("#buerger-karte"), "buerger-karte");
  assert.strictEqual(nav.hashZuAnsicht("#lehrkraft"), null);
  assert.ok(nav.ANSICHTEN.includes("buerger") && nav.ANSICHTEN.includes("buerger-karte"));
});

test("Bürgerbüro: Brotkrumen, Rückziel und Unternavigation", () => {
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "uebersicht")), ["Stadtverwaltung", "Bürgerbüro"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "fall")), ["Stadtverwaltung", "Bürgerbüro", "Fall B01"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger-karte")), ["Stadtverwaltung", "Bürgerbüro", "Nachschlagen"]);
  ["buerger", "buerger-karte"].forEach((a) => {
    assert.deepStrictEqual(nav.rueckziel(a), { ansicht: "stadt", label: "Zur Stadtübersicht" });
    assert.strictEqual(nav.leistenEbene(a), "buerger");
  });
  const u = nav.buergerUnternavigation("buerger", "fall");
  assert.deepStrictEqual(labels(u), ["Übersicht", "Fall B01", "Nachschlagen"]);
  assert.deepStrictEqual(u.filter((e) => e.aktuell).map((e) => e.label), ["Fall B01"]);
  assert.deepStrictEqual(nav.buergerUnternavigation("personal"), []);
  assert.deepStrictEqual(nav.buergerUnternavigation("stadt"), []);
});

test("Vorschauämter haben keine Aktion, Personalamt und Bürgerbüro sind benutzbar", () => {
  const liste = nav.aemter();
  assert.deepStrictEqual(liste.map((a) => a.titel), ["Personalamt", "Bürgerbüro", "Ordnungsamt", "Stadtkasse"]);
  liste.forEach((a) => {
    if (a.id === "personal" || a.id === "buergerbuero") {
      assert.strictEqual(a.benutzbar, true);
      assert.strictEqual(a.ansicht, a.id === "personal" ? "personal" : "buerger");
    } else {
      assert.strictEqual(a.benutzbar, false);
      assert.strictEqual(a.ansicht, null);
    }
  });
});

test("Personalamt-Unternavigation nur in Personalamt-Ansichten", () => {
  assert.deepStrictEqual(nav.personalUnternavigation("stadt"), []);
  assert.deepStrictEqual(nav.personalUnternavigation("lehrkraft"), []);
  assert.deepStrictEqual(nav.personalUnternavigation("unbekannt"), []);
  ["personal", "post", "akte", "vorgang", "nachschlagen"].forEach((a) => {
    const u = nav.personalUnternavigation(a);
    assert.deepStrictEqual(labels(u), ["Übersicht Personalamt", "Posteingang", "Ausbildungsakte", "Vorgang", "Nachschlagen"]);
    assert.deepStrictEqual(u.filter((e) => e.aktuell).map((e) => e.ansicht), [a]);
  });
});

test("Leistenebene: Personalamt gilt auf post, akte, vorgang; Lehrkraft hat keine Amtsebene", () => {
  assert.strictEqual(nav.leistenEbene("stadt"), "stadt");
  ["personal", "post", "akte", "vorgang"].forEach((a) => assert.strictEqual(nav.leistenEbene(a), "personal"));
  assert.strictEqual(nav.leistenEbene("lehrkraft"), null);
});

test("Lehrkraft ist kein Kind des Personalamts", () => {
  assert.ok(nav.istAnsicht("lehrkraft"));
  assert.ok(!nav.HASH_ANSICHTEN.includes("lehrkraft"));
  assert.ok(!nav.personalUnternavigation("personal").some((e) => e.ansicht === "lehrkraft"));
});

// Lehrkraftmodus: Rücksprung beim Ausschalten und beim Laden
test("Ausschalten in der Lehrkraftansicht führt zur Stadtübersicht", () => {
  assert.deepStrictEqual(nav.lehrkraftUmschalten("lehrkraft", true), { lehrkraft: false, ansicht: "stadt" });
});

test("Einschalten aus dem Vorgang springt zur Lehrkraftansicht", () => {
  assert.deepStrictEqual(nav.lehrkraftUmschalten("vorgang", false), { lehrkraft: true, ansicht: "lehrkraft" });
});

test("Ausschalten aus dem Personalamt lässt die Ansicht unverändert", () => {
  assert.deepStrictEqual(nav.lehrkraftUmschalten("personal", true), { lehrkraft: false, ansicht: "personal" });
});

test("Laden: lehrkraft ohne Modus ergibt stadt, mit Modus bleibt lehrkraft", () => {
  assert.strictEqual(nav.ansichtNachLaden("lehrkraft", false), "stadt");
  assert.strictEqual(nav.ansichtNachLaden("lehrkraft", true), "lehrkraft");
  assert.strictEqual(nav.ansichtNachLaden("vorgang", false), "vorgang");
  assert.strictEqual(nav.ansichtNachLaden("unbekannt", true), "stadt");
});

test("Lehrkraft-Funktionen verändern Zustandsobjekte nicht und geben nur zwei Felder zurück", () => {
  const zustand = { ansicht: "lehrkraft", lehrkraft: true, antwort: "Entwurf", abgeschlossen: true };
  const kopie = JSON.stringify(zustand);
  const ergebnis = nav.lehrkraftUmschalten(zustand.ansicht, zustand.lehrkraft);
  nav.ansichtNachLaden(zustand.ansicht, zustand.lehrkraft);
  assert.strictEqual(JSON.stringify(zustand), kopie);
  assert.deepStrictEqual(Object.keys(ergebnis).sort(), ["ansicht", "lehrkraft"]);
});

test("rathaus-ui.js nutzt beide Funktionen und hat den einseitigen Zweig nicht mehr", () => {
  const text = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "js", "rathaus-ui.js"), "utf8");
  assert.ok(text.includes("navi.lehrkraftUmschalten("));
  assert.ok(text.includes("navi.ansichtNachLaden("));
  assert.ok(!text.includes('if (state.lehrkraft) state.ansicht = "lehrkraft"'));
});
