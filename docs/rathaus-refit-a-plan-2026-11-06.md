# Rathaus Refit Abschnitt A – Implementierungsplan

Stand: 06.11.2026. Verfasser: Rick, nachdem Terminus den Planungslauf ohne Datei beendet hat.
Worktree: /home/starnet/projects/Verwaltung-Ausbildung-rathaus-refit
Branch: feature/verwaltung-rathaus-refit-a-2026-11-06
Basis: b2f89f06a4b00d3d30a9ec63ca3b7d8c0612c28e (pre-dev/verwaltung-2026-11-05)

Nicht anfassen: Hauptcheckout, pre-dev, Night-School (7c87174), main, dev. Kein Push, kein Merge, kein Deployment. Keine neuen Fälle. Keine KI-API. Keine neue Laufzeitabhängigkeit. Kein Commit durch Jarvis; Rick committet nach grüner Suite.

## 1. Navigation

Ist, gelesen in js/rathaus-navigation.js:

- Erstes Brotkrumen-Label ist Stadtverwaltung.
- B04 ist Stadtverwaltung / Bürgerbüro / Fall B04, ohne Arbeitsschritt.
- Bürgerbüro-Unternavigation: Übersicht, B01–B04, Nachschlagen.
- Personalamt-Unternavigation: Übersicht, Posteingang, Ausbildungsakte, Vorgang, Nachschlagen. Luca und Noelle stehen dort nicht als Vorgänge.
- Ordnungsamt und Stadtkasse sind bereits benutzbar: false.
- fortschrittSichtbar gilt nur für akte und vorgang.
- Zurück geht eine Ebene hoch, nicht über den Browserverlauf. Das bleibt.

Soll:

- Erstes Label überall: Rathaus Sonnenthal.
- Beispiel, viertes Glied nur wenn ein Schrittname übergeben wird: Rathaus Sonnenthal / Bürgerbüro / B04 / Unterlagen.
- brotkrumen(ansicht, modus, schrittLabel): ohne schrittLabel bleibt die bisherige Länge. Mit nicht-leerem String wird das bisher letzte Glied verlinkt (Ziel = aktuelle Ansicht) und der Schritt als letztes, unverlinktes Glied angehängt.
- Vorgangslabels in der Pfadnavigation: B01, B02, B03, B04, Luca Berger, Noelle Kranz. Nicht Fall B01.
- Zurück-Label von der Stadt: Zurück zur Rathausübersicht. Amt-Zurück bleibt Zurück zum Bürgerbüro bzw. Zurück zum Personalamt.
- buergerUnternavigation: nur die Vorgänge des Amts, nicht zusätzlich Nachschlagen als gleichrangigen Menüpunkt. Nachschlagen bleibt über die Karte im Fall erreichbar.
- personalUnternavigation: Luca Berger und Noelle Kranz, nicht Posteingang/Akte/Vorgang/Nachschlagen. Die bestehenden Ansichten post, akte, vorgang, nachschlagen bleiben als interne Arbeitsflächen von Luca erhalten. Sie dürfen nicht gelöscht werden. Die sichtbare Fallleiste zeigt die zwei Personen.
- Ämtermenü bleibt kompakt: Stadtübersicht, Bürgerbüro, Personalamt, Ordnungsamt (In Kürze, kein Sprung), Stadtkasse (In Kürze, kein Sprung).
- Fortschritt pro Vorgang auf der Amtsübersicht, aus dem vorhandenen Speicherstand, ohne neuen Speicher.
- Wechsel zwischen Vorgängen löscht keinen fremden localStorage-Schlüssel.
- TASKFLOW (js/rathaus-aufgabenfluss.js) bleibt die Arbeitsschritt-Leiste. Die Pfadnavigation liest den aktuellen Schrittnamen von dort und hängt ihn an. Kein zweites Schrittmenü.
- Mobil: Pfad umbrechen. Tastatur: Brotkrumen und Vorgangswechsel sind echte Buttons oder Links, sichtbarer Fokus, aria-current am aktuellen Glied.

Tests in tests/rathaus-navigation.test.js auf die neuen Labels umstellen. Nicht abschwächen: Länge, Ziele und letztes Glied ohne Ziel bleiben geprüft. Neuer Test: brotkrumen("buerger", "fall-b04", "Unterlagen") ergibt genau Rathaus Sonnenthal / Bürgerbüro / B04 / Unterlagen.

## 2. Rechtsgrundlagen – erst erklären, dann abfragen

P0, gelesen: In js/rathaus-buergerbuero-ui.js beginnt Etappe 3 direkt mit der bewerteten Mehrfachfrage. Die Nachschlagekarte liegt in der eigenen Ansicht buerger-karte, nicht vor der Frage. Das ist die Lücke.

Dieselbe Lücke:

- B02: Etappe 3 stellt die bewerteten Fragen, die Karte steht nicht vor den Fragen.
- B03 und B04: die Karte steht in der Fallakte, die bewerteten Fragen stehen im Schritt. Die Akte ist nachschlagbar, ersetzt aber keine Erklärung vor der Frage.
- Luca (js/rathaus-ui.js) und Noelle (js/rathaus-hochbetrieb.js): die Karte öffnet sich über einen eigenen Knopf bzw. die Ansicht Nachschlagen. Die Entscheidung wird im Vorgang abgefragt.

Einbau, für alle sechs Vorgänge, ohne neue Fälle und ohne neue Rechtsbehauptungen:

- Vor der ersten bewerteten Rechtsfrage des Vorgangs einen nicht bewerteten Block Grundlagen sichtbar machen. Nicht nur zuklappbar-geschlossen, nicht nur in der Lehrkraftansicht, nicht nur in einer anderen Ansicht.
- Inhalt: kurze Einführung, die bereits vorhandene Nachschlagekarte dieses Falls, die Bedeutung in einem Satz, ein eigenständiges Mini-Beispiel, das nicht der bewertete Sachverhalt ist, und der Hinweis, dass die Karte während der Aufgabe nachschlagbar bleibt.
- Die bewerteten Optionen und ihre Kennungen stehen nicht in diesem Block.
- Gestufte Hilfen bleiben und verraten weiterhin nicht die richtige Zeile.
- Bestehende nachschlagen()-Texte wiederverwenden. Für B01 die unten geprüften Sätze verwenden, falls der vorhandene Kartentext davon abweicht. Für B02, B03 und B04 die vorhandenen Kartentexte nicht umschreiben.

B01-Mini-Beispiel, nicht bewertet: Herr Berg zieht am 3. März in eine Wohnung. Der Mietvertrag begann am 1. März. Die Zwei-Wochen-Frist beginnt mit dem Einzug, nicht mit dem Vertragsbeginn. Eine Wohnungsgeberbestätigung liegt nicht vor. Er muss das der Meldebehörde unverzüglich mitteilen. Eine amtliche Meldebestätigung gibt es erst nach der durchgeführten Anmeldung.

B02-Mini-Beispiel, nicht bewertet, ohne neue Norm: Eine Person beantragt eine Bescheinigung über die eigenen Meldedaten. Das ist nicht dieselbe Sache wie die Anmeldung nach einem Einzug. Details nur aus der vorhandenen B02-Karte.

B03-Mini-Beispiel: Ein privater Arbeitgeber ist keine Behörde. Ein gewöhnlicher Bürojob begründet kein erweitertes Zeugnis. Nur die vorhandene Karte, keine neue Norm.

B04-Mini-Beispiel: Bloßes Unbehagen ohne Tatsachen genügt nicht für eine Auskunftssperre. Nur die vorhandene Karte zu § 51 BMG, Prüfdatum im Code 05.11.2026, heute nicht neu umgeschrieben.

Luca/Noelle-Mini-Beispiel: Hochbetrieb ist keine im gelesenen § 15 BBiG genannte Ausnahme von der Freistellung für den Berufsschulunterricht. Ausbildende haben Auszubildende zum Besuch der Berufsschule anzuhalten (§ 14 Abs. 1 Nr. 4 BBiG) und für die Teilnahme am Unterricht freizustellen (§ 15 Abs. 1 Satz 2 Nr. 1 BBiG).

### Geprüft am 06.11.2026, nichtamtliche Fassung auf gesetze-im-internet.de

- § 17 Abs. 1 BMG: Wer eine Wohnung bezieht, hat sich innerhalb von zwei Wochen nach dem Einzug bei der Meldebehörde anzumelden. https://www.gesetze-im-internet.de/bmg/__17.html
- § 19 Abs. 1 und 2 BMG: Der Wohnungsgeber wirkt bei der Anmeldung mit und bestätigt den Einzug. Erhält die meldepflichtige Person die Bestätigung nicht rechtzeitig, teilt sie das der Meldebehörde unverzüglich mit. https://www.gesetze-im-internet.de/bmg/__19.html
- § 23 Abs. 1 BMG: Zur Anmeldung gehören Ausweis oder Pass sowie die Bestätigung des Wohnungsgebers oder das Zuordnungsmerkmal nach § 19 Abs. 4. https://www.gesetze-im-internet.de/bmg/__23.html
- § 1 BMG: Meldebehörden sind die durch Landesrecht dazu bestimmten Behörden. Das Bürgerbüro Sonnenthal als Schalter ist eine Übungsannahme, kein Landesrecht. https://www.gesetze-im-internet.de/bmg/__1.html
- § 24 Abs. 2 BMG: Die meldepflichtige Person erhält unentgeltlich eine amtliche Bestätigung über die durchgeführte An- oder Abmeldung. https://www.gesetze-im-internet.de/bmg/__24.html
- § 14 Abs. 1 Nr. 4 BBiG: Ausbildende haben Auszubildende zum Besuch der Berufsschule anzuhalten. https://www.gesetze-im-internet.de/bbig_2005/__14.html
- § 15 Abs. 1 Satz 2 Nr. 1 BBiG: Ausbildende haben Auszubildende für die Teilnahme am Berufsschulunterricht freizustellen. https://www.gesetze-im-internet.de/bbig_2005/__15.html
- B02 § 18 BMG, B03 BZRG und JVKostG, B04 § 51 BMG: vorhandene Karten nicht umschreiben. § 51 bleibt beim Prüfdatum 05.11.2026 aus dem Code.

Neue Datei js/rathaus-rechtsverzeichnis.js, ohne DOM: Einträge mit id, norm, geltung (bund, land, uebung), kurz, url, pruefdatum, faelle. Nur die heute oder am 05.11. gelesenen Bundesnormen und die ausdrücklich markierte Übungsannahme Sonnenthal. Kein ungelesenes Landesgesetz. Mindestens B01 liest die fünf BMG-Einträge aus dem Verzeichnis in den Grundlagen-Block.

## 3. Auswertungen

Nicht neu bewerten. auswertung() bleibt die Quelle.

- B01/B02: Schritte 1. Anliegen, 2. Unterlagen, 3. Regeln, 4. Vorbereitung, 5. Antwort. Auswertung ist der letzte TASKFLOW-Schritt und zählt nicht als bewerteter Bereich.
- B03/B04: Namen aus BEREICHE.
- Luca/Noelle: 1. Entscheidung, 2. Begründung, 3. Antwortbrief.

Nach einer gültigen Auswertung:

- In js/rathaus-aufgabenfluss.js erhält ein Chip die Klasse ist-offen, wenn bereichStatus nicht richtig und nicht noch nicht geprüft ist. Der Status steht sichtbar am Chip, nicht nur im aria-label.
- Die Auswertungsansicht listet dieselben Nummern und Namen. Jeder nicht richtige Schritt hat einen Button Zu Schritt n, der den Aufgabenfluss auf diesen Index setzt.
- Im geöffneten Schritt steht die konkrete Rückmeldung aus den vorhandenen Hinweisen dieses Bereichs. Kein freier Satz, der nicht aus den Prüfdaten kommt.
- Mehrfachauswahl, nur wenn die Option richtig true/false hat: nach der Auswertung Richtig ausgewählt, Falsch ausgewählt, Relevante Antwort fehlt. Vor der Auswertung diese drei Wörter nicht an die Optionen schreiben und keine Optionskennung zeigen.
- B01 pruefeRegeln und die vergleichbaren Mehrfachprüfer sollen diese drei Listen zurückgeben, abgeleitet aus den vorhandenen Flags. Wenn ein Feld keine solche Flagge hat, keine Liste erfinden, nur den vorhandenen Bereichsstatus zeigen.
- Erneute Bearbeitung und erneute Auswertung bleiben. Eine Änderung verwirft die alte Auswertung wie bisher.
- Lösungen und Mustertexte bleiben in der Lehrkraftansicht.

## 4. Geschützt

B01–B04, Luca, Noelle, TASKFLOW, Fallakte, gestufte Hilfen, Speicher, Reset, Lehrkraftansicht, file://, Dunkelmodus, hoher Kontrast, LRS/ADHS, Tastatur, Screenreader, Nach-oben. Bestehende Speicher-Schlüssel nicht umbenennen.

## 5. KI – nur dokumentieren

Datei docs/rathaus-refit-a-ki-anforderungen-2026-11-06.md. Keine API, kein Schlüssel, kein Netzwerkaufruf.

- Eine allgemeine Schnittstelle der Ausbildungsplattform, nicht ein Rathaus-Sonderweg.
- Providerunabhängig. Cloud und lokales Modell später möglich.
- Datenschutz und Kostenkontrolle. Keine heimliche Übermittlung personenbezogener Daten. Offline über file:// bleibt ohne KI lauffähig.
- KI-Hilfe und eigene Schülerleistung müssen unterscheidbar bleiben.
- Fachliche Bewertung bleibt auswertung(). Keine Bewertung durch ein unkontrolliertes Modell.
- Luca ist der spätere erste Testfall für sprachliche Textverbesserung, nicht in Abschnitt A.

## 6. Später, nicht bauen

- Jahresabschlussprüfung je Ausbildungsjahr, alle Lernfelder des Jahres, Aufschlüsselung nach Lernfeldern, Lernempfehlung statt nur Gesamtpunktzahl, nur bereits vermittelte Kompetenzen.
- Lehrplan-Kompass: Unterrichtsunterlagen nur als Kompetenzreferenz, eigene Übungen, Kompetenzabdeckung und didaktische Abdeckung getrennt messen.

## 7. Abschluss für Jarvis

Geänderte oder neue Dateien nennen. Tests:

node --test tests/rathaus-navigation.test.js tests/rathaus-buergerbuero-ui.test.js tests/rathaus-ui-bewertung.test.js tests/rathaus-b02.test.js tests/rathaus-b03.test.js tests/rathaus-b04.test.js tests/rathaus-hochbetrieb.test.js tests/rathaus-kern.test.js
node --test tests/*.test.js

Es gibt kein package.json. Ein neuer Test muss scheitern, wenn der Grundlagen-Block in B01 hinter der bewerteten Regeln-Frage steht oder fehlt. Ein neuer Test muss die vierteilige Pfadnavigation prüfen. Kein Commit, kein Push.
