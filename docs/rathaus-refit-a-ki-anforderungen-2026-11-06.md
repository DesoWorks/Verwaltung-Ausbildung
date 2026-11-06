# Rathaus Refit A – Anforderungen an eine spätere KI-Hilfe

Stand: 06.11.2026. Nur Dokumentation (Plan Abschnitt 5 und 6). Es gibt in Abschnitt A keine KI-API, keinen Schlüssel, keinen Netzwerkaufruf und keinen Implementierungscode für KI.

## 1. Anforderungen

- **Allgemeine Schnittstelle.** Die KI-Hilfe ist eine Funktion der Ausbildungsplattform, kein Sonderweg des Rathauses. Rathaus, IT-Ausbildung und weitere Module nutzen dieselbe Schnittstelle.
- **Providerunabhängig.** Cloud-Anbieter und lokales Modell müssen später austauschbar sein. Kein Modul hängt an einem Anbieter.
- **Datenschutz.** Keine heimliche Übermittlung personenbezogener Daten. Eine Übermittlung geschieht nur nach sichtbarer Zustimmung und mit Hinweis, was gesendet wird. Die Rathaus-Fälle enthalten nur erfundene Personen; eigene Texte der Lernenden können trotzdem Echtdaten enthalten.
- **Kostenkontrolle.** Obergrenzen je Sitzung und je Zeitraum, sichtbarer Verbrauch, Abschaltmöglichkeit durch die Lehrkraft.
- **Offline.** Die Plattform bleibt über `file://` ohne KI voll lauffähig. Fehlt die KI, entfällt nur die Zusatzhilfe, nie eine Aufgabe.
- **Trennung von Hilfe und Leistung.** KI-Vorschläge sind als solche gekennzeichnet und werden nicht ungefragt in das Antwortfeld geschrieben. Es bleibt erkennbar, was die Person selbst geschrieben hat.
- **Bewertung.** Die fachliche Bewertung bleibt `auswertung()`. Ein Modell bewertet nichts und ändert keinen Bereichsstatus.
- **Rechtsaussagen.** Die KI erfindet keine Rechtsgrundlagen. Fachliche Grundlagen kommen aus den geprüften Nachschlagekarten und dem Rechtsverzeichnis (`js/rathaus-rechtsverzeichnis.js`) mit Prüfdatum.

## 2. Erster Testfall

Luca (Antwortbrief) ist der spätere erste Testfall für sprachliche Textverbesserung: Rückmeldung zu Ton und Verständlichkeit, nicht zur Fachlichkeit. Nicht Teil von Abschnitt A.

## 3. Später, nicht gebaut

- **Jahresabschlussprüfung** je Ausbildungsjahr über alle Lernfelder des Jahres, mit Aufschlüsselung nach Lernfeldern und einer Lernempfehlung statt nur einer Gesamtpunktzahl. Geprüft werden nur bereits vermittelte Kompetenzen.
- **Lehrplan-Kompass.** Unterrichtsunterlagen dienen nur als Kompetenzreferenz. Eigene Übungen entstehen daraus. Kompetenzabdeckung und didaktische Abdeckung werden getrennt gemessen.
