# Personalamt – enger Vorschlag für Rücksprünge nach der Auswertung

08.11.2026 · Terminus für Rick · Curriculum Forge II.
Basis: `pre-dev/verwaltung-aktuell`, `74baabe986eccb874907a619d6cf673f9c3a5977`. Nur Untersuchung und Vorschlag; kein Patch, keine JS-Änderung, kein Commit. LF1-C und Bürgerbüro bleiben unberührt. Keine neue Rechtsprüfung und keine Browserprüfung.

## Nachvollzogener Fehler

Luca Berger und Noelle Kranz verwenden dieselbe Personalamt-Oberfläche: `setzeFall()` in `js/rathaus-ui.js:46–51` wechselt Kern/Falldaten/Katalog. Die Funktion `fuelleAuswertung()` (ca. Zeile 483) zeichnet ihre drei Teilbewertungen in Zeilen 499–511 ausschließlich als Listeneinträge mit Text/Status. Kein Button und kein Click-Handler führen von dort zur jeweiligen Eingabe zurück.

`schritte()` (ca. 202) kennt genau sieben Schritte: Nachricht, Akte, Entscheiden, Begründen, Antwort, Auswertung, Abschluss. `fortschritt()` (ca. 215–229) zeichnet ebenfalls nur Listeneinträge, keine Navigation. Ein allgemeiner Umbau dieser Fortschrittsleiste ist für den Fehler nicht nötig.

Vorhandenes Muster, ausschließlich gelesen: `js/rathaus-aufgabenfluss.js:320–338` baut in der Auswertung „Zu Schritt …“-Buttons für offene Einträge, setzt type=button und einen beschreibenden aria-label und ruft `gehe(o.i, true)` auf. Das ist die interne Bürgerbüro-Schrittnavigation; sie ist nicht die passende Funktion für Personalamt. Nicht übernehmen, ändern oder auf B01–B04 ausweiten.

## Vorhandener Ansichtswechsel

- `zeige(ansicht, modus)` in `js/rathaus-ui.js:180–186` setzt die Ansicht, speichert, zeichnet und fokussiert verzögert `ansicht-titel`.
- `zeichnen()` (ca. 1144–1165) verteilt `post` an `zeichnePost`, `akte` an `zeichneAkte`, `vorgang` an `zeichneVorgang`.
- `post` ist nur die Nachrichtenübersicht (`zeichnePost`, ca. 379–399). Der Nachrichtentext selbst steht in `vorgang` (ca. 620–623).
- `oeffneNachricht(id)` (149–154) setzt `gelesen=true` und öffnet `vorgang`; kann außerdem den aktiven Fall wechseln. Daher nicht blind für einen neutralen Korrektursprung verwenden.
- `zeichneAkte()` (401–429) setzt beim regulären Öffnen `akteGelesen=true`. Das ist ein Leseereignis, keine Antwortänderung, muss in Tests aber ausdrücklich berücksichtigt werden.

## Zielzuordnung – nur existierende Schritte

| Inhalt / Schritt | Ansicht | Genaues Ziel | Verwendung nach Auswertung |
| --- | --- | --- | --- |
| 1 Nachricht lesen | `vorgang`, wenn Nachricht schon geöffnet; ansonsten `post` | Nachrichtenüberschrift in `zeichneVorgang:621`; noch ohne ID | Optionaler Nachleseverweis. Die Übersicht allein zeigt nicht den Nachrichtentext. Bei ungelesener Nachricht keine automatische Erledigung durch den Sprung. |
| 2 Akte öffnen | `akte` | bestehendes `ansicht-titel` in `zeichneAkte:402–404` | Button am vorhandenen Hinweis „Öffne zuerst die Ausbildungsakte …“, wenn `!state.akteGelesen`; keine erfundene falsche Teilbewertung. |
| 3 Entscheiden | `vorgang` | Entscheidungsgruppe `gruppe(...)` um 670; vorhandenes `data-licht-feld="entscheidung"` | Teilbewertung „Entscheidung“ (`teilbewertungen:453`) mit wert=false. |
| 4 Begründen | `vorgang` | Begründungsgruppe um 687; vorhandenes `data-licht-feld="gruende"` | Teilbewertung „Begründung“ (`teilbewertungen:454`) mit wert=false. |
| 5 Antwort schreiben | `vorgang` | vorhandenes Textfeld `antwort-text`, ca. 723; besser zusätzlich fokussierbare Abschnittsüberschrift um 718 | Teilbewertung „Antwortbrief“ (`teilbewertungen:455`) mit wert=false. |

Schritte 6 und 7 sind keine Korrekturziele für Fehler in Antworten. Keine Nummer aus einer Arrayposition ungeprüft zum Link machen. Feste erlaubte Zuordnung zu den fünf tatsächlich vorhandenen Schritten und Prüfung des jeweiligen DOM-Ziels. Unbekannte Kennung: kein Button. Für wert=null („Noch nicht geprüft“) nicht behaupten, die Antwort sei falsch; entweder neutraler Verweis bei vorhandenem Ziel oder weiterhin nur Text. Die kleinste Umsetzung setzt Fehlerbuttons nur für wert=false.

Die drei Teilbewertungen enthalten bislang keine Bewertungen für Nachricht/Akte. Deshalb keine zusätzlichen scheinbaren Fachnoten erzeugen. Allgemeine Textlisten `naechsterBlick`/`hinweise` (ca. 522–526) nicht über Wortsuche oder freie Textinterpretation irgendwelchen Schritten zuordnen.

## Enger Umsetzungsumfang nach Freigabe

1. Nur in `rathaus-ui.js` feste Zielmetadaten für Entscheidung, Begründung und Antwortbrief ergänzen, nahe `teilbewertungen()` (448–457) oder als getrennte kleine Zuordnung. Die bestehende Bewertung bleibt unverändert.
2. In `fuelleAuswertung()` (501–511) an falschen Einträgen je einen Button „Zu Schritt 3: Entscheiden“, „Zu Schritt 4: Begründen“ bzw. „Zu Schritt 5: Antwort schreiben“ ergänzen. type=button, klarer zugänglicher Name. Vor `if (!ergebnis) return` (495–498) keine Ergebnisbuttons erzeugen. Aktenbutton gesondert am bestehenden Aktenhinweis.
3. Für den Sprung vorhandenes `zeige("vorgang")` bzw. `zeige("akte")` verwenden; wenn schon in `vorgang`, reicht direktes Fokussieren/Scrollen und vermeidet unnötiges Neuzeichnen. Zielüberschriften 1/3/4/5 benötigen stabile IDs und tabIndex=-1; diese sind dort bisher nicht vorhanden. IDs als geplante Ergänzung kennzeichnen, nicht als bestehend voraussetzen.
4. Fokus erst nach dem Neuzeichnen auf das echte Ziel setzen und dieses in den sichtbaren Bereich scrollen. `zeige()` plant selbst `fokus("ansicht-titel")` per setTimeout (`fokus:173–178`); eine sofortige zweite focus()-Anweisung würde dadurch später überschrieben. Den Ziel-Fokus zeitlich nach diesem Aufruf ausführen oder die vorhandene Funktion eng um ein optionales Fokusziel erweitern. Kein globaler Navigationsumbau.

## Zustand und Fehlermarkierungen erhalten

- Ein Sprung ist Navigation, keine neue Auswertung und keine Eingabe. Nicht `eingabeGeaendert()` (588–603), `kern.nachPruefung()` oder Eingabe-Events auslösen. `entscheidung`, `gruende`, `antwort`, `lichtStand`, `letzteAuswertung`, `versuche`, `abgeschlossen` müssen unverändert bleiben; aktiver Fall ebenfalls. `zeige()` darf wie bisher die Ansicht speichern.
- `zeigeLichter()` (572–580) verwendet `kern.lichtAntworten(state)` und den gespeicherten `lichtStand`; `zeichneVorgang()` ruft es nach Aufbau des Formulars auf (755). Dadurch können die vorhandenen Fehlermarkierungen der Entscheidung und Gründe nach dem Sprung wieder erscheinen, solange der Snapshot nicht gelöscht oder ersetzt wird.
- Ein unverändert ausgewerteter Schritt behält seinen bisherigen Status. Erst eine tatsächliche Eingabeänderung führt weiter durch die bestehenden Handler (678–680,694–697,729–731) zur Invalidierung; keine neue Sonderbewertung beim Navigieren.
- Antwortbrief: In diesem Code sind `lichtSets` nur an Entscheidung und Gründen angebunden. Für den Brief keine schon vorhandene Feldampel behaupten. Vorhanden sind die Teilbewertung der Auswertung und die Schrittmarkierung über `nichtRichtig(2)`. Der Sprung soll diese erhalten und zum Brief führen, nicht ungefragt ein neues Bewertungssystem ergänzen.
- Öffnen der Akte markiert sie regulär gelesen. Eine noch gesperrte alte Auswertung wird dadurch nicht neu bewertet: `letzteAuswertung.darfAbschliessen` bleibt unverändert; anschließend muss ausdrücklich erneut ausgewertet werden. Dieses Verhalten entspricht dem vorhandenen Text in `naechsterSchritt()` (475–480).

## Keine Lösungen vor der Auswertung

`fuelleAuswertung()` kehrt ohne `letzteAuswertung` vor der Ergebnisliste zurück. Diesen Schutz beibehalten. Buttons dürfen keine Sollantworten, Musterbriefe oder Auswahländerungen transportieren. `zeigeLichter()` bleibt an den vorhandenen Bewertungs-Snapshot gebunden. Die vorhandenen Lern-Grundlagen vor Schritt 3 sind Unterricht, keine neue Auswertung; die Musterlösung bleibt ausschließlich in der Lehrkraftansicht (Hinweis ca. 734). Der Vorschlag öffnet diesen Modus nicht.

## Abnahmekriterien für spätere Implementierung

1. Je Luca und Noelle falsche Entscheidung, falsche Begründung und mangelhaften Brief auswerten. Zugehörige Buttons führen sichtbar und mit Tastaturfokus zu 3/4/5; vorhandene Fehlermarkierungen bleiben.
2. Zustandsvergleich unmittelbar vor/nach Klick: Antworten, Bewertungssnapshot, letzte Auswertung, Versuche und Abschluss gleich; kein Wechsel zum anderen Fall, keine Veränderung dessen Speicherstand.
3. Richtigen und falschen ausgewerteten Schritt ohne Bearbeitung verlassen und wieder öffnen: Status bleibt. Erst tatsächliche Änderung verlangt neue Auswertung.
4. Frischer Versuch: keine Ergebnis-/Lösungsanzeige und keine Fehlerbuttons. Nach Änderung: vorhandene Regeln für veraltete Auswertung bleiben wirksam.
5. Nicht vorhandenes Ziel / unbekannte Kennung: kein defekter Sprung. Aktenhinweis öffnet Akte, nicht Schritt 3; Bekanntgabe der Nachricht landet im Nachrichtentext bzw. bei ungelesenem Stand im Posteingang.
6. Tastatur Enter/Leertaste, Fokus sichtbar, kein Formular-Submit; kleiner Bildschirm/Zoom: Ziel und bestehende Markierung im Sichtbereich. Windows-Sichtprüfung ausdrücklich noch auszuführen.
7. B01–B04 vorhandene „Zu Schritt“-Abläufe unverändert regressionsprüfen; deren JS-Dateien bleiben außerhalb dieses Umsetzungsvorschlags.

## Nachweisgrenze

Fehlen der Personalamt-Buttons und bestehende Ansichts-/Zustandspfade sind am Quelltext belegt. Es wurde weder ein Patch erstellt noch die vorgeschlagene Funktionalität als lauffähig getestet. Umsetzung wartet auf Ricks Abgrenzung zur parallelen Arbeit; dieses Dokument allein behebt den Fehler nicht.
