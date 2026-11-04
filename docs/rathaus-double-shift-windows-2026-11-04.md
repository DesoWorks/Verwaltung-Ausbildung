# DOUBLE SHIFT – lokale Windows-Testanleitung

04.11.2026 · Jarvis/Terminus. **Anleitung, kein Windows-/NVDA-Nachweis.** Produktcommit im Paket: `TESTSTAND.txt`; ZIP-Dateiname, Bytezahl und SHA-256 stehen im daneben gelieferten Manifest `windows-package.json` bzw. im gemeinsamen Übergabebericht. Paket nicht veröffentlichen.

## 1. Anwendung starten

ZIP vollständig in einen neuen Ordner entpacken, nicht innerhalb des ZIP öffnen. `START-RATHAUS.cmd` doppelklicken oder `module/rathaus.html` in Edge/Chrome öffnen. Zusätzlich `index.html` → Rathaus testen. Adresse muss `file:///…` sein. Kein Docker, Server oder Internet nötig. Ganze Ordnerstruktur behalten. Eigenes Testprofil verwenden; echte Lernstände nicht löschen. Notieren: Paketcommit, Windows-/Browser-/ggf. NVDA-Version, Datum.

## 2. Reflow kontrollieren

Fenster mit ca. 320, 360 und 400 CSS-Pixel Inhaltsbreite prüfen (Entwicklertools-Viewport notfalls separat als Emulation notieren). Danach bei normaler Fensterbreite **echten Browserzoom 200 % und 400 %** über Browsermenü/Strg+ einstellen. Stadt, Personalamt, Bürgerbüroübersicht, B01, B02 und Lehrkraft aufrufen. Erwartung: keine horizontale Seitenscrollleiste, abgeschnittenen Wörter, Knöpfe oder Formulare; lange Bezeichnungen umbrechen. Seiten vertikal ganz durchgehen. Viewport-Emulation und Browserzoom nicht vermischen. Zum Schluss Strg+0.

## 3. Anzeige & Lesen kontrollieren

Hauptnavigation → „Anzeige & Lesen“: Schrift150 %, größere Abstände, Hell/Dunkel/Kontrast einzeln, weniger Bewegung. Startseite, Glossar, Stadt, Personalamt, B01, B02 und Lehrkraft vergleichen. Neuladen: alle vier Einstellungen bleiben erhalten. Schritt2 auch mit großer Schrift/Abständen wiederholen. Nur Tastatur: Tab/Shift+Tab, Enter/Leertaste, Pfeiltasten bei Radios. Fokus sichtbar und nach Auswertung auf Ergebnisüberschrift; keine Fokusfalle. NVDA separat protokollieren: Legenden, Beschriftungen, ausgewählt/nicht ausgewählt, Aufklapperzustand und zurückhaltende Statusansagen.

## 4. B01-Kurztest

Bürgerbüro → B01. Unter „Regeln“ unten vier Radios, nichts vorausgewählt. Ohne Antwort prüfen: unbeantwortet, kein Abschluss. Eine falsche Aussage wählen: falsche Einordnung, kein Abschluss. Sollfall nach `rathaus-foundation-windows-test-2026-11-04.md` (im gleichen docs-Ordner), dabei ausdrücklich **„Keine dieser Aussagen trifft zu.“** wählen: richtig abschließbar. Nach Auswertung Auswahl/Freitext ändern: alte Auswertung und Abschluss ungültig. Fehlende Wohnungsgeberbestätigung bedeutet im B01-Sachverhalt keine abgeschlossene Anmeldung.

## 5. B02 vollständig richtig durchspielen

Bürgerbüro → „Fall B02 öffnen“. Alex Weber ist fiktiv. Vier Rückfragen und alle drei Unterlagen öffnen.

1. Anliegen: **Eine Meldebescheinigung für die eigene Person**.
2. Unterlagen: Familienname, Vorname, Geburtsdatum, derzeitige alleinige Anschrift jeweils **„liegt vor und stimmt“**. Identität: **Ausweis, Antrag und Übungsregister abgleichen; sie passen zusammen**.
3. Umfang: **Nur die Daten nach §18 Abs.1 BMG, die im Register stehen**. Regeln: eigene Person, §18 BMG, zusätzliche Daten nur auf Antrag, schriftliche Gebührenregel prüfen — diese vier ankreuzen. „Elektronisch kostet immer“ nicht ankreuzen. Untere Einfachfrage: **Keine dieser Aussagen trifft zu.**
4. Vorbereitung: **Übungsbescheinigung mit passenden Registerdaten vorbereiten und örtliche Gebührenregel prüfen**; nicht bereits ausgehändigt.
5. Antwort: genau die fünf passenden Bausteine Anliegen, Vorbereitung, nur beantragter Umfang, Gebühr prüfen, Übung. Keine der fünf falschen Zusagen. Freitext optional, nicht automatisch bewertet.
6. „Auswertung prüfen“: alle fünf Fachbereiche richtig, Abschluss freigegeben. „Übungsfall abschließen“: bestätigter Übungsabschluss, **keine echte Bescheinigung**.

Hilfen in drei Stufen und Nachschlagekarte prüfen. Lehrkraftmodus zeigt B02-Muster/Kriterien/Quellen; beim Zurückwechseln ist keine Musterantwort in der Lernansicht eingeblendet. B03 bleibt sichtbar geplant/nicht startbar.

## 6. B02 bewusst falsch beantworten

Nach erfolgreichem Fall falschen Zusatzbaustein „feste Gebühr“ ankreuzen: Abschluss sofort ungültig; erneute Prüfung sperrt ihn trotz richtiger anderer Bausteine. Falsche Vorbereitung „bereits ausgehändigt“ ebenfalls sperren. Anschließend B02 zurücksetzen und leer prüfen: „Noch offen“, kein Abschluss. Nur Anliegen „Neue Anmeldung“ beantworten und prüfen: fachlich falsch, andere Bereiche offen; kein Abschluss. Teilweise vollständige Daten: unvollständig, nie bestanden. Freitext mit allen richtigen Wörtern allein darf keinen Erfolg bewirken.

## 7. Speicherstand und Zurücksetzen

B01 und beide Personalamt-Fälle Luca/Noelle mit eigenen Testständen bearbeiten. B02 teilweise ausfüllen, B01/Personalamt öffnen, zurück zu B02: Antworten bleiben. B02 richtig abschließen und neu laden: Übersicht meldet Abschluss; Fall öffnet gespeicherte Antworten. Jede Auswahl-/Freitextänderung entwertet Auswertung und Abschluss auch nach Reload. Reset B02 abbrechen → nichts verändert; bestätigen → nur B02 leer. B01/Luca/Noelle und Anzeigeeinstellungen bleiben erhalten. Luca/Noelle mindestens einmal vollständig bis Abschluss spielen. Browser-Zurück separat beobachten; interne Fallansicht ist kein vollständiger Browser-Verlauf.

## 8. Bekannte Einschränkungen

- **Windows/Edge und NVDA bisher nicht ausgeführt**, deshalb offene Abnahme. Linux-Chrome ersetzt diese nicht.
- `file://`-Speicherung ist browser-/profil-/pfadabhängig. Nach Verschieben/neu Entpacken kann ein anderer Speicherbereich entstehen. Keine Cloud-Synchronisierung. Bei gesperrtem Speicher sichtbare Fehlermeldung, kein behaupteter gespeicherter Erfolg.
- Lehrkraftmodus lokal offen, kein Zugriffsschutz; keine echten Daten eingeben.
- Fachlich: unbekannte Sonnenthal-Gebühr und amtlicher aktueller BW-Sonderzuständigkeitsvolltext nicht bewertet. Keine elektronische Authentifizierung, echte Ausstellung oder Übermittlung.
- B03 ist Planung. Keine Produktionsfreigabe, Veröffentlichung oder Deployment.

Protokoll: `Schritt | bestanden / Fehler / nicht geprüft | Ist/Soll | Umgebung | Beleg`. Windows und NVDA jeweils separat. Nicht ausgeführte Punkte bleiben offen.
