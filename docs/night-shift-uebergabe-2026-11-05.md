# OPERATION NIGHT SHIFT – Übergabe

## Auftrag und Ausführung
Start des tatsächlichen Implementierungslaufs: **05.11.2026, 04:35:40 MEZ (Europe/Berlin)** nach ausdrücklichem Sofortauftrag. Der geplante Lauf hatte laut Commander nicht funktioniert. Keine Arbeit wurde als erfolgreiche Nachtschicht vorgetäuscht.

Ausgangspunkt: `a4aa436acf2fa17ba230ff47753a883c931d5c54`, Branch `feature/operation-rathaus-mvp1`, getrackter Baum sauber. Vorhandene untracked `.output/` und `docs/uebergaben/` nicht aufgenommen; fremde Übergaben nicht verändert. IT-Ausbildung-clean-slate nur gelesen.

Neuer freigegebener Branch: **feature/verwaltung-night-shift-2026-11-04**
Repository: **https://github.com/DesoWorks/Verwaltung-Ausbildung**
[Branch öffnen](https://github.com/DesoWorks/Verwaltung-Ausbildung/tree/feature/verwaltung-night-shift-2026-11-04)

Die GitHub-Veröffentlichung und ihr endgültiger Hash werden nach dem abschließenden Dokumentationscommit im Abschlussbericht durch Remote-Readback bestätigt. Dieses Dokument selbst behauptet keinen bereits erfolgten Push.

## Tatsächlich fertig
1. **P0 Startseite:** Alle vier Tools-Karten hinter sämtlichen Ausbildungsjahren, nicht nur Überschrift. Alphabetische Tools-Reihenfolge. Praxiswelten eigenständig; Rathaus einmal, keine zusätzliche Unterrichtslektion. IT-Startseitenstruktur in `js/startseite.js` gelesen; Ansicht mit Bildschirmkoordinaten und vollständigem Screenshot geprüft.
2. **B03:** Einfaches Privatführungszeugnis für Robin Keller, vollständig lokal per `file://`. Gespräch/Rückfragen, fiktive Unterlagen, Daten-/Identitätsprüfung, Art/Empfänger/Antragsweg, Regeln, Gebühr/Befreiung, Vorbereitung, Antwortbausteine und ungeprüfter Freitext; gestufte Hilfen, Offline-Nachschlagekarte und getrennte Lehrkraftmusterlösung.
3. **Sicherer Fallvertrag:** Eigener Schlüssel `verwaltung-ausbildung.rathaus.buergerbuero.b03.v1`. Nur richtige vollständige Struktur abschließbar; falsche Zusatzantworten sperren. Jede Eingabeänderung inklusive Freitext entwertet Ergebnis/Abschluss. Gespeicherte Ergebnisse werden neu berechnet; defekte, alte und unbekannte Werte dürfen keinen Abschluss übernehmen. Fallwechsel/Reload erhalten Eingaben; Reset nur B03.
4. **Kleine Folgeerweiterung:** Aufgabenspezifische Rückmeldung benennt die zu überarbeitende Frage ohne Sollwert preiszugeben. Separat geprüft und committed.

Keine Großrefaktorierung, keine Änderungen der alten Speicherkennungen/Bewertungskerne, keine Produktion oder Cloud. B03 erzeugt keinen echten Antrag, kein Dokument und keine Zahlung.

## Lokale Produktcommits
- `e8368bc` – Tools-Karten auf Startseite.
- `1bc0385` – B03-Fall, Integration, Quellen und Tests.
- `9ca4691` – aufgabenspezifische B03-Rückmeldungen.
- Nachfolgender Dokumentationscommit: diese Übergabe und Windows-Anleitung.

## Tests und Grenzen
### Automatisiert
`node --test tests/*.test.js`: **299/299 bestanden**, 0 übersprungen. Enthält bestehende Personalamt-/B01-/B02-Suiten und 50 neue B03-Prüfungen. Bisherige Erwartungen „B03 gesperrt“ gezielt auf den nun beauftragten startbaren Fall aktualisiert; fachliche Sperren nicht gelockert.
`node --check js/rathaus-b03.js`, `node --check js/rathaus-b03-ui.js` und `git diff --check`: erfolgreich.

### Linux-Chrome direkt per file:// (Eigenprüfung)
- `node tests/browser-night-shift-cdp.js`: **19/19** Prüfpunkte, zuletzt auf fertiger Produktfassung: echte sichtbare Startseitenreihenfolge, Tools-Sortierung, B03 erreichbar, keine Musterlösung, leer/falsch/richtig, Abschluss, Freitextinvalidierung, Fallwechsel, Reload, Resetisolation, beschädigter Speicher, Reflow 320/360/400, Lehrkraft und keine JS-Ausnahmen.
- `node tests/browser-b01-regression-cdp.js`: erfolgreich (Radio, leer gesperrt, Invalidierung und Speichertrennung). Kein vollständiger B01-Erfolgsdurchlauf in dieser Schicht; dieser ist automatisiert abgedeckt und aus früherer Schicht belegt.
- `node tests/browser-b02-cdp.js`: vollständiger B02-Erfolgs-/Fehlerpfad, Speicherung, Manipulation, Reset und Reflow erfolgreich.
- `node tests/browser-b02-speicher-cdp.js`: beschädigte/alte Speicherstände, sichtbare Warnung, keine stille Löschung und Reset erfolgreich.
- `node tests/browser-zoom-cdp.js`: **32/32** Kombinationen bei echtem Chrome-Zoom 200/400 %, jeweils normal und 150 % Schrift/größere Abstände; B03 mit offenen Hilfen ergänzt. Keine horizontalen Überläufe oder außerhalb liegenden Bedienelemente. Produktänderung danach nur Rückmeldungstexte; kein neuer Layoutcode.
- Zusätzlicher bestehender Personalamt-CDP-Lauf: Luca und Noelle jeweils vollständig über UI abgeschlossen und gespeichert; keine JS-Ausnahmen.
- B03 Hell/Dunkel/Kontrast mit 150 % Schrift ohne Überlauf; echte CDP-Tastaturereignisse für Radio-Leertaste/Tab erfolgreich. Keine vollständige Screenreader- oder reine Tastatur-Gesamtabnahme.

Prüfartefakte lokal unter `.output/night-shift/`, bewusst nicht auf GitHub. Vollständiger Startseiten-Screenshot visuell gelesen.

### Unabhängige QA / Windows / NVDA
**Nicht durchgeführt.** `team.config` und `station.settings` antworteten: `REFUSED: no station page answered — open StarNet to run station commands`. Damit Jarvis' vorgesehenen Provider nicht verifizierbar. Kein ungeprüfter Crew-Lauf und kein bezahlter Fallback gestartet. Terminus implementierte und prüfte selbst auf bestehendem Codex-Weg. Keine erfundene unabhängige Freigabe.
Windows und NVDA sind offen; Linux-Chrome ist dafür kein Ersatz. [Konkrete Testanleitung](night-shift-windows-2026-11-05.md).

## Kontingent und kontrollierter Abschluss
Keine verlässlich abrufbare Restquote oder Verbrauchszahl verfügbar; keine Modellaufrufe als Quotenprobe. Jarvis nicht gestartet, daher kein Jarvis-Kontingentabbruch. Keine zusätzlichen API-Provider benutzt. Nach P0/B03 wurde genau eine kleine Rückmeldungsverbesserung abgeschlossen, danach Abschluss statt weiterer Baustellen. Kein harter Limitabbruch beobachtet. Kostenverbrauch nicht messbar angegeben.

## Fachliche Quellen
[Lokale B03-Quellenkarte](../quellen/bzrg-b03-2026-11-05.md), erneut amtlich geprüft 05.11.2026: §§ 30/30a/30c/30d BZRG, JVKostG Anlage Nr. 1130/Vorbemerkung 1.1.3 und § 10. Bundesrecht, BW-Referenzrahmen und fiktive Schalterannahme getrennt. Keine erfundene Gebühr. Digitaler Weg gesetzlich bestätigt; konkrete Portaltechnik nicht simuliert. Auslands-, Vertretungs-, Registerinhalts- und Arbeitgeberdatenschutzfragen nicht pauschal bewertet.

## Priorisierte nächste kleine Einheiten
1. Unabhängige QA des veröffentlichten Hashs und Windows/NVDA-Abnahme, vor weiteren Fällen.
2. B03-Rückmeldung unter realer Unterrichtsnutzung erproben; bei Bedarf konkretere Irrtumshinweise, keine automatische Freitextbewertung.
3. Fallübergreifende Nachschlageübersicht mit Quellenständen (Melderecht/Führungszeugnis), ohne Quellen zu duplizieren.
4. Erst danach weiterer Bürgerbürofall mit eigenem geprüften Fachvertrag. Kein beliebiger Rechtsfall ohne Quellenprüfung.

GitHub ist maßgebliche Downloadquelle. Optionales lokales ZIP kann aus dem finalen Git-Commit erstellt werden; dessen Größe/Hash gehören in den Abschlussbericht. Kein Merge nach dev/main, kein Deployment.
