# Windows-Testanleitung: Rückmeldelichter

Diese Anleitung ist kein bestandener Test. Sie wurde nicht ausgeführt; weder ein Browser noch NVDA liefen dafür.

## Vorbereitung

1. Arbeitskopie `Verwaltung-Ausbildung-rathaus-refit` auf dem Branch `feature/verwaltung-rathaus-refit-a-2026-11-06` öffnen. Der Stand ist lokal committet, nicht gepusht.
2. `module/rathaus.html` über den üblichen lokalen Server oder die Startdatei öffnen. Für jeden Fall im Browser die Entwicklerkonsole öffnen (F12) und auf Fehler achten.

## Ablauf je Fall (B01, B02, B03, B04, Luca, Noelle)

1. Neu beginnen (Zurücksetzen). Antworten ankreuzen, aber noch nicht auswerten. Erwartung: keine Rahmen, keine Symbole, kein "Relevante Antwort fehlt".
2. "Auswertung prüfen" drücken. Erwartung: jeder Frageblock hat einen grünen oder roten Rahmen mit Hinweiszeile; ✓ / ✕ und Text stehen an den Antworten.
3. Prüfen: falsch gewählte Antwort rot mit ✕; richtige, nicht gewählte Antwort grün mit "Relevante Antwort fehlt"; nicht gewählte falsche Antworten neutral.
4. Eine Antwort in einem Block ändern. Erwartung: nur dieser Block zeigt "Bewertung veraltet" (gestrichelt, ohne Grün/Rot), die anderen Blöcke bleiben markiert.
5. Erneut auswerten. Erwartung: der geänderte Block wird wieder bewertet.
6. Seite neu laden (F5). Erwartung: gleiche Markierungen wie vorher. Danach Antwort ändern, speichern lassen, neu laden: der geänderte Block zeigt keine alte Markierung.
7. Zurücksetzen. Erwartung: alle Lichter weg, Eingaben leer.
8. Mehrere Blöcke in einem Schritt kontrollieren (B03 Schritt mit mehreren Fragen).
9. Freitext (Antwortentwurf, Brief) darf nie grün oder rot markiert sein.

## Darstellung

- Dunkelmodus, hoher Kontrast und große Schrift in den Anzeige-Einstellungen nacheinander einschalten: Symbole, Text und Rahmenart (durchgezogen, doppelt, gestrichelt) müssen auch ohne Farbe unterscheidbar sein.
- Windows-Kontrastmodus (Alt+linke Umschalt+Druck): Rahmen bleiben sichtbar.
- Zoom 200 %: nichts abgeschnitten, keine feste Höhe.

## Tastatur und Screenreader

- Nur mit Tab, Pfeiltasten und Leertaste auswerten und Antworten ändern; der Fokusrahmen bleibt sichtbar.
- NVDA: Der Hinweis "Frageblock richtig/nicht richtig" und die Texte "Richtig ausgewählt", "Falsch ausgewählt", "Relevante Antwort fehlt" müssen vorgelesen werden. Die Symbole sind für Screenreader ausgeblendet, der Text trägt die Aussage. Ergebnis hier eintragen: noch nicht geprüft.

## Zu melden

Abweichungen mit Fall, Schritt, Frageblock, Browser und Anzeigemodus.
