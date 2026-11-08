# Statische Kopplungs-QA – LF1-B „Der Ausbildungsvertrag“

**Prüfdatum:** 08.11.2026  
**Arbeitsstand:** Branch `pre-dev/verwaltung-aktuell`, HEAD `74baabe986eccb874907a619d6cf673f9c3a5977`  
**Umfang:** Statische Kopplung zwischen `js/lf1-vertrag.js`, `module/lf1-vertrag.html` und dem vorhandenen Lösungsschlüssel in `js/fortschritt.js`. Keine Browserprüfung.

## Ergebnis

Der ergänzende Test `tests/lf1-vertrag-kopplung.test.js` prüft, dass die Aufgaben-IDs der Fallübung zu den IDs aus der Auswertungslogik passen, die Fortschrittslogik dieselben Sollwerte führt, jeder Sollwert genau einmal als Auswahl vorhanden ist und die Auswertung eine jeweils falsche Auswahl nicht als richtig zählt. Außerdem prüft er auf sichtbare Sollantworten in Aufgabenfragen/Hilfen sowie darauf, dass die zugehörigen Regelpassagen vor dem Fallabschnitt im HTML stehen.

Diese Prüfungen zeigen nur die technische Übereinstimmung der vorhandenen Daten und den erkennbaren Textaufbau. **Sie beweisen weder die Rechtsrichtigkeit der Lerninhalte noch die Eindeutigkeit der Aufgaben oder dass fachlich vertretbare Alternativantworten angemessen behandelt werden.** Es wird keine rechtliche Fachfreigabe erteilt.

## Grenzen

- Keine Prüfung im Browser, keine Sichtprüfung von Darstellung, Tastaturbedienung oder Laufzeitverhalten.
- Keine eigenständige Rechtsquellenprüfung in diesem Testlauf.
- Der Texttest erkennt nur, ob die festgelegten Regeltexte vor dem Aufgabenabschnitt vorkommen; er bewertet nicht deren didaktische Qualität oder fachliche Vollständigkeit.
- Die Prüfung deckt ausschließlich die sechs Aufgaben des Vertragsfalls ab, nicht die Lernkontrolle.
- LF1-C ist nicht vorhanden und wurde nicht geprüft; dafür wurde kein Test erfunden.

## Geänderte Dateien

- `tests/lf1-vertrag-kopplung.test.js` – neuer statischer Kopplungstest.
- `docs/qa-kopplung-lf1b-2026-11-08.md` – dieser Bericht.
