/* Virtuelles Rathaus, Lernkern. Keine Oberfläche, keine Netzwerkaufrufe.
 * Übungsmaterial, keine Rechtsberatung. Rechtsstand: 01.11.2026.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_KERN = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var RECHTSSTAND = "01.11.2026";
  var QUELLEN = [
    "KMK-Rahmenlehrplan Kaufmann für Büromanagement und Kauffrau für Büromanagement, Fassung vom 20.03.2025, Lernfeld 1, Seite 9",
    "Berufsbildungsgesetz (BBiG) § 14 und § 15, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026",
    "Jugendarbeitsschutzgesetz (JArbSchG) § 9, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026",
    "Scans unter /home/starnet/unterrichtsmaterial/verwaltung/, nicht ins Repository kopiert. LS03, LS04 und LS06 sind auf den geprüften Seiten nicht als solche beschriftet und nicht vollständig eingearbeitet"
  ];

  var ENTSCHEIDUNGEN = {
    A: {
      id: "A",
      text: "Luca muss in die Dienststelle. Personalmangel geht vor.",
      richtig: false
    },
    B: {
      id: "B",
      text: "Luca ist für den Berufsschultag freizustellen. Die Dienststelle darf ihn nicht statt zur Schule einteilen.",
      richtig: true
    },
    C: {
      id: "C",
      text: "Luca entscheidet allein, ob er zur Schule oder in die Dienststelle kommt.",
      richtig: false
    },
    D: {
      id: "D",
      text: "Luca geht zur Schule, muss danach aber noch den ganzen Tag Schalter machen.",
      richtig: false
    }
  };

  var GRUENDE = {
    "bbig15": {
      id: "bbig15",
      text: "BBiG § 15: Freistellung für den Berufsschulunterricht. Bei mehr als fünf Unterrichtsstunden an einem Tag, einmal in der Woche, gilt die Freistellung für den Tag.",
      richtig: true,
      pflicht: true,
      falle: false
    },
    "bbig14-4": {
      id: "bbig14-4",
      text: "BBiG § 14 Absatz 1 Nummer 4: Ausbildende haben Auszubildende zum Besuch der Berufsschule anzuhalten.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "bbig14-3": {
      id: "bbig14-3",
      text: "BBiG § 14 Absatz 3: Es dürfen nur Aufgaben übertragen werden, die dem Ausbildungszweck dienen.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "jarbschg9": {
      id: "jarbschg9",
      text: "JArbSchG § 9: Luca ist 17. Jugendliche sind für die Berufsschule freizustellen und an einem Tag mit mehr als fünf Unterrichtsstunden nicht zu beschäftigen.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "falle-mangel": {
      id: "falle-mangel",
      text: "Personalmangel ist ein anerkannter Ausnahmegrund. Dann darf die Berufsschule ausfallen.",
      richtig: false,
      pflicht: false,
      falle: true
    },
    "falle-vertrag": {
      id: "falle-vertrag",
      text: "Im Ausbildungsvertrag kann die Berufsschule abbedungen werden.",
      richtig: false,
      pflicht: false,
      falle: true
    }
  };

  function fallDaten() {
    return {
      id: "berufsschule-statt-dienststelle",
      stadt: "Stadtverwaltung Sonnenthal",
      amt: "Personalamt",
      betreff: "Bitte um Einsatz statt Berufsschule",
      von: "Sven Holm, Teamleitung Bürgerbüro",
      an: "Mira Holtz, Ausbilderin im Personalamt",
      person: {
        name: "Luca Berger",
        alter: 17,
        lehrjahr: 1,
        beruf: "Kaufmann für Büromanagement / Kauffrau für Büromanagement",
        schultag: "Dienstag",
        stunden: 8,
        stundenlaenge: 45
      },
      nachricht: "Guten Tag, Frau Holtz. Im Bürgerbüro fehlt am Dienstag Personal am Schalter. Bitte schicken Sie Luca Berger nicht in die Berufsschule, sondern in die Dienststelle. Er soll den Tag am Schalter aushelfen. Der Unterricht würde sonst acht Stunden dauern. Danke, Sven Holm.",
      akte: {
        vertrag: "Fiktiver Auszug: Die Berufsschule ist Teil der Ausbildung. Sie kann nicht durch eine mündliche Anweisung oder wegen Personalmangels abbedungen werden.",
        hinweis: "Alle Namen und die Stadt Sonnenthal sind erfunden. Es werden keine echten Schülerdaten gespeichert."
      },
      quellen: QUELLEN.slice(),
      rechtsstand: RECHTSSTAND
    };
  }

  function bewerteEntscheidung(id) {
    var eintrag = ENTSCHEIDUNGEN[id];
    if (!eintrag) {
      return {
        richtig: false,
        bekannt: false,
        hinweis: "Wähle eine der vier Entscheidungen."
      };
    }
    if (eintrag.richtig) {
      return {
        richtig: true,
        bekannt: true,
        hinweis: "Die Entscheidung passt: Luca ist für den Berufsschultag freizustellen."
      };
    }
    var hinweis = "Diese Entscheidung passt nicht. Personalmangel hebt die Freistellung nicht auf.";
    if (id === "C") {
      hinweis = "Luca entscheidet das nicht allein. Die Dienststelle muss ihn freistellen.";
    }
    if (id === "D") {
      hinweis = "Acht Unterrichtsstunden sind mehr als fünf. Danach darf kein ganzer Arbeitstag am Schalter folgen.";
    }
    return { richtig: false, bekannt: true, hinweis: hinweis };
  }

  function alsListe(ids) {
    if (!ids) return [];
    return Array.isArray(ids) ? ids.slice() : [ids];
  }

  function bewerteBegruendung(ids) {
    var liste = alsListe(ids);
    var hinweise = [];
    var hatPflicht = false;
    var hatFalle = false;
    var unbekannt = false;
    liste.forEach(function (id) {
      var grund = GRUENDE[id];
      if (!grund) {
        unbekannt = true;
        return;
      }
      if (grund.pflicht) hatPflicht = true;
      if (grund.falle) hatFalle = true;
    });
    if (liste.length === 0) {
      hinweise.push("Wähle mindestens die Freistellung nach BBiG § 15.");
    }
    if (!hatPflicht) {
      hinweise.push("Die Begründung braucht die Freistellung nach BBiG § 15. Bei mehr als fünf Unterrichtsstunden gilt sie für den Tag.");
    }
    if (hatFalle) {
      hinweise.push("Eine Falle ist ausgewählt. Personalmangel ist kein Ausnahmegrund. Die Berufsschule lässt sich im Vertrag nicht abbedingen.");
    }
    if (unbekannt) {
      hinweise.push("Ein Begründungspunkt ist unbekannt.");
    }
    return {
      reicht: hatPflicht && !hatFalle && !unbekannt && liste.length > 0,
      hatPflicht: hatPflicht,
      hatFalle: hatFalle,
      hinweise: hinweise
    };
  }

  function verlangtAusfall(text) {
    var t = String(text || "").toLowerCase();
    if (/nicht zur berufsschule|berufsschule ausfallen|schule ausfallen|statt zur berufsschule|statt in die berufsschule|soll die schule schwänzen/.test(t)) {
      return true;
    }
    if (/in die dienststelle|am schalter/.test(t) && !/nicht in die dienststelle|nicht zur dienststelle|nicht am schalter/.test(t)) {
      return true;
    }
    return false;
  }

  function sagtFreistellung(text) {
    return /freistell|freigestellt|freizustellen|zur berufsschule|in die berufsschule|berufsschule besuchen/.test(String(text || "").toLowerCase());
  }

  function istUnsachlich(text) {
    return /\b(idiot|blöd|bloed|dumm|unfähig|unfaehig|verarsch)\b/i.test(String(text || ""));
  }

  function bewerteAntwort(text) {
    var roh = String(text || "");
    var gekuerzt = roh.trim();
    var hinweise = [];
    if (gekuerzt.length < 40) {
      hinweise.push("Die Antwort ist zu kurz. Schreibe mindestens einen sachlichen Satz mit Freistellung und Berufsschule.");
    }
    if (istUnsachlich(gekuerzt)) {
      hinweise.push("Die Antwort muss sachlich bleiben. Keine Beleidigung.");
    }
    if (!sagtFreistellung(gekuerzt)) {
      hinweise.push("Schreibe klar, dass Luca für die Berufsschule freigestellt wird.");
    }
    if (verlangtAusfall(gekuerzt)) {
      hinweise.push("Die Antwort darf nicht verlangen, dass Luca die Berufsschule ausfallen lässt oder in die Dienststelle kommt.");
    }
    return {
      ok: hinweise.length === 0,
      hinweise: hinweise,
      laenge: gekuerzt.length
    };
  }

  function auswertung(eingabe) {
    var daten = eingabe || {};
    var entscheidung = bewerteEntscheidung(daten.entscheidung);
    var begruendung = bewerteBegruendung(daten.gruende);
    var antwort = bewerteAntwort(daten.antwort);
    var hinweise = [];
    if (!entscheidung.richtig) hinweise.push(entscheidung.hinweis);
    begruendung.hinweise.forEach(function (hinweis) { hinweise.push(hinweis); });
    antwort.hinweise.forEach(function (hinweis) { hinweise.push(hinweis); });
    var bestanden = entscheidung.richtig && begruendung.reicht && antwort.ok;
    if (bestanden) {
      hinweise.unshift("Der Vorgang ist fachlich tragfähig. Du kannst ihn abschließen oder die Antwort noch einmal prüfen.");
    } else {
      hinweise.push("Du kannst die Angaben ändern und die Auswertung erneut starten. Nichts ist dauerhaft blockiert.");
    }
    return {
      bestanden: bestanden,
      darfAbschliessen: bestanden,
      hinweise: hinweise,
      entscheidung: entscheidung,
      begruendung: begruendung,
      antwort: antwort
    };
  }

  function nachPruefung(zustand) {
    var daten = zustand || {};
    var ergebnis = auswertung({
      entscheidung: daten.entscheidung,
      gruende: daten.gruende,
      antwort: daten.antwort
    });
    if (!daten.akteGelesen) {
      ergebnis = {
        bestanden: false,
        darfAbschliessen: false,
        hinweise: ["Öffne zuerst die Ausbildungsakte. Dort stehen Alter und Unterrichtsstunden."].concat(ergebnis.hinweise),
        entscheidung: ergebnis.entscheidung,
        begruendung: ergebnis.begruendung,
        antwort: ergebnis.antwort
      };
    }
    return {
      versuche: (Number(daten.versuche) || 0) + 1,
      abgeschlossen: false,
      letzteAuswertung: ergebnis
    };
  }

  function hilfe(stufe) {
    var n = Number(stufe) || 1;
    if (n <= 1) {
      return "Lies die Nachricht und öffne die Ausbildungsakte. Achte auf das Alter und auf die Zahl der Unterrichtsstunden.";
    }
    if (n === 2) {
      return "Personalmangel ändert die Freistellung nicht. Welches Gesetz schützt den Besuch der Berufsschule, und was gilt bei mehr als fünf Unterrichtsstunden?";
    }
    return "Richtung, keine Musterlösung: Die passende Entscheidung ist die Freistellung für den ganzen Berufsschultag. Die vollständige Musterantwort steht nur in der Lehrkraftansicht.";
  }

  function lehrkraftLoesung() {
    return {
      fallId: "berufsschule-statt-dienststelle",
      rechtsstand: RECHTSSTAND,
      unsicherheit: "Vorläufige Übungslösung, nicht verbindlich. Die gescannten Unterlagen sind da, aber nicht vollständig ausgewertet und nicht als verbindliche Musterlösung geprüft. Länderregeln zur Berufsschulpflicht können abweichen. Das ist keine Rechtsberatung und keine gesicherte Rechtslage.",
      entscheidung: "B",
      pflichtgrund: "bbig15",
      stuetzendeGruende: ["bbig14-4", "bbig14-3", "jarbschg9"],
      fallen: ["falle-mangel", "falle-vertrag"],
      kriterien: [
        "Entscheidung B gewählt",
        "BBiG § 15 als Begründung gewählt",
        "Keine Falle gewählt",
        "Antwort mindestens 40 Zeichen, sachlich, sagt Freistellung für die Berufsschule zu",
        "Antwort verlangt nicht, dass die Berufsschule ausfällt"
      ],
      mustertext: "Guten Tag, Herr Holm. Luca Berger wird am Dienstag für die Berufsschule freigestellt. Acht Unterrichtsstunden sind mehr als fünf. Er kommt an diesem Tag nicht in die Dienststelle. Personalmangel ist dafür kein Ausnahmegrund. Mit freundlichen Grüßen, Mira Holtz, Personalamt.",
      quellen: QUELLEN.slice(),
      faelle: [fallDaten()]
    };
  }

  function katalog() {
    return {
      entscheidungen: Object.keys(ENTSCHEIDUNGEN).map(function (id) {
        return { id: id, text: ENTSCHEIDUNGEN[id].text };
      }),
      gruende: Object.keys(GRUENDE).map(function (id) {
        return { id: id, text: GRUENDE[id].text };
      }),
      begriffe: [
        { begriff: "Freistellung", erklaerung: "Die Dienststelle muss Luca für die Berufsschule von der Arbeit freigeben. Er muss in dieser Zeit nicht in der Dienststelle arbeiten." },
        { begriff: "Ausbildungszweck", erklaerung: "Eine Aufgabe muss zur Ausbildung gehören. Ein Schalterdienst nur wegen Personalmangels ist kein Ausbildungszweck." },
        { begriff: "Berufsschultag", erklaerung: "Ein Tag, an dem Berufsschulunterricht stattfindet. Bei mehr als fünf Unterrichtsstunden von je mindestens 45 Minuten gilt die Freistellung einmal in der Woche für den Tag." }
      ]
    };
  }

  return {
    RECHTSSTAND: RECHTSSTAND,
    fallDaten: fallDaten,
    bewerteEntscheidung: bewerteEntscheidung,
    bewerteBegruendung: bewerteBegruendung,
    bewerteAntwort: bewerteAntwort,
    auswertung: auswertung,
    nachPruefung: nachPruefung,
    hilfe: hilfe,
    lehrkraftLoesung: lehrkraftLoesung,
    katalog: katalog
  };
});
