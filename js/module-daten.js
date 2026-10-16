/* Datengetriebene Modulübersicht der Startseite.
 * Neue Lektionen werden über Einträge in dieser Liste ergänzt.
 * Lernstruktur nach dem KMK-Rahmenlehrplan Kaufmann für Büromanagement
 * und Kauffrau für Büromanagement, Fassung vom 20.03.2025.
 * Die Titel sind aus der Übersicht des Plans gelesen, nicht neu formuliert.
 * Keine verbindliche betriebliche Monatsplanung.
 */
(function (global) {
  "use strict";

  global.MODULE_TOOLS = [
    {
      id: "werkzeug-rechner",
      page: "werkzeug-rechner",
      titel: "Kaufmännischer Rechner",
      beschreibung: "Dreisatz, Prozent und Skonto mit Eingabe, Zwischenschritt und Ergebnis.",
      datei: "module/werkzeuge/rechner.html",
      lektion: "module/lf3-preis.html"
    },
    {
      id: "werkzeug-tabelle",
      page: "werkzeug-tabelle",
      titel: "Kleine Tabelle",
      beschreibung: "Summe, Prozent, WENN, SVERWEIS und ein einfaches Diagramm.",
      datei: "module/werkzeuge/tabelle.html",
      lektion: "module/lf4-menge.html"
    },
    {
      id: "werkzeug-textbausteine",
      page: "werkzeug-textbausteine",
      titel: "Textbausteine und Formular",
      beschreibung: "Vorlage, austauschbare Bausteine und sichtbare Normfelder.",
      datei: "module/werkzeuge/textbausteine.html",
      lektion: "module/lf3-textbausteine.html"
    },
    {
      id: "werkzeug-nutzwert",
      page: "werkzeug-nutzwert",
      titel: "Nutzwerttabelle",
      beschreibung: "Kriterien, Gewichte, Punkte und Summe.",
      datei: "module/werkzeuge/nutzwert.html",
      lektion: "module/lf4-vergleich.html"
    }
  ];

  global.MODULE_EINSTIEG = [];

  global.MODULE_DATEN = [
    {
      jahr: 1,
      titel: "1. Ausbildungsjahr",
      module: [
        {
          id: "lf1",
          lernfeld: "Lernfeld 1",
          titel: "Die eigene Rolle im Betrieb mitgestalten und den Betrieb präsentieren",
          status: "verfuegbar",
          stunden: 40,
          unterthemen: [
            {
              id: "lf1-rolle",
              typ: "lektion",
              titel: "Deine Rolle im Betrieb",
              beschreibung: "Ausbildungsverhältnis und späteres Arbeitsverhältnis unterscheiden. Den eigenen Verantwortungsbereich einordnen.",
              page: "lf1-rolle",
              status: "verfuegbar",
              datei: "module/lf1-rolle.html"
            },
            {
              id: "lf1-rechte",
              typ: "lektion",
              titel: "Rechte und Pflichten im Ausbildungsverhältnis",
              beschreibung: "Eigene Rechte und Pflichten im Ausbildungsverhältnis einordnen und wissen, wen du bei einem Problem zuerst fragst.",
              page: "lf1-rechte",
              status: "verfuegbar",
              datei: "module/lf1-rechte.html"
            },
            {
              id: "lf1-betrieb",
              typ: "lektion",
              titel: "Den Betrieb verständlich zeigen",
              beschreibung: "Informationen zum Betrieb prüfen, das Leistungsspektrum einordnen und Datenschutz bei einer Präsentation beachten.",
              page: "lf1-betrieb",
              status: "verfuegbar",
              datei: "module/lf1-betrieb.html"
            },
            {
              id: "lf1-ziele",
              typ: "lektion",
              titel: "Ziele und Wirtschaftskreislauf",
              beschreibung: "Betriebsziele, Arbeitsteilung und den erweiterten Wirtschaftskreislauf an einem einfachen Beispiel verstehen.",
              page: "lf1-ziele",
              status: "verfuegbar",
              datei: "module/lf1-ziele.html"
            },
            {
              id: "lf1-aufbau",
              typ: "lektion",
              titel: "Aufbau und Handlungsrahmen",
              beschreibung: "Die Stellung im Aufbau des Betriebs, wesentliche Arbeits- und Geschäftsprozesse und den eigenen Handlungsrahmen einordnen.",
              page: "lf1-aufbau",
              status: "verfuegbar",
              datei: "module/lf1-aufbau.html"
            },
            {
              id: "lf1-fortbildung",
              typ: "lektion",
              titel: "Fortbildung und lebenslanges Lernen",
              beschreibung: "Eine angebotene Fortbildung prüfen, ein realistisches Ziel von einem Wunsch unterscheiden und das Gelernte für die eigene Aufgabe nutzen.",
              page: "lf1-fortbildung",
              status: "verfuegbar",
              datei: "module/lf1-fortbildung.html"
            },
            {
              id: "lf1-praesentation",
              typ: "lektion",
              titel: "Eine Präsentation vorbereiten und bewerten",
              beschreibung: "Die Präsentationsform an die Rahmenbedingungen anpassen, Datenschutz und Urheberrecht beachten und einen Kriterienkatalog zur Bewertung nutzen.",
              page: "lf1-praesentation",
              status: "verfuegbar",
              datei: "module/lf1-praesentation.html"
            },
            {
              id: "lf1-lernziel", typ: "lernzielkontrolle", titel: "Lernzielkontrolle",
              beschreibung: "Fünf Fragen zu den vorhandenen Lektionen. Zurücksetzen nur mit Projektpasswort.",
              page: "lf1-lernziel", status: "verfuegbar", datei: "module/lf1-lernziel.html"
            }
          ]
        },
        {
          id: "lf2",
          lernfeld: "Lernfeld 2",
          titel: "Büroprozesse gestalten und Arbeitsvorgänge organisieren",
          status: "verfuegbar",
          stunden: 80,
          unterthemen: [
            {
              id: "lf2-ablauf",
              typ: "lektion",
              titel: "Arbeitsablauf und Störungen trennen",
              beschreibung: "An einem erfundenen Büroablauf Störung und Zeitdieb erkennen und eine ordnende nächste Handlung wählen.",
              page: "lf2-ablauf",
              status: "verfuegbar",
              datei: "module/lf2-ablauf.html"
            },
            {
              id: "lf2-arbeitsplatz",
              typ: "lektion",
              titel: "Arbeitsplatz und Gesundheit",
              beschreibung: "Ergonomie, Belastung und den Weg bei einem schweren Konflikt am Arbeitsplatz unterscheiden.",
              page: "lf2-arbeitsplatz",
              status: "verfuegbar",
              datei: "module/lf2-arbeitsplatz.html"
            },
            {
              id: "lf2-termine",
              typ: "lektion",
              titel: "Termine und Sitzungen",
              beschreibung: "Termine unterscheiden, eine Sitzung vorbereiten und ein einfaches Protokoll als Ergebnis einordnen.",
              page: "lf2-termine",
              status: "verfuegbar",
              datei: "module/lf2-termine.html"
            },
            {
              id: "lf2-post",
              typ: "lektion",
              titel: "Post, Ablage und Datenschutz",
              beschreibung: "Eingehende Information weitergeben, eine Versandart wählen und Schriftstücke geordnet aufbewahren.",
              page: "lf2-post",
              status: "verfuegbar",
              datei: "module/lf2-post.html"
            },
            {
              id: "lf2-zeit",
              typ: "lektion",
              titel: "Zeitdiebe und Prioritäten",
              beschreibung: "Zeitdiebe und Zeitfallen erkennen und Aufgaben nach Wichtigkeit und Dringlichkeit ordnen.",
              page: "lf2-zeit",
              status: "verfuegbar",
              datei: "module/lf2-zeit.html"
            },
            {
              id: "lf2-team",
              typ: "lektion",
              titel: "Im Team einen Kompromiss finden",
              beschreibung: "Im Team Gründe austauschen, einen Kompromiss finden und die eigene Meinung sachlich vertreten.",
              page: "lf2-team",
              status: "verfuegbar",
              datei: "module/lf2-team.html"
            },
            {
              id: "lf2-protokoll",
              typ: "lektion",
              titel: "Eine Sitzung protokollieren",
              beschreibung: "Ein Ergebnisprotokoll von einem Verlaufsprotokoll unterscheiden, Beschlüsse und offene Punkte festhalten und es an die Teilnehmenden geben.",
              page: "lf2-protokoll",
              status: "verfuegbar",
              datei: "module/lf2-protokoll.html"
            },
            {
              id: "lf2-lernziel", typ: "lernzielkontrolle", titel: "Lernzielkontrolle",
              beschreibung: "Fünf Fragen zu den vorhandenen Lektionen. Zurücksetzen nur mit Projektpasswort.",
              page: "lf2-lernziel", status: "verfuegbar", datei: "module/lf2-lernziel.html"
            }
          ]
        },
        {
          id: "lf3",
          lernfeld: "Lernfeld 3",
          titel: "Aufträge bearbeiten",
          status: "verfuegbar",
          stunden: 80,
          unterthemen: [
            {
              id: "lf3-auftrag",
              typ: "lektion",
              titel: "Von der Anfrage zum Auftrag",
              beschreibung: "Anfrage, Angebot und Auftrag unterscheiden und den Auftrag vollständig weitergeben.",
              page: "lf3-auftrag",
              status: "verfuegbar",
              datei: "module/lf3-auftrag.html"
            },
            {
              id: "lf3-preis",
              typ: "lektion",
              titel: "Preisrechnung vor dem Angebot",
              beschreibung: "Eine einfache Preisrechnung mit Dreisatz und Prozent prüfen, bevor ein Angebot rausgeht.",
              page: "lf3-preis",
              status: "verfuegbar",
              datei: "module/lf3-preis.html"
            },
            {
              id: "lf3-dokumente",
              typ: "lektion",
              titel: "Dokumente zum Auftrag",
              beschreibung: "Auftragsbestätigung, Lieferschein und Rechnung als drei verschiedene Dokumente einordnen.",
              page: "lf3-dokumente",
              status: "verfuegbar",
              datei: "module/lf3-dokumente.html"
            },
            {
              id: "lf3-angebot",
              typ: "lektion",
              titel: "Verlangtes und unverlangtes Angebot",
              beschreibung: "Verlangte und unverlangte Angebote unterscheiden und einen Angebotstext als normgerechtes Schreiben einordnen.",
              page: "lf3-angebot",
              status: "verfuegbar",
              datei: "module/lf3-angebot.html"
            },
            {
              id: "lf3-textbausteine",
              typ: "lektion",
              titel: "Textbausteine passend einsetzen",
              beschreibung: "Einen vorbereiteten Textbaustein mit geprüften Angaben füllen und den ganzen Kundentext vor dem Versand prüfen.",
              page: "lf3-textbausteine",
              status: "verfuegbar",
              datei: "module/lf3-textbausteine.html"
            },
            {
              id: "lf3-formulare",
              typ: "lektion",
              titel: "Formulare im Textverarbeitungsprogramm",
              beschreibung: "Ein Formular so anlegen, dass nur die vorgesehenen Felder ausgefüllt werden und der feste Text geschützt bleibt.",
              page: "lf3-formulare",
              status: "verfuegbar",
              datei: "module/lf3-formulare.html"
            },
            {
              id: "lf3-vervielfaeltigen",
              typ: "lektion",
              titel: "Schriftstücke vervielfältigen",
              beschreibung: "Kopieren, Drucken und Scannen der Aufgabe zuordnen, ein passendes Dateiformat wählen und beim Vervielfältigen Papier sparen.",
              page: "lf3-vervielfaeltigen",
              status: "verfuegbar",
              datei: "module/lf3-vervielfaeltigen.html"
            },
            {
              id: "lf3-lernziel", typ: "lernzielkontrolle", titel: "Lernzielkontrolle",
              beschreibung: "Fünf Fragen zu den vorhandenen Lektionen. Zurücksetzen nur mit Projektpasswort.",
              page: "lf3-lernziel", status: "verfuegbar", datei: "module/lf3-lernziel.html"
            }
          ]
        },
        {
          id: "lf4",
          lernfeld: "Lernfeld 4",
          titel: "Sachgüter und Dienstleistungen beschaffen und Verträge schließen",
          status: "verfuegbar",
          stunden: 120,
          unterthemen: [
            {
              id: "lf4-bedarf",
              typ: "lektion",
              titel: "Bedarf vor der Bestellung",
              beschreibung: "An einem erfundenen Büroalltag Bedarf, Wunsch und voreilige Bestellung unterscheiden und zuerst den Bedarf klären.",
              page: "lf4-bedarf",
              status: "verfuegbar",
              datei: "module/lf4-bedarf.html"
            },
            {
              id: "lf4-bezugsquellen",
              typ: "lektion",
              titel: "Bezugsquellen nach dem Bedarf",
              beschreibung: "Nach geklärtem Bedarf gezielt anfragen und fehlende Angaben zu Preis oder Lieferzeit im Angebot erkennen.",
              page: "lf4-bezugsquellen",
              status: "verfuegbar",
              datei: "module/lf4-bezugsquellen.html"
            },
            {
              id: "lf4-vergleich",
              typ: "lektion",
              titel: "Angebote vergleichen",
              beschreibung: "Zwei Angebote nach Preis und einem qualitativen Kriterium vergleichen, nicht nur nach dem niedrigsten Preis.",
              page: "lf4-vergleich",
              status: "verfuegbar",
              datei: "module/lf4-vergleich.html"
            },
            {
              id: "lf4-menge",
              typ: "lektion",
              titel: "Bestellmenge und Lieferzeitpunkt",
              beschreibung: "Bestellmenge und Lieferzeitpunkt zusammen betrachten und ein Diagramm als Entscheidungshilfe nutzen.",
              page: "lf4-menge",
              status: "verfuegbar",
              datei: "module/lf4-menge.html"
            },
            {
              id: "lf4-vertrag",
              typ: "lektion",
              titel: "Vertragsarten beim Beschaffen",
              beschreibung: "Kaufvertrag, Mietvertrag, Werkvertrag und Dienstvertrag beim Beschaffen unterscheiden.",
              page: "lf4-vertrag",
              status: "verfuegbar",
              datei: "module/lf4-vertrag.html"
            },
            {
              id: "lf4-miete",
              typ: "lektion",
              titel: "Mieten statt kaufen",
              beschreibung: "Eine Miete von einem Kauf unterscheiden und Nutzen und Risiko der zeitweisen Nutzung einordnen.",
              page: "lf4-miete",
              status: "verfuegbar",
              datei: "module/lf4-miete.html"
            },
            {
              id: "lf4-wareneingang",
              typ: "lektion",
              titel: "Wareneingang prüfen und einlagern",
              beschreibung: "Die Lieferung mit der Bestellung abgleichen, Abweichungen festhalten und freigegebene Ware am passenden Platz einlagern.",
              page: "lf4-wareneingang",
              status: "verfuegbar",
              datei: "module/lf4-wareneingang.html"
            },
            {
              id: "lf4-lager",
              typ: "lektion",
              titel: "Lagerung passend wählen",
              beschreibung: "Die Lagerung nach der Ware und einem Kriterium wählen, nicht nach dem nächsten freien Platz.",
              page: "lf4-lager",
              status: "verfuegbar",
              datei: "module/lf4-lager.html"
            },
            {
              id: "lf4-rechnung",
              typ: "lektion",
              titel: "Rechnung prüfen und Zahlung wählen",
              beschreibung: "Rechnung, Bestellung und Lieferung abgleichen und den Zahlungsweg nur nach der genannten Bedingung wählen.",
              page: "lf4-rechnung",
              status: "verfuegbar",
              datei: "module/lf4-rechnung.html"
            },
            {
              id: "lf4-anfrage",
              typ: "lektion",
              titel: "Eine Anfrage an den Lieferanten schreiben",
              beschreibung: "Eine Anfrage mit den nötigen Angaben normgerecht schreiben, ohne schon zu bestellen.",
              page: "lf4-anfrage",
              status: "verfuegbar",
              datei: "module/lf4-anfrage.html"
            },
            {
              id: "lf4-stoerung",
              typ: "lektion",
              titel: "Eine Lieferstörung sachlich melden",
              beschreibung: "Nicht-Rechtzeitig-Lieferung und Schlechtleistung unterscheiden und einen konkreten Lösungsvorschlag sachlich mitteilen.",
              page: "lf4-stoerung",
              status: "verfuegbar",
              datei: "module/lf4-stoerung.html"
            },
            {
              id: "lf4-lernziel", typ: "lernzielkontrolle", titel: "Lernzielkontrolle",
              beschreibung: "Fünf Fragen zu den vorhandenen Lektionen. Zurücksetzen nur mit Projektpasswort.",
              page: "lf4-lernziel", status: "verfuegbar", datei: "module/lf4-lernziel.html"
            }
          ]
        }
      ]
    },
    {
      jahr: 2,
      titel: "2. Ausbildungsjahr",
      module: [
        { id: "lf5", lernfeld: "Lernfeld 5", titel: "Kunden akquirieren und binden", status: "kommt-bald", stunden: 80, unterthemen: [] },
        { id: "lf6", lernfeld: "Lernfeld 6", titel: "Werteströme erfassen und beurteilen", status: "kommt-bald", stunden: 80, unterthemen: [] },
        { id: "lf7", lernfeld: "Lernfeld 7", titel: "Gesprächssituationen gestalten", status: "kommt-bald", stunden: 40, unterthemen: [] },
        { id: "lf8", lernfeld: "Lernfeld 8", titel: "Personalwirtschaftliche Aufgaben wahrnehmen", status: "kommt-bald", stunden: 80, unterthemen: [] }
      ]
    },
    {
      jahr: 3,
      titel: "3. Ausbildungsjahr",
      module: [
        { id: "lf9", lernfeld: "Lernfeld 9", titel: "Liquidität sichern und Finanzierung vorbereiten", status: "kommt-bald", stunden: 80, unterthemen: [] },
        { id: "lf10", lernfeld: "Lernfeld 10", titel: "Wertschöpfungsprozesse erfolgsorientiert steuern", status: "kommt-bald", stunden: 80, unterthemen: [] },
        { id: "lf11", lernfeld: "Lernfeld 11", titel: "Geschäftsprozesse darstellen und optimieren", status: "kommt-bald", stunden: 40, unterthemen: [] },
        { id: "lf12", lernfeld: "Lernfeld 12", titel: "Veranstaltungen und Geschäftsreisen organisieren", status: "kommt-bald", stunden: 40, unterthemen: [] },
        { id: "lf13", lernfeld: "Lernfeld 13", titel: "Ein Projekt planen und durchführen", status: "kommt-bald", stunden: 40, unterthemen: [] }
      ]
    }
  ];
})(typeof window !== "undefined" ? window : globalThis);
