# Unabhängige QA – Navigation Rebuild

**Stand geprüft:** Branch `feature/operation-rathaus-mvp1`, HEAD `8c5483b94965e64502d940c695d0bb128bc3a080` (exakt angeforderter Commit). Projektdateien nicht verändert; kein Commit, keine Installation, keine Anmeldung, kein Providerwechsel. Eigenbelege liegen ausschließlich unter `.output/navigation-glados/`.

## Ergebnis

Im geprüften Umfang keine Fehler festgestellt. Produktiver HEAD blieb während der Prüfung unverändert. Der erste selbst erstellte UI-Check scheiterte an seinen Selektor-/Viewport-Annahmen (das Menü ist natives `details`/`summary`, Chrome-Fensterbreite wurde auf 360 px emuliert). Nach Anpassung lief er erfolgreich; dies war kein Produktfehler.

## Geprüfte Abläufe und Belege

- **Echte Browserbedienung (eigenes headless Chrome-Profil, lokale `file://`-Dateien):** Startseite → Virtuelles Rathaus → Ämtermenü. Geöffnetes Menü zeigte Bürgerbüro, Ordnungsamt, Personalamt, Stadtkasse in alphabetischer Reihenfolge. Bürgerbüro geöffnet, Fall B02 gewählt: Titel „Fall B02: Ein Nachweis über die eigene Meldung“ und Breadcrumbs „Stadtverwaltung → Bürgerbüro → Fall B02“ erschienen; „Zurück zum Bürgerbüro“ führte zurück zur Übersicht, in der B01 und B02 erreichbar blieben. Danach Personalamt geöffnet und dessen Kontext bestätigt.
- **Tastatur:** Lehrkraftschalter fokussiert und mit Enter betätigt; Wechsel in „Lehrkraftansicht – Fall Luca Berger“ beobachtet. Ämtermenü per Enter geöffnet, per Escape geschlossen; Fokus lag anschließend wieder auf `summary` („Ämter: Lehrkraftansicht“). Keine JavaScript-Ausnahmen im UI-Lauf.
- **Speichergrenze der Navigation:** Vor und nach den geprüften Navigationswechseln war der lokaleStorage-Schlüsselbestand identisch: `verwaltung-ausbildung.rathaus.v1`, `verwaltung-ausbildung.uebersicht-aufklappzustand.v1`. Das belegt nur unveränderte Schlüssel, nicht die Inhaltsintegrität der gespeicherten Werte.
- **Automatisierte fokussierte Suite:** `node --test tests/navigation-rebuild.test.js tests/rathaus-navigation.test.js tests/rathaus-barrierefreiheit.test.js tests/rathaus-lehrkraft.test.js tests/rathaus-buergerbuero-ui.test.js` — Exit 0, 78/78 Tests bestanden. Deckt u. a. Ämter-/Praxisweltsortierung, Fallkontext B01/B02, Breadcrumbs/Eltern-Zurück, Lehrkrafttrennung, Fokus und Luca/Noelle-Struktur ab.
- **Echte Browserchecks der vorhandenen Testskripte:**
  - `node .output/navigation-terminus/independent-review.cjs` — Exit 0; Startseiten-Einstieg, Rathaus-Anzeigeeinstellungen, Ämterliste, 1280/320/360/400 CSS-Viewportbreiten mit Text 150 %/Abstand ohne horizontalen Überlauf, keine JS-Ausnahmen. Diese Datei stammt aus dem vorhandenen `.output/navigation-terminus`; Ergebnis daher als vorhandener Referenzlauf, nicht als eigener Beleg behandelt.
  - `node tests/browser-zoom-cdp.js` — Exit 0; 24 Kombinationen bei echtem Browserzoom 200/400 % über Stadt, Bürgerbüro, B01, B02 und Lehrkraft, jeweils zusätzlich mit Anzeige 150 %/Abstand; kein horizontaler Überlauf oder außerhalb liegende Steuerelemente.
  - `node tests/browser-b01-regression-cdp.js` — Exit 0; B01 geöffnet, unbeantwortet/falsch sperren Abschluss, erneute Prüfung nach Änderung erforderlich, keine B02-Speicheranlage, keine JS-Ausnahmen.
  - `node tests/browser-b02-cdp.js` — Exit 0; B02 leer/falsch/richtig, Abschluss und Neuladen, Speicher-/Manipulations-/Resetpfade und 320/360/400 emulierte Breiten bestanden; keine JS-Ausnahmen.
  - `node tests/browser-b02-speicher-cdp.js` — Exit 0; B02 Speicherzustand beim Wiederaufruf, sichtbare Warnung bei verworfenem Rohwert, keine stille Löschung, gezielter Reset und 320/400 px ohne Überlauf.
  - `node .output/navigation-glados/ui-review.cjs` — Exit 0; gezielter UI-/Navigationstest oben dokumentiert. Ergebnisdatei: `.output/navigation-glados/ui-review.json`.

## Grenzen

- Vier Fälle wurden nicht alle als vollständige interaktive Lernabläufe im unabhängigen UI-Lauf manuell durchgespielt. B01/B02 sind durch eigene Browser-Regressionsskripte belegt; Luca/Noelle sind in der fokussierten automatisierten Suite strukturell und bezüglich Fokus/Statusmeldungen abgedeckt. Daher keine Behauptung, alle vier Fälle eigenständig vollständig spielbar getestet zu haben.
- Es wurde kein Speicherinhalt gezielt befüllt und über Navigation hinweg byte-/wertgleich verglichen. Der eigene Browsercheck belegt nur Gleichheit des Schlüsselbestands. Ein vorhandener Terminus-B02-Rohwertvergleich ist separate Drittbeobachtung, nicht eigene Reproduktion.
- Die UI-Interaktion mit den geöffneten nativen Details-Menüs wurde im Desktop-Chrome mit 360 px emulierter Layoutbreite geprüft. Kein vollständiger Reflow-Screenshottest jedes Menü bei jedem Maß.
- Windows, NVDA, andere Browser und echte Touchgeräte wurden nicht geprüft. Keine entsprechenden Erfolgsbehauptungen.
- Die unabhängige Übereinstimmung mit der IT-Ausbildung als Referenzprojekt wurde nicht in diesem Prüflauf erneut untersucht; kein vollständiger Inhalts-/Fachrichtigkeitstest.
