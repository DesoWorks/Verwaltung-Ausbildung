# Kleine Lektion: Bezugsquellen nach dem Bedarf

Stand: 15.10.2026. TERMINUS, ausdrücklicher Bauauftrag von Rick. Arbeitsbranch `dev`. Version `0.1.5-alpha.1` nach dem vorhandenen Muster (`0.1.4-alpha.1` → `0.1.5-alpha.1`).

## Ergebnis und Quelle

Neue Dateien: `module/lf4-bezugsquellen.html`, `js/lf4-bezugsquellen.js`. Eigener Speicher-Schlüssel: `verwaltung-ausbildung.lf4-bezugsquellen.v1`.

Lernziel: Nach geklärtem Bedarf eine passende Bezugsquelle anfragen und fehlenden Preis oder fehlende Lieferzeit in einem Angebot erkennen, bevor bestellt wird. Vier Schritte, drei Radio-Fragen, frei erfundenes Beispiel mit Mara im Lindenbogen Büroservice; ausdrücklich als erfunden und nicht als Rechtsberatung gekennzeichnet.

Gelesene Quelle: ausschließlich Dokumentseite 13 der Arbeitskopie `quellen/kmk-rahmenlehrplan-bueromanagement.pdf` (`pdftotext -f 13 -l 13 -layout … -`). Lernfeld 4, „Sachgüter und Dienstleistungen beschaffen und Verträge schließen“, erstes Ausbildungsjahr, 120 Stunden. Verwendeter Ausschnitt: „Sie recherchieren Bezugsquellen unter Verwendung verschiedener Kommunikationswege und Datenquellen. Sie informieren sich über die Inhalte von Angeboten.“ Die Ordner, Anbieter und Angebote sind didaktisch erfunden, keine Angaben aus dem Rahmenlehrplan.

Lösungen: `q1: anfragen`, `q2: preis`, `q3: lieferzeit`. Fortschritt wie in der Vorlage: richtige Antworten plus besuchter Abschluss, geteilt durch vier. Abschluss allein zählt 25 %, gilt aber ohne alle richtigen Antworten nicht als abgeschlossene Lektion. Auswahl wird bereits vor der Prüfung gespeichert. Katalog und gemeinsame Abschlussableitung kennen die neue Lektion.

## Änderungen und Schutz bestehender Inhalte

- `index.html`: Verfügbarkeitstext auf zwei kleine Lektionen in LF4 berichtigt.
- `js/module-daten.js`: neuer Link unter LF4; Startseite und Navigation nutzen denselben Katalog.
- `js/fortschritt.js`: nur neuer Schlüssel und neue Lösungen ergänzt.
- `js/glossar-daten.js`: nur „Bezugsquelle“ ergänzt. „Angebot“ wird wiederverwendet. Alle 15 bisherigen Einträge sind unverändert.
- `js/version.js`: Versionsnummer erhöht.
- `docs/plan-lernplattform.md`: kurzer Ergebnisabsatz mit Belegverweis ergänzt.
- `module/lf4-bedarf.html` und `js/lf4-bedarf.js`: bytegleich zu HEAD, mit Node und SHA-256 geprüft; der bestehende Speicher-Schlüssel wurde nicht verändert. Keine CSS-Datei geändert.

## Selbst im echten lokalen Browser geprüft

Chrome 154 im eigenen, getrennten Headless-Testprofil auf `http://127.0.0.1:8107`. Sichtbare Zustände wurden nach Aktionen mit Browser-Text, Schnappschüssen und Elementprüfung gelesen; ergänzende Prüfungen erfolgten über die lokale Chrome-Debugschnittstelle. Kein persönliches Browserprofil verwendet.

- Startseite: LF4 zeigt zwei verfügbare Lektionen, neuer Link führt zur richtigen Lektion; Version sichtbar.
- LF5 geöffnet: nur „In Kürze“, kein Lektionslink. Ergänzende DOM-Prüfung: LF5 bis LF13 enthalten jeweils null Links auf Lektionen. Die Überschriften bleiben aufklappbar, führen aber nicht zu einer Lektion.
- Leere Prüfung: nennt Aufgabe 1, 2 und 3 als unbeantwortet; Fortschritt 0 %.
- Falsche Antwort „nur Ordner suchen“: konkreter Hinweis auf fehlende Menge, passende Ordner und Freitag; Fortschritt bleibt 0 %.
- Echte Aktualisierung über Chrome `Page.reload`: falsche Auswahl bleibt markiert. Zusätzlich korrekte Auswahl vor dem Prüfen aktualisiert: ebenfalls erhalten. Das Tastenkürzel über das Browserwerkzeug allein löste keinen belegbaren Reload aus; deshalb wurde ausdrücklich `Page.reload` verwendet.
- Richtige Antworten: 25 %, 50 %, 75 %; nach Abschluss 100 %. Startseite zeigt anschließend „2 verfügbar · 1 abgeschlossen“ und das Abschlusszeichen nur an der neuen Lektion.
- Abschluss ohne Antworten: 25 %, aber kein bestandener Abschluss.
- Zurück zum Beispiel und wieder zur Übung: Auswahl bleibt. Zweimaliges Prüfen mit neu ermitteltem Ziel: Antworten, Ergebnis und Fortschritt unverändert. Ein alter Elementverweis war nach dem ersten Prüfen wegen der veränderten Seitenanordnung nicht mehr zuverlässig; die Wiederholung über eindeutige Selektoren war erfolgreich.
- Browserkonsole am Ende der manuellen Folge: keine Meldungen.

Zusätzliche lokale Prüfungen: `node --check` für alle `js/*.js`, `git diff --check`; Node-Assertions für alle neun Antwortoptionen, Fortschrittsmatrix, Abschlussableitung, unveränderte alte LF4-Dateien, unveränderte Glossareinträge und unverfügbare LF5 bis LF13: bestanden.

## Prüfgrenzen und Auftragsgrenzen

Keine unabhängige Prüfung durch GLADOS, kein Screenreader-Test, keine vollständige Tastatur-, Mobil- oder browserübergreifende Abnahme. Kein vollständiger Regressionstest aller bisherigen Lektionen. Keine fachliche oder rechtliche Vollständigkeitsabnahme des gesamten Lernfelds.

Nicht eingebaut: optimale Bestellmenge, Lagerung, Nutzwertanalyse, Tabellenfunktionen, Vertragstypen, AGB, Wareneingang, Skonto oder Vertragsstörungen. Keine Installation, Veröffentlichung, Nachricht an Dennis oder Telegram-Aktion. Kein Commit, Push oder Merge. Keine Änderung an der IT-Ausbildung. ChatGPT hat während dieses Auftrags nicht gestoppt.

Abschlusskontrolle: Testserver und eigener Chrome-Prozess sind gestoppt. `ss -ltn '( sport = :8107 or sport = :9337 )'` zeigt keine offenen Testports. `git diff --check` und alle JavaScript-Syntaxprüfungen waren auch nach den Dokumentationsänderungen erfolgreich. Der Branch ist weiter `dev`; es liegen neun geänderte beziehungsweise neue Projektdateien vor.
