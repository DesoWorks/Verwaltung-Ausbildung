/* Virtuelles Rathaus, zweiter Personalamt-Vorgang: Hochbetrieb und Berufsschule.
 * Lernkern ohne Oberfläche und ohne Netzwerkaufrufe. Eigene Bewertung, eigener Speicherstand.
 * Übungsmaterial, keine Rechtsberatung. Rechtsstand: 01.11.2026.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_HOCHBETRIEB = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var RECHTSSTAND = "01.11.2026";
  // Wird bei jeder inhaltlichen Änderung dieser Bewertung erhöht.
  var BEWERTUNGSSTAND = "2026-11-01-hochbetrieb2";
  var SPEICHERSCHLUESSEL = "verwaltung-ausbildung.rathaus.hochbetrieb.v1";
  var QUELLEN = [
    "Berufsbildungsgesetz (BBiG) § 14 und § 15, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026"
  ];

  var ENTSCHEIDUNGEN = {
    A: {
      id: "A",
      text: "Noelle fällt drei Wochen in der Berufsschule aus und arbeitet in der Dienststelle.",
      richtig: false
    },
    B: {
      id: "B",
      text: "Noelle besucht die Berufsschule weiter. Sie wird in dieser Zeit nicht statt des Unterrichts in der Dienststelle eingeteilt.",
      richtig: true
    },
    C: {
      id: "C",
      text: "Noelle entscheidet selbst, ob sie zur Schule oder in die Dienststelle kommt.",
      richtig: false
    },
    D: {
      id: "D",
      text: "Noelle fällt nur in der ersten Woche aus. Danach geht sie wieder zur Schule.",
      richtig: false
    }
  };

  var GRUENDE = {
    "bbig15": {
      id: "bbig15",
      text: "BBiG § 15: Ausbildende stellen Auszubildende für die Teilnahme am Berufsschulunterricht frei.",
      richtig: true,
      pflicht: true,
      falle: false
    },
    "bbig14-4": {
      id: "bbig14-4",
      text: "BBiG § 14 Absatz 1 Nummer 4: Ausbildende halten Auszubildende zum Besuch der Berufsschule an.",
      richtig: true,
      pflicht: false,
      falle: false
    },
    "falle-hochbetrieb": {
      id: "falle-hochbetrieb",
      text: "Hochbetrieb im Amt ist ein Ausnahmegrund. Dann darf der Unterricht ausfallen.",
      richtig: false,
      pflicht: false,
      falle: true
    },
    "falle-alter": {
      id: "falle-alter",
      text: "Ab 18 Jahren gibt es keine Freistellung für die Berufsschule mehr.",
      richtig: false,
      pflicht: false,
      falle: true
    }
  };

  function fallDaten() {
    return {
      id: "berufsschule-hochbetrieb",
      stadt: "Stadtverwaltung Sonnenthal",
      amt: "Personalamt",
      betreff: "Bitte um Einsatz im Hochbetrieb statt Berufsschule",
      vorgangTitel: "Vorgang: Hochbetrieb und Berufsschule",
      antwortAn: "Jonas Pfeil",
      kurzname: "Noelle Kranz",
      von: "Jonas Pfeil, Teamleitung Bürgerbüro",
      an: "Mira Holtz, Ausbilderin im Personalamt",
      person: {
        name: "Noelle Kranz",
        alter: 19,
        lehrjahr: 2,
        beruf: "Kaufmann für Büromanagement / Kauffrau für Büromanagement",
        schule: "Berufsschulunterricht laut Stundenplan in den kommenden drei Wochen"
      },
      nachricht: "Guten Tag, Frau Holtz. In den nächsten drei Wochen ist im Bürgerbüro Hochbetrieb. Bitte lassen Sie Noelle Kranz in dieser Zeit nicht in die Berufsschule gehen. Sie soll jeden Tag in der Dienststelle arbeiten. Sie ist ja schon 19. Danke, Jonas Pfeil.",
      akte: {
        vertrag: "Fiktiver Auszug: Die Berufsschule ist Teil der Ausbildung. Der Ausbildungsplan nennt die Zeiten der Berufsschule. Änderungen am Ausbildungsplan brauchen eine schriftliche Absprache mit der Ausbilderin.",
        hinweis: "Alle Namen und die Stadt Sonnenthal sind erfunden. Es werden keine echten Schülerdaten gespeichert."
      },
      quellen: QUELLEN.slice(),
      rechtsstand: RECHTSSTAND
    };
  }

  function bewerteEntscheidung(id) {
    var eintrag = ENTSCHEIDUNGEN[id];
    if (!eintrag) {
      return { richtig: false, bekannt: false, hinweis: "Wähle eine der vier Entscheidungen." };
    }
    if (eintrag.richtig) {
      return {
        richtig: true,
        bekannt: true,
        hinweis: "Die Entscheidung passt: Der Unterricht hat in den drei Wochen Vorrang."
      };
    }
    var hinweis = "Diese Entscheidung passt nicht. Prüfe, ob der Gesetzestext für den Hochbetrieb eine Ausnahme nennt.";
    if (id === "C") {
      hinweis = "Noelle entscheidet das nicht allein. Die Pflicht zur Freistellung liegt bei der Ausbildungsstelle.";
    }
    if (id === "D") {
      hinweis = "Eine Teil-Lösung nur für die erste Woche ändert nichts an der Regel für die übrigen Wochen. Lies noch einmal, was der Gesetzestext für den Unterricht sagt.";
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
      hinweise.push("Wähle mindestens eine Regel aus dem Gesetz als Begründung.");
    }
    if (!hatPflicht) {
      hinweise.push("Die Begründung braucht die Regel zur Freistellung für den Berufsschulunterricht. Prüfe, ob du sie ausgewählt hast.");
    }
    if (hatFalle) {
      hinweise.push("Eine Falle ist ausgewählt. Prüfe, ob der gelesene Gesetzestext diese Behauptung wirklich enthält.");
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

  function klauseln(text) {
    return String(text || "").toLowerCase()
      .split(/[.!?;:\n]|,|\bund\b|\baber\b|\bsondern\b|\bdoch\b/)
      .map(function (teil) { return teil.trim(); })
      .filter(function (teil) { return teil.length > 0; });
  }

  function verneint(klausel) {
    return /\b(nicht|kein|keine|keinen|keiner|keinem|ohne|nie|niemals)\b/.test(klausel);
  }

  function istUnsachlich(text) {
    return /\b(idiot|blöd|bloed|dumm|unfähig|unfaehig|verarsch)\b/i.test(String(text || ""));
  }

  // Freistellung in die falsche Richtung: von der Schule oder vom Unterricht weg.
  function drehtRichtung(text) {
    var t = String(text || "").toLowerCase();
    return /(von|vom)\s+(der\s+|dem\s+)?(berufsschul\w*|unterricht\w*)\s+(frei\s*stell\w*|freigestellt|freizustellen)/.test(t) ||
      /frei(gestellt|zustellen|stellen)\s+(von|vom)\s+(der\s+|dem\s+)?(berufsschul|unterricht)/.test(t) ||
      /freistellung\s+(von|vom)\s+(der\s+|dem\s+)?(berufsschul|unterricht)/.test(t);
  }

  // Eine Klausel, die den Schulbesuch bejaht.
  function sagtBesuch(text) {
    return klauseln(text).some(function (k) {
      var schule = /berufsschul|unterricht|schule/.test(k);
      var besuch = /besucht|besuchen|geht\s+(weiter\s+)?(zur|in\s+die)|gehen\s+(weiter\s+)?(zur|in\s+die)|teilnahme|teilnehmen|nimmt\s+.*teil|weiter|freigestellt|freizustellen|freistellung|vorrang|geht\s+vor/.test(k);
      var aufhebung = /ausfallen|fällt\s+.*\baus\b|faellt\s+.*\baus\b/.test(k);
      if (!schule || !besuch) return false;
      if (verneint(k)) {
        return /nicht\s+ausfallen|kein\w*\s+ausfall|nicht\s+aus\b/.test(k);
      }
      return !aufhebung;
    });
  }

  // Eine Klausel, die ausdrücklich sagt: keine Einteilung oder Arbeit in der Dienststelle statt des Unterrichts.
  function sagtKeineEinteilung(text) {
    return klauseln(text).some(function (k) {
      return /\b(keine|keinen|kein)\s+(einteilung|einsatz|arbeitseinsatz|dienst|arbeit|dienstleistung)\b/.test(k) ||
        /\bohne\s+(einteilung|einsatz|arbeitseinsatz|dienst|arbeit|dienstleistung)/.test(k) ||
        /\bnicht\s+(in\s+der|in\s+die|im)\s+(dienststelle|buergerbuero|bürgerbüro|amt)\b/.test(k) ||
        /\bnicht\s+(eingeteilt|einzuteilen|zum\s+dienst|arbeiten|im\s+dienst)\b/.test(k);
    });
  }

  // Klauseln, die den Unterricht ausfallen lassen oder die Freistellung aufheben.
  function verlangtAusfall(text) {
    return klauseln(text).some(function (k) {
      if (verneint(k)) return false;
      if (/nicht\s+(zur|in\s+die)\s+berufsschule/.test(k)) return true;
      if (/(berufsschul\w*|unterricht|schule)\s+(soll\s+|muss\s+|darf\s+|kann\s+)?ausfallen/.test(k)) return true;
      if (/(fällt|faellt|fallen)\s+.*\baus\b/.test(k) && /schule|unterricht/.test(k)) return true;
      if (/statt\s+(zur|in\s+die)\s+berufsschule/.test(k)) return true;
      return false;
    });
  }

  function widerspricht(text) {
    var t = String(text || "").toLowerCase();
    if (/nur\s+(in\s+)?(der\s+|die\s+)?erste[nr]?\s+woche/.test(t)) return true;
    return klauseln(text).some(function (k) {
      if (/schule\s+nicht\s+(zu\s+)?(besuchen|gehen)|nicht\s+(die\s+)?(berufs)?schule\s+(zu\s+)?besuchen|nicht\s+am\s+(berufsschul)?unterricht\s+teil/.test(k)) {
        return true;
      }
      if (/ab\s+(18|achtzehn)|volljährig|volljaehrig|über\s+18|ueber\s+18/.test(k) &&
          /(keine?|nicht)\s+(mehr\s+)?(freistell|freigestellt)|entfällt|entfaellt/.test(k)) {
        return true;
      }
      if (verneint(k)) return false;
      if (/hochbetrieb/.test(k) && /ausnahme|vorrang|geht\s+vor|rechtfertig|darf\s+.*ausfallen/.test(k)) return true;
      var ort = /in der dienststelle|in die dienststelle|im bürgerbüro|im buergerbuero|am schalter|im amt\b/.test(k);
      var tut = /arbeiten|arbeitet|aushelfen|einsetzen|eingesetzt|erscheinen|anwesend|dienst leisten|dienst antreten|eingeteilt|einteilen|einteilung/.test(k);
      if (ort && tut) return true;
      return /zum dienst\s+(eingeteilt|antreten|erscheinen)/.test(k);
    });
  }

  function bewerteAntwort(text) {
    var gekuerzt = String(text || "").trim();
    var hinweise = [];
    if (gekuerzt.length < 40) {
      hinweise.push("Die Antwort ist zu kurz. Schreibe mindestens einen sachlichen Satz zum Berufsschulbesuch.");
    }
    if (istUnsachlich(gekuerzt)) {
      hinweise.push("Die Antwort muss sachlich bleiben. Keine Beleidigung.");
    }
    if (drehtRichtung(gekuerzt)) {
      hinweise.push("Die Formulierung dreht die Richtung. Freistellung meint hier von der Arbeit zum Unterricht, nicht vom Unterricht weg.");
    } else if (!sagtBesuch(gekuerzt)) {
      hinweise.push("Schreibe klar, dass Noelle die Berufsschule weiter besucht und dafür freigestellt wird.");
    } else if (!sagtKeineEinteilung(gekuerzt)) {
      hinweise.push("Schreibe auch, dass Noelle in dieser Zeit nicht statt des Unterrichts in der Dienststelle eingeteilt wird.");
    }
    if (verlangtAusfall(gekuerzt)) {
      hinweise.push("Die Antwort darf nicht verlangen, dass der Unterricht ausfällt oder Noelle nicht zur Berufsschule geht.");
    } else if (widerspricht(gekuerzt)) {
      hinweise.push("Ein Satz hebt auf, was an anderer Stelle gilt: Noelle soll doch arbeiten, nur zeitweise zur Schule gehen oder keine Freistellung haben. Lies deine Antwort bis zum Ende und lass nur eine Aussage stehen.");
    }
    return { ok: hinweise.length === 0, hinweise: hinweise, laenge: gekuerzt.length };
  }

  function auswertung(eingabe) {
    var daten = eingabe || {};
    var entscheidung = bewerteEntscheidung(daten.entscheidung);
    var begruendung = bewerteBegruendung(daten.gruende);
    var antwort = bewerteAntwort(daten.antwort);
    var hinweise = [];
    if (!entscheidung.richtig) hinweise.push(entscheidung.hinweis);
    begruendung.hinweise.forEach(function (h) { hinweise.push(h); });
    antwort.hinweise.forEach(function (h) { hinweise.push(h); });
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
      naechsterBlick.push("Prüfe die Entscheidung noch einmal anhand des Gesetzestextes und der Angaben in der Akte.");
    } else {
      naechsterBlick.push("Wähle zuerst eine Entscheidung.");
    }
    if (begruendung.reicht) {
      traegt.push("Die Begründung enthält die tragende Regel und keine Falle.");
    } else if (begruendung.hatFalle) {
      naechsterBlick.push("Prüfe, ob eine ausgewählte Begründung nur eine Behauptung ist, die im gelesenen Gesetzestext nicht steht.");
    } else {
      naechsterBlick.push("Suche die Regel, die die Teilnahme am Berufsschulunterricht ausdrücklich schützt.");
    }
    if (antwort.ok) {
      traegt.push("Die Antwort ist sachlich und nennt die richtige Richtung.");
    } else if (drehtRichtung(daten.antwort)) {
      naechsterBlick.push("Du verwechselst die Richtung der Freistellung. Sie gilt von der Arbeit zum Unterricht, nicht vom Unterricht weg.");
    } else if (widerspricht(daten.antwort)) {
      naechsterBlick.push("Lies deine Antwort bis zum Ende: Eine Aussage nimmt zurück, was an anderer Stelle gilt. Soll in den drei Wochen der Unterricht oder die Arbeit Vorrang haben?");
    } else if (sagtBesuch(String(daten.antwort || "")) && !sagtKeineEinteilung(String(daten.antwort || ""))) {
      naechsterBlick.push("Deine Antwort sagt, dass Noelle zur Schule geht. Sagt sie auch, was für die Dienststelle in dieser Zeit gilt?");
    } else if (antwort.laenge < 40) {
      naechsterBlick.push("Schreibe die Antwort an Herrn Pfeil in ganzen, sachlichen Sätzen.");
    } else {
      naechsterBlick.push("Lies deine Antwort noch einmal: Sagt sie klar, wohin Noelle in den drei Wochen geht?");
    }
    if (bestanden) {
      naechsterBlick = ["Prüfe noch einmal, ob Herr Pfeil aus deiner Antwort sofort erkennt, was in den drei Wochen gilt."];
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
        hinweise: ["Öffne zuerst die Ausbildungsakte. Dort stehen Alter und Angaben zum Ausbildungsplan."].concat(ergebnis.hinweise),
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

  // Bereinigt einen gespeicherten Zustand. Eingaben bleiben, Auswertung und Abschluss
  // aus einem anderen Bewertungsstand werden ungültig. Das Eingabeobjekt bleibt unverändert.
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
    if (n <= 0) return "";
    if (n <= 1) {
      return "Lies die Nachricht und öffne die Ausbildungsakte. Achte auf das Alter und darauf, was die Nachricht für die drei Wochen verlangt.";
    }
    if (n === 2) {
      return "Viel Arbeit im Amt ist ein Grund aus der Praxis. Prüfe im Gesetzestext, ob dort dafür eine Ausnahme steht und ob das Alter die Regel zur Freistellung für den Unterricht ändert.";
    }
    return "Richtung, keine Musterlösung: Vergleiche jede Aussage in der Nachricht mit dem Wortlaut der Regel zum Berufsschulunterricht. Die vollständige Musterantwort steht nur in der Lehrkraftansicht.";
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
        { begriff: "Ausnahme", text: "Eine Ausnahme ist ein Fall, in dem eine Regel nicht gilt. Eine Ausnahme muss im Gesetz stehen. Eine Behauptung aus der Praxis reicht dafür nicht." },
        { begriff: "Alter", text: "Das Alter kann bestimmen, welches Gesetz zusätzlich gilt. Lies im Gesetzestext nach, was für welche Altersgruppe geregelt ist." }
      ],
      hinweis: "Diese Erklärung nennt keine Entscheidung. Prüfe selbst, welche Regel zum Fall und zu den Angaben in der Akte passt."
    };
  }

  function lehrkraftLoesung() {
    return {
      fallId: "berufsschule-hochbetrieb",
      rechtsstand: RECHTSSTAND,
      unsicherheit: "Vorläufige Übungslösung, nicht verbindlich. Im gelesenen Gesetzestext steht keine Ausnahme für Hochbetrieb. Länderregeln zur Berufsschulpflicht, Schulordnungen und der Einzelfall können abweichen. Das ist keine Rechtsberatung und keine gesicherte Rechtslage.",
      entscheidung: "B",
      pflichtgrund: "bbig15",
      stuetzendeGruende: ["bbig14-4"],
      fallen: ["falle-hochbetrieb", "falle-alter"],
      kriterien: [
        "Entscheidung B gewählt",
        "BBiG § 15 als Begründung gewählt",
        "Keine Falle gewählt",
        "Antwort mindestens 40 Zeichen, sachlich, sagt zu, dass der Berufsschulbesuch weitergeht",
        "Antwort lässt den Unterricht nicht ausfallen, kürzt die drei Wochen nicht und teilt Noelle nicht statt des Unterrichts ein"
      ],
      mustertext: "Guten Tag, Herr Pfeil. Noelle Kranz besucht die Berufsschule in den drei Wochen weiter. Für diese Zeit erfolgt keine Einteilung in die Dienststelle statt des Unterrichts. Hochbetrieb steht als Ausnahme nicht im Gesetzestext, und das Alter ändert daran nichts. Mit freundlichen Grüßen, Mira Holtz, Personalamt.",
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
        { begriff: "Berufsschulunterricht", erklaerung: "Der Unterricht an der Berufsschule. Er ist Teil der Ausbildung." },
        { begriff: "Ausnahmegrund", erklaerung: "Ein Grund, bei dem eine Regel nicht gilt. Er muss im Gesetz stehen." }
      ]
    };
  }

  return {
    RECHTSSTAND: RECHTSSTAND,
    BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    SPEICHERSCHLUESSEL: SPEICHERSCHLUESSEL,
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
