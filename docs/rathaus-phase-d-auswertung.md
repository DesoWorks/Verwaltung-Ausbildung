# Operation RATHAUS – Phase D, Auswertung und Plan

Stand: 01.11.2026. Analyse, keine neue Funktion. Keine Unterrichtsfreigabe.

Nachtrag nach dem Windows-Durchlauf: Die sechs Sprach- und Bewertungsbefunde und die geänderte Reihenfolge stehen in `docs/rathaus-windows-rueckmeldung.md`. Die Scan-Auswertung in dieser Datei gilt weiter. Der Ausbauvorschlag in Abschnitt 4 ist dadurch überholt, nicht die Seitenbezüge.

Worktree: `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`  
Branch: `feature/operation-rathaus-mvp1`  
Geprüfter Anwendungsstand: `79f4e6d41661a60b600885613c19259358240360`

Die frühere Datei `docs/rathaus-unterrichtsuebersicht.md` hat nur einen Teil der Seiten gesehen. Sie wird durch diese Auswertung ersetzt. Die Originale liegen unverändert unter `/home/starnet/unterrichtsmaterial/verwaltung/`. Arbeitsbilder, nicht im Git: `/home/starnet/arbeitsdateien/rathaus-scans-2026-11-01/`.

`pdftotext` ist leer. `tesseract` ist nicht installiert. Die Seiten wurden mit `pdftoppm` bei 120 dpi gerendert. Schlüssel­seiten wurden als Bild gelesen. Die übrigen Seiten wurden per Bildanalyse gelesen und an unklaren Stellen gegen das Bild gehalten. Eine Crew-Transkription von `doc016265` hat Seite 3 falsch beschrieben und wird nicht als Quelle verwendet.

Personen, Straßen, Konten, Steuer- und Registernummern aus den Scans stehen hier nicht. Das sind Lehrbuchfiguren oder Klassennotizen, keine Fälle für die Oberfläche.

Rechtsstand der Gegenprüfung, nichtamtliche Fassung auf gesetze-im-internet.de, abgerufen am 01.11.2026:

- BBiG § 15 Freistellung, Anrechnung
- BBiG § 22 Kündigung
- JArbSchG § 9 Berufsschule

Das ist keine Rechtsberatung und keine gesicherte Länderregel zur Berufsschulpflicht.

## 1. Die drei Scans

Keine Datei ist als LS03, LS04 oder LS06 beschriftet. Die Dateinamen nennen keine Lernsituation. Die Zuordnung aus dem ersten Auftrag bleibt offen.

### doc01626520261030131013.pdf

14 Seiten, A4 quer, Scan vom 30.10.2026. Gemischte Kopiervorlagen, keine fortlaufende Lektion.

| PDF-Seite | Gedruckte Nummer | Was sichtbar ist | Art |
| --- | --- | --- | --- |
| 1 | keine | „Aufgaben zur Ausbildung“. Zwei Aufgaben zu Kündigung: wiederholtes Zuspätkommen; Ausbildung beenden für ein soziales Jahr oder eine Stelle im Ausland; Kündigung ohne Grund kurz nach Beginn; Wechsel des Betriebs im zweiten Lehrjahr. Jahreszahlen teilweise „20..“. | Unterrichtsvorgabe, Fälle |
| 2 | Seite 2 / 5 | Lernfeld 02, Lernsituation 01, „Berufliche Kompetenzen analysieren“. Stellenanzeige BüroPlus GmbH, Kauffrau/Kaufmann für Büromanagement. Fußzeile mit Personenname und Anschrift, hier nicht übernommen. Druckvermerk 30.09.2026. | Unterrichtsvorgabe |
| 3 | keine | Handschrift „G7“ und Begriffsraster: Duale Ausbildung, Ausbildungsvertrag, Rechte und Pflichten, BBiG, JArbSchG, JAV, Berichtsheft, Tarifvertrag, Berufsschule, Ausbildungsvergütung, Probezeit, Zwischenprüfung, Zuständige Stelle, Weisungsrecht, Verschwiegenheit. | Unterrichtsvorgabe, Begriffe |
| 4 | Seite 1 / 2 | WBM-LF01-LS01 „Ausbildungssituation darstellen“. E-Mail einer Bekannten vor Ausbildungsbeginn: Ablauf, Berufsschule, Tätigkeiten, Veränderung im Leben. Stadtmarketing GmbH. | Unterrichtsvorgabe |
| 5 | keine | Kennenlern-Bingo. Kein Verwaltungsvorgang. | Unterrichtsvorgabe, Eisbrecher |
| 6 | Seite 7 / 11 | WiSo-KB1-LS03. Rollenkarten 1 bis 6 der Telefonaktion „Was muss ich während meiner Ausbildung leisten?“. Karte 1: Berufsschule langweilig, lieber zu Hause. Karte 2: Kritik nach eigenmächtiger Aufgabenwahl. Karte 3: Weitergabe eines Kundenkaufs. Karte 4: Rauchen trotz Verbot. Karte 5: Auftrag nicht ausgeführt. Karte 6: Kaffee auf der Tastatur, Asche in der Ausgangspost. Druck 12.10.2015. | Unterrichtsvorgabe |
| 7 | Seite 8 / 11 | Dieselbe Lernsituation, Karten 7 bis 12. Karte 7: keine Vergütung im ersten Monat. Karte 8: eigenen Bildschirm mitbringen. Karte 9: Fensterputzen trotz Höhenangst. Karte 10: nur Ablage, Daten und Post. Karte 11: kein Zeugnis. Karte 12: drei Wochen nicht in die Berufsschule, weil Hochbetrieb. | Unterrichtsvorgabe |
| 8 | handschriftlich 116 | „Betrieblicher Leistungsprozess“. Schaubild Beschaffung, Produktion, Absatz. Zuordnungstabelle mit handschriftlichen Kreuzen, teils durchgestrichen. Die Kreuze sind Schülerarbeit, keine Musterlösung. | Unterrichtsvorgabe plus Notizen |
| 9 | Bildanalyse: 6/8, nicht pixelgeprüft | Protokollvordruck zur Telefonaktion. Handschriftliche Beratungsergebnisse mit § 13 und § 14. Einzelne Fallzeilen unleserlich. Keine amtliche Lösung. | Schülerprotokoll |
| 10 | keine gedruckte Zahl sicher | „Duales System“. Lernort Betrieb und Schule, IHK, handschriftlich Handwerkskammer, Vorteile und Nachteile. Ein Vorteilseintrag unleserlich. | Unterrichtsvorgabe |
| 11 | Seite 9, Merkur | „Die Ulmer Büromöbel AG kennenlernen“. Auswertungsformular, ISBN 978-3-8120-1578-3. „Hervorgegangen aus“ auf diesem Scan nicht sicher lesbar. | Lehrbuchvorlage |
| 12 | Seite 1 / 6 | WiSo-KB1-LS03, Ausgangssituation: Putzen, schwere Kartons, selbst gekaufte Tastatur und Maus, eigenmächtige Pause. Randnotiz BBiG § 14 und § 13. Druck 17.09.2015. | Unterrichtsvorgabe |
| 13 und 14 | keine | Dieselbe Übersicht „Handlungskompetenzen Kaufleute für Büromanagement“ für BüroPlus: Fach-, Methoden-, Sozial- und Selbstkompetenz. Zwei Aufnahmen derselben Vorlage. | Unterrichtsvorgabe |

Jugendarbeitsschutz kommt als Wort im Raster auf Seite 3 vor. Ein ausgearbeiteter JArbSchG-Fall steht auf diesen 14 Seiten nicht.

### doc01626720261030131327.pdf

12 Seiten, Scan vom 30.10.2026. Kaufvertrag, Anfrage, Angebot und ein alter Auszug zum Ausbildungsvertrag. Kein Rathaus-Vorgang.

| PDF-Seite | Sichtbarer Inhalt | Art |
| --- | --- | --- |
| 1 | Kaufvertrag, Lieferbedingungen. Stationen Verkäufer bis Käufer. Handschriftliche Kostenverteilung, Klauseln wie ab Werk, frei Haus. Einzelne Enden der Liste unleserlich. | Unterrichtsvorgabe plus Notizen |
| 2 | Zahlungsbedingungen vor, bei und nach Lieferung. Gesetzlicher Hinweis: ohne Vereinbarung sofort bar nach Übergabe. Gedruckt „12“. | Unterrichtsvorgabe |
| 3 | Kundenanfrage Couch, Anzeigenpreis, behaupteter Druckfehler, später anderer Preis. Auftrag: im BGB suchen. Kein Paragraph auf der Seite. | Unterrichtsvorgabe |
| 4 | Folgefragen zur Annahme per Mail und zur Frist. Handschriftlich „§ 147 BGB“. Das ist eine Eintragung, keine gedruckte Lösung. | Unterrichtsvorgabe plus Notiz |
| 5 | Musterangebot Ulmer Büromöbel AG, Merkur. Preis, Rabatt, Lieferung ab Werk, Skonto. Kontodaten nicht übernommen. | Lehrbuchvorlage |
| 6 | Abdruck BGB §§ 145 bis 153, Seite 183. Rand handschriftlich und teilweise unleserlich, Stichworte zu Nichtigkeit und Ausbeutung. | Gesetzestext plus Notiz |
| 7 | Lernfeld 3, Aufträge bearbeiten, Lernbuch S. 216–217. Anfrage eines Möbelhauses nach Aktenvernichtern. | Lehrbuchvorlage |
| 8 | Lernfeld 3, Material zur Anfrage: allgemein und speziell, keine Willenserklärung, Form nicht vorgeschrieben. Seite 160, Merkur. | Lehrbuchvorlage |
| 9 | Unternehmensbeschreibung Ulmer Büromöbel AG, direkter Absatz, Serie und Spezialanfertigung, etwa 420 Mitarbeitende, Stabliniensystem. | Lehrbuchvorlage |
| 10 | Organigramm derselben AG. Namen der Stelleninhaber nicht übernommen. | Lehrbuchvorlage |
| 11 | HOT 2/2008, Bildungsverlag EINS, Seite 4. „Der Ausbildungsvertrag“. Felder ergänzen: Form, Inhalt, Verzeichnis, Minderjährige, Erstuntersuchung, Probezeit, Kündigung. Handschrift teils unleserlich, unter anderem bei der Probezeitdauer. | Alte Kopiervorlage plus Notizen |
| 12 | Dieselbe Reihe, Seite 2. Auszug BBiG zu Dauer, Niederschrift, Verhalten, Ausbildungspflichten, Vergütung, Probezeit, Ende, Kündigung, Verzeichnis. Druckkontext 2008. | Alter Auszug, nicht der heutige Volltext |

Der Auszug auf Seite 12 nennt die Berufsschule bei der Pflicht, Auszubildende zum Besuch anzuhalten. Die heutige Freistellungsregel des § 15 steht dort nicht als eigener Paragraph. § 22 des Auszugs trifft die heutige Grundregel zur Probezeit und zur Vier-Wochen-Frist noch. Der heutige § 22 hat zusätzlich den Ausschluss der elektronischen Form und die Zwei-Wochen-Frist für die Kündigung aus wichtigem Grund. Der Scan von 2008 ist deshalb unvollständig und darf nicht als heutige Musterlösung dienen.

### doc01626820261030131415_2.pdf

13 Seiten, Scan vom 30.10.2026. Überwiegend handschriftliche Klassennotizen. Kein LS-Deckblatt.

| PDF-Seite | Sichtbarer Inhalt | Sicherheit |
| --- | --- | --- |
| 1 | Notizen zur 6. Auflage: Dauer drei Jahre, Schule neben der Arbeit, Abteilungen, E-Mail, Post, Vergütung. | lesbar, Schülertext |
| 2 | Skizze „Einführung in die BWL“: Lieferanten, Unternehmen, Kunden, Staat, Verträge, Angebot und Nachfrage. Datum unscharf, wirkt wie 29.09. | mehrere Wörter unleserlich |
| 3 und 4 | Unternehmenssteckbrief Automatisierungstechnik, Standort Weinheim, 95 Mitarbeitende, Direktvertrieb. | Klassenarbeit, nicht übernehmen |
| 5 | Prüfung einer Anfrage: Bonität, Sortiment, Preis, Lieferfähigkeit. Begriff des Angebots. | Notizen |
| 6 | Form des Angebots nicht vorgeschrieben. Bindung, § 145 BGB. | knapp, lesbar |
| 7 | Handschriftliche Antworten zu Rollenkarten 7 bis 10, Verweise auf § 14. | Schülerantwort, keine Vorlage |
| 8 | Bindung unter Anwesenden und Abwesenden, §§ 147, 149, 150. Seite 11, Datum 17.10.26. | Notizen |
| 9 | Überschrift „Anfragen der Kunden bearbeiten“. Fast nur Nummern. | überwiegend unleserlich |
| 10 | Angebot unter Abwesenden, § 147 Absatz 2, 24 Stunden für Mail. Datum unscharf. | Notiz, nicht als Gesetzestext nehmen |
| 11 | Aufgabe 1, handschriftlich § 22: Zuspätkommen kein wichtiger Grund; Probezeit ohne Grund; Wechsel mit vier Wochen. | teilweise unleserlich |
| 12 | Inhalte des Angebots, § 243 mittlere Art und Güte, Rabattarten, Skonto. | Notizen |
| 13 | Bonus als nachträglicher Preisnachlass. | kurz, lesbar |

Die 24-Stunden-Regel für E-Mail auf Seite 10 ist eine Notiz, kein abgedruckter Gesetzestext. § 147 Absatz 2 spricht von der Zeit, in der unter regelmäßigen Umständen eine Antwort erwartet werden darf. Die Notiz darf nicht als Gesetz in die Übung wandern.

## 2. Abgleich mit dem Rathaus-MVP

Der MVP auf `79f4e6d` hat Stadtübersicht, Personalamt, Posteingang, eine Ausbildungsakte, einen siebenschrittigen Vorgang und eine lokale Lehrkraftansicht. Bürgerbüro, Ordnungsamt und Stadtkasse sind Vorschau. Fortschritt nur in `localStorage`. Keine Schülerdatenbank.

### Bereits abgedeckt

Nur der Themenkreis, nicht die Vorlage:

- Rechte und Pflichten in der Ausbildung, Entscheidung, Begründung, sachliche Antwort, mehrere Versuche.
- Freistellung für den Berufsschultag bei mehr als fünf Unterrichtsstunden. Das trifft den heutigen BBiG § 15 und, für unter 18 Jahren, JArbSchG § 9. Beide am 01.11.2026 in der nichtamtlichen Fassung gelesen.
- Begriffe Freistellung, Ausbildungszweck, Berufsschultag werden in der Übung erklärt.
- Lehrkraftansicht mit vorläufiger Lösung und Zurücksetzen.

Die übrige Plattform im selben Worktree hat Lektionen zu Rolle, Rechten und Betrieb. Die sind nicht das virtuelle Rathaus und werden hier nicht als Rathaus-Abdeckung gezählt.

### Nicht abgedeckt

- Begriffsraster von PDF-Seite 3 in `doc016265`.
- Duales System, zwei Lernorte, zuständige Stelle.
- WBM-LF01-LS01, Gespräch über den Ausbildungsstart.
- Rollenkarten 1 bis 12, einschließlich der Ausgangssituation Putzen, Arbeitsmittel, Pause.
- Kündigungsfälle der ersten Seite und der Vertragsvorlage von 2008.
- Alles aus `doc016267` zu Anfrage, Angebot, Kaufvertrag, Lieferung und Zahlung.
- Klassennotizen und der Steckbrief aus `doc016268`.
- Kennenlern-Bingo und der betriebliche Leistungsprozess. Beides gehört nicht in den ersten Rathaus-Ausbau.

### Fachliche Korrekturen am vorhandenen Vorgang

Der laufende Fall „ein Dienstag, Personalmangel, Schalter statt Berufsschule“ steht so nicht in den Scans. Die nächste Vorlage ist Rollenkarte 12: drei Wochen nicht in die Berufsschule wegen Hochbetrieb. Rollenkarte 1 ist ein anderer Fall: langweiliger Unterricht, zu Hause bleiben. Der MVP-Fall bleibt eine fiktive Übung aus dem ersten Auftrag. Er ist nicht als Unterrichtszitat zu kennzeichnen.

Die Lehrkraftlösung sagt noch, die Scans seien nicht vollständig ausgewertet. Das ist nach dieser Datei überholt. Die Lösung bleibt vorläufig, bis Dennis und Nexus sie als Übungstext freigeben. Länderregeln sind weiter offen.

Die Schülerkreuze, das Protokoll und die Notizen zu § 14 und § 22 sind keine Musterlösung. Die 24-Stunden-Notiz und der BBiG-Auszug von 2008 auch nicht.

### Was sich als Simulation eignet

- Rollenkarte 12, danach Karte 1. Dieselbe Sieben-Schritt-Form: Nachricht, Akte, Entscheidung, Begründung, Antwort, Auswertung, Abschluss.
- Die Kündigungsfälle der ersten Seite, sobald der heutige § 22 und nicht nur der Auszug von 2008 die Grundlage ist.
- Karten 7, 8, 10 und 11 als spätere Personalvorgänge: Vergütung, Ausbildungsmittel, Ausbildungszweck, Zeugnis.

### Was eher Erklärung oder Nachschlagewerk ist

- Begriffsraster, duales System, Vertragsniederschrift, Probezeit, Verzeichnis.
- Anfrage, Angebot, §§ 145 bis 153, Liefer- und Zahlungsklauseln. Das ist Lernfeld 3, nicht der erste Personalamt-Fall.
- Ulmer Büromöbel und BüroPlus nur als Hinweis auf die Vorlage. Keine Kontodaten, keine echten Klassenfirmen.

## 3. Browserprüfung

Unabhängige interaktive Sichtprüfung: **NICHT AUSGEFÜHRT**. Nicht bestanden und nicht durchgefallen, weil der Ablauf nicht im Browser gesehen wurde.

GLaDOS, Lauf `73d8a3a0-c104-4ccc-b7ba-cf5197906c22`, Commit bestätigt `79f4e6d`, Arbeitsbaum sauber. Der eigene Server lief. `browser_test_navigate` meldete: `local test URL is not proven to belong to this agent's running background server`. Ein zweiter Port brachte denselben Fehler. `curl` zählt nicht als Sichtprüfung.

Zweiter unabhängiger Lauf `a2ca5c13-3f7c-4226-a67c-7d23fd63e8af`, derselbe Commit, Arbeitsbaum vorher sauber. Dieselbe Fehlermeldung. GLaDOS hat zusätzlich einen Headless-Screenshot geschrieben: `/home/starnet/arbeitsdateien/rathaus-scans-2026-11-01/sicht/glados-stadt.png`, 1365×900. Sie sieht die Startansicht, Navigation und „0 von 7 Schritten“. Ablauf, erneute Auswertung, Tastatur und Konsole hat sie nicht geprüft. Ihr Urteil bleibt **NICHT AUSGEFÜHRT**.

Derselbe Fehler trat hier auf Port 8137 auf. `browser.attach` ist in diesem Lauf nicht nutzbar. `browser.navigate` öffnet keine lokale Adresse.

Ein headless Screenshot von `http://127.0.0.1:8137/module/rathaus.html` mit Google Chrome, 1400×900, liegt unter `/home/starnet/arbeitsdateien/rathaus-scans-2026-11-01/sicht/stadt.png`. Das ist eine Aufnahme der Startseite, keine Ablaufprüfung und keine Abnahme durch GLaDOS. Sichtbar sind Titel, die sechs Bereichsschalter, 0 von 7 Schritten und der Willkommenstext. Die farbigen Blöcke sind die Skyline (`aria-hidden`), keine Auswertung. Die Ämterkarten liegen in diesem Ausschnitt unterhalb der Skyline. Tastatur, Konsole, erneute Auswertung und der Abschlussweg sind damit nicht geprüft.

Die Kerntests bleiben, was sie waren: 13 bestanden auf `79f4e6d`. Das ist keine Browserabnahme.

## 4. Vorschlag für den nächsten Ausbau

Noch nicht bauen. Reihenfolge nach Unterrichtsnutzen, nicht nach Technikspiel.

1. Kennzeichnung korrigieren. Der vorhandene Fall bleibt fiktiv und an den heutigen § 15 angelehnt. Die veraltete Zeile zur unvollständigen Scanprüfung kommt weg. Quellen und Unsicherheit bleiben. Jede Textänderung im Kern braucht einen Regressionstest.
2. Nachschlagekarte im Personalamt: die Begriffe von PDF-Seite 3 und das duale System, in einfachem Deutsch, mit Quelle und Rechtsstand. Keine Musterlösung.
3. Zweiter Vorgang nach Rollenkarte 12, mit erfundenen Namen. Karte 1 als deutlich getrennter Gegensatz, nicht als Variante desselben Sachverhalts.
4. Erst danach die Kündigungsfälle, auf heutigem § 22, nicht auf dem Auszug von 2008.
5. Anfrage und Angebot nicht in diesen Ausbau mischen. Dafür wäre ein eigener Bereich nötig, und die Lehrbuchfirmen dürfen nicht mit Kontodaten hinein.

Nicht aufnehmen: Bingo, Leistungsprozess-Kreuze, Klassensteckbrief Weinheim, handschriftliche Protokolle als Lösung, IBANs.

## 5. Offene Entscheidungen

Dennis und Nexus, nicht die Crew:

1. Bleibt der Dienstag-Schalter-Fall, oder wird er durch Rollenkarte 12 ersetzt?
2. Dürfen BüroPlus und Ulmer Büromöbel als benannte Übungsfirmen vorkommen, oder nur die erfundene Stadt Sonnenthal?
3. Ist der nächste Bau die Kennzeichnung plus Nachschlagekarte plus ein zweiter Fall, oder nur die Kennzeichnung?
4. Die Planungsseite liegt unter der vorhandenen Notion-Seite „Verwaltug-Ausbildung – Projektzentrale“. Der Titel dort hat den Tippfehler. Soll er bleiben?
5. Die interaktive Browserprüfung ist mit den vorhandenen Werkzeugen blockiert. Reicht der morgige eigene Test, oder wird auf einen nutzbaren Prüfbrowser gewartet?
