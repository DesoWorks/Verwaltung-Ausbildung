# Operation RATHAUS – Rückmeldung aus dem Windows-Durchlauf

Stand: 01.11.2026. Nur Dokumentation. Keine Umsetzung, keine Unterrichtsfreigabe.

Worktree: `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`  
Branch: `feature/operation-rathaus-mvp1`  
Anwendungscode zuletzt geändert in: `79f4e6d41661a60b600885613c19259358240360`  
Diese Notiz hängt an der Phase-D-Auswertung `docs/rathaus-phase-d-auswertung.md`. Sie ersetzt sie nicht.

## Was geprüft wurde

Dennis und Nexus haben MVP-1 unter Windows über `module/rathaus.html` manuell durchgespielt.

Belegt aus ihrer Rückmeldung, nicht aus einer neuen Crew-Prüfung:

- Der vollständige 7-Schritte-Vorgang funktioniert grundsätzlich.
- Falsche oder unvollständige Antworten werden beanstandet.
- Korrekturen sind möglich.
- Die erneute Auswertung funktioniert.
- Der Vorgang konnte abgeschlossen werden.

Das ist ein bestandener manueller Durchlauf durch Commander und Nexus. Es ist keine unabhängige Browserprüfung durch GLaDOS und keine Produktionsfreigabe.

GLaDOS-Browserprüfung bleibt **NICHT AUSGEFÜHRT**. Läufe `73d8a3a0-c104-4ccc-b7ba-cf5197906c22` und `a2ca5c13-3f7c-4226-a67c-7d23fd63e8af`, beide auf `79f4e6d`. Der Testbrowser öffnete die lokale Seite nicht. Nur ein Startseitenbild. Die 13 Kerntests bleiben eine Kernprüfung.

## Herkunft der sechs Punkte

Die sechs Punkte sind Beobachtungen aus dem Durchlauf. Sie sind keine neuen Unterrichtsvorgaben aus den Scans. Vorschläge darunter sind didaktisch, nicht als Gesetzestext zu lesen.

Fundstellen im aktuellen Kern, nicht geändert:

- `js/rathaus-kern.js`: Akte, Entscheidungen, Begründungen, `sagtFreistellung`, `hilfe`, Glossarbegriffe
- `js/rathaus-ui.js`: Hilfeknopf nur aufwärts, Auswertungstext „Tragfähig“ / „Noch nicht tragfähig“
- `tests/rathaus-kern.test.js`: keine Prüfung der umgekehrten Freistellung, keine Prüfung eines Hilferückschritts

## 1. „abbedungen“

Ist-Stand, zwei Stellen:

- Ausbildungsakte: „Sie kann nicht durch eine mündliche Anweisung oder wegen Personalmangels abbedungen werden.“
- Falle in der Begründung: „Im Ausbildungsvertrag kann die Berufsschule abbedungen werden.“

Das Glossar im Vorgang erklärt Freistellung, Ausbildungszweck und Berufsschultag. „abbedingen“ fehlt.

Gewünscht: In der Akte einfache Sprache. Den Fachbegriff im Glossar erklären.

Vorschlag, nicht gebaut:

- Akte: „Eine mündliche Anweisung oder Personalmangel kann diese Pflicht nicht aufheben.“
- Glossar: „abbedingen: in einem Vertrag etwas anderes festlegen, als das Gesetz vorsieht. Die Falle in diesem Fall behauptet, die Berufsschule lasse sich so wegvereinbaren. Das geht hier nicht.“
- Die Falle darf das Wort behalten, sonst prüft sie den Begriff nicht. Daneben ein kurzer Klartext, damit die Falle ohne Vorwissen lesbar ist.

Das ist eine Textkorrektur am bestehenden Fall, kein neuer Vorgang.

## 2. Antwortmöglichkeiten

Ungeeignet, wörtlich:

- Entscheidung B: „Die Dienststelle darf ihn nicht statt zur Schule einteilen.“
- Entscheidung D: „muss danach aber noch den ganzen Tag Schalter machen.“

„Einteilen“ und „Schalter machen“ passen nicht zur sachlichen Verwaltungsoberfläche. Der Schalter in Svens Nachricht und in der Bereichsvorschau „Bürgerbüro“ ist der Sachverhalt, kein Lernenden-Slang.

Vorschlag, nicht gebaut:

- B: „Luca ist für den Berufsschultag von der Arbeit freizustellen. Die Dienststelle darf ihn an diesem Tag nicht zur Arbeit einsetzen.“
- D: „Luca geht zur Schule und muss danach noch den ganzen Tag am Schalter arbeiten.“

A und C sind verständlich und bleiben, bis jemand sie ausdrücklich ändern will. Die fachliche Zuordnung bleibt: nur B ist richtig, D bleibt falsch.

## 3. Gesetzesgrundlagen, ohne die Lösung vorwegzunehmen

Ist-Stand: Die Begründungstexte nennen die Folge schon mit. Beispiel BBiG § 15: „Bei mehr als fünf Unterrichtsstunden an einem Tag, einmal in der Woche, gilt die Freistellung für den Tag.“ Wer den Kasten liest, hat die Entscheidung fast fertig.

Hilfestufe 3 sagt zusätzlich: „Die passende Entscheidung ist die Freistellung für den ganzen Berufsschultag.“ Das ist Richtung, kein Musterbrief. Der Test verlangt genau diese Richtung und verbietet nur den Mustertext.

Gewünscht ist etwas anderes: das Gesetz verständlich erklären, ohne die richtige Wahl zu verraten.

Vorschlag, nicht gebaut:

- Kurze Kästen bleiben als Auswahl.
- Eine einklappbare Erklärung sagt in einfachem Deutsch, was Freistellung, Unterrichtsstunde und „einmal in der Woche“ bedeuten. Sie sagt nicht, welche Karte richtig ist.
- Hilfestufe 3 bleibt die letzte Richtung. Sie wird nicht in die Gesetzeserklärung vorgezogen.

Das ist ein didaktischer Vorschlag. Die Scans enthalten dafür keinen fertigen Erklärungstext.

## 4. Hilfestufen zurück oder einklappen

Ist-Stand: Der Knopf setzt `hilfeStufe` nur nach oben, höchstens auf 3. Ein zweiter Weg nach unten fehlt. Auf Stufe 3 ändert ein weiterer Klick nichts. Die Stufe liegt in `localStorage` unter `verwaltung-ausbildung.rathaus.v1` und bleibt über den nächsten Besuch. Nur das Zurücksetzen in der Lehrkraftansicht setzt sie auf 0.

Gewünscht: zurückschalten oder einklappen.

Vorschlag, nicht gebaut:

- „Weniger Hilfe“ bis Stufe 0.
- Stufe 0 zeigt keinen Hilfetext.
- Die angezeigte Stufe und `aria-expanded` müssen zum Text passen.
- Beim späteren Bau ein kleiner Test: von 2 auf 1, und von 1 auf 0 ohne Text.

## 5. Automatische Textbewertung

Beobachtung, wörtlich aus der Rückmeldung: „Eine fachsprachlich ungenaue Formulierung zur Freistellung von der Berufsschule wurde akzeptiert.“

Der genaue Satz aus Windows liegt hier nicht vor. Die Ursache im Code ist sichtbar.

`sagtFreistellung` akzeptiert jedes Vorkommen von `freistell`, `freigestellt`, `freizustellen`, außerdem `zur berufsschule`, `in die berufsschule` und `berufsschule besuchen`.

Damit besteht unter anderem ein Satz, der die Richtung umdreht:

„Luca Berger erhält eine Freistellung von der Berufsschule und muss an diesem Tag nicht zum Unterricht.“

„Freistellung von der Berufsschule“ meint hier das Gegenteil der Übung: nicht von der Arbeit zur Schule, sondern von der Schule weg. `verlangtAusfall` fängt diesen Satz nicht. Der vorhandene Test prüft nur eine passende Antwort und eine Antwort, die den Schulbesuch ausdrücklich ausfallen lässt.

Das ist ein bestätigter Bewertungsfehler, nachgestellt aus dem Code, nicht aus dem Originalsatz des Durchlaufs. Gegenprobe am 01.11.2026 mit `node` und `js/rathaus-kern.js`: der umgekehrte Satz und ein Satz, der nur „zur Berufsschule“ sagt, kommen beide mit `ok: true` zurück. Die passende Musterantwort auch.

Vorschlag für den späteren Fix, nicht gebaut:

- Umgekehrte Richtung ablehnen: „von der Berufsschule freigestellt“, „Freistellung von der Berufsschule“, „nicht zum Unterricht“, wenn damit die Schule entfällt.
- Eine richtige Antwort muss die Freistellung zur Berufsschule oder von der Arbeit sagen.
- „zur Berufsschule“ allein reicht nicht mehr.
- Regressionstest: der umgekehrte Satz besteht mit dem heutigen Code und darf nach dem Fix nicht bestehen. Die vorhandene passende Antwort muss bestehen bleiben.
- Wenn der Originalsatz aus Windows noch vorliegt, den Test daran hängen, nicht nur an diesem rekonstruierten Satz.

## 6. Rückmeldungen am Lernprozess

Ist-Stand: Die Auswertung sagt entweder „Tragfähig. Die Entscheidung, die Begründung und die Antwort passen zusammen.“ oder „Noch nicht tragfähig. Du kannst alles ändern und es erneut versuchen.“ Darunter steht eine Hinweisliste mit Anweisungen wie „Wähle mindestens …“ und „Schreibe klar …“.

Das blockiert den Fall nicht. Es sagt aber kaum, was schon passt, welcher Schritt offen ist und woran die nächste Prüfung ansetzen soll.

Vorschlag, nicht gebaut:

- Zuerst nennen, was schon trägt.
- Dann einen nächsten Blick, ohne Musterbrief: Alter und Stundenzahl in der Akte, Richtung der Freistellung, keine Falle.
- Die falsche Richtung „von der Berufsschule“ ausdrücklich als Verwechslung erklären, sobald Punkt 5 sie erkennt.
- Mehrere Versuche bleiben erlaubt.

## Abgleich mit Phase D

Die bisherige Reihenfolge in `docs/rathaus-phase-d-auswertung.md`, noch nicht gebaut:

1. Kennzeichnung des vorhandenen Falls korrigieren.
2. Nachschlagekarte zu den Begriffen von PDF-Seite 3 und zum dualen System.
3. Zweiter Vorgang nach Rollenkarte 12.
4. Kündigungsfälle erst auf heutigem § 22.
5. Anfrage und Angebot nicht in diesen Ausbau.

Die sechs Punkte ändern diese Reihenfolge. Sie sind Qualitätskorrekturen an dem Fall, der unter Windows bereits benutzbar ist. Ein zweiter Vorgang verbessert den Unterricht erst, wenn dieser Fall sprachlich und in der Bewertung stimmt.

Neue vorgeschlagene Reihenfolge, weiterhin nicht gebaut:

1. Die sechs Punkte als ein Paket am bestehenden Fall. Text, Glossar, Hilfe zurück, Bewertung, Lernrückmeldung. Jede Bewertungs- und Hilfeänderung mit Regressionstest. Die veraltete Zeile „Scans nicht vollständig ausgewertet“ kann in demselben Textpaket weg, weil sie dieselbe Lehrkraftansicht betrifft.
2. Danach die Nachschlagekarte aus Phase D. „abbedingen“ gehört in das Vorgangsglossar, nicht erst in diese Karte. Die Karte bleibt für Begriffsraster und duales System.
3. Rollenkarte 12 und Karte 1 bleiben der spätere zweite Vorgang. Der Windows-Durchlauf ersetzt diese Entscheidung nicht. Er zeigt nur, dass der vorhandene Fall vorerst bleiben und verständlicher werden soll.
4. Kündigung, Anfrage und Angebot bleiben wie in Phase D zurückgestellt.

Nicht aus den Scans ableiten: Die sechs Formulierungen sind Review, keine neue Rechtslage. Rechtsstand der Übung bleibt 01.11.2026, nichtamtlich, vorläufig.

## Offene Entscheidungen

Für Dennis und Nexus, nicht für die Crew:

1. Wird das Korrekturpaket der sechs Punkte der nächste Bau, oder nur ein Teil davon?
2. Bleibt der Dienstag-Fall für dieses Paket stehen? Empfohlen: ja. Ob Rollenkarte 12 ihn später ersetzt, ist weiter offen.
3. Liegt der genaue Windows-Satz zur falschen Freistellung noch vor? Ohne ihn nutzt der spätere Test den rekonstruierten Satz aus Abschnitt 5.
4. Reicht der manuelle Windows-Durchlauf für den Unterrichtsversuch, oder wird weiter auf eine echte GLaDOS-Browserprüfung gewartet? Beides ist nicht dasselbe.
5. Unverändert offen aus Phase D: benannte Lehrbuchfirmen oder nur Sonnenthal, und der Tippfehler im Notion-Titel „Verwaltug-Ausbildung“.

Die Notion-Planungsseite vom 01.11.2026 kennt diese neue Reihenfolge nicht. Diese Datei ist der aktuelle Abgleich.

## 7. Interne Angaben aus der Oberfläche

Verbindliche Ergänzung vom 01.11.2026, noch nicht gebaut.

Interne Projektinformationen dürfen weder in der Lernansicht noch in der Lehrkraftansicht stehen. Insbesondere nicht:

- Hinweise auf gescannte Unterrichtsmaterialien und deren Auswertungsstand
- interne Datei- und Verzeichnisnamen
- VPS-Pfade
- interne Entwicklungs- und Agenteninformationen

Solche Angaben bleiben in der internen Projektdokumentation. Fachlich öffentliche Quellen bleiben: Gesetze, KMK-Rahmenlehrplan, Rechtsstand.

Heute sichtbar, nur in der Lehrkraftansicht, `js/rathaus-ui.js` gibt `lehrkraftLoesung().quellen` und `unsicherheit` aus:

- Quelle in `js/rathaus-kern.js`: „Scans unter /home/starnet/unterrichtsmaterial/verwaltung/, nicht ins Repository kopiert. LS03, LS04 und LS06 sind auf den geprüften Seiten nicht als solche beschriftet und nicht vollständig eingearbeitet.“
- Unsicherheitstext: „Die gescannten Unterlagen sind da, aber nicht vollständig ausgewertet …“

Die Lernansicht zeigt diese beiden Texte nicht. Sie zeigt die Fallkennung `berufsschule-statt-dienststelle`. Das ist eine interne Kennung, kein Gesetz. Sie gehört bei der Überarbeitung aus der sichtbaren Zeile.

Nicht entfernen, solange niemand das ausdrücklich ändert: der Warnbanner „Nur lokaler Test. Keine echte Rollenprüfung. Nicht produktiv. Keine Schülerdaten.“ Das ist die verlangte Absicherung des lokalen Lehrkraftmodus, kein Scan-Hinweis und kein Pfad.

Beim späteren Bau ein Regressionstest: die an die Oberfläche gegebenen Quellen und der Unsicherheitstext dürfen `/home/starnet`, `unterrichtsmaterial`, `VPS` und Scan-Auswertungsstand nicht enthalten. BBiG, JArbSchG, KMK und der Rechtsstand 01.11.2026 müssen bleiben.

Diese Regel rückt in dasselbe Korrekturpaket wie die sechs Punkte. Sie ist keine neue Funktion.

## Umsetzungsvermerk Korrekturpaket (01.11.2026)

Umgesetzt auf `feature/operation-rathaus-mvp1`, lokal committet, nicht gepusht. Reihenfolge: (1) umgekehrte Freistellung wird abgelehnt, (2) sachliche Formulierungen und Glossar „abbedingen“, (3) Gesetzeserklärung ohne Lösung, einklappbar, (4) Hilfe mehr, weniger, einklappen, (5) Rückmeldung mit „Das passt schon“ und „Dein nächster Blick“, (6) interne Pfade, Scan-Hinweise und Fallkennung aus den Nutzeransichten entfernt.

Geprüft mit `node --test tests/rathaus-kern.test.js` (Kerntests und Textprüfungen der Oberfläche). Eine Browserprüfung wurde NICHT AUSGEFÜHRT. Die Bedienung der Knöpfe, des Einklappens und der Fokussetzung ist am Windows-Rechner noch zu prüfen. Unabhängige Prüfung durch GLaDOS steht aus.
