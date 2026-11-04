# Unabhängige QA – Operation RATHAUS DOUBLE SHIFT

**Datum:** 04.11.2026
**Geprüfter Stand:** Branch `feature/operation-rathaus-mvp1`, Commit `d12af6f81c851861543fd8e432f40785a477439c`
**Umgebung:** Linux, Node.js v22.23.3, echtes Chrome über CDP mit eigenem temporärem Profil, Anwendung direkt über `file://`. Kein HTTP-Lauf, Windows, Edge oder NVDA.

## Ergebnis

**Empfehlung:** Der Stand ist für die vorgesehene lokale Windows-Testfassung geeignet, aber noch nicht als fehlerfrei oder produktionsfreigegeben abzunehmen. Ein reproduzierbarer UI-Mangel bei beschädigtem B02-Speicher bleibt offen. Windows-/NVDA-Prüfung und weitere plattformbezogene Abnahmen sind nicht erfolgt.

## Reproduzierbarer Befund – beschädigter B02-Speicher wird nicht sichtbar gemeldet

**Schwere:** mittel – Lernende können einen beschädigten Speicherstand für einen gewöhnlichen leeren/unbegonnenen Fall halten; falscher Abschluss wurde nicht beobachtet.
**Soll:** Bei beschädigtem Speicher sicher fortfahren, keinen alten Abschluss übernehmen und eine verständliche sichtbare Meldung anzeigen. Grundlage: Abnahmematrix B02-6, Fachfreigabe „Alte/manipulierte Speicherstände … Meldung“, Fachplan Prüffall 7.

**Ausgangslage und Reproduktion:** frisches temporäres Chrome-Profil; B02 über die sichtbare Navigation geöffnet; im vorgesehenen B02-localStorage-Schlüssel `verwaltung-ausbildung.rathaus.buergerbuero.b02.v1` den ungültigen JSON-Text `{broken` gespeichert; Seite neu geladen.

1. `index.html` öffnen und den Link „Virtuelles Rathaus“ betätigen.
2. „Bürgerbüro“ und „Fall B02 öffnen“ wählen.
3. Im isolierten Profil den B02-Speicherwert auf `{broken` setzen.
4. Seite neu laden.

**Ist:** Nach dem Laden erscheint wieder die Bürgerbüro-Übersicht mit B02 „NOCH NICHT BEGONNEN“; keine Meldung über beschädigte oder verworfene Daten ist sichtbar. Der ungültige Rohwert bleibt im Speicher. Kein Bestehen oder falscher Abschluss wurde übernommen.
**Häufigkeit:** einmal gezielt reproduziert.
**Einordnung:** Der fachliche Bereinigungspfad in `js/rathaus-b02.js` liefert für defektes JSON einen verworfenen, leeren Zustand. Die UI meldet diesen konkreten Zustand offenbar nicht sichtbar. Die vorhandenen Kerntests prüfen die sichere Bereinigung, ersetzen aber den sichtbaren Nutzerhinweis nicht.
**Folge:** Ein Lernender kann Antworten bzw. Fortschritt für verloren oder B02 für nie begonnen halten und weiß nicht, warum. Empfehlung: den verworfenen Speicherzustand in der Oberfläche mit einer verständlichen, nicht alarmistischen Meldung kenntlich machen; keine Reparatur durch QA vorgenommen.

## Erfolgreiche unabhängige Prüfungen

- `node --test tests/*.test.js` – **243/243 bestanden**, 0 fehlgeschlagen.
- `node tests/browser-b01-regression-cdp.js` – **9 Browserchecks bestanden**: vierte Einfachauswahl ausdrücklich erreichbar, unbeantwortet von falsch unterscheidbar, Abschluss gesperrt und Änderungsinvalidierung; keine JavaScript-Ausnahmen.
- `node tests/browser-b02-cdp.js` – **alle ausgegebenen Browserchecks bestanden**: leer/falsch blockiert, kompletter strukturierter Sollpfad, Freitext invalidiert, Abschluss/Reload, manipuliertes Bestehen verworfen, B02-Reset und 320/360/400 px emuliert; keine JavaScript-Ausnahmen. Diese Suite wurde zweimal ausgeführt; die zweite Ausführung diente ausschließlich der Wiederholung nach zwischenzeitlichen eigenen Harness-/Selektorfehlern, ohne Produktänderung.
- `node tests/browser-zoom-cdp.js` – **24/24 bestanden**: echter Chrome-Zoom 200 % und 400 % für Stadt, Bürgerbüro, B01, B02 und Lehrkraftansicht, mit und ohne Anzeige 150 %/Abstände; gemessene Layoutbreiten 640 px bzw. 320 px, keine gemeldeten horizontalen Überläufe oder außerhalb liegenden Controls.
- Zusätzliche live DOM-Stichprobe in B02: 82 sichtbare/interaktive Controls; Radiobuttons hatten zugeordnete Labels, Fokus auf einer Antwortoption war sichtbar (3-px-Outline). Zwei sichtbare Buttons ohne Text/ARIA-Label wurden im allgemeinen DOM-Snapshot gezählt, aber nicht funktionsbezogen identifiziert; daher **kein bestätigter Fehlerbefund** daraus.
- B01/B02 Kernprüfungen decken geänderte Pflichtantworten und verbotene Kombinationen ab. Die Speicherbereinigung der B02-Kernfunktion verwirft ungültige Rohwerte vor Normalisierung. Die browserseitige Manipulationsprobe bestätigt, dass der geprüfte manipulierbare Bestehensstand keinen Erfolg erschlich.

## Weitere Abgrenzungen und Prüfgrenzen

- Luca- und Noelle-Kern-/UI-Regressionen sind in der 243er-Testsuite enthalten. Eine unabhängige vollständige Browser-Sollbearbeitung beider Fälle bis zum Abschluss wurde hier nicht ausgeführt; sie ist weiterhin Teil der Windows-Prüfanleitung.
- Die B02-Reset-Browser-Suite prüfte Entfernen des eigenen B02-Schlüssels; eine unabhängige Live-Vorher/Nachher-Prüfung aller B01-, Luca-, Noelle- und Anzeige-Speicherwerte erfolgte nicht. Unit-/UI-Tests dazu waren Bestandteil der 243 erfolgreichen Tests.
- 320/360/400 px wurden im B02-Browserlauf emuliert, nicht als physische Geräte geprüft. Die separate Zoomsuite misst echten Chrome-Zoom. Die 150-%-Text-/Abstands-Kombination wurde in der Zoomsuite geprüft; die gesamte Plattformmatrix aller 41 Seiten wurde nicht unabhängig wiederholt.
- `file://` wurde geprüft; `http://` nicht. Windows/Edge und NVDA sind nicht verfügbar bzw. nicht geprüft und bleiben offen. Linux-Chrome ist kein Windows- oder Screenreader-Nachweis.
- Keine eigene fachrechtliche Quellenprüfung in dieser QA. Die Terminus-Fachfreigabe und der B02-Plan wurden als verbindliche Prüfgrundlage gelesen; die offene amtliche Volltextprüfung des baden-württembergischen Landesrechts und die fehlende Sonnenthal-Gebührensatzung bleiben wie dort angegeben offen.
- Bei mehreren eigenen Explorationsversuchen traten Fehler in meinen CDP-Skripten auf, weil sichtbare UI-Texte/Elemente falsch angenommen oder noch nicht gerendert waren. Nach erneutem Lesen des DOM wurde der korrekte Navigationsweg gefunden. Diese Selector-/Harnessfehler sind **keine Anwendungsfehler** und werden nicht als solche gezählt.

## Prüfkommandos und Git-Abschluss

Ausgeführt:

```text
node --test tests/*.test.js
node tests/browser-b01-regression-cdp.js
node tests/browser-b02-cdp.js
node tests/browser-zoom-cdp.js
```

Die B02-Browserprüfung wurde zweimal ausgeführt; die übrigen Befehle je einmal. Die Suite-Ergebnisse stammen aus dem tatsächlichen Prozessausgang; für keine fehlerhafte Pipeline wurde ein erfolgreicher Exitcode angenommen.

Zum Start und nach Abschluss der Tests blieb HEAD `d12af6f81c851861543fd8e432f40785a477439c` auf `feature/operation-rathaus-mvp1`. Die anfangs vorhandenen untracked Bereiche `.output/` und `docs/uebergaben/` wurden nicht verändert. Terminus-Berichte, die währenddessen neu erschienen, blieben unberührt. Keine Produkt- oder Testdatei wurde von QA geändert; keine Commits, Branchwechsel oder Deployments.
