/* Virtuelles Rathaus, Nachschlagekarte für das Personalamt. Reine Daten: kein DOM, kein localStorage.
 * Die Karte erklärt Begriffe und Grundlagen. Sie nennt keine Lösung eines Vorgangs.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_NACHSCHLAGEN = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var KARTE = {
    titel: "Nachschlagekarte Personalamt",
    einleitung: "Hier kannst du Begriffe und Regeln nachlesen. Die Karte sagt dir nicht, wie du einen Vorgang entscheiden sollst. Das erarbeitest du selbst mit der Nachricht und der Akte.",
    abschnitte: [
      {
        id: "dual",
        titel: "Das duale System",
        absaetze: [
          "Die Ausbildung findet an zwei Lernorten statt: im Betrieb und in der Berufsschule. Im Betrieb lernst du die Arbeit in der Praxis. In der Berufsschule lernst du die Theorie dazu."
        ],
        punkte: [
          "Beide Lernorte gehören zur Ausbildung.",
          "Die zuständige Stelle begleitet und überwacht die Ausbildung. Das ist zum Beispiel die IHK oder die Handwerkskammer. Welche Stelle zuständig ist, hängt vom Beruf ab."
        ]
      },
      {
        id: "rollen",
        titel: "Wer ist wer?",
        absaetze: [],
        punkte: [
          "Auszubildende oder Auszubildender: Die Person, die den Beruf lernt.",
          "Ausbildende oder Ausbildender: Wer ausbildet und den Ausbildungsvertrag mit der auszubildenden Person schließt. Das kann ein Betrieb oder eine Verwaltung sein."
        ]
      },
      {
        id: "freistellung",
        titel: "Freistellung",
        absaetze: [
          "Freistellung heißt: Die auszubildende Person ist von der Arbeit frei, damit sie den Berufsschulunterricht besuchen kann.",
          "Das Gesetz dazu steht in § 15 Berufsbildungsgesetz (BBiG) mit der Überschrift „Freistellung, Anrechnung“. Lies den Wortlaut selbst nach und vergleiche ihn mit den Angaben in der Akte. Diese Karte sagt nicht, welche Entscheidung in einem Vorgang daraus folgt."
        ],
        punkte: []
      },
      {
        id: "vertrag",
        titel: "Ausbildungsvertrag",
        absaetze: [
          "§ 11 BBiG regelt die Vertragsabfassung."
        ],
        punkte: [
          "Die Ausbildenden fassen den wesentlichen Inhalt des Vertrags in Textform ab.",
          "Das muss unverzüglich nach Vertragsschluss geschehen, spätestens vor Beginn der Ausbildung.",
          "Die Abfassung wird den Auszubildenden ausgehändigt. Bei elektronischer Abfassung muss sie so übermittelt werden, dass man sie speichern und ausdrucken kann.",
          "Zum wesentlichen Inhalt gehören zum Beispiel: Namen und Anschriften, Ziel der Ausbildung, Beginn und Dauer, Dauer der Probezeit, Vergütung, Urlaub und die Voraussetzungen einer Kündigung. Die vollständige Liste steht im Gesetz.",
          "Ältere Texte und Lehrbücher nennen manchmal andere Formvorschriften. Prüfe immer, für welchen Rechtsstand eine Aussage gilt."
        ]
      },
      {
        id: "probezeit",
        titel: "Probezeit",
        absaetze: [
          "§ 20 BBiG: Das Ausbildungsverhältnis beginnt mit der Probezeit."
        ],
        punkte: [
          "Sie muss mindestens einen Monat dauern.",
          "Sie darf höchstens vier Monate dauern."
        ]
      },
      {
        id: "jugend",
        titel: "Unter 18 Jahren",
        absaetze: [
          "Für Auszubildende unter 18 Jahren gilt zusätzlich das Jugendarbeitsschutzgesetz (JArbSchG). Darauf verweist § 15 Absatz 3 BBiG. Einzelheiten dieses Gesetzes sind auf dieser Karte nicht dargestellt."
        ],
        punkte: []
      },
      {
        id: "ablauf",
        titel: "So gehst du bei einem Vorgang vor",
        absaetze: [],
        punkte: [
          "Sachverhalt erfassen: Lies die Nachricht und notiere, worum es geht.",
          "Unterlagen prüfen: Schau in die Akte. Welche Angaben helfen dir?",
          "Entscheiden: Triff eine Entscheidung.",
          "Begründen: Nenne die Regel und die Angaben, auf die du dich stützt.",
          "Antworten: Schreibe sachlich und höflich, mit klarem Ergebnis und kurzem Grund.",
          "Rückmeldung nutzen: Lies die Hinweise der Auswertung und überarbeite deinen Entwurf."
        ]
      }
    ],
    quelle: "Quelle: nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026. Übung, keine Rechtsberatung. Rechtsstand 01.11.2026.",
    grenze: "Länderregeln zur Schulpflicht sind hier nicht dargestellt."
  };

  // Gibt eine Kopie zurück, damit die Daten nicht von außen verändert werden.
  function karte() {
    return JSON.parse(JSON.stringify(KARTE));
  }

  // Der gesamte sichtbare Text der Karte als eine Zeichenkette (für Prüfungen).
  function gesamtText() {
    var k = karte();
    var teile = [k.titel, k.einleitung];
    k.abschnitte.forEach(function (a) {
      teile.push(a.titel);
      a.absaetze.forEach(function (t) { teile.push(t); });
      a.punkte.forEach(function (t) { teile.push(t); });
    });
    teile.push(k.quelle, k.grenze);
    return teile.join("\n");
  }

  return { karte: karte, gesamtText: gesamtText };
});
