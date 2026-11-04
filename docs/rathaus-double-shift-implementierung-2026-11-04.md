# DOUBLE SHIFT – Implementierungsbericht (Jarvis)

Stand 04.11.2026. Ausgangs-HEAD der Arbeit: `ab5f2f8`; beim Abschluss lag HEAD auf `ac93c4b` (Planungscommit von Terminus). Alle Produktänderungen unten sind **noch nicht committet**; Commit und ZIP liegen bei Terminus. Windows und NVDA wurden **nicht** geprüft.

## 1. P0 – Reflow

**Ursache des horizontalen Überlaufs (aus Messung mit Chrome-CDP über `file://`, 320/360/400 px):** Kein einzelnes Element, sondern feste Mindestbreiten in Grid-/Flex-Layouts, die bei schmaler Breite nicht schrumpfen konnten:

- `repeat(auto-fit, minmax(<feste rem>, 1fr))` in Rathaus-Rastern erzwang eine Mindestbreite größer als der Viewport.
- `.rathaus-akte` nutzte `1fr` statt `minmax(0, 1fr)`; Inhalt (min-content) weitete die Spalte.
- `fieldset` hat standardmäßig `min-width: min-content`; lange Optionstexte weiteten es.
- Ansichten-/Unterleiste mit festen Spaltenmindestbreiten.
- Lange Wörter in Knöpfen, `summary`, `legend` und Glossarabsätzen ohne Umbruchregel.

**Behebung (gezielt, kein `overflow-x: hidden`):** `minmax(min(100%, X), 1fr)` bzw. `minmax(0, 1fr)`, `fieldset { min-width: 0 }`, `overflow-wrap: anywhere` für Knöpfe/summary/legend/Glossar, `.knopf { box-sizing: border-box; max-width: 100% }`. Mindestgrößen der Bedienelemente blieben erhalten. Dateien: `css/rathaus.css`, `css/styles.css`.

**Nachweis:**
- Emuliertes Viewport (kein echter Zoom): Gesamtmatrix index, glossar, alle module/*.html bei 320/360/400 px mit 150 % Text + größeren Abständen: 41 Seiten, 0 auffällig (Skript `.output/double-shift-jarvis/diag3.cjs`, nicht Teil des Produkts).
- **Echter Browserzoom** (Chrome-Profil `partition.default_zoom_level`, `tests/browser-zoom-cdp.js`): 200 % → innerWidth 640/dpr 2; 400 % → 320/dpr 4; visualViewport.scale 1. Ansichten Stadt, Bürgerbüro, B01, B02, Lehrkraft, je mit und ohne Anzeige 150 %/Abstände: 24 von 24 ohne Überlauf, keine Bedienelemente außerhalb des Fensters (der Skip-Link ist absichtlich ausgenommen).
- Alter Test `rathaus-barrierefreiheit.test.js` verlangte den früheren Präsentationsvertrag (drei feste Spalten, kein `anywhere`). Er prüft jetzt den responsiven Vertrag; CSS-Kommentare werden beim Check von `overflow-x:hidden` ignoriert.

## 2. B01-Regression

Vierte Option „Keine dieser Aussagen trifft zu“, Unterscheidung leer/falsch und Invalidierung bleiben erhalten (Kerntests + `tests/browser-b01-regression-cdp.js`: 9 Checks, alle OK). B01 legt keinen B02-Schlüssel an.

## 3. B02 – Meldebescheinigung für die eigene Person

Fachliche Grundlage: `docs/rathaus-foundation-b02-plan-2026-11-04.md` und `docs/rathaus-double-shift-fachfreigabe-2026-11-04.md`. Enger Eigenantrag Alex Weber, schriftlich, einfache Meldebescheinigung (§ 18 Abs. 1 BMG), kein Gebührenbetrag, Landes-Sonderzuständigkeit nicht bewertet. Keine echte Bescheinigung.

Neue Dateien: `js/rathaus-b02.js` (Kern, Katalog, Auswertung, Speicherbereinigung), `js/rathaus-b02-ui.js` (Oberfläche, Lehrkraftblock), `quellen/bmg-b02-2026-11-04.md` (lokale Quellenkarte).
Geänderte Einhängung (klein): `module/rathaus.html`, `js/rathaus-ui.js`, `js/rathaus-navigation.js` (Modus `fall-b02`), `js/rathaus-buergerbuero.js` (B02 startbar), `js/rathaus-buergerbuero-ui.js` (Karte und Stand lesend).

Verhalten:
- Sechs Bereiche: Anliegen (mit vier Rückfragen), Unterlagen (drei Dokumente, Datenprüfung, Identität), Regeln/Umfang, Vorbereitung, Antwort, Auswertung; Hilfe in drei Stufen, Nachschlagekarte, Lehrkraftansicht.
- Nur strukturierte, vollständig richtige Antwort besteht. Freitext wird gespeichert und angezeigt, nie bewertet („nicht automatisch geprüft“).
- Leer = „offen“, falsch = „noch nicht richtig“; unbekannte Werte sperren. Die Aussagen-Einfachauswahl braucht ausdrücklich „keine“.
- Jede Änderung, auch am Freitext, entwertet die Auswertung.
- Eigener Speicher `verwaltung-ausbildung.rathaus.buergerbuero.b02.v1`, eigener Reset mit Bestätigung. Beim Laden prüft die Bereinigung die rohen Werte vor der Normalisierung: Manipulierte oder veraltete Stände behalten die Daten, verwerfen aber Auswertung und Abschluss (Fix nach Fachreview Terminus).
- B03 bleibt sichtbar „geplant, noch nicht startbar“.

## 4. Tests (tatsächlich ausgeführt)

- `node --test tests/*.test.js`: **243 von 243 bestanden** (vorher 226; 17 neue in `tests/rathaus-b02.test.js`). Drei bestehende Tests wurden angepasst, weil B02 nun startbar ist (`rathaus-buergerbuero(-ui).test.js`, `rathaus-navigation.test.js`).
- `node tests/browser-b02-cdp.js` (echtes Chrome, file://): leer, falsch, Sollpfad mit allen 18 Auswahlen, Freitext-Invalidierung, Abschluss, Neuladen, Speichertrennung zu B01, Manipulation, Reset, Lehrkraft, 320/360/400 px emuliert, keine JS-Ausnahmen: alle OK.
- `node tests/browser-zoom-cdp.js`: 24/24. `node tests/browser-b01-regression-cdp.js`: 9/9.
- Gemeinsamer Helfer `tests/browser-cdp-helfer.js` (eigenes Profil, dynamischer Port, Aufräumen). Browserskripte sind keine `*.test.js` und laufen nicht in `node --test`.
- Personalamt-Sollpfade: bestehende Tests grün; zusätzlich laut Terminus' Browserprüfung (`.output/double-shift-terminus/personal-regression.json`) erfolgreich.

## 5. Grenzen und Abweichungen

- Nur Linux-Chrome headless über `file://`. **Kein** Windows, **kein** Edge, **kein** NVDA, **kein** `http://`.
- Echter Zoom per Chrome-Profil; emulierte Breiten sind davon getrennt ausgewiesen. Kein Pixel-Screenshot-Vergleich.
- Fachliche Abweichungen vom Plan: keine bekannt. Offen bleibt wie freigegeben: Landes-Sonderzuständigkeit nicht bewertet, Q5 blockiert den abgegrenzten Fall nicht.
- Terminus hat die Windows-Anleitung nach Jarvis' Schreibschluss gegen den vollständigen Originalauftrag abgeglichen und auf dessen acht Punkte erweitert. Paketdaten werden im separaten Manifest geführt (kein zirkulärer ZIP-Hash im Archiv). Terminus' eigene HTTP-Start-/Sichtprobe wird separat im gemeinsamen Bericht belegt; sie ist nicht Teil dieser Jarvis-file://-Prüfung.
- Kommentar in `css/rathaus.css` („Kein overflow-x: hidden.“) blieb unverändert; er ist harmlos, der Test ignoriert Kommentare.
- Eigene Prozesse: keine laufen mehr; 43 verwaiste `/tmp/rathaus-ds-*`-Profile aus eigenen Läufen wurden gelöscht. Nichts committet, kein Branchwechsel, kein Push.
