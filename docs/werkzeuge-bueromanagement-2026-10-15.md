# Werkzeuge für Kaufmann / Kauffrau für Büromanagement

Stand: 15.10.2026, 20:40 Uhr Stationszeit. Prüfung, kein Einbau.

## Grenze

Ein Werkzeug kommt nur hinein, wenn es eine Tätigkeit dieses Berufs übt, ohne Konto und ohne Kosten nutzbar ist und mit Tastatur bedienbar bleibt oder eine gleichwertige Textalternative hat. Quelle der Grenze: `docs/plan-lernplattform.md`, Abschnitt Werkzeuge.

Die Plattform hat den Platz schon. `js/module-daten.js` setzt `MODULE_TOOLS` auf eine leere Liste. `js/navigation.js` zeigt „Tools & Nachschlagen“ erst, wenn dort ein Eintrag steht. Heute gibt es kein Werkzeug. Die Lektionen üben nur mit Multiple Choice.

## Was der Beruf wirklich verlangt

Rahmenlehrplan, Arbeitskopie `quellen/kmk-rahmenlehrplan-bueromanagement.pdf`, Dokumentseiten 12 und 13, gelesen mit `pdftotext`:

- Lernfeld 3: Preisberechnung mit einem Tabellenkalkulationsprogramm. Aufbau und Formatierung von Tabellen, einfache Funktionen und Formeln, Zelladressierung. Kaufmännische Rechenarten: Dreisatz und Prozentrechnen.
- Lernfeld 3: Textverarbeitung für Formulare, Textbausteine und eingebundene Objekte. Kopieren, Drucken, Scannen, Dateiformate.
- Lernfeld 4: Diagramme in der Tabellenkalkulation für Bestellmenge und Lieferzeitpunkt.
- Lernfeld 4: Anfragen und Vertragsformulierungen mit einem Textverarbeitungsprogramm.
- Lernfeld 4: Nutzwertanalyse in der Tabellenkalkulation mit WENN, ZÄHLENWENN, SUMMEWENN und SVERWEIS.

Die Prüfung stützt das. Die IHK Köln nennt für Teil 1, Prüfungsbereich Informationstechnisches Büromanagement, eine Befehlsübersicht für Textverarbeitung und Tabellenkalkulation. Taschenrechner sind in Teil 1 nicht erlaubt. Quelle: https://www.ihk.de/koeln/hauptnavigation/ausbildung/ausbildungsthemen-von-a-bis-z/musteraufgaben-abschlusspruefung-kaufleute-bueromanagement-5234240

Die AkA veröffentlicht die Befehlsübersicht als PDF: https://www.ihk-aka.de/fileadmin/AkA/kbm/bu_bm_t1_6364.pdf (verlinkt von https://www.ihk-aka.de/aktuelles/kbm). Die Datei ist nicht barrierefrei. Am 15.10.2026 gelesen: Textverarbeitung nennt Formularfeld, Kontrollkästchen, Autotext und Serienbrief. Tabellenkalkulation nennt unter anderem SUMME, SUMMEWENN, SVERWEIS, WENN auch verschachtelt, ZÄHLENWENN und Diagramme. Allgemeine Rechenarten: Dreisatz, Durchschnitt, Prozentberechnung. Das deckt sich mit den Lernfeldern 3 und 4. Die Übersicht ist Beleg, kein Einbau.

## Empfehlung, in dieser Reihenfolge

1. Kaufmännischer Rechner. Dreisatz, Prozent, Skonto. Die Lektion `lf3-preis` fragt die Rechnung nur als Auswahl. `lf4-rechnung` fragt, ob Skonto genutzt wird, lässt aber nicht rechnen. Ein Rechner mit Eingabe, Zwischenschritt und Ergebnis macht genau diese Übung besser. Ohne Konto, ohne Kosten, mit Tastatur bedienbar. Das ist der erste Einbau, wenn Dennis ihn freigibt.

2. Kleine Tabellenkalkulation. Wenige Zellen, Summe, Prozent, WENN, SVERWEIS, ein einfaches Diagramm. Der Plan nennt diese Funktionen wörtlich in Lernfeld 4. Ein eingebettetes Office-Programm wäre Kontozwang oder Kosten. Eine eigene kleine Tabelle in der Seite bleibt ohne Konto. Das ist der zweite Einbau, nach dem Rechner, weil er mehr Oberfläche braucht.

3. Textbaustein- und Formularübung. Kein Word-Klon. Eine Vorlage, austauschbare Bausteine, sichtbare Normfelder. Der Plan verlangt Formulare und Textbausteine in Lernfeld 3 und die Anfrage in Lernfeld 4. Die Lektionen `lf3-textbausteine` und `lf4-anfrage` wählen nur die richtige Aussage. Eine kleine Zusammensetzung wäre die bessere Übung. Erst nach dem Rechner.

4. Nutzwerttabelle. Kriterien, Gewichte, Punkte, Summe. Der Plan nennt die Nutzwertanalyse in Lernfeld 4. Das ist eine Tabelle mit festen Spalten, kein allgemeines Office. Passt zu Punkt 2, nicht als eigenes Programm.

## Nicht einbauen

- Ein echtes Textverarbeitungs- oder Tabellenprogramm. Konto oder Kosten, und die Prüfung verlangt die Befehle, nicht eine bestimmte Marke.
- E-Mail, Terminplaner, Scanner, Kopierer. Der Plan nennt sie, aber sie brauchen Geräte oder ein Konto. Eine Lektion erklärt die Entscheidung. Ein Werkzeug würde das Gerät vortäuschen.
- Taschenrechner als einziges Werkzeug. In Teil 1 der Prüfung ist er nicht erlaubt. Unser Rechner soll den Rechenweg zeigen, nicht nur eine Zahl.

## Nicht in diesem Auftrag

Kein Einbau. Keine Änderung an `MODULE_TOOLS`. Kein Commit.
