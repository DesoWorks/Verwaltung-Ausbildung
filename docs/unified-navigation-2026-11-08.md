# OPERATION UNIFIED NAVIGATION – UX-Konzept
Stand: 08.11.2026 · Geltung: Luca Berger, Noelle Kranz und Bürgerbüro B01–B04.

## Ziel und gemeinsame Fläche
Die vorhandene Schrittanzeige verbindet die kompakte Personalamt-Optik mit direkten Bürgerbüro-Sprüngen; es entsteht keine dritte oder zusätzliche Navigationsleiste.
Kleine, abgerundete Statusflächen zeigen jeweils Nummer, Bezeichnung und ein sichtbares Statuswort.
Grundlage sind `.rathaus-schritte`: flexible Zeile, automatischer Umbruch, Abstand 0,35rem, Rundung 999px und kompakte Schrift 0,85rem.
Bedienflächen bleiben mindestens 44px hoch; keine unnötig großen, umrandeten Standardbuttons innerhalb der Statusflächen.
Lange Bezeichnungen und Statuswörter dürfen umbrechen und werden nicht abgeschnitten.
Freigeschaltete Flächen sind echte Buttons, mit Tastatur bedienbar und mit sichtbarem Fokus.
Der aktuelle Schritt erhält zusätzlich Unterstreichung, den sichtbaren Zusatz „aktuell“ und `aria-current="step"`; seine Statusfarbe bleibt erkennbar.
Gemeinsame Darstellung und Statusbegriffe nutzen, ohne die unterschiedliche Falllogik umzubauen; eine gemeinsame Komponente nur, soweit ohne solchen Umbau möglich.

## Zustände: Text ist immer sichtbar
| Zustand | Statuswort | Darstellung und Bedeutung |
| --- | --- | --- |
| Offen | „offen“ | Neutral; noch nicht bearbeitet oder bewertet. |
| Bearbeitet | „bearbeitet – noch nicht bewertet“ | Neutral; Eingabe oder fachlich relevante Bearbeitung liegt vor, aber kein aktuelles Urteil. |
| Richtig | „richtig bewertet“ | Grün; ausschließlich ein aktuelles positives fachliches Urteil. |
| Falsch | „noch nicht richtig“ | Rot; Korrektur erforderlich, zusätzlich gestrichelte Kontur wie im Personalamt. |
| Veraltet | „Bewertung veraltet“ | Eigene Warnkennzeichnung mit Symbol ↻ und Text; weder als richtig noch als aktuell falsch ausgeben. |
| Aktuell | Zusatz „aktuell“ | Positionsmerkmal zusätzlich zum fachlichen Zustand, kein eigenes Bewertungsergebnis. |
| Gesperrt | „gesperrt“ | Neutral und deaktiviert; vorhandene Freigabevoraussetzung verständlich benennen. |
Farben allein vermitteln keinen Zustand. Ein geöffneter oder besuchter Schritt ist nicht automatisch richtig.
Bei veränderter Antwort hat „Bewertung veraltet“ Vorrang vor dem früheren Urteil; erneute Bewertung bestimmt den neuen Zustand.

## Personalamt: Ziel jedes Klicks in Luca und Noelle
| Schritt | Unmittelbares Ziel |
| --- | --- |
| 1 – Nachricht lesen | Postansicht mit der Nachricht des aktiven Falls. |
| 2 – Akte öffnen | Aktenansicht des aktiven Falls. |
| 3 – Entscheiden | Vorgangsansicht, Abschnitt Entscheiden und dessen Eingabe. |
| 4 – Begründen | Vorgangsansicht, Abschnitt Begründen und dessen Eingabe. |
| 5 – Antwort schreiben | Vorgangsansicht, vorhandenes Antwortfeld samt relevanter Rückmeldung. |
| 6 – Auswertung | Auswertung des Falls, sobald regulär freigeschaltet; veraltete Ergebnisse klar kennzeichnen. |
| 7 – Abschließen | Abschlussbereich, sobald freigeschaltet; Navigation löst keinen Abschluss aus. |
Für Schritte 3–5 gilt das vorhandene Muster der Auswertungssprünge: Vorgang öffnen, Ziel fokussieren und in den sichtbaren Bereich scrollen, ohne Eingabe oder Neubewertung auszulösen.
Vor jedem Sprung gelten die bestehenden Freigaben; kein Umweg über Schritte 1–4 ist für einen bereits freigeschalteten Schritt 5 nötig.
Der aktuelle Abschnitt muss auch innerhalb der gemeinsamen Vorgangsansicht eindeutig markiert sein.

## Bürgerbüro: bestehende Leiste ersetzen, Sprünge erhalten
Die Chip-Leiste aus `zeichne` bleibt die einzige Schrittnavigation und übernimmt die kompakten Personalamt-Statusflächen statt großer `.knopf`-Umrandungen.
Die vorhandene Zuordnung von Schrittindex und `gehe(i, true)` bleibt erhalten, einschließlich Fokusführung und Speicherung der Position.
Der gelesene Ausschnitt von `gehe` prüft Indexgrenzen, zeigt aber keine fachliche Freigabeprüfung: bestehende Sperren sind beim Anschluss ausdrücklich zu berücksichtigen.
Schrittanzahl und Beschriftungen kommen weiterhin aus dem jeweiligen Fall, nicht aus dem Sieben-Schritte-Schema des Personalamts.
Auch „offen“ wird sichtbar ausgegeben; bislang wird „noch nicht geprüft“ im Chiptext ausgelassen.
Auswertung, Fehlerrücksprünge und Rückkehr zu freigeschalteten Aufgaben bleiben mindestens genauso direkt erreichbar.

## Fortschritt und Bestandsschutz
Bearbeitung und fachliche Richtigkeit getrennt ausweisen, etwa „X von N Schritten bearbeitet“ und „Y von M bewertbaren Aufgaben richtig“.
M zählt nur fachlich bewertbare Aufgaben; Nachricht, Akte und bloße Besuche erhöhen den Richtig-Zähler nicht.
Nur aktuelle positive Bewertungen zählen zu Y; veraltete Gesamtbewertungen dürfen nicht als aktuell bestanden erscheinen.
Reiner Schrittwechsel erhält Antworten und unveränderte Bewertungen. Antwortänderungen entwerten die betroffene Bewertung und gegebenenfalls das Gesamtergebnis.
Gespeicherte Altvorgänge bleiben wiederaufnehmbar; fehlt ein belastbares Urteil, wird kein grüner Erfolg aus Besuchs- oder Bearbeitungsmarkern abgeleitet.

## Abnahmekriterien für die Umsetzung
- Freigeschalteten Schritt 5 anklicken: vorhandenes Antwortfeld und Rückmeldung erscheinen unmittelbar, Eingabe bleibt erhalten.
- Zwischen Schritten und Auswertung wechseln: unveränderte Antworten und Bewertungen bleiben erhalten.
- Bewertete Antwort ändern: betroffene Bewertung erscheint veraltet; bisheriger Gesamterfolg gilt nicht weiter als aktuell.
- Gesperrten Schritt wählen: kein Sprung, keine Freischaltung und kein Abschluss werden ausgelöst.
- Schritt 7 öffnen: nur Abschlussbereich anzeigen; bestehende fachliche Voraussetzungen bleiben wirksam.
- B01–B04 behalten ihre fallabhängigen Schritte, Fehlersprünge, Speicherung und Wiederaufnahme.
- Tastatur, schmale Ansicht und lange Texte: Fokus sichtbar, Status lesbar, Umbruch ohne horizontales Überlaufen.

## Nicht angefasst / Grundlage
Dieses Dokument ändert keinen Anwendungscode, keine Bewertungsregeln, Fallinhalte, Speicherformate oder Abschlussvoraussetzungen und führt keine zusätzliche Leiste ein.
Quellprüfung ausschließlich: `js/rathaus-ui.js` 202–232 und 490–535; `js/rathaus-aufgabenfluss.js` 249–256 und 286–303; `css/rathaus.css` 68–94, 454–455 und 604–611.
Die genannten Prüfungen sind Abnahmekriterien, keine in diesem Konzeptauftrag ausgeführten Funktionstests.
