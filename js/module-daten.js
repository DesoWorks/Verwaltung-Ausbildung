/* Datengetriebene Modulübersicht der Startseite.
 * Neue Lektionen werden über Einträge in dieser Liste ergänzt.
 * Lernstruktur nach dem KMK-Rahmenlehrplan Kaufmann für Büromanagement
 * und Kauffrau für Büromanagement, Fassung vom 20.03.2025.
 * Die Titel sind aus der Übersicht des Plans gelesen, nicht neu formuliert.
 * Keine verbindliche betriebliche Monatsplanung.
 */
(function (global) {
  "use strict";

  global.MODULE_TOOLS = [];

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
            }
          ]
        },
        {
          id: "lf2",
          lernfeld: "Lernfeld 2",
          titel: "Büroprozesse gestalten und Arbeitsvorgänge organisieren",
          status: "kommt-bald",
          stunden: 80,
          unterthemen: []
        },
        {
          id: "lf3",
          lernfeld: "Lernfeld 3",
          titel: "Aufträge bearbeiten",
          status: "kommt-bald",
          stunden: 80,
          unterthemen: []
        },
        {
          id: "lf4",
          lernfeld: "Lernfeld 4",
          titel: "Sachgüter und Dienstleistungen beschaffen und Verträge schließen",
          status: "kommt-bald",
          stunden: 120,
          unterthemen: []
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
