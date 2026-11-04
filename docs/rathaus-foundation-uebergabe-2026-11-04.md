# Operation RATHAUS – FOUNDATION & EXPANSION: gemeinsame Übergabe

04.11.2026 · Terminus: Planung/fachliche Prüfung, Jarvis: Implementierung, GLaDOS: unabhängige Teil-QA.

## Ergebnis und Git

P0 implementiert, P1 als Baupläne dokumentiert. Keine Produktionsfreigabe und keine vollständige unabhängige Browserabnahme. Keine Pushes, Merges oder Deployments; IT-Ausbildung ausschließlich gelesen.

Worktree `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`, Branch `feature/operation-rathaus-mvp1`. Ausgangspunkt bestätigt: `acc3f56a45eb53fdaef5dfe12f9ebebafa6b2fa2`.

- Produktcommit **11730be79ffce5c2c378fb11d71b9ead46a21473**: B01 und mobile Anzeige, 8 Dateien, 148 hinzugefügte/26 entfernte Zeilen.
- Planungscommit **aa617b07348612c187d7919cdc12b71b34822eef**: Referenzanalyse, Grundgerüst, B02 und Windows-Anleitung.
- Anschließender Dokumentationscommit enthält diesen Bericht und GLaDOS-QA; seine ID steht im Git-Log/Abschluss. Produkt identisch zum Prüfcommit.

Fremdes `docs/uebergaben/` war vor Beginn untracked und bleibt unberührt/untracked. Nur eigene Dateien gezielt aufgenommen. Hauptcheckout auf `review/bwl-werkstatt-verwaltung-2026-10-26` nicht verändert.

## Umsetzung

B01: Untere Regelnfrage jetzt Radio mit vier Optionen ohne Vorauswahl. Nur „Keine dieser Aussagen trifft zu.“ richtig. Fehlende Antwort bleibt offen/unvollständig, falsche Aussagen sperren den Abschluss. Rückmeldungen differenziert, Widerspruchsprüfung erhalten. Bewertungsstand `b01-2026-11-04-r3`; Legacy-Arrays nicht in richtige Antworten umgedeutet; alte Auswertung/Abschluss verworfen, übrige normalisierbare Eingaben/Entwurf gerettet. Freiwilliger Entwurf vierzeilig, volle Breite, vertikal vergrößerbar, nicht automatisch fachlich bewertet.

Anzeige: Vorhandene Komponente entspricht bereits der IT-Referenz; keine Doppelentwicklung. Mobile CSS-Basisschrift berücksichtigt jetzt `--text-scale`; Rathaus-Warnbanner verwendet Themevariablen. Alle HTML-Seiten binden Anzeige ein. Personalamt-Kerne/-Controller und `anzeige-lesen.js` gegenüber Ausgangscommit unverändert.

Geänderte Produktdateien: `js/rathaus-buergerbuero.js`, `js/rathaus-buergerbuero-ui.js`, `css/rathaus.css`, `css/styles.css`. Regressionen in `tests/rathaus-barrierefreiheit.test.js`, `tests/rathaus-buergerbuero-bereiche.test.js`, `tests/rathaus-buergerbuero-ui.test.js`, `tests/rathaus-buergerbuero.test.js`.

## Testnachweise – getrennt

| Ebene | Tatsächliches Ergebnis |
|---|---|
| Automatisiert, Terminus | `node --test tests/*.test.js`: **226/226 bestanden**, 0 übersprungen. Luca/Noelle, B01-Erfolg/Fehler/Leer/Legacy/manipulierte Daten, Invalidierung, Speicher/Reset, Fokus/Navigation im DOM-Modell |
| Automatisiert, GLaDOS | Ebenfalls 226/226 auf Produktcommit 11730be |
| Diff/Statik | `git diff --check` grün; 148 hinzugefügte Zeilen gesichtet, keine Treffer der geprüften Risikomuster. Keine umfassende Sicherheitszertifizierung |
| Unabhängiger Browser, GLaDOS | Linux-Chrome/HTTP: Rathausstart, Bürgerbüroübersicht, B01-Erstansicht. Keine reproduzierbaren Fehler dort; Interaktionsweg blockierte vollständige Abnahme |
| Ergänzender Browser, Terminus | Eigene isolierte Linux-Chrome-Instanz, direkte `file:`-Öffnung, Node22/WebSocket-CDP: **18 Prüfpunkte erfolgreich**, siehe unten. Keine unabhängige QA |
| Windows | Nicht ausgeführt |
| NVDA | Nicht ausgeführt |

### Ergänzende Browserprüfung

Dateien unter `.output/`: `foundation-browser.cjs` (ausführbares Testskript), `foundation-browser-results.json` (18 Ergebnisse), `foundation-b01-mobile.png` (390×844). Lokale ignorierte Belege, nicht im Git-Commit.

B01 vier Radios ohne Vorauswahl; fehlende und falsche Regelnantwort sperren; vollständiger Erfolgsweg und tatsächliche Abschlussmeldung; Freitextänderung invalidiert; Entwurf und Sperre nach Reload/Wiederöffnen erhalten. Alle vier Anzeigeoptionen in B01 geschaltet: Wurzelschrift 27 px Desktop bzw 25,5 px bei 390 px/150 %, Dunkel-/Kontrastflächen, Abstands-/Bewegungsklassen. Anzeige in Stadt/Personalamt/Bürgerbüro/Startseite und nach Reload erhalten. Slider über echtes ArrowLeft-Keyevent 150→140 bedient. Legacy-r2-Array nach Reload ohne Antwort/Abschluss bei erhaltenem Entwurf. B01-Reset leert Fall, andere vorhandene Speicherschlüssel bytegleich erhalten.

Bedienung überwiegend über DOM-Klicks/Input-Events im realen Browser, nicht vollständige menschliche Tastatur-/Mausprüfung. Keine vollständigen Luca-/Noelle-Abschlusswege im Browser; deren Beleg aus automatisierten Kern-/DOM-Tests und unverändertem Code. Nicht jede Unteransicht visuell vermessen.

Screenshot direkt angesehen: Entwurf/Erklärung lesbar, Text umbricht. Horizontale Scrollleiste sichtbar; Ursache/Gesamtauswirkung nicht eingegrenzt. **Keine umfassende Reflow-Abnahme.**

Testserver/Chrome beendet, Ports 8117/9229/9341 danach geschlossen nachgewiesen. Kein laufender Vorschauprozess dieses Auftrags.

## Planungsdokumente

- [Referenzanalyse](rathaus-foundation-referenzanalyse-2026-11-04.md): Bestandsaufnahme und Wiederverwendung.
- [Rathaus-Grundgerüst](rathaus-foundation-grundgeruest-2026-11-04.md): Falladapter, UI/Fachkern, Status-/Speichervertrag, Risiken und kleine Umsetzungsschritte. Keine große Refaktorierung erfolgt.
- [B02-Fachplan](rathaus-foundation-b02-plan-2026-11-04.md): konkrete fiktive Akte, Aufgaben-/Bewertungsmatrix, Hilfen, Quellen/Prüfdatum, Tests. Kein Anwendungscode; B02/B03 bleiben nicht startbar.
- [Windows-/NVDA-Anleitung](rathaus-foundation-windows-test-2026-11-04.md): konkrete Erfolgs-/Fehlerantworten, Offline, Anzeige, Speicher, Tastatur und Protokollformat. Für diesen Auftrag statt teilweise überholter MVP2-Anleitung verwenden.
- [GLaDOS-QA](rathaus-foundation-glados-2026-11-04.md): unabhängiger Bericht unverändert mit tatsächlicher Prüfgrenze.

## Offene Risiken und nächste Schritte

1. Vollständige unabhängige Browser-, Tastatur-/Fokus- und Windows/NVDA-Abnahme offen. Eigenprüfung nicht als unabhängig umetikettieren.
2. Gezielte Reflowprüfung bei 150 %/größeren Abständen wegen sichtbarer horizontaler Scrollleiste. Noch kein eingegrenzter Fehler.
3. `file:`-Persistenz für Linux-Chrome belegt, nicht für alle Windows-Browser garantiert. Blockierter Speicher muss sichtbar gemeldet werden.
4. B02: § 1 BW AGBMG nur über gekennzeichneten Sekundärabdruck geprüft; aktueller amtlicher Volltext vor erweiterter Zuständigkeitslehre offen. Bundesnorm/amtlicher kommunaler BW-Leistungsabdruck gelesen. Keine erfundene Sonnenthal-Gebühr: elektronisch nach § 18 Abs. 3 BMG unentgeltlich, schriftliche Ortsregel bewusst ungeklärt.
5. Keine Rechtsberatung/echte Behörde; Lehrkraftansicht keine Zugriffssicherung.

**Empfehlung:** Erst P0 unter Windows/NVDA und gezielt Reflow unabhängig abnehmen. Danach B02 in eigenem Auftrag anhand Fachplan umsetzen und nur benötigte Bürgerbüro-Bausteine wiederverwenden. Keine große Refaktorierung vor diesem Praxistest. B03/weitere Ämter bleiben Planung.
