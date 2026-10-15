# Lektion Lernfeld 1: Rechte und Pflichten im Ausbildungsverhältnis (15.10.2026)

Dateien: `module/lf1-rechte.html`, `js/lf1-rechte.js`. Version: 0.1.6-alpha.1 (vorher 0.1.5-alpha.1, beim Lesen bestätigt).

## Lernziel
Drei Dinge unterscheiden:
1. Der Ausbildungsvertrag regelt das Ausbildungsverhältnis, nicht ein späteres Arbeitsverhältnis.
2. Rechte und Pflichten stehen im Vertrag und in den Gesetzen. Paragraphen auswendig zu kennen ist nicht nötig. Nachfragen ist erlaubt, Pflichten fallen nicht einfach weg.
3. Bei einem Problem fragt man zuerst die Ausbilderin oder den Ausbilder. Die Jugend- und Auszubildendenvertretung vertritt Interessen und ändert nicht allein den Vertrag. Tarifrecht gilt, wenn ein Tarifvertrag für einen gilt.

## Quelle
KMK-Rahmenlehrplan Kaufmann für Büromanagement, Fassung 20.03.2025, Lernfeld 1, Seite 9 (Leitkompetenz: eigene Rechte und Pflichten, Ausbildungsverträge, Mitbestimmung durch die Jugend- und Auszubildendenvertretung, Berufsbildungsgesetz, Jugendarbeitsschutzgesetz, Tarifrecht).

## Geänderte Dateien
- neu: `module/lf1-rechte.html`, `js/lf1-rechte.js`, diese Notiz
- ergänzt: `js/module-daten.js` (Eintrag lf1-rechte), `js/version.js` (eine Zeile), `index.html` (Einleitungssatz), `js/glossar-daten.js` (Berufsbildungsgesetz, Jugendarbeitsschutzgesetz, Tarifvertrag)
- zusätzlich, nicht im Auftrag genannt: `js/fortschritt.js` (je eine Zeile in SCHLUESSEL und LOESUNGEN, damit das Abschlusszeichen funktioniert)

## Was nicht behauptet wird
- Keine Rechtsberatung. Beispielbetrieb Elbblick Verwaltungsservice und Jonas sind frei erfunden.
- Keine Paragraphennummern, Kündigungsfristen, Vergütungshöhen oder konkreten Tarifverträge.
- Nicht behandelt: Fortbildung, Präsentation des Betriebs, Datenschutz, Urheberrecht, Wirtschaftskreislauf.
- Seite nicht im Browser geprüft. Das übernimmt Rick.

## Prüfung
- `node --check js/lf1-rechte.js` Exit 0
- `node --check js/module-daten.js` Exit 0
- `node --check js/version.js` Exit 0
- zusätzlich `node --check js/glossar-daten.js` Exit 0
- Kleiner Test per `require`: 3 Fragen, je 3 Optionen, correct vorhanden, Feedback je Option; progress = 100 bei allem richtig und abgeschlossen, 0 ohne Antworten.
- Kein Commit, kein Push.
