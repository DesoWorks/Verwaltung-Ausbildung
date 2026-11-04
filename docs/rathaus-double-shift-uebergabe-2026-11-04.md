# Operation RATHAUS – DOUBLE SHIFT: gemeinsame Übergabe

04.11.2026 · Terminus (Fachplanung/Review/Zusammenführung), Jarvis (Implementierung), GLaDOS (unabhängige QA separat dokumentiert).

## Ergebnis und Git

Projekt `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`, Branch **`feature/operation-rathaus-mvp1`**. Bestätigter Ausgangsstand `ab5f2f865d142d1df66d91412e2b2fea6215f806`; getrackter Arbeitsbaum vorher sauber. Die schon vorhandenen untracked `.output/` und `docs/uebergaben/` wurden nicht eingecheckt oder aufgeräumt.

Lokale Commits dieses Auftrags:

1. `ac93c4b85b839f0ebbfd8a0f53990a9a7b9da6e6` – B02-Fachfreigabe, B03-Fach-/Bildschirmplan, Architektur und Abnahmematrix.
2. **`d12af6f81c851861543fd8e432f40785a477439c`** – vollständig implementierter und eingefrorener Produkt-/Teststand, Reflow und B02 einschließlich aktualisierter Anleitung.
3. **`7baddf109d7080d758598b4029dbd3ed2b8fcc45`** – gezielte QA-Nachkorrektur: verworfenen B02-Speicher in Übersicht und Fall sichtbar erklären; Browserregression ergänzen. **Finaler Produkt- und Paketstand.**

Der abschließende Dokumentationscommit enthält diesen Bericht und die QA-Nachweise; seine eigene ID wird im Abschluss neben diesem Dokument angegeben. Er ändert keinen Produktcode. **Finales ZIP und Nachprüfung beziehen sich ausdrücklich auf `7baddf1…`, die Erstprüfung auf `d12af6f…`, nicht auf einen späteren Dokumentations-HEAD.**

Keine Pushes, Merges, Deployments oder Produktionsfreigabe. Keine Änderungen am IT-Ausbildung-Repository. Terminus allein führte lokale Git-Schreiboperationen aus. Zum Abschluss bleiben nur `.output/` (bereits vorhanden plus eigene neue Prüf-/ZIP-Artefakte) und fremde `docs/uebergaben/` untracked; keine getrackten Produktänderungen offen. Temporäre Chrome-Prozesse sowie der eigene HTTP-Server sind beendet.

## Umgesetzt

### Reflow

Ursachen: nicht schrumpfende Mindestbreiten in Grid/Flex/Fieldset, min-content-Spalten, lange unteilbare Bezeichnungen und content-box-Breiten. Gezielte Korrektur in `css/rathaus.css` und `css/styles.css`: schrumpfbare Raster/Fieldsets, sinnvoller Wortumbruch und korrekte Knopfbreiten. Kein kaschierendes `overflow-x:hidden`, bedienbare Mindestgrößen erhalten.

### Bürgerbüro B02

Eigenständiger lokaler Fall **Alex Weber – Meldebescheinigung für die eigene Person**: Gespräch mit Rückfragen, drei fiktive Unterlagen, vier Datenabgleiche, Identität, Umfang/Recht, Vorbereitung, strukturierte Antwort, fünf differenzierte Bewertungsbereiche, gestufte Hilfen/Karte und fallbezogene Lehrkraftansicht. Eigener Speicher mit gezieltem Reset; Übersicht und Navigation integriert. Keine echte Bescheinigung, Übermittlung oder erfundene Gebühr. Freitext ausdrücklich nicht automatisch bewertet.

Richtige Vollantworten abschließbar; leer/unvollständig/falsch/ungültig gesperrt. Jede Änderung inkl. Freitext invalidiert. Manipulierte/alte Auswertungen werden beim Laden nicht als grün übernommen. Ein während des Reviews reproduzierter Loaderfehler wurde vor dem Produktcommit korrigiert und regressionsgeprüft.

B01 behält seine ausdrückliche vierte Einfachauswahl und Widerspruchsprüfung. Luca/Noelle-Fachkerne wurden nicht umgebaut. B03 bleibt sichtbar **„geplant, noch nicht startbar“**.

Wesentliche neue Produktdateien: `js/rathaus-b02.js`, `js/rathaus-b02-ui.js`, `quellen/bmg-b02-2026-11-04.md`. Integration: `module/rathaus.html`, `js/rathaus-ui.js`, `js/rathaus-navigation.js`, `js/rathaus-buergerbuero.js`, `js/rathaus-buergerbuero-ui.js`. Tests: `tests/rathaus-b02.test.js`, drei Browserläufe und CDP-Helfer sowie gezielte bestehende Regressionsanpassungen. Vollständige Dateiliste: `git show --stat d12af6f`.

## Belegte Prüfungen – getrennte Aussagekraft

Details: [Terminus-Prüfung](rathaus-double-shift-terminus-pruefung-2026-11-04.md), [Jarvis-Implementierung](rathaus-double-shift-implementierung-2026-11-04.md).

- **Automatisiert:** `node --test tests/*.test.js` **243/243**, 17 neue B02-Tests; eigener Fachkernreview 68 Assertions. `verify_run` nach Produktcommit ebenfalls grün.
- **Linux-Chrome, direkt `file://`:** B02-Skript vollständiger UI-Erfolg und Fehlerpfade; B01-Skript 9/9 plus eigener vollständiger B01-Abschluss; Luca und Noelle jeweils über echte Formularaktionen abschließbar. Eigene B02-UI-Prüfung 12/12, Tastatur/Fokus/Anzeige 6/6.
- **Reflow:** 320/360/400px geprüft; echter Browserzoom200/400% anhand innerWidth/DPR/visualViewport.scale verifiziert. Versionierte Matrix **24/24** inkl.150%Text+Abstand, eigene B02-Zusatzmatrix10/10. Jarvis' zusätzliche41-Seiten-Reihe ist als dessen Nachweis getrennt benannt.
- **HTTP:** zusätzliche Terminus-Start-/Sichtprobe über temporären lokalen Server, B02 geladen ohne Laufzeitausnahme. Kein vollständiger HTTP-Durchlauf behauptet. Server beendet.
- **Paket:** ZIP-CRC, SHA-256, byteweiser Vergleich133Dateien mit finalem Produktcommit und Start des entpackten Pakets im Linux-Chrome über `file://` erfolgreich. Kein Ersatz für Windows.
- **Windows/Edge: nicht ausgeführt, offen. NVDA: nicht ausgeführt, offen.** Keine pauschale Barrierefreiheitszertifizierung.

Ein zwischenzeitlich roter Test nach dem Entpacken hatte eine Testumgebungsursache: der rekursive HTML-Scanner zählte die eigene extrahierte Paketkopie im Checkout mit (90statt45Seiten). Eigene Kopie außerhalb des Checkout verschoben, keine Produkt-/Teständerung; derselbe Befehl anschließend243/243. Eigene zusätzliche Prüfartefakte bleiben bewusst untracked; fremde Übergaben unverändert.

## Unabhängige QA

[GLaDOS-Erstprüfung](rathaus-double-shift-glados-2026-11-04.md) auf `d12af6f…`: 243/243, B01-Browser9/9, B02-Browser und echteZoommatrix24/24 erfolgreich. Eigene DOM-/Fokus-/Speicherexploration bestätigte keinen erschlichenen Abschluss, fand aber fehlende sichtbare Rückmeldung bei beschädigtem B02-Speicher in der Übersicht (mittlere Schwere). Jarvis korrigierte den Befund in `7baddf109d7080d758598b4029dbd3ed2b8fcc45`. Die [Nachprüfungsnachweise](rathaus-double-shift-glados-nachpruefung-2026-11-04.md) bestätigen unabhängig ausgeführte Speicherregression,243erSuite,B02 und24erZoommatrix jeweils mitExit0. **GLaDOS lieferte allerdings keinen abschließenden Bericht:** nach mehrminütigem Stillstand stoppte Terminus den Lauf und sicherte die aufgezeichneten Ergebnisse ausdrücklich als eigene Zusammenführung. Kein abschließendes persönliches GLaDOS-Freigabeurteil behauptet; ergänzende unabhängige Explorations-/Isolationsausgaben bleiben mangels Bericht unbestätigt. Die unabhängigen Live-Vorher/Nachher-Prüfungen aller Fallstände und vollständigen Personalamt-Browserpfade waren in der Erstprüfung nicht vollständig; Terminus' eigene Belege bleiben davon getrennt. Windows/NVDA weiterhin offen.

## Planung und fachliche Restgrenzen

- [B02-Fachfreigabe](rathaus-double-shift-fachfreigabe-2026-11-04.md): bestehenden Fachplan bestätigt, §18BMG und amtliche BW-Praxisquelle erneut gelesen; unbekannte Landes-Sonderzuständigkeit ausdrücklich nicht bewertet.
- [B03-Fach-/Bildschirmplan](rathaus-double-shift-b03-plan-2026-11-04.md): privater Arbeitgeber, einfach/erweitert, Identität/Antragsweg, Gebühren/Befreiungen, Datenschutz und gesonderte Antragstellung/BfJ-Ausstellung. Quellenprüfdatum04.11.2026. Aktuell digitales Führungszeugnis seit01.10.2026 berücksichtigt, gestützt auf BfJ und §30dBZRG. Keine Implementierung.
- [Architekturvorschlag](rathaus-double-shift-architektur-2026-11-04.md): Istvergleich Personalamt/B01/B02; später Registry → einzelner UI-Baustein → Speicher-I/O → Lehrkraftadapter, mit klaren Prüf-/Migrationsgrenzen. Fachlogik bleibt fallbezogen, keine Großrefaktorierung durchgeführt.

Bekannt: lokale Dateispeicherung browser-/profil-/pfadabhängig; Lehrkraftmodus ohne Zugriffsschutz; keine echte Behördenfunktion. Für B02 keine lokale Gebühr oder rechtlich ungeprüfte Sonderzuständigkeit lehren. Arbeitgeber-Datenschutzsonderfragen, Auslands-/Minderjährigenfälle und weitere B03-Sonderfälle im Plan ausgeschnitten. UI-Helfer in B01/B02 teils dupliziert – bewusste Zwischenlösung statt unnötiger Komplettumbau.

## Direkt verwendbare lokale Windows-Testfassung

**ZIP:** [RATHAUS-DOUBLE-SHIFT-Windows-7baddf109d70.zip](../.output/double-shift-terminus/RATHAUS-DOUBLE-SHIFT-Windows-7baddf109d70.zip)

Vollständiger Pfad:
`/home/starnet/projects/Verwaltung-Ausbildung-rathaus/.output/double-shift-terminus/RATHAUS-DOUBLE-SHIFT-Windows-7baddf109d70.zip`

- Größe: **453809 Byte**.
- SHA-256: **`cd00f6c1ab9bd1988566e289c98b647ee2f5baf8c058e892e016596fa3e6a647`**.
- Enthält133bytegleich aus dem Produktcommit übernommene Dateien plus `START-RATHAUS.cmd` und `TESTSTAND.txt`. Kein Gitverzeichnis, keine alten/fremden untrackedArtefakte, keine Zugangsdaten oder Veröffentlichungen. Das frühere d12af6f-ZIP bleibt ausschließlich als historisches eigenes Prüfarbeitsartefakt liegen und ist **nicht** die finale Testempfehlung.
- Manifest daneben: `.output/double-shift-terminus/windows-package.json`.
- [Achtteilige Windows-Anleitung](rathaus-double-shift-windows-2026-11-04.md) liegt ebenfalls im ZIP: Start, Reflow, Anzeige, B01, B02richtig, B02falsch, Speicher/Reset und Einschränkungen. Windows/NVDA-Protokoll getrennt führen.

Start: ZIP ganz entpacken → `START-RATHAUS.cmd` oder `module/rathaus.html` öffnen. Keine Installation/kein Server. Der Paketstand enthält keine erst später erstellten QA-/Abschlussberichte, diese liegen hier separat, damit Produktstand und Hash unverändert bleiben.

## Empfehlung für den nächsten Auftrag

Zuerst die bereitgestellte Fassung unter Windows/Edge und mit NVDA nach Anleitung abnehmen und Rückmeldungen gezielt korrigieren. Danach B03-Plan fachlich freigeben und als nächsten Fall umsetzen; Quellen vor Code erneut prüfen. Als kleine Architekturvorarbeit höchstens die Fallregistry isoliert beauftragen, nicht alle Ämter gleichzeitig umstrukturieren. Keine Veröffentlichung oder Integration ohne ausdrückliche Freigabe.
