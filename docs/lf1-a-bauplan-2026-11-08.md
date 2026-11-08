# LF1-A – Lernen an zwei Orten: das duale System

Stand: 08.11.2026. Fachlich-didaktischer Bauplan, keine implementierte Lektion und keine Rechtsberatung.

## 1. Einordnung und Grenzen

LF1 heißt „Die eigene Rolle im Betrieb mitgestalten und den Betrieb präsentieren“ und umfasst 40 Stunden. Gelesener Bestand in `js/module-daten.js`: `lf1-rolle`, `lf1-rechte`, `lf1-betrieb`, `lf1-ziele`, `lf1-aufbau`, `lf1-fortbildung`, `lf1-praesentation`, `lf1-lernziel`. Genau genommen sind das sieben Inhaltslektionen und eine Lernzielkontrolle. LF1-A vertieft den Einstieg bei `lf1-rolle`; sie ersetzt weder diese Seite noch die bestehende Kontrolle mit 24 Fragen. Vorgeschlagene Unterrichtszeit: 45–60 Minuten, keine zusätzliche Rahmenlehrplanvorgabe.

Der gelesene LF1-Ausschnitt des Lehrplan-Kompass-Berichts nennt unter anderem einen Flyer zum dualen System, eigene Antworten mit Rückmeldung und eine Erweiterung ohne Abschwächung vorhandener Fragen. Hier entsteht ausschließlich neues Eigenmaterial. Keine Schul-PDFs übernommen oder gelesen. LF1-B und LF1-C bleiben spätere Abhängigkeiten; sie werden hier nicht ausgearbeitet. Der Nachtlauf `7c87174` bleibt unberührt. Keine Integration, kein Commit, kein Push.

## 2. Beobachtbare Lernziele

Nach der Einheit kannst du:

1. Ausbildungsbetrieb und Berufsschule als zwei zentrale Lernorte nennen und ihre Beiträge unterscheiden.
2. An einer Büroaufgabe erklären, wie praktische Anwendung und fachliches Verstehen zusammenwirken.
3. Ausbildungsordnung, betrieblichen Ausbildungsplan und schulischen Rahmenlehrplan nach ihrer Funktion unterscheiden.
4. Berufliche Handlungsfähigkeit von bloßem Abarbeiten einzelner Handgriffe unterscheiden.
5. Bei einer unklaren Ausbildungsaufgabe eine passende erste Klärung wählen und sachlich begründen.

Vorkenntnisse: keine Gesetzeskenntnisse nötig. Begriffe werden auf dieser Seite erklärt. Zielgruppe ist hier die Ausbildung im Büromanagement, nicht pauschal jeder Ausbildungsgang in einer Verwaltung.

## 3. Einführung – direkt verwendbarer Lerntext

Du bist neu im Ausbildungsbetrieb. Am Montag lernst du im Büro, wie eine Anfrage aufgenommen wird. Am nächsten Schultag beschäftigst du dich damit, welche Informationen eine Anfrage enthalten muss und wie du verständlich nachfragst. Warum lernst du an beiden Orten?

Eine Ausbildung soll dich dazu befähigen, berufliche Aufgaben zu verstehen, zu planen, auszuführen und zu prüfen. Dafür brauchst du praktische Erfahrung und fachliches Wissen. In der dualen Ausbildung arbeiten Ausbildungsbetrieb und Berufsschule an diesem gemeinsamen Ziel.

**Startfrage, unbewertet:** Stell dir vor, du kannst eine Vorlage ausfüllen, weißt aber nicht, ob die Angaben vollständig sind. Was müsstest du zusätzlich lernen? Notiere einen Gedanken. Deine Notiz wird nicht automatisch als richtig oder falsch beurteilt und ist keine Pflichtangabe.

## 4. Erklärung – direkt verwendbarer Lerntext

### Zwei Lernorte, ein Ausbildungsziel

**Im Ausbildungsbetrieb** lernst du an beruflichen Aufgaben und Abläufen. Eine zuständige Ausbildungsperson erklärt dir Arbeitsschritte, begleitet dein Üben und bespricht Ergebnisse. Der Betrieb darf Ausbildung nicht auf beliebige Hilfsarbeiten reduzieren: Aufgaben müssen dem Ausbildungszweck dienen. Die Ausbildung soll planmäßig sowie zeitlich und sachlich gegliedert stattfinden. [Q2]

**In der Berufsschule** erarbeitest du berufliche Zusammenhänge, Fachbegriffe und allgemeinbildende Inhalte. Du übst beispielsweise, Informationen zu prüfen und Entscheidungen zu begründen. Auch die Schule arbeitet mit praktischen Aufgaben; auch im Betrieb wird Theorie erklärt. Die Kurzform „Betrieb nur Praxis, Schule nur Theorie“ ist deshalb zu grob. Diese Lernortbeschreibung ist eine didaktische Zusammenfassung, kein aus den beiden gelesenen Paragraphen abgeleiteter Lehrplanbeleg.

**Gemeinsames Ziel:** berufliche Handlungsfähigkeit. Du sollst nicht nur einen einzelnen Klick nachmachen, sondern berufliche Aufgaben mit den nötigen Fertigkeiten, Kenntnissen und Fähigkeiten bewältigen und Berufserfahrung erwerben. Das Ausbildungsziel beschreibt § 1 Absatz 3 BBiG. [Q1]

Ausbildende müssen zum Besuch der Berufsschule anhalten (§ 14 Absatz 1 Nummer 4 BBiG). Diese Vorschrift allein belegt nicht sämtliche Regeln zur Schulpflicht, Freistellung oder Anrechnung von Unterrichtszeit. Solche Einzelfragen behandelt diese Einheit nicht. [Q2]

### Drei Grundlagen auseinanderhalten

Die folgende Funktionsübersicht ist fachliches Orientierungswissen. Die konkreten Dokumente und ihre Rechtsgrundlagen wurden in diesem begrenzten Quellenlauf nicht geprüft; vor Implementierung ist dafür ein gesonderter Quellencheck erforderlich. Insbesondere regeln die hier gelesenen §§ 1 und 14 BBiG nicht selbst den Inhalt einer Ausbildungsordnung.

| Grundlage | Wofür sie hier steht | Nicht verwechseln mit |
| --- | --- | --- |
| Ausbildungsordnung | Bundesweite Grundlage für den anerkannten Ausbildungsberuf; enthält unter anderem Vorgaben für die betriebliche Ausbildung. | Dem Wochenplan eines einzelnen Betriebs. |
| Betrieblicher Ausbildungsplan | Übertragung der Ausbildungsvorgaben auf die Ausbildung im konkreten Betrieb: welche Inhalte wann und wo vermittelt werden sollen. | Einer bloßen Liste aller gerade anfallenden Büroarbeiten. |
| Schulischer Rahmenlehrplan | Inhaltliche Grundlage für den berufsbezogenen schulischen Unterricht; die konkrete schulische Umsetzung ist zusätzlich zu beachten. | Einer betrieblichen Dienstanweisung. |

**Merksatz:** Zwei Lernorte ergänzen sich. Die Ausbildungsordnung ist kein dritter Lernort. Der betriebliche Ausbildungsplan macht Ausbildung im Betrieb planbar.

## 5. Eigenständiges Beispiel: Büroservice Sonnenthal

Alle Namen, Zeiten und Abläufe dieses Beispiels sind erfunden. „Büroservice Sonnenthal“ ist ein fiktiver Ausbildungsbetrieb für Büromanagement, keine reale Behörde.

Du begleitest die auszubildende Person Alex. Sonnenthal organisiert Termine und bearbeitet Anfragen für kleine Vereine. Alex soll eine Anfrage für einen Besprechungsraum vorbereiten. Es fehlen das Datum und die Zahl der Teilnehmenden.

- Im Betrieb zeigt die Ausbilderin Alex, wie Anfragen im Übungssystem erfasst werden. Alex prüft die Angaben und entwirft unter Anleitung eine Rückfrage. Die Ausbilderin bespricht den Entwurf, bevor etwas versendet wird.
- In der Berufsschule übt Alex an einem anderen Fall, fehlende Angaben zu erkennen und Rückfragen verständlich zu formulieren.
- Im betrieblichen Ausbildungsplan ist für diesen Abschnitt die begleitete Bearbeitung von Anfragen vorgesehen. Der Plan ersetzt weder die Erklärung noch die Rückmeldung.
- Beim nächsten Übungsfall erkennt Alex selbst, welche Informationen fehlen, und erklärt den nächsten Arbeitsschritt. Das zeigt mehr Handlungsfähigkeit als bloßes Abschreiben einer fertigen Rückfrage.

**Beispielauswertung:** Der Betrieb bietet konkrete Abläufe, Anwendung und Rückmeldung. Die Schule unterstützt das Verständnis und den Transfer auf andere Fälle. Beides greift ineinander. Ein echter Versand ist nicht Teil dieser Lernübung.

## 6. Übung: Alex bereitet den nächsten Ausbildungstag vor

### Arbeitsauftrag

Lies die fünf Aufgaben. Wähle jeweils genau eine Antwort. Erst „Auswerten“ zeigt die Bewertung. Hilfen sind freiwillig und werden nicht als Fehler gezählt. Eine optionale eigene Begründung wird nicht automatisch benotet.

**A1 – Lernorte erkennen.** Welche Kombination bezeichnet die beiden zentralen Lernorte im dualen System?
- `a`: Ausbildungsbetrieb und Berufsschule.
- `b`: Ausbildungsordnung und Ausbildungsplan.
- `c`: Ausbildungsbetrieb und dessen Pausenraum.

**A2 – Lernen im Betrieb.** Alex erfasst eine Übungsanfrage im betrieblichen System und bespricht den Entwurf mit der Ausbilderin. Was trifft zu?
- `a`: Das ist nur Unterricht der Berufsschule, weil etwas erklärt wird.
- `b`: Das ist Lernen im Ausbildungsbetrieb mit Anleitung und Rückmeldung.
- `c`: Das ist keine Ausbildung, weil noch nichts allein versendet wird.

**A3 – Grundlagen unterscheiden.** Welche Zuordnung stimmt?
- `a`: Ausbildungsordnung = tägliche Aufgabenliste; Ausbildungsplan = Schulzeugnis; Rahmenlehrplan = Raumbelegung.
- `b`: Ausbildungsordnung = nur Hausordnung der Schule; Ausbildungsplan = beliebiger Dienstplan; Rahmenlehrplan = Kundenliste.
- `c`: Ausbildungsordnung = Grundlage des Ausbildungsberufs; Ausbildungsplan = konkrete betriebliche Ausbildungsplanung; Rahmenlehrplan = schulische Inhaltsgrundlage.

**A4 – Beide Lernorte verbinden.** Alex versteht in der Schule, warum Angaben vollständig sein müssen. Im Betrieb prüft Alex damit eine neue Anfrage. Welche Erklärung passt?
- `a`: Das ist Zusammenarbeit der Lernorte: Wissen wird in einer beruflichen Aufgabe angewendet und überprüft.
- `b`: Schule und Betrieb haben nichts miteinander zu tun.
- `c`: Mit dem Unterricht entfällt jede Anleitung im Betrieb.

**A5 – Nächster Schritt.** Alex soll eine unbekannte Aufgabe ohne Erklärung sofort selbstständig versenden. Was ist in diesem Übungsfall die passende erste Handlung?
- `a`: Ungeprüft versenden, damit die Aufgabe schnell erledigt ist.
- `b`: Die Aufgabe kommentarlos liegen lassen.
- `c`: Bei der zuständigen Ausbildungsperson Ziel, Anleitung und Prüfung vor dem Versand klären.

**Optionale Transfernotiz:** Erkläre in zwei Sätzen, was Alex an beiden Orten lernt. Ergänze einen Grund, warum Alex vor einem unbekannten Versand nachfragen sollte. Die Anwendung zeigt dazu die Checkliste „beide Lernorte genannt / Zusammenhang erklärt / Klärung vor Versand begründet“, aber kein automatisches Richtigkeitsurteil. Eine Lehrkraft kann die Notiz gesondert besprechen.

### Gestufte Hilfen

Pro Aufgabe sind zwei ausdrücklich aufrufbare Hilfestufen vorgesehen; keine automatische Anzeige der Musterlösung.

| Aufgabe | Hilfe 1: Denkimpuls | Hilfe 2: Orientierung |
| --- | --- | --- |
| A1 | Suche nach Orten, an denen Ausbildung stattfindet. | Ein Ort gehört zum Unternehmen, der andere zum schulischen Lernen. |
| A2 | Wo spielt die Handlung, wer begleitet Alex? | Erklären und Rückmeldung sind auch Teil betrieblicher Ausbildung. |
| A3 | Trenne übergreifende Vorgabe, konkrete Betriebsplanung und schulische Inhalte. | Ein Dokument für einen Ausbildungsberuf ist nicht der Tagesplan einer einzelnen Person. |
| A4 | Was nimmt Alex aus dem Unterricht in die nächste Aufgabe mit? | Achte auf Verstehen, Anwenden und Prüfen statt auf ein Entweder-oder. |
| A5 | Was fehlt Alex, bevor verantwortbar gearbeitet werden kann? | Kläre Auftrag und Unterstützung mit der zuständigen Ausbildungsperson, bevor etwas hinausgeht. |

## 7. Auswertung aus festen Flags

Keine KI-Bewertung, kein Schlüsselwortvergleich von Freitext und keine nur scheinbar individuelle Rückmeldung. Jede Pflichtauswahl besitzt einen stabilen technischen Wert. Der folgende Schlüssel ist ausschließlich Implementierungs- und Lehrkraftmaterial; er darf in der Lernansicht vor der Auswertung nicht als Musterlösung angezeigt werden. Clientseitiger Quellcode ist allerdings kein sicherer Geheimnisspeicher.

```json
{
  "schemaVersion": 1,
  "einheit": "lf1-a",
  "pflichtfelder": ["a1", "a2", "a3", "a4", "a5"],
  "loesungen": {"a1": "a", "a2": "b", "a3": "c", "a4": "a", "a5": "c"},
  "flags": {
    "lernorteErkannt": {"feld": "a1", "wert": "a"},
    "betrieblichesLernenErkannt": {"feld": "a2", "wert": "b"},
    "grundlagenUnterschieden": {"feld": "a3", "wert": "c"},
    "lernorteVerknuepft": {"feld": "a4", "wert": "a"},
    "klaerungGewaehlt": {"feld": "a5", "wert": "c"}
  }
}
```

Verbindliche Zustände je Aufgabenblock: `unbeantwortet`, `richtig`, `falsch`, `veraltet`. Vor der ersten Auswertung bleibt eine beantwortete Auswahl neutral, ohne Richtigkeitsflag. Hilfenutzung ist ein separates Merkmal und verändert keine Bewertung.

Ablauf:
1. Auswerten prüft Pflichtangaben. Fehlende Auswahl erhält „Bitte wähle eine Antwort“, keine falsche Fachbewertung. Die anderen beantworteten Blöcke dürfen bereits bewertet werden; die Gesamtauswertung bleibt unvollständig.
2. Für beantwortete Blöcke wird ausschließlich der feste Wert verglichen. Richtig: grüner Rahmen plus Text „Richtig“ und Symbol. Falsch: roter Rahmen plus Text „Noch nicht richtig“ und passender Hinweis. Farbe allein genügt nicht.
3. Bei Fehlern erscheinen aufgabenspezifische Hinweise: A1 „Unterscheide Lernort und Dokument“; A2 „Auch Anleitung im Betrieb gehört zum Lernen“; A3 „Vergleiche die drei Funktionen in der Tabelle“; A4 „Suche die Verbindung zwischen Verstehen und Anwenden“; A5 „Klärung vor dem Versand fehlt“. Noch keine vollständige Musterlösung.
4. Jede Änderung nach Bewertung setzt genau die betroffene Bewertung auf `veraltet`; Anzeige „Antwort geändert – bitte erneut auswerten“. Andere unveränderte Bewertungen bleiben erhalten. Ein gespeicherter Bewertungs-Snapshot muss alle wertungsrelevanten Auswahlwerte enthalten. Abschluss bleibt gesperrt, solange eine Pflichtantwort fehlt, falsch oder veraltet ist.
5. Erneutes Auswerten berechnet die betroffenen Flags aus aktuellen Werten. Bei fünf richtigen aktuellen Flags wird die Übung freigegeben. Kein Durchschnitt kann eine fehlende Pflichtantwort verdecken.
6. „Fehler bearbeiten“ führt per tastaturbedienbarem Link zum betroffenen Aufgabenblock und fokussiert dessen Überschrift. Die zugehörige Hilfe bleibt dort erreichbar.

## 8. Lernkontrolle: neuer Fall ohne Hilfen

Neuer fiktiver Anlass: Alex soll für Sonnenthal die Rückmeldung zu einer Raumanfrage vorbereiten. In der Berufsschule wurde geübt, Aussagen sachlich zu begründen. Im Betrieb wird die Rückmeldung vor dem Versand gemeinsam geprüft. Die Lernkontrolle verwendet keine Hilfeknöpfe; nach einem Versuch darf zum Lerntext zurückgekehrt werden. Keine Zeitbegrenzung.

**K1 – Woran zeigt sich berufliche Handlungsfähigkeit am besten?**
- `a`: Alex kopiert einen unbekannten Text, ohne ihn zu verstehen.
- `b`: Alex prüft fehlende Angaben, begründet die Rückfrage und bespricht den Entwurf.
- `c`: Alex kennt nur die Farbe der Versandtaste.

**K2 – Welches Dokument konkretisiert im Betrieb die zeitliche und inhaltliche Ausbildungsplanung?**
- `a`: Der betriebliche Ausbildungsplan.
- `b`: Die Kundenanfrage.
- `c`: Der Speiseplan.

**K3 – Welche Aussage zum dualen System trifft zu?**
- `a`: Im Betrieb wird nie erklärt, in der Schule nie praktisch gearbeitet.
- `b`: Eine Ausbildungsordnung ist der zweite Lernort.
- `c`: Betrieb und Berufsschule leisten unterschiedliche, sich ergänzende Beiträge zur Ausbildung.

**K4 – Was lässt sich aus dem gelesenen § 14 Absatz 3 BBiG ableiten?**
- `a`: Jede beliebige Aufgabe ist zulässig, wenn sie schnell erledigt wird.
- `b`: Übertragene Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sein.
- `c`: Der betriebliche Ausbildungsplan ersetzt den Berufsschulbesuch.

Fester, nicht vorab sichtbarer Schlüssel: `k1=b`, `k2=a`, `k3=c`, `k4=b`. Jedes Pflichtfeld erzeugt genau ein boolesches Flag; fehlend ist nicht falsch, sondern unvollständig. Ziel erreicht bei vier richtigen aktuellen Antworten. Nach Auswertung sind Ergebnis und begründete Auflösung des abgeschickten Versuchs zugänglich. Beispiel K1: „Richtig ist b: Alex verbindet Prüfen, Begründen und begleitetes Handeln. Ein einzelner auswendig gelernter Handgriff reicht dafür nicht.“ K2: „Richtig ist a: Der Plan konkretisiert die betriebliche Ausbildung, nicht eine Kundenanfrage.“ K3: „Richtig ist c: Beide Lernorte ergänzen sich; die reine Trennung Praxis/Theorie greift zu kurz.“ K4: „Richtig ist b: Das entspricht der gelesenen Vorgabe zu Ausbildungsaufgaben.“

Nach Änderungen werden die betroffenen Ergebnisse veraltet und der Abschluss gesperrt, bis erneut ausgewertet wurde. Hilfen aus der Übung werden nicht als Kontrollfehler übernommen. Abschlussvorschlag: Übung und Kontrolle jeweils vollständig richtig und aktuell. Dieser Bauplan verändert keine bestehenden projektweiten Abschlussregeln.

## 9. Speicherung, Bedienung und Implementierungsabnahme

Vor Umsetzung vorhandene Speicher- und Resetmechanik lesen und erhalten; dieser Bauplan behauptet keine bereits geprüfte API. Geplante Speicherung: Versionskennung, Auswahlwerte, Bewertungs-Snapshot, Flags, Hilfestufen und Abschlussstatus getrennt. Beim Laden nur Bewertungen mit passender Schema-Version und übereinstimmendem Snapshot als aktuell akzeptieren. Keine realen Personen- oder Betriebsdaten erheben. Optionale Freitextnotizen standardmäßig nicht dauerhaft speichern und diesen Umstand sichtbar erklären. Speicherfehler verständlich melden, nicht fälschlich „gespeichert“ anzeigen. Reset nur über das vorhandene autorisierte Verfahren, dann Auswahlen, Flags, Hilfen und Abschluss konsistent entfernen; keine neue Umgehung des Projektpassworts.

Geplante Sicht- und Funktionstests vor Freigabe:
- Alle Fragen richtig; jede Frage einzeln falsch; alle und einzelne Pflichtfelder leer.
- Mehrere Frageblöcke unabhängig bewerten; eine Antwort danach ändern; nur betroffenen Block veralten lassen; Abschluss bis neuer Auswertung sperren.
- Hilfen ohne Punktabzug; keine Lösung im sichtbaren Lerntext vor Auswertung; Lernkontrollauflösung erst nach Abschicken.
- Neuladen mit aktuellem und mit veraltetem Snapshot; beschädigte Speicherung; verweigerter Speicher; vollständiger Reset.
- Ausschließliche Tastaturbedienung, native Radio-Gruppen mit `fieldset`/`legend`, sichtbarer Fokus, verständliche Statusmeldung, Fehlersprung zum richtigen Block.
- Dunkelmodus, hoher Kontrast und schmales Fenster ohne abgeschnittene Aufgaben oder nur farbige Rückmeldung.
- Offline über `file://` prüfen, sobald implementiert. Windows, Firefox und NVDA sind durch diesen Bauplan nicht getestet.

## 10. Quellen und verbleibende Grenzen

**Q1 – selbst gelesen, 08.11.2026:** Berufsbildungsgesetz, § 1, insbesondere Absatz 3. Nichtamtliche Online-Wiedergabe: https://www.gesetze-im-internet.de/bbig_2005/__1.html . Belegt das Ziel beruflicher Handlungsfähigkeit und erforderlicher Berufserfahrungen; belegt nicht die gesamte Organisation des dualen Systems.

**Q2 – selbst gelesen, 08.11.2026:** Berufsbildungsgesetz, § 14, insbesondere Absatz 1 Nummern 1, 2 und 4 sowie Absatz 3. Nichtamtliche Online-Wiedergabe: https://www.gesetze-im-internet.de/bbig_2005/__14.html . Belegt planmäßige Ausbildung, ausdrückliche Beauftragung einer Ausbildungsperson, Anhalten zum Berufsschulbesuch und ausbildungszweckgerechte Aufgaben. Keine umfassende Aussage zu schulrechtlichen Pflichten oder Freistellung daraus ableiten.

**Lokaler Strukturabgleich:** `/home/starnet/projects/Verwaltung-Ausbildung-rathaus-refit/js/module-daten.js`, LF1-Abschnitt gelesen. `/home/starnet/projects/Verwaltung-Ausbildung-lehrplan-kompass/docs/lehrplan-kompass/bericht.md`, ausschließlich LF1-Suchtreffer mit Kontext gelesen; keine Prüfung des gesamten Berichts oder zugrunde liegender Schulmaterialien.

**Quelle ungeprüft / offene fachliche Freigabe:** konkrete aktuelle Ausbildungsordnung für Büromanagement und deren Ausbildungsrahmenplan; schulischer Rahmenlehrplan im Original; einschlägige schulrechtliche Grundlagen. Keine weiteren Normen zitiert. Die Funktionsübersicht der drei Grundlagen muss vor Umsetzung fachlich mit diesen Dokumenten abgesichert werden. Bestehende LF1-Lernkontrollfragen wurden nicht gelesen und daher weder auf Überschneidungen geprüft noch geändert.

**Ergebnisgrenze:** Vollständiger Unterrichtsbauplan mit Lerntext, eigenständigem Fall, Aufgaben, Hilfen, deterministischen Auswertungsregeln und Lernkontrolle. Kein Nachweis einer implementierten oder browsergeprüften Einheit; keine Veröffentlichungsfreigabe.
