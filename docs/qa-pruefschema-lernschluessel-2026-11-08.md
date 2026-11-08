# Prüfschema: Lerninhalt, Aufgabe, Antwortschlüssel und Auswertung

Stand: 08.11.2026  
Anwendung: Verwaltung-Ausbildung, LF1-A „Zwei Lernorte“ (`lf1-dual`).  
Ziel: Automatisierbare Verbindungen zwischen Aufgaben und Auswertung absichern, ohne fachliche Prüfung durch Textmuster vorzutäuschen.

## Ausgangspunkt und Grenzen

Die Lektion verwaltet Fragen und den Schlüssel in `js/lf1-dual.js`. Antworten werden mit `auswerten` in einen Bewertungsstand übernommen; `status` vergleicht diesen Stand mit dem Schlüssel. Die sichtbare Oberfläche wird aus den Fragen aufgebaut. `module/lf1-dual.html` enthält Einführung, Erklärung, Beispiel und Aufgabenbereiche, aber keine Antwortoptionen oder Lösungstexte. `js/fortschritt.js` führt für `lf1-dual` nochmals einen Schlüssel für die plattformweite Fortschrittsableitung.

Die vorhandene `tests/lf1-dual.test.js` prüft bereits unter anderem richtige und falsche Antworten, unbeantwortete Felder, veraltete Bewertungen, vorzeitige Anzeige von Hinweisen/Auflösungen, Hilfen, Speicherung und Seitenstruktur. Die neue Prüfschicht ergänzt diese Funktionsprüfungen durch einen unabhängigen Abgleich zwischen den Frage-IDs/Antwortoptionen der Lektion und dem separat gepflegten LF1-A-Schlüssel im plattformweiten Fortschritt. Sie wiederholt nicht die bestehenden Falltests.

## 1. Automatisiert prüfbar

Automatisierte Tests können technische Konsistenz und definierte Laufzeitregeln nachweisen:

- **Jede Aufgabe hat einen Antwortschlüssel:** Die Menge der Aufgaben-IDs muss exakt durch einen unabhängig im Test festgehaltenen LF1-A-Schlüssel abgedeckt sein; weder Aufgaben noch Schlüssel-Einträge dürfen fehlen oder zusätzlich sein.
- **Schlüsselwerte sind tatsächlich auswählbar:** Für jede Aufgabe muss der erwartete Schlüsselwert zu einer vorhandenen Antwortoption gehören. Das beweist nur technische Wählbarkeit, nicht fachliche Richtigkeit.
- **Pflichtantworten werden erfasst:** Die ausgewerteten Aufgaben-IDs müssen vollständig sein; ein leerer Stand muss als fehlende Antwort und nicht als falsche Antwort behandelt werden. Die vorhandene LF1-A-Suite deckt das über die Aufgabenblöcke bereits ab.
- **Schlüssel und Auswertung stimmen technisch überein:** Ein Schlüsselwert muss nach Eingabe und Auswertung als richtig, eine andere gültige Auswahl als falsch gelten. Dies wird in der vorhandenen LF1-A-Suite mit einem unabhängigen Schlüssel geprüft.
- **Lösungstexte werden nicht vorzeitig im statischen HTML gezeigt:** Hinweis- und Lösungstexte dürfen nicht im HTML-Quelltext als vorab sichtbarer Seiteninhalt stehen. Laufzeitseitig freigegebene Rückmeldungen müssen an eine aktuelle Auswertung gebunden sein. Das prüft die vorhandene Suite; es ersetzt keinen Browser- oder Screenreadertest.
- **Antwortänderungen entwerten die alte Bewertung:** Nach Änderung darf das Ergebnis nicht mehr als aktuelle Bewertung gelten; erst erneutes Auswerten bewertet den neuen Stand. Die vorhandene Suite prüft diesen Ablauf.
- **Doppelte Schlüssel müssen synchron bleiben:** Der unabhängige LF1-A-Erwartungsschlüssel wird mit dem Schlüssel in `js/fortschritt.js` verglichen. So fällt eine Abweichung zwischen der lokalen Lektionserwartung und dem plattformweiten Fortschritt auf.

Neue Testdatei: `tests/lf1-dual-kopplung.test.js`. Sie prüft die Aufgabenabdeckung, die Wählbarkeit der erwarteten Antwort und die Übereinstimmung des unabhängig erwarteten Schlüssels mit dem Fortschrittseintrag. Sie testet weder Browserdarstellung noch die fachliche Richtigkeit der Lösung.

## 2. Fachlich zu prüfen – nicht durch Wortlisten bestandbar

Diese Fragen benötigen eine fachkundige inhaltliche Sichtung anhand geeigneter Quellen und des Lernziels:

- Stimmt die angegebene Rechtsgrundlage in Fassung, Geltungsbereich und Bedeutung?
- Ist die Frage unter Berücksichtigung des zuvor vermittelten Inhalts eindeutig?
- Ist eine andere Antwort fachlich vertretbar oder lässt die Aufgabe mehrere richtige Deutungen zu?
- Erklärt der Lerntext die maßgebliche Regel verständlich und ohne irreführende Verkürzung?
- Passen Lernziel, vermittelter Inhalt, Aufgabenstellung, Antwortschlüssel und Rückmeldung tatsächlich zusammen?
- Ist die Erklärung bei einer falschen Antwort hilfreich und sachlich korrekt?

**Ein Textvergleich, eine Schlüssel-Konsistenzprüfung oder das Vorhandensein bestimmter Wörter beweist keine dieser fachlichen Eigenschaften.** Automatisierte Tests können prüfen, dass vorhandene Texte und Schlüssel zueinander verdrahtet sind; sie können nicht aus einer Textähnlichkeit ableiten, dass die Rechtslage stimmt oder eine Antwort eindeutig und pädagogisch tragfähig ist. Fachliche Freigabe bleibt gesondert erforderlich.

## Vorgehen und Befundkategorien

Für jede Lektion werden zuerst Lernziele, Aufgaben-IDs, Pflichtfelder, Schlüssel, Auswertungsgruppen und Fortschrittseintrag identifiziert. Danach werden vorhandene Tests abgegrenzt, damit neue Tests echte Verbindungen absichern statt dieselben Erwartungen zu wiederholen. Automatische Befunde sind auf reproduzierbare technische Aussagen zu beschränken. Fachliche Zweifel werden als offene Prüfpunkte dokumentiert, nicht durch zusätzliche Wortlisten-Assertions kaschiert.

Bei einer nicht sicher automatisierbaren Verbindung wird kein spekulativer Test ergänzt: Die Lücke wird hier benannt und für eine fachliche Sichtung offengehalten.

## Übertragung auf LF1-B und LF1-C

Für `lf1-vertrag` wird dieselbe Prüfschicht erst angewandt, wenn die Implementierung vorliegt: Aufgaben-IDs, erforderliche Antworten, Schlüsselwerte und gegebenenfalls Fortschrittseintrag unabhängig abgleichen; technische Auswertung und Antwortänderungen nur dort ergänzend testen, wo bestehende Tests dies noch nicht abdecken. Inhaltliche Aussagen zum Vertrag und zu Rechtsfolgen bleiben einer Quellen- und Fachprüfung vorbehalten. Für den noch nicht gebauten LF1-C-Plan wird zunächst eine Zuordnung von Lernziel → vermittelter Regel → Fallfrage → erwartbarer Lösung mit begründbaren Alternativen festgehalten. Nach einer späteren Umsetzung kann man daraus gezielte technische Kopplungstests ableiten. Dieses Schema ändert weder LF1-B noch einen LF1-C-Plan.
