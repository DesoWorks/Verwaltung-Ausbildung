# OPERATION RATHAUS – NAVIGATION REBUILD: Übergabe

04.11.2026 · Jarvis Implementierung, Terminus Strukturreview/Integration/Tests/Paket, GLaDOS unabhängige QA separat.

## Git und Umfang

Branch `feature/operation-rathaus-mvp1`. Ausgang `b4895f8a9fadd14f87daed51952cd3ea89c5ff50`. Produktcommit **`8c5483b94965e64502d940c695d0bb128bc3a080`**. Abschließender Dokumentationscommit folgt; vollständiger finaler HEAD wird in der Abschlussmeldung angegeben. IT-Referenz nur lesend `fbfed81d44cde4e496a849dfe4e5645870c1f2a8` im CLEAN-SLATE-Worktree. Keine IT-Dateiänderungen, kein Push/Merge/Deployment/Produktionsfreigabe. Fremde untracked docs/uebergaben und vorhandene .output-Dateien nicht aufgenommen.

## Neues Navigationsmodell

- Startseite und Hauptnavigation: eigener Bereich **Praxiswelten**, Rathaus einmaliger Einstieg, keine zusätzliche Unterrichtslektion. Weitere Welten werden vollständig und alphabetisch gerendert; kompakte Ausbildungsjahre und Lernfelder bleiben erhalten.
- Rathaus: natives aufklappbares **Ämtermenü**, innerhalb des Amts kompakte **Fälle-und-Seiten-Auswahl** statt permanenter B01/B02-Knopfreihe.
- Stadtämter alphabetisch: Bürgerbüro, Ordnungsamt, Personalamt, Stadtkasse. Geschlossene Ämter nicht startbar.
- Eine Eltern-Zurückaktion; kleinere, unterstrichene Breadcrumbs als Orientierung. Aktiver B01/B02-Kontext und Luca/Noelle-Person auch bei Personalamt-Nachschlagen sichtbar.
- Lehrkraftschalter in abgesetztem Lehrkraftbereich unter dem Lerninhalt, nicht in gleichwertiger Kopfnavigation. Keine echte Rollenprüfung.
- IDs, Bewertungskerne und Speicherverträge unverändert. Nur redundante Rückwege aus B01/B02/Personalamt-Inhalten entfernt. Kein B03-Code, keine Bewertungsrefaktorierung.

Geänderte Produktdateien: css/rathaus.css; js/navigation.js, plattform-navigation.js, startseite.js, rathaus-navigation.js, rathaus-ui.js, rathaus-buergerbuero-ui.js, rathaus-b02-ui.js; module/rathaus.html. Testanpassungen nur neue Navigation; sechs neue Verträge in tests/navigation-rebuild.test.js.

## Verifizierte Eigenprüfung

| Prüfform | Ergebnis |
|---|---|
| Node-Suite `node --test tests/*.test.js` |249/249, Exit0, vorher243/243|
| Linux-Chrome/file:// B01 |vollständiger Abschluss; leer/falsch gesperrt; explizite vierte Radiooption; Änderungsinvalidierung|
| Linux-Chrome/file:// B02 |vollständiger Abschluss; leer/falsch gesperrt; erneute Prüfung, Freitextinvalidierung, Speicherung und Reset|
| Luca/Noelle eigene Browserläufe |beide UI-Abschlüsse gespeichert,5/5 Kontrollpunkte|
| Echter Chrome-Profilzoom200/400% |24/24 Kombinationen, auch150%Text+Abstand; keine geometrisch abgeschnittenen Controls|
| Eigene neue Struktur-/Kontextläufe |9/9 Plattform/Anzeige/Stadtbreiten,8/8 Kontext/Speicher,7/7 Tastatur|
| Zukunftstest |3 injizierte Praxiswelten vollständig/sortiert, Unterrichtsjahre erhalten,320px ohne Überlauf|
| Sichtprüfung |Desktop dunkel/große Schrift,360px beide Rathausmenüs offen: keine seitlichen Abschneidungen|
| Paket |ZIP-Integrität,138 committete Dateien bytegleich, entpackte Startseite/Rathaus unter Linux-Chrome/file:// geöffnet|
| Windows/Edge |NICHT AUSGEFÜHRT|
| NVDA |NICHT AUSGEFÜHRT|

Details, Sortierregeln, Testgrenzen und Rohbelegpfade: `rathaus-navigation-terminus-2026-11-04.md`. Unabhängiger GLaDOS-Bericht liegt in `rathaus-navigation-glados-2026-11-04.md`: keine gefundenen Fehler im geprüften Umfang auf exakt8c5483b; fokussierte Suite78/78, eigener UI-Pfad sowie B01/B02/Speicher/Zoomläufe Exit0. Nicht unabhängig vollständig durchgespielt: Luca/Noelle und B01-Gesamtabschluss; dafür getrennte vollständige Terminus-Browserläufe oben. GLaDOS prüfte beim eigenen Navigationsspeichertest nur Schlüsselbestand, nicht Inhaltsgleichheit. Keine umfassende unabhängige Vier-Fälle-Abnahme behauptet.

## Windows-Testfassung

Pfad `.output/navigation-terminus/RATHAUS-NAVIGATION-Windows-8c5483b94965.zip`.

- Größe472450Byte.
- SHA256 `4b5051dbf7a23786b3831dec40de0026e119504c778af89392f309daddd21418`.
- Vollständig entpacken, START-RATHAUS.cmd oder index.html öffnen.
- Anleitung im Paket: `docs/rathaus-navigation-windows-2026-11-04.md`.
- Privates lokales Paket, nicht veröffentlicht. Es enthält Produktcommit und bis dahin committete Rathausdokumente, nicht den späteren Abschlussbericht.

## Risiken und nächste Abnahme

Windows/NVDA offen. file://-Speicher ist browser-/pfadabhängig: neuer Entpackordner kann anderen Speicher zeigen; vorhandene Ordner nicht löschen. Lehrkraftbereich bleibt lokal ohne Zugangsschutz. Keine neue didaktische/fachrechtliche B02-Bewertung in diesem Navigationsauftrag.

Jarvis-Lauf wegen unerwartetem kostenbelegtem Providerwechsel gestoppt; keine Wiederaufnahme dieses Wegs, Restabschluss durch Terminus. Der dokumentierte Kostenweg war nicht durch diesen Auftrag als zusätzliche Anbieteraktion freigegeben; kein erfundener erfolgreicher Jarvis-Schlusslauf.

Empfehlung: Windows-/NVDA-Abnahme dieses Pakets, danach gezielte Befunde korrigieren; erst anschließend separaten Folgeauftrag (z.B.B03) beginnen.

Zusätzliche eigene Reflowabsicherung: geöffnete Rathausmenüs bei320/360/400CSSpx, jeweils hell/dunkel/kontrast mit150%Text+Abstand:9/9 ohne Seitenüberlauf, sichtbare Menücontrols mindestens24px hoch. IT-Referenz am Abschluss erneut unverändert und sauber auf `fbfed81d44cde4e496a849dfe4e5645870c1f2a8` bestätigt.
