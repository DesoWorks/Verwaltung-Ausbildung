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
  // Wird bei jeder inhaltlichen Änderung der Bewertung erhöht. Gespeicherte Auswertungen mit anderem Stand gelten als veraltet.
  var BEWERTUNGSSTAND = "2026-11-01-brief2";
  var QUELLEN = [
    "KMK-Rahmenlehrplan Kaufmann für Büromanagement und Kauffrau für Büromanagement, Fassung vom 20.03.2025, Lernfeld 1, Seite 9",
    "Berufsbildungsgesetz (BBiG) § 14 und § 15, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026",
    "Jugendarbeitsschutzgesetz (JArbSchG) § 9, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026"
  ];

  var ENTSCHEIDUNGEN = {
    A: {
      id: "A",
      text: "Luca muss in die Dienststelle. Personalmangel geht vor.",
      richtig: false
    },
    B: {
      id: "B",
      text: "Luca ist für den Berufsschultag von der Arbeit freizustellen. Die Dienststelle darf ihn an diesem Tag nicht zur Arbeit einsetzen.",
      richtig: true
    },
    C: {
      id: "C",
      text: "Luca entscheidet allein, ob er zur Schule oder in die Dienststelle kommt.",
      richtig: false
    },
    D: {
      id: "D",
      text: "Luca geht zur Schule und muss danach noch den ganzen Tag am Schalter arbeiten.",
      richtig: false
    }
  };

  var GRUENDE = {
    "bbig15": {
      id: "bbig15",
      text: "BBiG § 15: Freistellung für den Berufsschulunterricht.",
      richtig: true,
      pflicht: true,
      falle: false
    },
    "bbig14-4": {
      id: "bbig14-4",
      text: "BBiG § 14 Absatz 1 Nummer 4: Auszubildende zum Besuch der Berufsschule anhalten.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "bbig14-3": {
      id: "bbig14-3",
      text: "BBiG § 14 Absatz 3: Nur Aufgaben übertragen, die dem Ausbildungszweck dienen.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "jarbschg9": {
      id: "jarbschg9",
      text: "JArbSchG § 9: Schutz von Jugendlichen beim Berufsschulbesuch.",
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
      text: "Im Ausbildungsvertrag kann die Berufsschule abbedungen werden. Abbedingen heißt, im Vertrag etwas anderes festzulegen, als das Gesetz vorsieht.",
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
        vertrag: "Fiktiver Auszug: Die Berufsschule ist Teil der Ausbildung. Eine mündliche Anweisung oder Personalmangel kann diese Pflicht nicht aufheben.",
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
      hinweise.push("Die Begründung braucht die Freistellung nach BBiG § 15. Prüfe, ob du diese Regel ausgewählt hast.");
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

  function drehtRichtung(text) {
    var t = String(text || "").toLowerCase();
    return /(von|vom)\s+(der\s+|dem\s+)?berufsschul\w*\s+(frei\s*stell\w*|freigestellt|freizustellen|frei\s+\w*stell\w*)/.test(t) ||
      /frei(gestellt|zustellen|stellen)\s+(von|vom)\s+(der\s+|dem\s+)?berufsschul/.test(t) ||
      /freistellung\s+(von|vom)\s+(der\s+|dem\s+)?berufsschul/.test(t);
  }

  function sagtFreistellung(text) {
    var t = String(text || "").toLowerCase();
    var nenntFreistellung = /freistell|freigestellt|freizustellen|stell\w*[^.!?]*\bfrei\b/.test(t);
    var nenntRichtung = /zur berufsschule|für die berufsschule|fuer die berufsschule|für den berufsschul|fuer den berufsschul|von der arbeit|berufsschule besuchen/.test(t);
    return nenntFreistellung && nenntRichtung;
  }

  function klauseln(text) {
    return String(text || "").toLowerCase()
      .split(/[.!?;:\n]|,|\bund\b|\baber\b|\bsondern\b|\bdoch\b/)
      .map(function (teil) { return teil.trim(); })
      .filter(function (teil) { return teil.length > 0; });
  }

  function verneint(klausel) {
    return /\b(nicht|kein|keine|keinen|keiner|keinem|ohne|nie|niemals)\b/.test(klausel);
  }

  // Ein späterer Satz, der Freistellung oder Berufsschulbesuch wieder aufhebt.
  function widerspricht(text) {
    return klauseln(text).some(function (k) {
      if (/schule\s+nicht\s+(zu\s+)?(besuchen|gehen)|nicht\s+(in\s+die|zur|zum)\s+(berufs)?schule|nicht\s+(die\s+)?(berufs)?schule\s+(zu\s+)?besuchen|nicht\s+am\s+(berufsschul)?unterricht\s+teil/.test(k)) {
        return true;
      }
      if (verneint(k)) return false;
      var ort = /in der dienststelle|in die dienststelle|im bürgerbüro|im buergerbuero|am schalter|im amt\b/.test(k);
      var tut = /arbeiten|aushelfen|einsetzen|eingesetzt|erscheinen|anwesend|dienst leisten|dienst antreten/.test(k);
      if (ort && tut) return true;
      return /eingeteilt|einteilen|zum dienst/.test(k);
    });
  }

  function sagtVorrangOhneDienst(text) {
    var t = String(text || "").toLowerCase();
    var vorrang = /berufsschul\w*[^.!?]*\bvorrang\b|\bvorrang\b[^.!?]*berufsschul|(unterricht|schulbesuch)[^.!?]*\bvorrang\b|berufsschul\w*[^.!?]*geht\w*\s+vor\b/.test(t);
    var keinDienst = klauseln(t).some(function (k) {
      return /einteilung|eingeteilt|einsatz|eingesetzt|zum dienst|dienststelle|schalter/.test(k) && verneint(k);
    });
    return vorrang && keinDienst;
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
    if (drehtRichtung(gekuerzt)) {
      hinweise.push("Die Formulierung dreht die Richtung. Freistellung meint hier von der Arbeit zur Berufsschule, nicht von der Berufsschule weg.");
    } else if (!sagtFreistellung(gekuerzt) && !sagtVorrangOhneDienst(gekuerzt)) {
      hinweise.push("Schreibe klar, dass Luca für die Berufsschule freigestellt wird. Gleichwertig ist: Der Schulbesuch hat Vorrang und Luca wird an diesem Tag nicht zum Dienst eingeteilt.");
    }
    if (verlangtAusfall(gekuerzt)) {
      hinweise.push("Die Antwort darf nicht verlangen, dass Luca die Berufsschule ausfallen lässt oder in die Dienststelle kommt.");
    } else if (widerspricht(gekuerzt)) {
      hinweise.push("Ein späterer Satz hebt auf, was vorher gilt: Luca soll doch arbeiten oder die Schule nicht besuchen. Lies deine Antwort bis zum Ende und lass nur eine Aussage stehen.");
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
    var traegt = [];
    var naechsterBlick = [];
    if (entscheidung.richtig) {
      traegt.push("Die Entscheidung passt schon.");
    } else if (entscheidung.bekannt) {
      naechsterBlick.push("Prüfe die Entscheidung noch einmal anhand von Alter und Unterrichtsstunden in der Akte.");
    } else {
      naechsterBlick.push("Wähle zuerst eine Entscheidung.");
    }
    if (begruendung.reicht) {
      traegt.push("Die Begründung enthält die tragende Regel und keine Falle.");
    } else if (begruendung.hatFalle) {
      naechsterBlick.push("Prüfe, ob eine ausgewählte Begründung nur eine Behauptung ist, die das Gesetz nicht trägt.");
    } else {
      naechsterBlick.push("Suche in der Begründung die Regel, die den Berufsschulbesuch ausdrücklich schützt.");
    }
    var gedreht = drehtRichtung(daten.antwort);
    if (antwort.ok) {
      traegt.push("Die Antwort ist sachlich und nennt die richtige Richtung.");
    } else if (gedreht) {
      naechsterBlick.push("Du verwechselst die Richtung der Freistellung. Sie gilt von der Arbeit zur Berufsschule, nicht von der Berufsschule weg.");
    } else if (widerspricht(daten.antwort)) {
      naechsterBlick.push("Lies deine Antwort bis zum Ende: Ein späterer Satz nimmt zurück, was vorher gilt. Soll am Berufsschultag der Unterricht oder die Arbeit Vorrang haben?");
    } else if (antwort.laenge < 40) {
      naechsterBlick.push("Schreibe die Antwort an Herrn Holm in ganzen, sachlichen Sätzen.");
    } else {
      naechsterBlick.push("Lies deine Antwort noch einmal: Sagt sie klar, wohin Luca am Berufsschultag geht und wovon er freigestellt wird?");
    }
    if (bestanden) {
      naechsterBlick = ["Prüfe noch einmal, ob Herr Holm aus deiner Antwort sofort erkennt, was am Dienstag gilt."];
    }
    return {
      bestanden: bestanden,
      darfAbschliessen: bestanden,
      hinweise: hinweise,
      traegt: traegt,
      naechsterBlick: naechsterBlick,
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
        traegt: ergebnis.traegt,
        naechsterBlick: ["Öffne zuerst die Ausbildungsakte."].concat(ergebnis.bestanden ? [] : ergebnis.naechsterBlick),
        entscheidung: ergebnis.entscheidung,
        begruendung: ergebnis.begruendung,
        antwort: ergebnis.antwort
      };
    }
    ergebnis.bewertungsstand = BEWERTUNGSSTAND;
    return {
      versuche: (Number(daten.versuche) || 0) + 1,
      abgeschlossen: false,
      letzteAuswertung: ergebnis
    };
  }

  // Bereinigt einen gespeicherten Zustand. Eingaben und Entwurf bleiben, eine Auswertung
  // und ein Abschluss aus einem anderen Bewertungsstand werden ungültig. Das Eingabeobjekt bleibt unverändert.
  function bereinigeGespeichert(daten) {
    var quelle = (daten && typeof daten === "object") ? daten : {};
    var ergebnis = {};
    ["ansicht", "gelesen", "akteGelesen", "entscheidung", "antwort", "hilfeStufe", "lehrkraft", "versuche"].forEach(function (feld) {
      if (quelle[feld] !== undefined) ergebnis[feld] = quelle[feld];
    });
    if (Array.isArray(quelle.gruende)) ergebnis.gruende = quelle.gruende.slice();
    var auswertungQuelle = (quelle.letzteAuswertung && typeof quelle.letzteAuswertung === "object") ? quelle.letzteAuswertung : null;
    var aktuell = quelle.bewertungsstand === BEWERTUNGSSTAND &&
      (auswertungQuelle === null || auswertungQuelle.bewertungsstand === BEWERTUNGSSTAND);
    if (aktuell) {
      ergebnis.letzteAuswertung = auswertungQuelle ? JSON.parse(JSON.stringify(auswertungQuelle)) : null;
      ergebnis.abgeschlossen = quelle.abgeschlossen === true;
      ergebnis.verworfen = false;
    } else {
      ergebnis.letzteAuswertung = null;
      ergebnis.abgeschlossen = false;
      ergebnis.verworfen = true;
    }
    ergebnis.bewertungsstand = BEWERTUNGSSTAND;
    return ergebnis;
  }

  function hilfe(stufe) {
    var n = (stufe === undefined || stufe === null) ? 1 : (Number(stufe) || 0);
    if (n <= 0) {
      return "";
    }
    if (n <= 1) {
      return "Lies die Nachricht und öffne die Ausbildungsakte. Achte auf das Alter und auf die Zahl der Unterrichtsstunden.";
    }
    if (n === 2) {
      return "Personalmangel ändert die Freistellung nicht. Welches Gesetz schützt den Besuch der Berufsschule, und was gilt bei mehr als fünf Unterrichtsstunden?";
    }
    return "Richtung, keine Musterlösung: Die passende Entscheidung ist die Freistellung für den ganzen Berufsschultag. Die vollständige Musterantwort steht nur in der Lehrkraftansicht.";
  }

  function hilfeWechsel(stufe, richtung) {
    var n = Math.floor(Number(stufe)) || 0;
    n = Math.max(0, Math.min(3, n));
    if (richtung === "mehr") return Math.min(3, n + 1);
    if (richtung === "weniger") return Math.max(0, n - 1);
    if (richtung === "einklappen") return 0;
    return n;
  }

  function gesetzesErklaerung() {
    return {
      titel: "Was bedeuten die Begriffe im Gesetz?",
      punkte: [
        { begriff: "Freistellung", text: "Die Ausbildungsstelle gibt die Auszubildende oder den Auszubildenden von der Arbeit frei, damit sie oder er am Berufsschulunterricht teilnehmen kann." },
        { begriff: "Unterrichtsstunde", text: "Eine Unterrichtsstunde ist eine Einheit im Stundenplan der Berufsschule. Die Gesetze zählen diese Einheiten, nicht die Uhrzeit im Betrieb." },
        { begriff: "einmal in der Woche", text: "Manche Regeln gelten nur für einen Berufsschultag je Woche. Lies im Gesetzestext nach, welche Regel an welche Bedingung geknüpft ist." }
      ],
      hinweis: "Diese Erklärung nennt keine Entscheidung. Prüfe selbst, welche Regel zum Fall und zu den Angaben in der Akte passt."
    };
  }

  function lehrkraftLoesung() {
    return {
      fallId: "berufsschule-statt-dienststelle",
      rechtsstand: RECHTSSTAND,
      unsicherheit: "Vorläufige Übungslösung, nicht verbindlich. Länderregeln zur Berufsschulpflicht können abweichen. Das ist keine Rechtsberatung und keine gesicherte Rechtslage.",
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
        { begriff: "Freistellung", erklaerung: "Die Ausbildungsstelle gibt eine Person von der Arbeit frei, damit sie am Unterricht teilnehmen kann." },
        { begriff: "abbedingen", erklaerung: "in einem Vertrag etwas anderes festlegen, als das Gesetz vorsieht." },
        { begriff: "Ausbildungszweck", erklaerung: "Eine Aufgabe muss zur Ausbildung gehören. Ein Schalterdienst nur wegen Personalmangels ist kein Ausbildungszweck." },
        { begriff: "Berufsschultag", erklaerung: "Ein Tag, an dem Berufsschulunterricht stattfindet. Für die Regeln zählt, wie viele Unterrichtsstunden an diesem Tag stattfinden." }
      ]
    };
  }

  return {
    RECHTSSTAND: RECHTSSTAND,
    BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    bereinigeGespeichert: bereinigeGespeichert,
    fallDaten: fallDaten,
    bewerteEntscheidung: bewerteEntscheidung,
    bewerteBegruendung: bewerteBegruendung,
    bewerteAntwort: bewerteAntwort,
    auswertung: auswertung,
    nachPruefung: nachPruefung,
    hilfe: hilfe,
    hilfeWechsel: hilfeWechsel,
    gesetzesErklaerung: gesetzesErklaerung,
    lehrkraftLoesung: lehrkraftLoesung,
    katalog: katalog
  };
});
