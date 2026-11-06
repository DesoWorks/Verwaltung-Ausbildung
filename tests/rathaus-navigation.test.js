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
    assert.deepStrictEqual(labels(k).slice(0, 2), ["Rathaus Sonnenthal", "Personalamt"]);
    assert.strictEqual(k.length, 3);
    assert.strictEqual(k[0].ziel, "stadt");
    assert.strictEqual(k[1].ziel, "personal");
    assert.strictEqual(k[2].ziel, null, "letztes Glied nur Text");
    assert.ok(!labels(k).some((l) => /Lehrkraft/.test(l)));
  });
});

test("Brotkrumen von stadt und personal", () => {
  assert.deepStrictEqual(nav.brotkrumen("stadt"), [{ label: "Rathaus Sonnenthal", ziel: null }]);
  const p = nav.brotkrumen("personal");
  assert.deepStrictEqual(labels(p), ["Rathaus Sonnenthal", "Personalamt"]);
  assert.strictEqual(p[0].ziel, "stadt");
  assert.strictEqual(p[1].ziel, null);
});

test("Brotkrumen der Lehrkraftansicht ohne Personalamt", () => {
  const k = nav.brotkrumen("lehrkraft");
  assert.deepStrictEqual(labels(k), ["Rathaus Sonnenthal", "Lehrkraftansicht"]);
  assert.strictEqual(k[0].ziel, "stadt");
  assert.strictEqual(k[1].ziel, null);
});

test("Rückziel ist immer die Elternebene: Amtsseiten zum Amt, Ämter und Lehrkraft zur Stadt", () => {
  ["post", "akte", "vorgang", "nachschlagen"].forEach((a) => {
    assert.deepStrictEqual(nav.rueckziel(a), { ansicht: "personal", modus: null, label: "Zurück zum Personalamt" }, a);
  });
  ["personal", "lehrkraft", "buerger"].forEach((a) => {
    assert.deepStrictEqual(nav.rueckziel(a, "uebersicht"), { ansicht: "stadt", modus: null, label: "Zurück zur Rathausübersicht" }, a);
  });
  assert.strictEqual(nav.rueckziel("stadt"), null);
  assert.strictEqual(nav.rueckziel("unbekannt"), null);
});

test("Hashes #buerger und #buerger-karte werden erkannt, #lehrkraft bleibt abgelehnt", () => {
  assert.strictEqual(nav.hashZuAnsicht("#buerger"), "buerger");
  assert.strictEqual(nav.hashZuAnsicht("#buerger-karte"), "buerger-karte");
  assert.strictEqual(nav.hashZuAnsicht("#lehrkraft"), null);
  assert.ok(nav.ANSICHTEN.includes("buerger") && nav.ANSICHTEN.includes("buerger-karte"));
});

test("Bürgerbüro: Brotkrumen, Rückziel und Unternavigation", () => {
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "uebersicht")), ["Rathaus Sonnenthal", "Bürgerbüro"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "fall")), ["Rathaus Sonnenthal", "Bürgerbüro", "B01"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger-karte")), ["Rathaus Sonnenthal", "Bürgerbüro", "Nachschlagen"]);
  ["buerger", "buerger-karte"].forEach((a) => {
    assert.strictEqual(nav.leistenEbene(a), "buerger");
  });
  const zumAmt = { ansicht: "buerger", modus: "uebersicht", label: "Zurück zum Bürgerbüro" };
  assert.deepStrictEqual(nav.rueckziel("buerger-karte"), zumAmt);
  assert.deepStrictEqual(nav.rueckziel("buerger", "fall"), zumAmt);
  assert.deepStrictEqual(nav.rueckziel("buerger", "fall-b02"), zumAmt);
  assert.deepStrictEqual(nav.rueckziel("buerger", "fall-b03"), zumAmt);
  assert.deepStrictEqual(nav.rueckziel("buerger", "fall-b04"), zumAmt);
  assert.deepStrictEqual(nav.rueckziel("buerger", "uebersicht"), { ansicht: "stadt", modus: null, label: "Zurück zur Rathausübersicht" });
  const u = nav.buergerUnternavigation("buerger", "fall");
  assert.deepStrictEqual(labels(u), ["B01", "B02", "B03", "B04"]);
  assert.deepStrictEqual(u.filter((e) => e.aktuell).map((e) => e.label), ["B01"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "fall-b02")), ["Rathaus Sonnenthal", "Bürgerbüro", "B02"]);
  const u2 = nav.buergerUnternavigation("buerger", "fall-b02");
  assert.deepStrictEqual(u2.filter((e) => e.aktuell).map((e) => e.label), ["B02"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("buerger", "fall-b04")), ["Rathaus Sonnenthal", "Bürgerbüro", "B04"]);
  assert.deepStrictEqual(nav.buergerUnternavigation("buerger", "fall-b04").filter((e) => e.aktuell).map((e) => e.label), ["B04"]);
  assert.deepStrictEqual(nav.buergerUnternavigation("buerger", "fall-b03").filter((e) => e.aktuell).map((e) => e.label), ["B03"]);
  assert.deepStrictEqual(nav.buergerUnternavigation("personal"), []);
  assert.deepStrictEqual(nav.buergerUnternavigation("stadt"), []);
});

test("Vorschauämter haben keine Aktion, Personalamt und Bürgerbüro sind benutzbar", () => {
  const liste = nav.aemter();
  assert.deepStrictEqual(liste.map((a) => a.titel), ["Bürgerbüro", "Ordnungsamt", "Personalamt", "Stadtkasse"]);
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
    assert.deepStrictEqual(labels(u), ["Luca Berger", "Noelle Kranz"]);
    assert.deepStrictEqual(u.filter((e) => e.aktuell).map((e) => e.fall), ["luca"], a);
    assert.deepStrictEqual(nav.personalUnternavigation(a, "noelle").filter((e) => e.aktuell).map((e) => e.fall), ["noelle"], a);
    u.forEach((e) => assert.strictEqual(e.ansicht, "personal"));
  });
});

test("Vierteilige Pfadnavigation: Rathaus Sonnenthal / Bürgerbüro / B04 / Unterlagen", () => {
  const k = nav.brotkrumen("buerger", "fall-b04", "Unterlagen");
  assert.deepStrictEqual(labels(k), ["Rathaus Sonnenthal", "Bürgerbüro", "B04", "Unterlagen"]);
  assert.strictEqual(k.length, 4);
  assert.strictEqual(k[0].ziel, "stadt");
  assert.deepStrictEqual([k[1].ziel, k[1].modus], ["buerger", "uebersicht"]);
  assert.deepStrictEqual([k[2].ziel, k[2].modus], ["buerger", "fall-b04"], "B04 wird zum Link auf den Vorgang");
  assert.strictEqual(k[3].ziel, null, "der Arbeitsschritt ist das letzte Glied ohne Ziel");
  assert.strictEqual(k.filter((x) => x.ziel === null).length, 1);
});

test("Pfadnavigation: ohne Schrittname bleibt die bisherige Länge, Leerstrings zählen nicht", () => {
  assert.strictEqual(nav.brotkrumen("buerger", "fall-b04").length, 3);
  [undefined, null, "", "   ", 5, {}].forEach((s) => {
    assert.strictEqual(nav.brotkrumen("buerger", "fall-b04", s).length, 3, String(s));
  });
  assert.strictEqual(nav.brotkrumen("stadt", null, "Unterlagen").length, 1, "die Stadtebene hat keinen Arbeitsschritt");
  assert.strictEqual(nav.brotkrumen("buerger", "fall", " Regeln ").at(-1).label, "Regeln");
});

test("Pfadnavigation im Personalamt: Luca Berger und Noelle Kranz mit Arbeitsschritt", () => {
  const luca = nav.brotkrumen("vorgang", null, "Begründung", "luca");
  assert.deepStrictEqual(labels(luca), ["Rathaus Sonnenthal", "Personalamt", "Luca Berger · Vorgang", "Begründung"]);
  assert.strictEqual(luca[2].ziel, "vorgang");
  assert.strictEqual(luca[3].ziel, null);
  const noelle = nav.brotkrumen("vorgang", null, "Entscheidung", "noelle");
  assert.deepStrictEqual(labels(noelle), ["Rathaus Sonnenthal", "Personalamt", "Noelle Kranz · Vorgang", "Entscheidung"]);
  assert.deepStrictEqual(labels(nav.brotkrumen("vorgang")), ["Rathaus Sonnenthal", "Personalamt", "Vorgang"]);
});

test("Ordnungsamt und Stadtkasse bleiben Vorschau ohne Sprung", () => {
  nav.aemter().filter((a) => a.id !== "personal" && a.id !== "buergerbuero").forEach((a) => {
    assert.strictEqual(a.benutzbar, false, a.titel);
    assert.strictEqual(a.ansicht, null, a.titel);
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
