# Lehrplan-Kompass Verwaltung-Ausbildung

Stand der Prüfung: 05.11.2026.
Produktstand, nur gelesen: Branch `feature/verwaltung-rathaus-expansion-2026-11-05`, HEAD `fd1b374acd95638f8d2234e36bd626925afc385d`.
Dieser Bericht ändert keinen Produktcode.

Einbindung in den Pre-Dev-Branch am 05.11.2026: nur diese Dokumentation. Es gibt keine Lehrplan-Kompass-Seite in der Lernoberfläche. Die Zahlen beziehen sich auf den damals gelesenen Stand `fd1b374`. Der Branch enthält zusätzlich die Aufgabenoberfläche aus `30cdc85`. Die Original-PDFs sind nicht Bestandteil dieses Repositories.

## Gesamtbewertung

Die drei Unterrichts-PDFs sind kein Lehrplan und kein vollständiges Schuljahr.
Es sind 39 gescannte Seiten: Arbeitsblätter, Lehrbuchseiten, ein Gesetzestextfoto und Schülernotizen.
Daraus lassen sich 16 gedruckte Unterrichtseinheiten unterscheiden.

Keine dieser 16 Einheiten ist auf der Plattform vollständig abgedeckt.
Keine der 16 Aufgaben ist als diese Aufgabe vorhanden.
13 haben eine verwandte Kurzlektion oder ein Werkzeug.
3 haben keinen passenden Inhalt.

Die Plattform hat für Jahr 1 benutzbare Orientierung: 32 Lektionen, vier Lernzielkontrollen, vier Werkzeuge und sechs Rathaus-Fälle.
Jahr 2 und Jahr 3 sind Platzhalter. Die Rathaus-Fälle bilden die PDF-Aufgaben nicht ab, außer den Berufsschulbesuch bei Luca und Noelle.

Das ist keine Abdeckung der Ausbildung.

## Prozent, nur mit dieser Bezugsgröße

Zählmenge: 16 gedruckte Einheiten, Zeilen U01 bis U16 in `abdeckung-matrix.csv`.
Mitschriften, Dubletten, der Rahmenlehrplan und das Rathaus sind nicht in diesem Nenner.

| Stufe | Anzahl | Rechnung |
|---|---|---|
| Vollständig | 0 | 0 / 16 = 0 % |
| Teilweise | 13 | 13 / 16 = 81,25 % |
| Nur erwähnt | 0 | 0 / 16 = 0 % |
| Fehlt | 3 | 3 / 16 = 18,75 % |

Teilweise heißt hier: das Themenfeld ist in einer kurzen Lektion angerissen.
Die Aufgabe aus dem PDF, die verlangten Paragraphen und die Rückmeldung dazu fehlen.
0 / 16 der PDF-Aufgaben haben eine passende Übung.
0 / 16 haben eine passende Rückmeldung.
0 / 16 haben eine passende Lernkontrolle.

Die drei fehlenden Einheiten sind Kennenlern-Bingo, das Arbeitsblatt Duales System und die Lieferklauseln.

## Was die PDFs selbst einem Lernfeld zuordnen

Nur drei Einheiten tragen ein Lernfeld auf der Seite:

| Einheit | Aufdruck | Abdeckung |
|---|---|---|
| U04 | WBM, Lernfeld 01 | Teilweise |
| U02 | WBM, Lernfeld 02, Blatt 2 von 5 | Teilweise |
| U15 | Lernfeld 3, Lernsituation 1 | Teilweise |

3 / 3 = 100 % teilweise, 0 / 3 vollständig.
Das ist der ganze aufgedruckte Lernfeldumfang der PDFs, nicht der Unterricht eines Jahres.

Die Bögen U06 und U08 sind als WiSo gekennzeichnet und getrennt ausgewiesen. Rechte und Pflichten überschneiden sich mit LF1. WiSo ist kein zusätzliches Lernfeld und wird nicht doppelt gezählt.

## Rahmenlehrplan, getrennt

Gelesen: Rahmenlehrplan Kaufmann/Kauffrau für Büromanagement, Beschluss vom 27.09.2013 in der Fassung vom 20.03.2025.
Quelle: https://www.kmk.org/fileadmin/Dateien/pdf/Bildung/BeruflicheBildung/rlp/Kaufleute_Bueromanagement_13-09-27_idFv_25-03-20-mitEL.pdf
Die Lernfeldtitel und Stunden auf Seite 8 stimmen mit `js/module-daten.js` überein.
Die Zielformulierungen sind nicht Satz für Satz gegen jede Lektion geprüft. Für Lernfeld 1 wurde der Text auf den Seiten 9 und 10 gelesen.

| Aussage | Rechnung | Was sie nicht bedeutet |
|---|---|---|
| Lernfelder mit benutzbaren Lektionen | 4 / 13 = 30,8 % | nicht 30,8 % des Unterrichts |
| Planstunden dieser vier Felder | (40 + 80 + 80 + 120) / 880 = 320 / 880 = 36,4 % | nicht 36,4 % Inhaltsabdeckung |
| Jahr 2 und 3 | 9 / 13 Felder, 560 / 880 Stunden, nur `kommt-bald` | in den PDFs nicht belegt |

## Die zehn wichtigsten Lücken

1. Bindung an das Angebot, §§ 145 bis 150, Fälle Frau Schmitt. Die PDFs haben die Aufgaben. Die Lektion hat sie nicht.
2. Kündigung im Ausbildungsverhältnis, § 22, die vier Fälle auf PDF-1 Seite 1.
3. Ausbildungsvertrag ausfüllen, §§ 5, 11, 13, 14, 17, 20 bis 22 und 34 bis 36.
4. Rollenkarten zu Pflichten, eigenen Geräten, einfachen Tätigkeiten, Zeugnis und Verschwiegenheit. Nur die Berufsschule ist als Rathaus-Fall da.
5. Kundenanfrage der Westmoor KG beantworten, einschließlich der fehlenden Angebotspflicht.
6. Inhalte eines Angebots: Art, Güte, Menge, Rabattarten, Skonto, Bonus. § 243 steht nur in der Mitschrift.
7. Lieferklauseln und Kostenübergang. Im Code nicht gefunden.
8. Zahlungszeitpunkte außer Skonto: Vorkasse, Nachnahme, Ziel, gesetzliche Sofortzahlung.
9. Duales System: zwei Lernorte, Kammer, Vor- und Nachteile.
10. Betrieb im Steckbrief und Organigramm darstellen, wie bei der Ulmer Büromöbel AG. Die allgemeine Lektion ersetzt das Formular nicht.

Nicht in dieser Liste: Bingo, die widersprüchliche Weinheim-Mitschrift, weitere Rathaus-Ämter.

## Drei Ausbaupakete

Noch nicht bauen. Erst die Windows-Rückmeldung zum bestehenden Stand abwarten.

### Paket 1. Rechtslage der Ausbildung

Ziel: Die Aufgaben zu Vertrag, Probezeit und Kündigung so üben, wie die Blätter sie stellen.
Lernfelder: LF1. Die WiSo-Karten bleiben als zusätzliches Übungsblatt gekennzeichnet, nicht als Lernfeld des Rahmenplans.
Inhalte: vier Kündigungsfälle, Ergänzung des Ausbildungsvertrags, Rollenkarten, Flyer Duales System.
Übungen: Rechtslage mit Paragraph entscheiden, nicht nur den Begriff wählen. Beratungsprotokoll als eigene Antwort, nicht als Freitext ohne Rückmeldung.
Lernkontrolle: neue Fragen in der bestehenden LF1-Kontrolle, alte Fragen nicht abschwächen.
Technik: vorhandenes Lektionsmuster, offline, kein Netz. Luca und Noelle nicht umbauen.
Größe: ein zusammenhängendes Paket, kein neues Amt.

### Paket 2. Von der Anfrage zur Bindung

Ziel: Die Schmitt-Fälle und die Westmoor-Anfrage werden die Übung, nicht eine dritte allgemeine Merksatzlektion.
Lernfelder: LF3.
Inhalte: Annonce gegen Angebot, Frist, verspätete Annahme, Form der Anfrage, Angebotsschreiben lesen.
Übungen: Fall entscheiden und die Konditionen am Brief erkennen.
Lernkontrolle: Fallfragen mit Rückmeldung. Schüler-Mitschriften nicht als Lösung übernehmen. Sie vermischen die Paragraphen.
Technik: neue Lektion im vorhandenen Jahr-1-Muster. Textbausteine bleiben Werkzeug, nicht die Bewertung.
Größe: mittel, abhängig von Paket 1 nur bei den gemeinsamen Vertragsbegriffen.

### Paket 3. Liefern und zahlen

Ziel: Lieferklauseln und Zahlungszeitpunkte schließen die Lücke neben der vorhandenen Skonto-Lektion.
Lernfelder: LF4.
Inhalte: Kostenübergang von Station zu Station, Zahlung vor, bei und nach der Lieferung, danach der vorhandene Skonto-Rechner.
Übungen: Klausel zuordnen, Zahlungszeitpunkt erkennen, Skonto nur innerhalb der Frist.
Lernkontrolle: Fragen zur Zuordnung, keine erfundenen Satzungspreise.
Technik: eine Lektion und eine Abbildung, offline.
Größe: kleiner als Paket 2. Kann nach Paket 2 folgen, weil Zahlungsbedingungen im Angebot wiederkehren.

## Rathaus, getrennt von den PDFs

Sechs benutzbare Fälle, nicht fünf.

| Fall | Was er übt | Treffer in den drei PDFs |
|---|---|---|
| Luca Berger | Berufsschule und Freistellung, BBiG § 14 und § 15 | eine von zwölf WiSo-Karten |
| Noelle Kranz | dieselbe Rechtsfrage bei Hochbetrieb | dieselbe Karte, anderer Sachverhalt |
| B01 Samira Yilmaz | Mietvertrag, Anmeldung | keiner |
| B02 Alex Weber | Meldebescheinigung | keiner |
| B03 Robin Keller | einfaches Führungszeugnis | keiner |
| B04 Mira Hoffmann | Auskunftssperre | keiner |

Ordnungsamt und Stadtkasse sind Vorschau. Sie fehlen auch in den PDFs.
Ein weiterer Rathaus-Fall ist nicht der nächste Unterrichtsnutzen.

## Fehlende Quellen und Unsicherheiten

- Stellenanzeige: vier von fünf Blättern fehlen.
- WBM-LF01-LS01: das zweite Blatt fehlt.
- WiSo-Bogen: sieben von elf Blättern fehlen.
- Kein Unterrichtspaket für Jahr 2 oder Jahr 3.
- Der Schulname ist auf den Bögen nicht vollständig lesbar. Sichtbar sind WBM, KTL, Astrid Teigesser und ein Schullogo.
- Handschrift auf PDF 2 Seite 1 ist an einzelnen Klauseln unleserlich.
- Zwei Steckbrief-Seiten widersprechen sich bei Mitarbeiterzahl, Vertriebsweg und Standortangabe.
- Daten auf den Notizen lauten 14.10.24, 29.09.06, 30.09.26, 02.10.26, 12.10.26, 17.10.26 und 19.10.26. Daraus wird kein Schuljahr gebaut.
- Schülertexte sind keine Musterlösungen.
- Windows, Firefox und NVDA sind für diesen Auftrag nicht gelaufen.
- `js/lf2-auskunft.js` und `js/lf3-fremd.js` sind nach dem Inventar Kopien von `lf1-fortbildung` und stehen nicht in der Navigation. Sie wurden nicht als eigene Lektionen gezählt.

## Prüfung der Analyse

Jarvis hat den Plattformbestand nur lesend inventarisiert. Die Stichproben zu BBiG, Angebot, Skonto und den Lernfeldtiteln habe ich selbst im Code nachgesehen.

GLaDOS hat die Matrix unabhängig gelesen. Seitenzahl, Rechnungen, Platzhalter und Quellentrennung waren in Ordnung. Sie hat die Begründung zu U05 gesperrt, weil „kein fachlicher Ausbau“ nicht dasselbe ist wie „nicht vorhanden“. Die Begründung nennt jetzt den fehlenden Code. Eine zweite Runde nach diesem Satz ist nicht gelaufen.

Terminus hält die Paketreihenfolge. Er hat die zu scharfe WiSo-Trennung beanstandet. Der Satz oben ist danach geändert. Schüler-Mitschriften bleiben keine Musterlösung.

## Speicherort

Analyse-Branch, nicht der Expansion-Branch.
Dateien in `docs/lehrplan-kompass/`: Methodik, Matrix, Seitenprotokoll, dieser Bericht.
