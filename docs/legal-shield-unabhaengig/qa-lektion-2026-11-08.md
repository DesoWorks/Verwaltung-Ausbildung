# Unabhängige QA-Prüfung des Lerntexts LF1-A

**Datum:** 08.11.2026  
**Prüfumfang:** ausschließlich `module/lf1-dual.html` und `docs/lf1-b-bauplan-2026-11-08.md` aus `/home/starnet/projects/Verwaltung-Ausbildung-rathaus-refit/`. Keine Webseite geöffnet. Keine Projektdatei geändert. Dies ist eine begrenzte statische Prüfung und keine Freigabe.

## Ergebnis

Im sichtbaren HTML-Lerntext ist die Einordnung der zwei Lernorte mit dem zusätzlichen dritten Durchführungsort aus § 2 BBiG in sich schlüssig: Der Text nennt Betrieb und Berufsschule als Lernorte der dualen Ausbildung, erwähnt ausdrücklich den dritten Ort und grenzt ihn von der konkreten Übungsfrage ab. Der HTML-Text stellt die Verordnung von 2025 nicht als pauschalen Ersatz bereits bestehender Verträge dar; er zitiert vielmehr § 4 Abs. 5 BBiG und § 19 der Verordnung mit der Einschränkung für bestehende Ausbildungsverhältnisse. Probezeit und dreijährige Dauer werden im sichtbaren HTML-Lerntext nicht behauptet. Sie kommen im separaten LF1-B-Bauplan vor und werden dort als Themen einer geplanten Einheit behandelt.

Die HTML-Datei selbst enthält keine erkennbaren Antwortschlüssel oder Lösungen. Sie lädt jedoch `../js/lf1-dual.js`, dessen Inhalt außerhalb des erlaubten Prüfumfangs liegt. Daher ist nicht belegt, dass Lösungen auch im tatsächlich geladenen Skript oder in der vollständigen Anwendung nicht vorzeitig zugänglich sind.

## Befunde

### Wesentlich – Prüfgrenze bei dynamischen Aufgaben und Antwortschlüsseln

**Aussage:** Aus der geprüften HTML-Datei lässt sich nicht feststellen, ob Aufgaben, Schlüssel und Rückmeldungen im externen Skript vor Auswertung offengelegt werden.  
**Beleg:** Am Ende der HTML-Datei wird `../js/lf1-dual.js` eingebunden. Das Skript und die Aufgabenquelle wurden nicht gelesen. Im sichtbaren HTML stehen lediglich leere Container `uebung-fragen` und `kontrolle-fragen` sowie Ergebniscontainer; dort ist kein Antwortschlüssel enthalten.  
**Bewertung:** Kein nachgewiesener Fehler im HTML. Die Anforderung „Lösungen oder Schlüssel im HTML“ ist für diese Datei mit „nicht gefunden“ beantwortet; die breitere Frage nach tatsächlicher Offenlegung in der Anwendung bleibt ungeprüft.  
**Kleinste nächste Prüfung:** gesondert `js/lf1-dual.js` statisch prüfen; dies wurde hier ausdrücklich nicht getan.

### Hinweis – Aussagen zum Rahmenlehrplan nicht durch eigene Lektüre belegt

**Aussage:** Die Funktion des schulischen Rahmenlehrplans wird im Lerntext ausdrücklich als Funktionsorientierung bzw. reine Funktionsorientierung markiert; die Quellenliste sagt, dass der Rahmenlehrplan nicht gelesen wurde.  
**Beleg:** Abschnitt „Drei Grundlagen auseinanderhalten“ und Quellenliste „Nicht gelesen“.  
**Bewertung:** Kein verschleierter Quellenbeleg erkennbar. Aussagen zur konkreten Abstimmung oder zum konkreten Inhalt des Rahmenlehrplans sind durch diese Prüfung nicht bestätigt.

### Geprüfte Schwerpunktfragen ohne kritischen Fehler im HTML-Lerntext

- **Drei Durchführungsorte vs. Übungsfrage Betrieb und Schule:** Der Lerntext benennt drei Orte nach § 2 BBiG und erklärt, dass die dritte Stelle nicht der zweite Lernort der konkreten Übungsfrage ist. Kein Widerspruch festgestellt.
- **Verordnung 2025 und bestehende Verträge:** Der Text nennt die Übergangsregel aus § 4 Abs. 5 BBiG und sagt, § 19 enthalte keine abweichende Umstellung. Eine pauschale Ersetzung bestehender Verträge wird nicht behauptet.
- **Probezeit und drei Jahre:** Im geprüften HTML-Lerntext nicht enthalten; daher keine Aussage dazu bewertet. Im Bauplan sind mindestens ein bis höchstens vier Monate (R20) und drei Jahre als Regeldauer laut § 2 der Verordnung (RV2) genannt. Die Passage grenzt drei Jahre ausdrücklich von „jeder denkbaren Dauer“ ab.
- **Antwortschlüssel:** In der geprüften HTML-Datei nicht sichtbar enthalten. Dynamisch geladene Inhalte nicht geprüft.

## Quellen- und Prüfgrenzen

Tatsächlich gelesene Dateien: die zwei oben genannten Dateien.  
Normlektüre in dieser Prüfung: keine Webseiten oder Normtexte erneut geöffnet. Für den Abgleich wurden ausschließlich die im Arbeitskontext als bereits gelesen ausgewiesenen Normen verwendet: BBiG §§ 2, 4, 8, 11, 15, 20–22 und 25 sowie BüroMKfAusbV 2025 §§ 2 und 19. Nicht als eigene Lektüre behauptet werden BBiG §§ 1 oder 14, weitere Vorschriften der Verordnung, der Rahmenlehrplan oder das dynamische JS. Die bloße Quellenangabe oder Zusammenfassung im geprüften Dokument wurde nicht als unabhängiger Quellencheck gewertet.

**Abnahmestatus:** Keine Freigabe erteilt. Diese eingeschränkte Prüfung kann weder eine vollständige Rechtsprüfung noch eine Prüfung der Aufgabenlogik/Antwortschlüssel im JavaScript ersetzen. Der LF1-B-Bauplan wurde gelesen, aber seine Quellen wurden nicht unabhängig nachgelesen; seine dortige Bereitschaftsangabe ist keine QA-Freigabe durch diese Prüfung.
