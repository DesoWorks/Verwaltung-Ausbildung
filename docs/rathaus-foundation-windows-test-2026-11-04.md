# FOUNDATION & EXPANSION – konkrete Windows- und NVDA-Prüfung

Stand 04.11.2026. Prüfanleitung, **kein Nachweis ausgeführter Windows-/NVDA-Tests**. Produktstand: `11730be79ffce5c2c378fb11d71b9ead46a21473`, Branch `feature/operation-rathaus-mvp1`. Spätere reine Dokumentationscommits ändern den Produktstand nicht. Die ältere MVP2-Anleitung beschreibt bei B01 noch drei statt fünf Bewertungsbereiche und enthält die neue ausdrückliche vierte Regelnantwort nicht; für diesen Auftrag diese Anleitung verwenden.

## Vorbereitung

- Den vollständigen Rathaus-Worktree auf den Windows-Rechner kopieren, nicht nur die HTML-Datei. Keine Dateien aus dem anderen BWL-Checkout beimischen. Keine Produktionsveröffentlichung nötig.
- In einem eigenen Testbrowserprofil arbeiten. Bereits vorhandene echte Lernstände nicht löschen. Für Migrationstests eine Kopie des Testprofils oder gezielte Testdaten nutzen.
- Edge/Chrome-Version, Windows-Version, NVDA-Version, Datum, Auflösung/Zoom und geprüften Commit notieren.
- `index.html` per Doppelklick öffnen; Adresse beginnt mit `file:///`. Dann über Praxiswelten das Rathaus öffnen. Zusätzlich später `module/rathaus.html` direkt öffnen. Ein lokaler Server ist dafür nicht erforderlich.
- Netzverbindung kann während des Tests getrennt werden. Erwartung: keine externen Schrift-/Script-/API-Abhängigkeiten. Bei blockiertem Dateispeicher sichtbare Meldung notieren; nicht als erfolgreiche Persistenz werten.

## A. Anzeige & Lesen plattformweit

1. Hauptnavigation öffnen, „Anzeige & Lesen“ aufklappen. Nicht eine separate Einstellungsseite suchen: Es ist ein natives aufklappbares Steuerelement.
2. Mit Tab den Textgrößenregler erreichen; per Pfeiltasten auf 150 % stellen. Abstandsschalter aktivieren, Darstellung Dunkel auswählen und Bewegungen reduzieren einschalten. Erwartung: beschriftete Kontrollen, hör-/sichtbarer Zustand; kein Mauszwang.
3. Startseite, Glossar, eine Unterrichtsseite, Stadtübersicht, Personalamt, Bürgerbüro-Übersicht und B01 öffnen. Erwartung: größere Texte und Abstände überall, passende dunkle Flächen/Felder, lesbare Rückmeldungen. Danach Kontrast, dann Hell prüfen. Inhalt/Erledigungsstände ändern sich dadurch nicht.
4. Fenster auf etwa 390–400 px verkleinern; bei 150 % plus Abständen prüfen. Erwartung: Text wächst auch mobil, keine verdeckten Optionen/Abschlussknöpfe und kein unbedienbares Panel. Browserzoom zusätzlich getrennt notieren.
5. Reload und Wechsel zurück zur Startseite: gewählte Einstellungen wiederhergestellt, soweit der Browser Dateispeicher erlaubt. Bei `file:` kann die Speicherzuordnung browserabhängig sein: tatsächliche Wirkung pro Seite notieren, nicht voraussetzen.
6. In Windows „Animationseffekte“ ausschalten. Erwartung: reduzierte Bewegung bleibt wirksam, auch wenn die eigene Bewegungscheckbox aus ist. Das Panel erklärt die Systemvorgabe. Anschließend ursprüngliche Systemeinstellung wiederherstellen.
7. Nur Anzeige auf Standard zurücksetzen: Fälle/Entwürfe bleiben erhalten.

## B. B01 leere und falsche Antwort

1. Bürgerbüro → Fall B01 öffnen. Bestehenden Teststand nötigenfalls über den fallbezogenen Reset zurücksetzen, nicht Browserdaten global löschen.
2. Alle richtigen Angaben wie im Erfolgsweg unten setzen, aber die **untere Frage in Regeln leer lassen**. „Auswertung prüfen“: Regeln noch nicht vollständig, Hinweis auf nicht beantwortete Frage, Abschluss gesperrt.
3. Untere Frage: „Für die Anmeldung muss eine bestimmte Gebühr bezahlt werden“ wählen. Erwartung: nur ein Radioknopf aktiv, Regeln falsch, Abschluss gesperrt. Auch die zwei anderen falschen Alternativen einzeln prüfen.
4. Vierte Option „Keine dieser Aussagen trifft zu.“ wählen: nun kann der Regelbereich richtig sein. Sie darf beim frischen Fall nicht vorausgewählt sein.

## C. B01 kompletter Erfolgsweg

- Anliegen: Anmeldung nach Zuzug; maßgebliches Einzugsdatum 09.11.2026; keine weitere Wohnung.
- Unterlagen: Ausweis liegt vor und passt; Mietvertrag liegt vor, ersetzt Nachweis nicht; Wohnungsgeberbestätigung fehlt; elektronisches Zuordnungsmerkmal fehlt.
- Regeln oben: alle vier Regeln (BMG17/BMG19/BMG23/Übungszuständigkeit) markieren; unten ausdrücklich vierte Option.
- Vorbereitung: Mitteilung aufnehmen und zur weiteren Klärung vorbereiten.
- Antwort: Anliegen, fehlender Nachweis, Mitteilung aufgenommen, nächster Schritt, Anmeldung noch nicht abgeschlossen. Keine verbotenen Bausteine.
- Freitext zunächst leer lassen. „Auswertung prüfen“: **fünf Bereiche richtig**, Abschluss aktiv. Abschließen: klare Übungsabschlussmeldung, keine Behauptung einer tatsächlich ausgeführten Anmeldung.

## D. Auswertung, Speicher und isoliertes Reset

1. Nach positiver Bewertung ein strukturiertes Feld ändern: Ergebnis/Abschluss sofort ungültig; nach Reload nicht wieder grün. Erneut richtig beantworten und prüfen.
2. Danach nur Freitext ändern: ebenso erneute Prüfung erforderlich. Feld ist ungefähr vier Zeilen hoch, volle Breite und manuell vertikal vergrößerbar. Der Text bleibt als **nicht automatisch geprüfter Entwurf** erkennbar und nach Reload erhalten.
3. Mietvertrag fälschlich als passend werten bzw verbotenen Baustein „Anmeldung abgeschlossen“ ergänzen: fachliche Sperren bleiben, auch bei ansonsten richtigen Antworten.
4. Migration (nur Testprofil): alten B01-r2-Stand mit Array `fallen: []` und positivem Ergebnis laden. Erwartung: übrige bekannte Eingaben/Entwurf gerettet, untere Frage leer, alte Auswertung und Abschluss verworfen; vierte Antwort muss neu gewählt und geprüft werden. Kein „leeres Array = richtig“ mehr. Manipulierte oder beschädigte Daten dürfen nicht zu einem bestandenen Fall führen.
5. B01-Reset abbrechen: keine Änderung. Bestätigen: nur B01 leer; gespeicherte Luca-/Noelle-Stände und Anzeige unverändert. B02/B03 bleiben geplant/nicht startbar.

## E. Personalamt und Navigation

- Luca und Noelle jeweils öffnen, Nachricht/Akte lesen, anhand fallbezogener Lehrkraftkriterien korrekt bearbeiten, prüfen und abschließen. Falscher Brief bleibt gesperrt; Änderung nach Auswertung sperrt erneut.
- Zwischen beiden Fällen sowie Stadt/Bürgerbüro/Nachschlagen wechseln und neu laden. Entwürfe und getrennter Fortschritt bleiben erhalten. Lehrkraftmodus zeigt den passenden Fall, nicht versehentlich eine fremde Musterlösung.
- Nur Tastatur: Tab/Shift+Tab, Enter/Leertaste, Pfeiltasten bei Radios/Select/Slider. Fokus sichtbar; nach Ansichtswechsel auf sinnvoller Überschrift; aufklappbare Hilfen nachvollziehbar, keine Fokusfalle. Browser-Zurück und interne Rücknavigation separat prüfen.

## F. NVDA separat protokollieren

NVDA starten. Ohne Maus dieselben Kernwege in einem eigenen Testprofil prüfen:

- Hauptnavigation und Anzeige-Panel verständlich benannt; Sliderwert, Umschaltzustand, Darstellung und Checkbox werden korrekt gesprochen.
- Untere Regelnfrage als benannte Gruppe und **Einfachauswahl mit vier Optionen**; Status und Auswahl nachvollziehbar. Oben Mehrfachauswahl bleibt davon unterscheidbar.
- Dokumentstatusfelder/Antwortentwurf besitzen zugeordnete Beschriftungen; Pflicht-/Fehlerhinweise sind auffindbar.
- Auswertung und Invalidierung werden sinnvoll, nicht bei jedem Tastendruck ständig angesagt. Nach Abschluss Fokus/Status verständlich.
- Rein visuelle Häkchen/Farben sind nicht die einzige Statusinformation. Verborgene Ansichten werden nicht mitgelesen.

## Protokollformat und Abnahmegrenze

Je Schritt: `Schritt | bestanden / Fehler / nicht geprüft | Ist/Soll | Browser/Umgebung | Beleg`. Fehler mit genauer Klick-/Tastenfolge und Screenshot bzw NVDA-Sprachausgabe festhalten. Windows ohne NVDA bestätigt keine Screenreader-Abnahme; Linux-Chrome bestätigt weder Windows noch NVDA. Nicht ausgeführte Prüfungen bleiben offen, auch wenn automatisierte Tests grün sind.
