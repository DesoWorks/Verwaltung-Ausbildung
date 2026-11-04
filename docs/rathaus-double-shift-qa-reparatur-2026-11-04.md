# DOUBLE SHIFT – QA-Nachkorrektur: sichtbarer Hinweis bei defektem B02-Speicherstand

Stand: 04.11.2026 · Basis-HEAD `d12af6f81c851861543fd8e432f40785a477439c` · Autor: JARVIS (nicht committet, Commit durch Terminus)

## Befund (GLaDOS)

B02-Speicher `{broken`, danach Neuladen: Landung auf der Bürgerbüro-Übersicht, B02 dort „noch nicht begonnen“, keine Meldung. Der Rohwert bleibt im Speicher.

## Ursache (gelesen, reproduziert)

- `RATHAUS_B02.bereinigeGespeichert` (`js/rathaus-b02.js`) liefert für defektes JSON, Nicht-Objekte, falschen Fall/Bewertungsstand und unbekannte Werte korrekt `verworfen: true` ohne Abschluss und ohne Auswertung. Die Fachlogik war richtig.
- Die Übersicht (`zeichneUebersicht` in `js/rathaus-buergerbuero-ui.js`) las diesen Zustand nur über `standTextB02()`, die ausschließlich einen Statustext zurückgab. Das Flag `verworfen` ging dabei verloren.
- Ein Neuladen landet immer auf der Übersicht (der Fallmodus wird nicht gespeichert). Dort konnte der Hinweis also nie erscheinen.
- Die Fallansicht (`js/rathaus-b02-ui.js`) zeigte `verworfen` nur versteckt im Auswertungsbereich und mit dem für defektes JSON unpassenden Satz „Deine Eingaben bleiben“.

Mit dem HEAD ohne Fix reproduziert: neuer Browsertest schlägt bei „Übersicht zeigt sichtbaren Hinweis zu B02“ fehl (kein Hinweistext).

## Änderung (klein, keine Fachregel geändert)

1. `js/rathaus-buergerbuero-ui.js`: `standTextB02()` ist jetzt ein Wrapper um die neue `zustandB02()`, die Text und Flag `verworfen` liefert. Die Übersicht zeigt bei `verworfen` einen sichtbaren Absatz `#b02-verworfen-hinweis` (`role="status"`) über der Fallübersicht. Es wird nur gelesen, nie geschrieben oder gelöscht.
2. `js/rathaus-b02-ui.js`: Beim Öffnen des Falls steht ein Hinweis `#b2-verworfen-hinweis` (`role="status"`) unter der Fehlerzeile. Er ist nur sichtbar, solange `modell.verworfen` gilt, und verschwindet nach erneutem Prüfen oder Zurücksetzen (bestehendes Verhalten von `pruefen`). Der bisherige Hinweis im Auswertungsbereich bleibt.

Hinweistext Übersicht: „Hinweis zu Fall B02: Der gespeicherte Stand konnte nicht gelesen werden oder passt nicht mehr zur aktuellen Bewertung. Es wird kein alter Abschluss und keine alte Auswertung übernommen. Es wurde nichts gelöscht; beim nächsten Speichern oder über „Fall B02 zurücksetzen“ im Fall wird der alte Stand ersetzt.“

Keine Datenlöschung ohne Reset: der Rohwert bleibt nach Neuladen und nach reinem Ansehen unverändert (im Test geprüft).

## Tests

Neu: `tests/browser-b02-speicher-cdp.js` (echter Chrome über `file://`, kein node:test). Weg: `index.html` → Link „Virtuelles Rathaus“ → Bürgerbüro → Fall B02 → defekter Speicher `{broken` → echtes Neuladen. Geprüft: Übersicht mit sichtbarem Hinweis und `role=status`; B02 weiter „nicht begonnen“; Rohwert erhalten; Fallansicht mit Hinweis und gesperrtem Abschluss; Reset entfernt Schlüssel und Hinweise; weitere verworfene Rohwerte (`"text"`, `[]`, falscher Bewertungsstand mit `abgeschlossen:true`) zeigen Hinweis und keinen Abschluss; sauberer Start ohne Hinweis; kein horizontaler Überlauf mit Hinweis bei 320/400 px (Viewport-Emulation, kein echter Zoom); keine JavaScript-Ausnahmen. Hinweis: Die sichtbaren Statuswörter werden per CSS großgeschrieben, deshalb vergleicht der Test unabhängig von der Schreibung.

Ergebnisse (alle in dieser Sitzung ausgeführt):

- `node tests/browser-b02-speicher-cdp.js` – alle Checks bestanden; gegen den unveränderten HEAD-Export (`/tmp/double-shift-jarvis-rot`) schlägt er wie erwartet fehl.
- `node --test tests/*.test.js` – 243/243 bestanden.
- `node tests/browser-b02-cdp.js` – bestanden.
- `node tests/browser-b01-regression-cdp.js` – bestanden.
- `node tests/browser-zoom-cdp.js` – 200 %/400 % bestanden.

## Grenzen

- Der Hinweis in der Übersicht bleibt, bis der Rohwert ersetzt oder per B02-Reset entfernt wird (bewusst; kein stilles Löschen).
- Der Fallhinweis ist nur im UI-Test über Browser abgesichert, nicht in einem Kernel-Test; die Zoom-Matrix wurde nicht um den Hinweis erweitert.
- Manuelle Screenreader-Prüfung nicht durchgeführt; `role=status` ist gesetzt.
- Nicht committet. ZIP-Regeneration durch Terminus. Keine fremden Dokumente verändert; temporärer Export nur unter `/tmp/double-shift-jarvis-rot`.

## Geänderte Dateien

- `js/rathaus-buergerbuero-ui.js`
- `js/rathaus-b02-ui.js`
- `tests/browser-b02-speicher-cdp.js` (neu)
- `docs/rathaus-double-shift-qa-reparatur-2026-11-04.md` (neu)
