# NAVIGATION REBUILD – Terminus Strukturprüfung

04.11.2026. Rathaus-Ausgang `b4895f8a9fadd14f87daed51952cd3ea89c5ff50`, feature/operation-rathaus-mvp1. IT-Referenz nur gelesen: /home/starnet/projects/IT-Ausbildung-clean-slate, HEAD `fbfed81d44cde4e496a849dfe4e5645870c1f2a8`.

## Referenzvergleich

Gelesen: IT index.html, js/navigation.js und js/startseite.js. Prinzipien: zentraler Katalog, dateipfadbasierte Offline-Links, native details für Jahre/Lernfelder, kompakte Startseite, separater Einstieg und Tools, aktuelle Zweige offen und aria-current, mobiles Menü mit Escape, persistente Aufklapp-/Rückkehrzustände. Die Referenz hat keine wörtliche Kategorie Praxiswelten: diese ist die beauftragte Verwaltung-Adaption des Trennungsprinzips, keine 1:1-Kopie. Verwaltung besitzt bereits PLATTFORM_NAVIGATION; wiederverwenden. Bisheriges Rendering von nur eintraege[0] skaliert nicht auf weitere Praxiswelten.

## Sortierregeln

- Ämter gemeinsam nach deutschem sichtbarem Titel: Bürgerbüro, Ordnungsamt, Personalamt, Stadtkasse. Geplante und verfügbare nicht getrennt vorsortieren.
- Gleichrangige Praxiswelten, freie Module und Werkzeuge alphabetisch, deutsche natürliche Ziffernsortierung; Kopie sortieren, IDs/Katalog nicht mutieren.
- Jahre und nummerierte Lernfelder numerisch/curricular belassen. Fachliche Lernschritte nicht alphabetisieren. Fälle B01/B02/B03 nach stabiler Kennung/fachlicher Reihenfolge.
- Feste Funktionsbereiche folgen Informationsarchitektur, keiner alphabetischen Gesamtliste. Titel statt Dateiname/ID/Verfügbarkeit ist Sortierschlüssel. Keine Speichermigration für Sortierung.

## Unabhängige Abnahmebasis

Persona: neue Auszubildende ohne Fallkennungswissen, schmales Fenster und große Schrift. Aufgabe: B02 finden, Entwurf sichern, anderes Amt besuchen und zurückkehren.

Startseite: Rathaus einmal als Praxiswelt, nicht zusätzlich als Unterrichtslektion; mehrere Praxiswelten vollständig/kompakt. Hierarchie Stadt → Amt/Fallübersicht → Fall → Bearbeitung. Keine permanenten Amts-/Fallknopfreihen. Amt und aktiver Fall auch bei Luca/Noelle erkennbar. Breadcrumbs visuell Orientierung, nicht zweite Arbeitsnavigation. Eine Eltern-Zurückaktion unabhängig von Browserhistory. Lehrkraft klar separat, keine Musterlösung automatisch in Lernansicht. Fokus auf Ansichtstitel, native Tastaturbedienung, mobiles Menü/Escape und Anzeigeoptionen erhalten. Vier Fälle spielbar, Entwürfe/Ergebnisse/Abschlüsse bei Navigation unverändert.

Desktop, 320/360/400px, große Schrift/Abstände und echter Browserzoom getrennt prüfen. Linux-Chrome/file://, Windows und NVDA getrennt ausweisen. Ungeprüfte Prüfarten offen.

## Prüfstand

Noch Prüfbasis; konkrete Implementierungs-/Browsernachweise werden nach Schreibschluss ergänzt. Kein Bestehensnachweis.

## Bestätigte Ausgangsprüfung

Vor Implementierungsänderungen: `node --test tests/*.test.js` am Ausgangsstand: **243/243 bestanden**, Exit 0 (Rohbeleg `.output/navigation-terminus/baseline-tests.tap`). Dies ist nur die Baseline, keine Abnahme des neuen Modells. Automatisierte alte Strukturprüfungen sind gegen den neuen Sollvertrag zu bewerten, nicht als unveränderliche Buttonanordnung.

## Plattform-Zwischenprüfung

Eigene Live-Prüfung Linux-Chrome/file://: drei nur im Browser injizierte Praxiswelten erscheinen vollständig und alphabetisch sowohl Startseite als auch Hauptnavigation; drei Ausbildungsjahre erhalten, bei320px kein Überlauf (`future-worlds.cjs/json`). Keine zusätzlichen Produktfälle angelegt. Erster Test erfasste versehentlich den Glossar-Rückkehrparameter `von=…rathaus…` als Welt; URL-Selektor nach Lesen des Ergebnisses auf eigentliche Modulpfade eingegrenzt, kein Produktfehler.

Eigene Tastaturprüfung Startseite: **7/7** (Skip-Link → Hauptinhalt, mobiles Menü per Enter mit Fokusübergabe, Escape mit Fokusrückkehr, sichtbare Outline, sichtbare Controls benannt, keine JS-Ausnahme). CDP-Enter benötigt im keyDown `text: '\\r'`; ohne Text war zuvor keine Aktivierung ausgelöst worden. Testaufbau korrigiert, keine Produktänderung. Kein NVDA-Nachweis. Diese Zwischenprüfung betrifft die Plattformnavigation, nicht die noch in Arbeit befindliche Rathausnavigation.

Eigener Vertragscheck `contract-check.cjs`: sieben Fach-/Speicher-/Anzeige-/Fortschrittsdateien bytegleich zum Ausgangscommit (Luca-, Noelle-, B01-, B02-Kern, Lehrkraftmodell, Anzeige & Lesen, Plattformfortschritt). Synthetischer Praxisweltenkatalog wird ohne Mutation und ohne Lektionsfortschritt sortiert. Nach endgültiger Umsetzung nochmals gegen Produktstand absichern.

Reviewhinweise an Jarvis: Praxisweltbeschreibung im Adapter nicht verlieren; Personalamt-Kontext muss aktive Person benennen; Escape eines Rathausmenüs darf nicht fremdes Hauptmenü/Reset-Fokus überschreiben. Noch kein behaupteter Endbefund, Umsetzung bleibt bei Jarvis.

## Eigene Rathaus-Liveprüfung nach Navigationsumbau (Zwischenstand)

`independent-review.cjs`: **9/9**, Linux-Chrome direkt file://: einmaliger Rathaus-Einstieg, Praxisweltenlabel, vier globale Anzeigeeinstellungen (150%/Abstand/Dunkel/ruhig), alphabetische Ämter, kein Seitenüberlauf Stadt bei1280/320/360/400 mit150%Text+Abstand, keine JS-Ausnahme. `context-review.cjs`: **8/8**: B02-Breadcrumb/Fokus, genau eine Eltern-Zurückaktion, Noelle-Kontext auch beim Nachschlagen, B02-Rohspeicher nach Wechsel Bürgerbüro→Personalamt→Bürgerbüro bytegleich und Entwurf sichtbar, keine Musterlösung in Lernansicht, Lehrkraftschalter in eigenem aside, keine JS-Ausnahme. Kein Ersatz für vollständige vier Fallabschlüsse.

Screenshot `.output/navigation-terminus/stadt-desktop.png` tatsächlich gesichtet: dunkle Darstellung mit großer Schrift/Abständen, kompakter Ämterschalter statt permanenter Amtsreihe. Kopftext umgebrochen, nicht horizontal abgeschnitten. Sichtbarer Ausschnitt endet am Stadttitel; Karten/untere Controls sind durch diesen Screenshot nicht mitabgenommen.

## Produktstand und vollständige Eigenprüfung

Produktcommit `8c5483b94965e64502d940c695d0bb128bc3a080`. Implementierung Jarvis, Abschluss der Regressionstests/Windowsanleitung und sechs zusätzlicher Strukturtests Terminus. Jarvis-Lauf wurde durch Terminus gestoppt, nachdem das Laufprotokoll unerwartet `~anthropic/claude-sonnet-latest` mit Kostenereignissen statt des ursprünglichen Kontowegs auswies. Kein Neustart dieses Wegs. Kein behaupteter Jarvis-Schlussbericht.

- `node --test tests/*.test.js`: **249/249**, Exit0; Baseline243 plus6 Navigationsverträge. Alte Assertions nur an explizit geänderte Navigation angepasst, keine fachliche Lockerung.
- `node tests/browser-b01-regression-cdp.js`, `node tests/browser-b02-cdp.js`, `node tests/browser-b02-speicher-cdp.js`: jeweils Exit0. B02 leer/falsch/richtig, Freitextinvalidierung, Abschluss, Speicherung, gezielter Reset und beschädigter Speicher geprüft.
- Eigene `b01-complete.cjs`:7/7, vollständiger B01-Abschluss sowie unbeantwortet/falsch/Änderungsinvalidierung. Eigene `personal.cjs`:5/5, Luca und Noelle per echter UI bis gespeichertem Abschluss, keine Laufzeitausnahme. Lehrkraftdaten liefern Testeingaben, werden nicht in Lernoberfläche eingebaut.
- `node tests/browser-zoom-cdp.js`: **24/24** echter Chrome-Profilzoom200/400%, jeweils mit/ohne150%Text+Abstand; Stadt, Bürgerbüroübersicht, B01, B02, B02-offen und Lehrkraft. Kein Seitenüberlauf/außerhalb liegendes Control laut Geometrieprüfung.
- Eigene Tastatur7/7 und Drei-Praxiswelten-Skalierung nach Produktcommit erneut erfolgreich. Bytegleichheit der sieben geschützten Kern-/Anzeigedateien bestätigt. Syntaxscan geänderter JS-Dateien und `git diff --check` erfolgreich. Hinzugefügte Produktzeilen ohne eval, innerHTML-Zuweisungen, Netzaufrufe, Schlüssel oder localStorage.clear; kein vollständiges Sicherheitsaudit.

## Windows-Testpaket

`.output/navigation-terminus/RATHAUS-NAVIGATION-Windows-8c5483b94965.zip`,472450Byte, SHA256 `4b5051dbf7a23786b3831dec40de0026e119504c778af89392f309daddd21418`.138 explizit committete Laufzeit-/Rathausdokumentdateien plus START-RATHAUS.cmd und TESTSTAND.txt. ZIP-Integrität und jeder archivierte Produktinhalt gegen `git show` geprüft. Entpacktes Paket im Linux-Chrome direkt per file:// mit Startseite/Praxiswelten und Rathausstart ohne Laufzeitausnahme geöffnet. Erste Paketprobe über relativen Helfer mit absolutem Pfad scheiterte (Helfer verwendet path.join); nach Lesen von Helfer und entpacktem index direkte Page.navigate-file-URL genutzt, erfolgreich. Kein Produktfehler.

**Windows/Edge, NVDA und manuelle Windows-Zoom-/Tastaturprüfung nicht ausgeführt.** Lokale file-Speicher bleiben browser-/pfadabhängig; keine garantierte Übernahme beim Umzug in anderen Entpackordner. Lehrkraftmodus keine echte Zugriffsschranke. Kein Push/Merge/Deployment/Produktionsfreigabe.

Weitere Sichtprüfung `.output/navigation-terminus/b02-narrow.png`:360CSSpx, beide Rathausmenüs geöffnet. Ämterliste alphabetisch mit inaktiven Vorschauämtern, B02 sichtbar aktiv, Eltern-Zurück getrennt vom kleineren Breadcrumb, Controls nicht seitlich abgeschnitten. Für das Bild nach Fallwechsel und Scroll zur Navigation auf gesetzten Fokus-/Scrollzustand gewartet; erster zu früher Capture zeigte stattdessen den Falltitel. Keine Produktänderung.

Zusatzcheck geöffnete Menüs:320/360/400px × hell/dunkel/kontrast mit150%Text+Abstand **9/9**, kein Seitenüberlauf und kein sichtbarer Menübutton/Summary unter24px Höhe (`open-menus.json`). Erster Testversuch nutzte irrtümlich eine nicht existierende öffentliche ANZEIGE_LESEN.speichern-Methode; nach Lesen des tatsächlichen API-Exports und Zoomtests Einstellungen über den bestehenden lokalen Schlüssel mit Neuladen aktiviert. Kein Produktfix erforderlich.
