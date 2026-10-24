# Review-Fassung: BWL-Werkstatt in Verwaltung-Ausbildung

Stand: 24.10.2026. Ziel: testbarer Stand für Montag, 26.10.2026. Keine Produktionsfreigabe.

## Umfang

- Neues Werkzeug `module/werkzeuge/bwl-werkstatt.html` (Testfassung), erreichbar im Menü "Tools & Nachschlagen".
- `js/bwl-kern.js`: Rechenkern ohne Oberfläche. Beträge in ganzen Cent, kaufmännische Rundung, Positionsbeträge mit BigInt.
- `js/bwl-werkstatt-ui.js` und `css/bwl-werkstatt.css`: Oberfläche für Angebot, Gewinn, Rabatt, Netto und Brutto mit Rechenweg.
- Registrierung in `js/module-daten.js` (`MODULE_TOOLS`). Der vorhandene Kaufmännische Rechner bleibt unverändert.
- Tests: `tests/bwl-kern.test.js` (13), `tests/bwl-seite.test.js` (5).

## Technische Grundlage

Rechenkern der BWL-Werkstatt aus IT-Ausbildung, Review-Stand 17fd7fd, nur lesend. IT-Inhalte und der Lernmodus sind nicht übernommen.

## Prüfung

- Befehl: `node --test tests/bwl-kern.test.js tests/bwl-seite.test.js` (Node 22, keine Abhängigkeiten). Ergebnis: 18 von 18 bestanden.
- Referenzfall der Übergabe: 2.850,00 / 199,50 / 3.049,50 / 152,48 / 3.201,98 Euro.
- Sichtprüfung im Testbrowser: Menüeintrag vorhanden, Beispielangebot rechnet richtig (166,93 Euro, von Hand nachgerechnet).
- Dabei gefunden und behoben: ausgeblendete Artikelzeilen wurden angezeigt, weil `display: grid` das Attribut `hidden` überschrieb.

## Grenzen und offene Punkte

- Fachlich nicht freigegeben. Bezugsbasen (Handlungskosten auf Positionssumme, Gewinn auf Selbstkosten) sind Übungsannahmen. Beispiele sind erfunden.
- Im Browser nur der Angebots-Beispielfall geprüft. Gewinn, Rabatt und Netto-Brutto sind über die Kerntests abgedeckt, nicht über die Oberfläche.
- Screenreader, Tastaturbedienung und schmale Bildschirme sind nicht geprüft. Das übernimmt die unabhängige QA.
- Sprachprüfung durch C-3PO (siehe Übergaben) ist nicht vollständig eingearbeitet.
- Höchstens 6 Artikel, Beträge bis 1.000.000.000,00 Euro, Prozentsätze mit höchstens zwei Nachkommastellen.
- Die Versionsnummer wurde nicht geändert.
