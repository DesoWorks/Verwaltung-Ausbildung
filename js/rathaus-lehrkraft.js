/* Virtuelles Rathaus, Lehrkraftansicht: fallbezogene Anzeigedaten.
 * Reine Funktionen: kein DOM, kein localStorage. Alle Texte stammen aus fallDaten(), lehrkraftLoesung() und katalog()
 * des jeweiligen Falls. Es werden keine Bewertungsregeln geändert und keine Rechtsaussagen ergänzt.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_LEHRKRAFT = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var FEHLT = "im Fall nicht gesondert hinterlegt";

  function textZu(liste, id) {
    var treffer = (liste || []).filter(function (eintrag) { return eintrag.id === id; })[0];
    return treffer ? treffer.text : null;
  }

  function sachverhalt(daten) {
    var zeilen = [];
    var p = daten.person || {};
    if (daten.von) zeilen.push("Anfrage von: " + daten.von);
    if (daten.an) zeilen.push("Gerichtet an: " + daten.an);
    if (p.name) {
      var teile = [p.name];
      if (p.lehrjahr) teile.push(p.lehrjahr + ". Ausbildungsjahr");
      if (p.alter) teile.push(p.alter + " Jahre alt");
      zeilen.push("Betroffene Auszubildende Person: " + teile.join(", "));
    }
    if (p.schultag) {
      var tag = "Berufsschultag: " + p.schultag;
      if (p.stunden) tag += ", " + p.stunden + " Unterrichtsstunden" + (p.stundenlaenge ? " zu je " + p.stundenlaenge + " Minuten" : "");
      zeilen.push(tag);
    }
    if (p.schule) zeilen.push("Berufsschule: " + p.schule);
    if (daten.nachricht) zeilen.push("Nachricht im Wortlaut: " + daten.nachricht);
    return zeilen;
  }

  function lernziele(loesung, kat) {
    var ziele = [];
    var entscheidung = textZu(kat.entscheidungen, loesung.entscheidung);
    if (entscheidung) ziele.push("Die passende Entscheidung erkennen (Entscheidung " + loesung.entscheidung + "): " + entscheidung);
    var pflicht = textZu(kat.gruende, loesung.pflichtgrund);
    if (pflicht) ziele.push("Den Pflichtgrund nennen: " + pflicht);
    (loesung.stuetzendeGruende || []).forEach(function (id) {
      var t = textZu(kat.gruende, id);
      if (t) ziele.push("Eine stützende Regel erkennen: " + t);
    });
    (kat.begriffe || []).forEach(function (b) {
      ziele.push("Den Begriff „" + b.begriff + "“ erklären können: " + b.erklaerung);
    });
    return ziele;
  }

  function typischeFehler(loesung, kat) {
    var fehler = [];
    (kat.entscheidungen || []).forEach(function (e) {
      if (e.id !== loesung.entscheidung) fehler.push("Entscheidung " + e.id + " wählen: " + e.text);
    });
    (loesung.fallen || []).forEach(function (id) {
      var t = textZu(kat.gruende, id);
      if (t) fehler.push("Falsche Begründung wählen: " + t);
    });
    return fehler;
  }

  // Liefert die Anzeigedaten der Lehrkraftansicht für genau einen Fall (kern = Lernkern dieses Falls).
  function fallAnsicht(kern) {
    var daten = kern.fallDaten();
    var loesung = kern.lehrkraftLoesung();
    var kat = kern.katalog();
    var name = daten.person.name;
    var ziele = lernziele(loesung, kat);
    var fehler = typischeFehler(loesung, kat);
    return {
      fallName: name,
      betreff: daten.betreff,
      ueberschrift: "Lehrkraftansicht – Fall " + name,
      fallZeile: name + " – " + daten.betreff,
      sachverhalt: sachverhalt(daten),
      lernziele: ziele,
      lernzieleHinweis: "Ausdrücklich formulierte Lernziele sind im Fall nicht gesondert hinterlegt. Die Liste ist aus Entscheidung, Pflichtgrund, stützenden Regeln und Begriffen dieses Falls abgeleitet.",
      typischeFehler: fehler,
      musterantwort: {
        entscheidung: loesung.entscheidung,
        entscheidungText: textZu(kat.entscheidungen, loesung.entscheidung) || FEHLT,
        mustertext: loesung.mustertext
      },
      kriterien: (loesung.kriterien || []).slice(),
      quellen: (loesung.quellen || []).slice(),
      rechtsstand: loesung.rechtsstand,
      unsicherheit: loesung.unsicherheit,
      fehlt: FEHLT
    };
  }

  // Text der Rückfrage vor dem Zurücksetzen. Nennt nur den gewählten Fall als Löschziel.
  function resetFrage(name, betreff) {
    return "Soll der Übungsvorgang „" + name + "“ (" + betreff + ") für einen neuen Durchlauf zurückgesetzt werden? " +
      "Zurückgesetzt werden nur Eingaben, Bewertung, Hilfestufe und Abschluss dieses einen Vorgangs. " +
      "Der andere Personalamt-Vorgang und dein Fortschritt auf der Plattform bleiben unverändert.";
  }

  return {
    FEHLT: FEHLT,
    fallAnsicht: fallAnsicht,
    resetFrage: resetFrage
  };
});
