# DOUBLE SHIFT – Terminus: Fachreview und eigene Prüfnachweise

04.11.2026 · Produktstand `d12af6f81c851861543fd8e432f40785a477439c`, Branch `feature/operation-rathaus-mvp1`. Eigenprüfung, nicht als unabhängige GLaDOS-QA ausgegeben.

## Fachliche Prüfung und Korrekturzyklus

B02 gegen verbindlichen Foundation-Fachplan und Ergänzungsfreigabe gelesen: Akte, fünf Bereiche, Daten/Identität, §18 BMG, Gebührenvorbehalt, strukturiertes Antwortgerüst, keine fachliche Freitextbewertung. Keine unbelegte Sonderzuständigkeit, keine echte Bescheinigung. Der erste Loader normalisierte unbekannte Rohwerte vor der Prüfung; damit konnte ein manipuliertes gespeichertes Bestehen erhalten bleiben. Reproduktion mit Sollantwort+unbekannter Regel bestätigt. Jarvis reparierte Rohprüfung vor Normalisierung; eigenständige Assertions und neuer Regressionstest bestätigen `verworfen=true`, keine Auswertung/kein Abschluss. Keine Bewertungsregel gelockert.

CSS-Test erwartete veraltet drei starre Spalten und verbot den für Reflow jetzt nötigen Umbruch. Test **und** CSS gelesen, Vertrag anhand Commander-Anforderung angepasst (Jarvis). Derselbe Gesamtbefehl danach erfolgreich. Die fachlichen alten Tests wurden nicht zur Beschönigung entfernt; drei Startbarkeitserwartungen wurden gezielt von B02-geplant auf B02-startbar geändert.

## Ausgeführte Prüfungen

Nachweise unter `.output/double-shift-terminus/` (bewusst untracked). Die individuellen Skripte sind lokale Zusatzprüfungen, keine erforderlichen Laufzeitdateien. Die Produkt-Browserskripte liegen versioniert in `tests/`.

| Prüfung | Befehl / Nachweis | Ergebnis |
|---|---|---|
| Gesamtsuite inkl.17 neuer B02-Tests | `node --test tests/*.test.js`, auch `verify_run` nach Commit | **243/243**, Exit0 |
| B02 Browser, direkt file:// | `node tests/browser-b02-cdp.js` → `b02-final.log` | alle Checks erfolgreich; echter UI-Erfolg, leer/falsch, Änderungen, Reload, Manipulation, Reset, Lehrkraft, 320/360/400 |
| B01 Browser | `node tests/browser-b01-regression-cdp.js` → `b01-final.log` | 9/9; zusätzlich `b01-regression.cjs` 7/7 inkl. tatsächlich vollständigem Abschluss, falsch/leer und Freitextinvalidierung |
| Browserzoom | `node tests/browser-zoom-cdp.js` → `zoom-final.log` | **24/24**, 200/400%, mit/ohne150%Text+Abstand, Stadt/Bürgerbüro/B01/B02/Lehrkraft |
| Echte Zoomverifikation | `zoom-probe.cjs` → `zoom-probe.json` | outerWidth1280, innerWidth1280/640/320, DPR1/2/4, visualViewport.scale1: echter Layoutzoom, kein Pinch-/Viewportersatz |
| Personalamt direkt file:// | `personal-regression.cjs` → JSON | **5/5**, Luca und Noelle über Formularaktionen bis gespeichertem Abschluss, keine Laufzeitausnahmen |
| Eigene B02-UI-Stichprobe file:// | `b02-browser-review.cjs` → JSON | **12/12**, zusätzlicher falscher Baustein sperrt, Daten bei Fallwechsel erhalten, nur eigener Reset, kein Lernansicht-Muster |
| Eigener B02-Fachkern | `b02-kern-review.cjs` → JSON | **68 Assertions**, jedes Pflichtfeld fehlt/falsch/unbekannt, falsche Extras und manipuliertes Laden |
| B02 Reflow-Zusatzmatrix | `b02-reflow-review.cjs` → JSON | **10 Kombinationen**,320/360/400 sowie echte200/400, Standard/150%+Abstand; kein Seitenüberlauf, Controls innerhalb |
| B02 Tastatur/Anzeige | `b02-a11y-review.cjs` → JSON | **6/6**, echte Pfeiltasten-Auswahl, Ergebnisfokus, Labels/Legenden, vier globale Einstellungen und Persistenz |
| Syntax/gezielter statischer Scan | `static-review.cjs` → JSON, `git diff --check` | sechs JS-Syntaxchecks; keine gefundenen Tokenmuster, B02-DOM/Netz-Risikomuster oder fehlenden Rathaus-Ressourcen |
| HTTP separat | `http-smoke.cjs` → JSON/PNG; HTTP200 | B02 startbar/gerendert, keine JS-Ausnahme. Nur Start-/Sichtprobe, kein kompletter HTTP-Falltest |
| Paketprüfung | `package-windows.py`, `package-smoke.cjs`, `sha256sum` | 132 versionierte Dateien bytegleich zum Produktcommit, ZIP-CRC grün, Start der extrahierten Kopie unter Linux-Chrome file:// erfolgreich |

Die visuellen Ausschnitte `p0-b01-zoom400.png` und `b02-http-desktop.png` wurden zusätzlich gesichtet: sichtbare Titel/Navigation nicht horizontal abgeschnitten; kein Anspruch auf vollständige Sichtabnahme aller Scrollpositionen. Der 400%-Ausschnitt zeigt nur die umgebrochene B01-Überschrift, nicht die unterhalb liegenden Knöpfe. Das ersetzen die Mess-/Interaktionstests nicht pauschal.

Jarvis' zusätzliche 41-Seiten-Messreihe (320/360/400+150%/Abstand) ist im Implementierungsbericht als **sein** Nachweis benannt; Terminus hat diese komplette Reihe nicht eigenständig wiederholt.

## Testumgebungsfehler bei Paketprüfung

Eine eigene entpackte Paketkopie unter `.output/` wurde vom rekursiven Testscanner in `tests/anzeige-lesen.test.js:12–24` mitgezählt: 90 statt45Navigationsseiten, 242/243. Scanner **und** Paketskript gelesen. Korrektur ausschließlich an eigener Testumgebung: entpackte Kopie nach `/tmp/terminus-double-shift-package-lori7m5k/RATHAUS-DOUBLE-SHIFT` verschoben; Produkt und Tests unverändert. Exakt derselbe `verify_run`-Befehl anschließend **243/243**. Eigene künftige Pakete außerhalb des Checkout entpacken. ZIP unverändert, Fremddateien unberührt.

## Grenzen

**Windows/Edge nicht ausgeführt. NVDA nicht ausgeführt.** Echtes Linux-Chrome, Browser- und Dateiprüfung getrennt von diesen offenen Umgebungsabnahmen. Keine pauschale WCAG-Zertifizierung. `localStorage` bei file:// bleibt browser-/profil-/pfadabhängig; Lehrkraftansicht kein Zugriffsschutz. Fachliche Landesrechtslücke im freigegebenen Umfang bewusst nicht bewertet. Der temporäre HTTP-Server wurde beendet; kein dauerhafter Server notwendig.

## Nachkorrektur nach unabhängiger Erst-QA

GLaDOS fand auf d12af6f den fehlenden sichtbaren Hinweis in der Bürgerbüroübersicht bei defektem B02-Speicher. Jarvis änderte ausschließlich beide UI-Dateien (29Zeilen hinzu/7entfernt), ergänzte `tests/browser-b02-speicher-cdp.js` und Reparaturdoku. Keine Fachregel geändert. Neuer Produktcommit **`7baddf109d7080d758598b4029dbd3ed2b8fcc45`**. Terminus las Implementierung und neuen Test, prüfte den gesamten neuen file://-Ablauf inkl. sichtbarem Status, Rohwerterhalt, Reset, alten/Nichtobjekt-Ständen und Reflow320/400: alle Checks grün; Suite weiterhin243/243. Ein zwischenzeitlicher Testfehler war Großschreibung von `innerText` durch CSS, nicht fehlender Status; Test nach Lesen von CSS/Test/UI auf schreibungsunabhängigen Vergleich korrigiert, derselbe Befehl grün.

Finales ZIP neu aus **7baddf1** erstellt: **133** versionierte Dateien bytegleich, zwei Starter/Metadaten-Dateien zusätzlich. **453809Byte**, SHA-256 **cd00f6c1ab9bd1988566e289c98b647ee2f5baf8c058e892e016596fa3e6a647**. `package-smoke.cjs` und `final-artifact-check.py` erneut grün. Extrahierte Testkopie außerhalb des Checkout: `/tmp/terminus-double-shift-package-zrt15f_q/RATHAUS-DOUBLE-SHIFT`. Frühere Paketwerte oben beschreiben den Erststand, nicht die finale Empfehlung. GLaDOS-Nachprüfung ist separat dokumentiert; Windows/NVDA bleiben offen.

Sichtprüfung der Nachkorrektur zusätzlich: `b02-storage-hint-400.png` zeigt den vollständigen umgebrochenen Speicherhinweis ohne horizontales Abschneiden. Trotz angeforderter Fensterbreite400 meldete Chrome hier485CSS-Pixel (Mindestfensterbreite); **diesen Screenshot nicht als400px-Test ausgeben**. Die tatsächlichen320/400px-Messungen stammen aus dem expliziten Viewport-Test im neuen Regressionstest.
