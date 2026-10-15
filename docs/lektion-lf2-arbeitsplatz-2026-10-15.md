# Lernfeld 2: Arbeitsplatz und Gesundheit

Stand: 15.10.2026. Zweite kleine Lektion in Lernfeld 2.

## Dateien und Lernziel

- `module/lf2-arbeitsplatz.html`
- `js/lf2-arbeitsplatz.js`

Du unterscheidest an einem Büroplatz drei Dinge: ergonomische und sichere Gestaltung (Bildschirm, Stuhl, Licht, Wege), anhaltende Belastungen statt einzelner Zeitdiebe und Unterstützung bei möglichem Mobbing oder schweren Konflikten. Erste Anlaufstelle im erfundenen Beispiel: Samis Ausbilderin; ist sie beteiligt, eine andere vertrauenswürdige Anlaufstelle im Betrieb. Sami und alle Situationen sind ausdrücklich frei erfunden, ohne benanntes Unternehmen.

## Quelle und Grenzen

Fachliche Grundlage ausschließlich: KMK-Rahmenlehrplan Kaufmann für Büromanagement und Kauffrau für Büromanagement, Fassung vom 20.03.2025, Lernfeld 2, Seiten 10–11. Lokal vollständig für diesen Abschnitt gelesen mit `pdftotext -f 10 -l 11 -layout quellen/kmk-rahmenlehrplan-bueromanagement.pdf -` (Exit-Code 0). Herkunft der Arbeitskopie: `docs/ausbildungsplan.md`; KMK-Downloadbereich: https://www.kmk.org/service/servicebereich-berufliche-schulen/downloadbereich-rahmenlehrplaene.html

Der Plan nennt Ergonomie, Arbeitssicherheit, Gesundheit, Belastungen und Konflikte. Samis Situationen und Handlungsmöglichkeiten setzen diese Lernziele didaktisch um; sie sind keine wörtlichen Vorgaben des Plans. Die Lektion behauptet keine vollständige Abdeckung von Lernfeld 2, keine rechtliche Prüfung des Arbeitsplatzes, keine verbindliche Beschwerdestelle und keine medizinische Diagnose. Keine Rechtsberatung, keine Paragraphen oder konkreten Bildschirmabstände. Keine Wiederholung der Ablauf-Lektion.

Nicht behandelt: Termine, Sitzungen, Protokoll, Post, Ablage, Datenschutz, Zeitmanagement-Methoden (einschließlich ABC-Analyse und Eisenhower), vertiefte Büroraumkonzepte, Homeoffice, mobiles Arbeiten, ökologische Arbeitsplatzplanung und Suchtprävention. Gesundheit ist hier nur ein erster Ausschnitt, kein vollständiges Gesundheitsprogramm.

## Gewünschte Glossar-Sätze für Rick

Die drei Begriffe stehen im `TERMS`-Array. Gemeinsame Glossardatei nicht geändert.

- **Arbeitsplatz:** Dein Arbeitsplatz ist der Ort mit den Arbeitsmitteln und Bedingungen, unter denen du deine Aufgaben erledigst.
- **Ergonomie:** Ergonomie bedeutet, die Arbeitsbedingungen so an den Menschen anzupassen, dass er möglichst gesund und sicher arbeiten kann.
- **Belastung:** Eine Belastung ist eine Anforderung oder ein Einfluss bei der Arbeit, der auf deinen Körper oder deine Psyche wirkt.

## Prüfung und Übergabe

- `node --check js/lf2-arbeitsplatz.js` — Exit-Code **0**.
- Zusätzliche Node-Prüfung mit `node:assert/strict` und `node:vm`, direkt über Standardeingabe: bestanden, Exit-Code **0**. Geprüft: Export, Schlüssel, vier Schritte, drei Fragen mit je drei Optionen, Fortschritt 0/25/75/100 %, jede fehlende Aufgabe bei leerer Prüfung, alle neun optionsbezogenen Rückmeldungen, Speichern schon bei Auswahl, Wiederherstellen nach erneutem Laden, wiederholtes Prüfen, Navigation, beide Rücksetzungen und blockierter Speicher. DOM-Ersatz, kein echter Browsertest.
- HTML-Strukturprüfung mit Python `html.parser`, direkt über Standardeingabe: bestanden, Exit-Code **0**. Eindeutige IDs, vier Abschnitte, passende Navigationsziele, `type="button"`, identische gemeinsame Script-Reihenfolge wie LF1 und existierende Scriptdateien.
- Kein Browser gestartet, kein Server gestartet, kein Commit, kein Push und keine Veröffentlichung. Nur die drei für diese Lektion beauftragten Dateien angelegt. Andere Lektionen und IT-Ausbildung nicht bearbeitet.
- Katalog, Version, gemeinsamer Fortschritt und Glossar bleiben für Ricks Einbindung unberührt. Die Fachwörteranzeige folgt der Vorlage und benötigt die Einträge im gemeinsamen Glossar. Die neue Lektion ist noch nicht im Katalog registriert.

## Einbindung durch Rick, 15.10.2026

Katalog, Glossar, Fortschritt und Version hat Rick nach der Ablieferung ergänzt, damit die parallele Lektion in Lernfeld 1 nicht überschrieben wird. Version danach: `0.1.7-alpha.1`. Die Auswahl speichert erst beim Prüfen, wie in der bestehenden Lektion zur Rolle. Ein Klick allein setzt den Abschluss nicht.
