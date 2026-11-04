# GLaDOS-QA – Operation RATHAUS: Foundation & Expansion

**Stand:** 4. November 2026  
**Geprüfter Produktstand:** `11730be79ffce5c2c378fb11d71b9ead46a21473` (`Rathaus: B01 explizit beantworten und mobile Anzeige korrigieren`) auf `feature/operation-rathaus-mvp1`  
**Prüfergebnis:** Die angeforderte unabhängige Browserabnahme ist nur teilweise gelungen. Die lokale Vorschau und B01 wurden im isolierten Headless-Chrome aufgerufen; der vollständige Satz an Nutzerabläufen wurde nicht ausgeführt. Daher keine Abnahme des Gesamtumfangs.

## Umgebung und Arbeitsbereich

- Repository: `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`
- Git-HEAD entsprach dem angeforderten Commit. `git diff --quiet` bestätigte keine Änderungen an getrackten Dateien. Vorhandene untracked Dateien in `docs/rathaus-foundation-*` und `docs/uebergaben/` wurden nicht verändert.
- Lokaler, nur an Loopback gebundener Python-HTTP-Server, Port `8117`; Einstieg `http://127.0.0.1:8117/module/rathaus.html`. Serverprozess wurde für diesen Test gestartet; kein fremder Prozess wurde beendet.
- Isoliertes Headless-Chrome mit eigenem Profil `/tmp/glados-rathaus-qa-20261104`, CDP-Port `9229`; keine Verbindung zu einem vorhandenen persönlichen Chrome-Profil.
- Direkte `file:`-Öffnung wurde nicht geprüft.

## Tatsächlich beobachtet – Browser

1. Rathaus-Startansicht wurde geladen. Sichtbare Beschriftungen: „Stadtübersicht“, „Personalamt“, „Bürgerbüro“, „Lehrkraftmodus lokal ein oder aus“. Der Seitentext beschreibt Sonnenthal als erfunden und die Vorschau als lokale Übung ohne echte Schülerdaten.
2. Über „Bürgerbüro“ gelangte die Oberfläche zur Bürgerbüro-Übersicht. Dort wurde B01 als startbar angezeigt; B02 und B03 waren als „geplant, noch nicht startbar“ markiert.
3. B01 wurde in derselben lokalen Testinstanz geöffnet. Browserseitig sichtbar waren sechs Bereiche, darunter „3. Regeln“, die Aufforderung „Wähle genau eine Antwort“, die Option „Keine dieser Aussagen trifft zu“ sowie „Auswertung prüfen“ und „Übungsfall abschließen“. Der angezeigte Stand begann bei „0 von 6 Bereichen bearbeitet“.
4. Bei 780×500 wurde ein Screenshot der B01-Seite gespeichert: `shots/shot-75524fd608b9.png`. Auf dem Bild sind Kopfbereich, B01-Überschrift und die Breadcrumb-Leiste zu sehen; der obere Rand der Breadcrumb-Leiste liegt teilweise außerhalb des sichtbaren Ausschnitts. Das ist eine Momentaufnahme bei aktuellem Scrollstand, kein belegter Darstellungsfehler.
5. Die Browserwerkzeuge konnten die Seite lesen und den Bereichswechsel auslösen, aber nicht stabil die interaktiven B01-Antwortfelder bedienen: die normale Navigation verweigert Loopback-Adressen, der lokale Testbrowser akzeptierte den gestarteten Server nicht als nachgewiesen eigenen Server. Der alternative isolierte CDP-Weg öffnete die Vorschau, jedoch stand in der angehängten Browsersteuerung kein normaler, verlässlicher Interaktionspfad für diese lokale Seite zur Verfügung. Ich habe deshalb keinen vollständigen Fallabschluss behauptet.

## Automatisierte Tests – getrennt vom Browserlauf

Ausgeführt in der Projektkopie mit `node --test tests/*.test.js`: **226/226 Tests bestanden**, 0 fehlgeschlagen. Darunter Tests für B01 (richtige/vierte, falsche und fehlende Regelnantwort; ungültig werdende Auswertung; Legacy-r2-Verhalten; Freitext; Reset-Isolation), Personalamt Luca/Noelle und Anzeige-Einstellungen. Das belegt die im Testcode modellierten Bedingungen, nicht deren erfolgreiche Bedienung im Browser.

## Nicht geprüft / verbleibende Abnahme

- B01 über Eingaben vollständig abschließen; leere/falsche Regelnantwort tatsächlich in der Oberfläche bis zur Sperre ausführen; richtige Option als Radio auswählen; Änderung und Freitext eingeben, Auswertung invalidieren; Reload mit Legacy-r2-Testdaten und Erhalt der übrigen Eingaben; B01-Reset gegenüber Personalamt-Speichern kontrollieren.
- Luca- und Noelle-Nutzerpfade in der Browseroberfläche.
- „Anzeige & Lesen“ per Hauptnavigation aufrufen und die tatsächliche Wirkung/Persistenz der vier Einstellungen auf Startseite, Rathaus, Personalamt und B01 prüfen; schmale und breite Ansicht; Tastatur/Fokus und Navigation in diesen Ansichten.
- Direkte `file:`-Öffnung.
- Windows und NVDA wurden nicht ausgeführt; diese Umgebungen standen für diesen Lauf nicht als tatsächlich bedienbare Testziele zur Verfügung.

## Befund

Im tatsächlich im Browser angesehenen Teil (Rathaus-Startansicht, Bürgerbüro-Übersicht und B01-Erstansicht) wurde kein reproduzierbarer Anwendungsfehler festgestellt. Wegen des nicht durchgeführten End-to-End-Abschlusses und der offenen Anzeige-, Speicher-, Personalamt- und Tastaturprüfungen gilt diese Aussage ausdrücklich nur für die genannten Ansichten; sie ist keine Gesamtfreigabe. Für die noch offenen Interaktionen ist ein stabiler Browserzugriff auf den Loopback-Server erforderlich.
