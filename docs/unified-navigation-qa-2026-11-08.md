# Statische QA – OPERATION UNIFIED NAVIGATION

**Prüfdatum:** 8. November 2026  
**Projektstand:** laut Auftrag Worktree `Verwaltung-Ausbildung-rathaus-refit`, Branch `pre-dev/verwaltung-aktuell`, nicht committet. Die konkrete HEAD-ID und der Diff wurden in dieser Teilprüfung nicht verifiziert.  
**Umfang:** Statische Prüfung von `js/rathaus-schrittleiste.js`, den Funktionen `schrittStatus`, `geheZuSchritt` und `fortschritt` in `js/rathaus-ui.js`, dem Chip-Ersatz in `js/rathaus-aufgabenfluss.js`, den Schritt-Pillenregeln in `css/rathaus.css` sowie den vier abschließenden Tests in `tests/rathaus-barrierefreiheit.test.js`. Keine Anwendung ausgeführt.

## Befunde

### Beobachtet

1. **Freigeschaltete und gesperrte Elemente:** `rathaus-schrittleiste.js` zeichnet jeden Eintrag als `<button>`. Bei `gesperrt` wird der native Button deaktiviert; der Personalamt-Status setzt Schritte 3–7 auf gesperrt, solange `state.gelesen` falsch ist (`rathaus-ui.js:243–255`). Der Test prüft Schritt 5 in diesem Zustand (`rathaus-barrierefreiheit.test.js:365–372`). Für Bürgerbüro erzeugt die neue gemeinsame Leiste die anklickbaren Buttons und übergibt deren Index an den vorhandenen Sprung `gehe(i, true)` (`rathaus-aufgabenfluss.js:288–295`, vollständiger Aufruf in der gelesenen Datei). Die Navigation im Bürgerbüro bleibt damit auf statischer Codeebene direkt.

2. **Antwort bleibt beim Sprung erhalten:** Schritt 5 führt auf `antwort-text`; `geheZuSchritt` ändert keine Antwortdaten und löst keine Eingabe- oder Bewertungsfunktion aus (`rathaus-ui.js:265–291`). Beim Ansichtswechsel wird der bestehende Zustand gespeichert. Der abschließende Test vergleicht den gespeicherten Antworttext vor und nach dem Sprung (`rathaus-barrierefreiheit.test.js:351–363`).

3. **Geänderte Antwort wird nicht weiter als richtig geführt:** Die Eingabeänderung setzt `letzteAuswertung` auf `null`, setzt `eingabenGeaendert` und zeichnet die Schrittleiste neu (`rathaus-ui.js:703–720`). Der Schrittstatus fällt dadurch auf „Bewertung veraltet“ (`rathaus-ui.js:221–239`); die Gesamtauswertung erscheint ebenfalls als veraltet (`rathaus-ui.js:248–255`). Der Abschlussknopf hängt an `letzteAuswertung.darfAbschliessen` und wird nach dem Entwerten deaktiviert (`rathaus-ui.js:646–680`). Der neue Test deckt für Schritt 5 eine vorher falsche, dann geänderte Antwort ab und bestätigt Invalidierung, nicht aber explizit den Übergang von vorher *richtig* zu veraltet (`rathaus-barrierefreiheit.test.js:374–386`).

4. **Unbekannte Bürgerbüro-Statusworte:** `ausStand` ordnet nicht erkannte Begriffe dem neutralen Status `offen` zu und erhält den Originaltext (`rathaus-schrittleiste.js:32–43`). Der abschließende Test prüft einen unbekannten Begriff (`rathaus-barrierefreiheit.test.js:388–398`).

5. **Abschlusslogik:** Im Personalamt wird der Abschlussbutton ausschließlich durch `state.letzteAuswertung.darfAbschliessen === true` freigegeben; sein Klick prüft diese Voraussetzung nochmals (`rathaus-ui.js:646–680`). Das ist statisch mit der geforderten Bindung an `darfAbschliessen` vereinbar. Die darunterliegende fachliche Abschlusslogik wurde hier nicht erneut geprüft.

6. **Eine sichtbare Schrittleiste:** In `rathaus-aufgabenfluss.js` wird die bisherige Segmentleiste `.aufgabenfluss-leiste` weiterhin erzeugt, aber mit `aria-hidden="true"` versehen (`rathaus-aufgabenfluss.js:149–151`); die sichtbare Navigation wird als gemeinsame Leiste unter `.aufgabenfluss-nav` aufgebaut. Personalamt zeigt die Leiste im separaten Fortschrittscontainer, Bürgerbüro die Leiste des Aufgabenflusses. Die HTML-Seite enthält diesen Fortschrittscontainer nur einmal (`module/rathaus.html:30`). Statisch ist daher keine zweite **sichtbare** Schritt-Navigation erkennbar.

### Vermutung / Testgrenze

- Die vier neuen Tests betreffen Schritt-Sprung, Sperrung, veraltete Antwortbewertung und neutrale Behandlung unbekannter Statusworte. Sie prüfen nicht eigenständig, dass die Bürgerbüro-Auswertung nach direkter Navigation erreichbar bleibt, dass Fallantworten beim Sprung unverändert bleiben oder dass `darfAbschliessen` nach Sprüngen weiterhin die einzige Freigabe ist. Der Codepfad lässt diese Eigenschaften plausibel erscheinen; als durch diese vier Tests nachgewiesen sind sie nicht zu bezeichnen.
- Im Personalamt sind Schritte 3–7 nach dem Lesen freigeschaltet, auch wenn einzelne davorliegende Schritte nicht bearbeitet wurden (`rathaus-ui.js:243–255`). Das entspricht der ausdrücklichen Freigabe „jeder bereits freigeschaltete Schritt direkt“ und lässt die einzige erkennbare Sperre (vor dem Lesen) bestehen. Ob die Freischaltregel fachlich exakt gewollt ist, wurde nicht eigenständig beurteilt.

## Nicht geprüft

- Browser, Server, Darstellung und Verhalten im laufenden Rathaus.
- Windows, Firefox und NVDA.
- Tastatur- und Screenreader-Bedienung in einer echten Browserumgebung.
- Speicherung/Wiederaufnahme und Abschlussablauf als durchgespielte Nutzerabläufe.
- Vollständiger Git-Diff, HEAD-ID und Versionszuordnung.
- Gesamte Bürgerbüro-Falllogik; die vom Lead genannte Testmessung (524 bestanden, 0 fehlgeschlagen) wurde nicht selbst ausgeführt und ist kein Ergebnis dieser Prüfung.

## Kurzurteil

In den gelesenen Implementierungen sind die angefragten Kernmechanismen statisch erkennbar: Buttons mit nativer Sperre, direkter Schrittwechsel ohne Antwortmutation, Entwertung geänderter Antworten, neutrale Behandlung unbekannter Statusworte und Abschlussfreigabe über `darfAbschliessen`. Ein Laufzeitnachweis ist dies nicht. Browser, Windows, Firefox und NVDA bleiben ungeprüft.
