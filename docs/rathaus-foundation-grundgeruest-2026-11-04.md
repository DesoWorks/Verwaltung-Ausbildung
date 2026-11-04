# Rathaus-Grundgerüst – technischer und didaktischer Bauplan

Stand 04.11.2026, Terminus. **Planung, keine Refaktorierungsfreigabe.** Untersuchte Basis: `acc3f56` und die vorhandenen Rathaus-JavaScript-Module. Die aktuelle P0-Reparatur darf diesen Bauplan nicht als Anlass für Umbauten verwenden.

## Ziel und gesicherter Iststand

Neue Fälle sollen Inhalte und Bewertungsregeln ergänzen, ohne Navigation, lokale Speicherung, Fortschritt und zugängliche Formulare zu kopieren. Bestehende Luca-/Noelle-/B01-Stände bleiben dabei erhalten. Der Erfolg wäre ein zusätzlicher Fall, dessen allgemeine Oberflächenbausteine bereits getestet sind und dessen fachliche Regeln separat nachvollzogen werden können.

- `rathaus-navigation.js`: allgemeine Ansichten/Navigation; `rathaus-ui.js`: zentraler Controller mit eigenem Zustand und Fallumschaltung Luca/Noelle, zusätzlicher Bürgerbüro-Unteransicht.
- `rathaus-kern.js` und `rathaus-hochbetrieb.js`: Personalamt-Fachkerne. Die Oberfläche schaltet den verwendeten Kern; die Lehrkraftdarstellung verwendet `fallDaten`, `lehrkraftLoesung` und `katalog`.
- `rathaus-buergerbuero.js`: reiner B01-Kern ohne DOM/Netz, eigener Katalog, Normalisierung, Bewertung, Hilfe, Lehrkraftdaten, Nachschlagekarte und Speicherbereinigung.
- `rathaus-buergerbuero-ui.js`: eigener B01-Controller; fünf fachliche Bereiche und Auswertung, Radio/Checkbox/Unterlagenstatus, aufklappbare Dokumente, Statusregion, fokussierbare Etappenüberschriften und eng begrenztes Reset.
- `rathaus-lehrkraft.js`: bereitet Personalamt-Daten auf; B01 liefert einen anderen Lehrkraftvertrag. Diese Unterschiede nicht durch einen ungeprüften Einheitsadapter verdecken.
- `anzeige-lesen.js`/`styles.css`: plattformweite Anzeige; gehört nicht in jeden Fall.
- Bestehende Tests sind nach Kern, Navigation, Lehrkraft, UI, Nachschlagen und Bürgerbüro aufgeteilt. Sie bilden die Sicherheitsleine vor späteren Extraktionen.

## Vorgeschlagenes Zielbild

Drei Schichten statt einer universellen Bewertungsmaschine:

1. **Falldefinition und fachlicher Kern:** stabile `fallId`, `amtId`, Titel/Verfügbarkeit, Quellenstand, Sachverhalt, Unterlagen, strukturierte Fragen, gestufte Hilfe, Lehrkraftkriterien und reine Bewertungsfunktionen. Fachliche Widersprüche bleiben explizite fallbezogene Regeln.
2. **Falladapter:** verbindet vorhandenen Kern mit gemeinsamen Oberflächendaten. Zunächst Luca/Noelle und B01 jeweils explizit adaptieren, nicht ihre Speicherformate sofort vereinheitlichen.
3. **Gemeinsame Oberfläche und Dienste:** Fallübersicht, verständliche Statusanzeigen, Fokus/Ankündigung, sichere DOM-Erzeugung, Hilfe-/Kartencontainer und ein lokaler Speicheradapter. Keine fachlichen Musterlösungen im Renderer.

Vorgeschlagener Vertrag (Plan, noch nicht implementiert):

```text
FallDefinition: id, amtId, titel, startbar, quellenstand, bewertungsstand
FallAdapter:
  daten(), fragen(), hilfen(stufe), nachschlagen(), lehrkraft()
  normalisiere(roh), bewerte(eingaben), eingabeVersion(eingaben)
  ladeGespeichert(roh), speicherPayload(zustand), resetText()
Bewertung:
  fallId, bewertungsstand, eingabeVersion
  bereiche: { id, status, hinweise[], sperren[] }[]
  darfAbschliessen, freitext: { automatischGeprueft: false }
```

Statusvokabular: `offen`, `unvollstaendig`, `falsch`, `ungueltig`, `richtig`. `veraltet` betrifft die Gültigkeit einer früheren Auswertung, nicht die fachliche Antwort. Keine Prozentzahl darf ein fehlendes Pflichtkriterium oder eine Sperre kompensieren.

## Wiederverwendung je Bereich

| Bereich | Gemeinsamer Anteil | Fachlicher Anteil / Schutz |
|---|---|---|
| Fallübersicht/Fallwechsel | Registrierung verfügbarer Fälle, klare Aktivmarkierung, Speichern vor Wechsel, Fokus auf Zielüberschrift | Verfügbarkeit separat von erledigt; B02/B03 ohne Code nicht startbar |
| Fortschritt | erledigte Pflichtbereiche / Gesamtbereiche, Text neben Leiste, Statusliste | Bearbeitet ist nicht richtig; Abschluss nur bei aktueller positiver Bewertung aller Pflichten |
| Hilfe/Karten | Auf-/Zuklappen, Fokus bleibt am Auslöser, gestufte Hilfe mit überschriebenfreier Anzeige | Inhalt und Quellen aus jeweiligem Fachkern; Hilfe 1 Orientierung, 2 gezielter Hinweis, 3 Bearbeitungsgerüst |
| Rückmeldung | konsistente Statuswörter, Abschnitt nennen, Statusregion nur bei sinnvollen Ereignissen | spezifische Fehlursache und Widerspruchsregeln im Kern; keine Lösungsverrat-Standardtexte |
| Lehrkraft | Sachverhalt, Ziele, Kriterien, typische Fehler, Muster, Quellen im gemeinsamen Layout | Personalamt- und B01-Verträge zunächst adaptieren; Ansicht ist keine Zugriffssicherung |
| Speichern | JSON lesen mit Fehlerbehandlung, Schlüssel pro Fall, Versionsprüfung, sichtbare Speicherfehler | bestehende Schlüssel beibehalten, Eingabenrettung im fallbezogenen Migrationsadapter |
| Reset | Bestätigung und genaue Reichweite, nur gewählten Schlüssel entfernen | kein `localStorage.clear`; Anzeige, andere Fälle und Lernfortschritt erhalten |
| Barrierefreiheit | semantische Fieldsets/Legends, Labels, Tastatur, Fokus, reduced motion, Themes | passend zum Fragetyp; keine generischen Checkboxen für fachlich eindeutige Einfachauswahl |

## Didaktischer Ablauf für zusätzliche Fälle

Anliegen verstehen → Belege sichten → Anforderungen/Regeln zuordnen → nächste Handlung vorbereiten → begründete strukturierte Antwort → Auswertung und Überarbeitung. Nicht jeder Fall braucht dieselbe Anzahl Seiten. Leseschritte dürfen als bearbeitet zählen, aber nie eine fachliche Bewertung ersetzen. Freitext bleibt freiwillige Transferleistung mit ausdrücklich manueller Rückmeldung; richtig ausgewählte Bausteine bescheinigen nicht die Richtigkeit eines daneben geschriebenen Textes.

Jede neue Aufgabe bekommt vor Umsetzung: beobachtbares Lernziel, eindeutige richtige Antwort, plausible falsche Alternativen, Verhalten bei fehlender/ungültiger Antwort, Widerspruchsliste, Quellen und Lehrkraftbegründung. Nicht erfüllbare oder rechtlich ungeklärte Kriterien werden nicht still als richtig gewertet.

## Risiken und Gegenmaßnahmen

- **Unterschiedliche Zustandsmodelle:** Personalamt speichert Leseschritte/Ansicht/Versuche, B01 strukturierte Bereichseingaben. Gemeinsames Schema erst nach explizitem Mapping; keine pauschale Migration.
- **Verlorene Lernstände:** etablierte Schlüssel und Bewertungsstände erhalten; Rohdaten-fixtures mit aktueller/alter/beschädigter Version testen. Veraltete Auswertung verwerfen, beantwortete Felder nachprüfbar retten.
- **Fachliche Verwässerung:** kein Punktesummen-Generator, der Widersprüche ausgleicht. Tests für Pflichtgrund und verbotene Aussagen je Fall behalten.
- **Fokus-/Navigationsregression:** vollständiges Neuzeichnen kann Fokus entfernen; Extraktionen müssen reale Tab-/Hash-/Zurückpfade prüfen.
- **Scheinsicherheit:** lokale Lehrkraftansicht nicht als Zugangsschutz bewerben; fiktive Personendaten, kein Cloudversand.
- **Zu frühe Abstraktion:** Aufwand eines konfigurierbaren Universalformulars ist höher als zwei klar abgegrenzte Adapter. Erst einen kleinen gemeinsamen Baustein extrahieren.

## Umsetzung in kleinen, separat abnehmbaren Schritten

1. Aktuelle P0 fertigstellen und auf Produktcommit einfrieren. Kern-/Speicher-/Browsernachweise für alle drei bestehenden Fälle sichern.
2. In eigenem späterem Auftrag nur Statuswort-/Rückmeldungs- und Hilfecontainer extrahieren. Identisches Verhalten und Darstellung vor/nach Änderung vergleichen; keine Speicheränderung.
3. Fallregistrierung einführen: eindeutige IDs, geplant/startbar, amtweise Übersicht. Bestehende Hashziele/Fallwahl und isolierte Stände prüfen.
4. B02 nach vorliegendem Fachplan implementieren; dabei genau den minimal benötigten Bürgerbüro-Adapter erproben. Keine parallele Personalamt-Neustrukturierung.
5. Erst anhand realer Wiederholung entscheiden, ob Speicher-/Lehrkraftadapter gemeinsam werden. Migrationsvertrag und Fixtures vor Code schreiben.

Abnahme jeder Stufe: Luca/Noelle unverändert abschließbar; falsche/leere Antworten gesperrt; Auswertung nach Änderung ungültig; isoliertes Reset; Reload/Fallwechsel ohne Datenverlust; HTTP und direkte Dateiöffnung; Tastatur/Fokus und alle Anzeigeoptionen; Windows/NVDA gesondert. Bei Regression Stufe nicht integrieren. B03 und neue Ämter bleiben Planung.
