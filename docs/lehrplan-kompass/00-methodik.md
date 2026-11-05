# Methodik Lehrplan-Kompass

Wiederverwendbar für Verwaltung-Ausbildung und später IT-Ausbildung.
Jedes Projekt behält eigene Quellen, eigene Zeilen und eigene Prozentwerte.
Diese Datei enthält keine IT-Daten.

## Was eine Zeile ist

Eine Zeile ist eine Unterrichtseinheit, nicht eine Seite und nicht ein Navigationstitel.

Eine Einheit ist ein zusammenhängender Arbeitsauftrag oder ein klar überschriebenes Thema
aus einer Quelle. Fortsetzungsseiten derselben Aufgabe werden eine Zeile.
Eine Beilage, die nur den Gesetzestext zu einer schon gezählten Aufgabe zeigt,
wird nicht noch einmal gezählt. Eine Schüler-Mitschrift zu derselben Aufgabe
wird eine eigene Zeile in der Zählmenge `pdf-mitschrift`, nicht in der Hauptzahl.

## Quellenklassen, nie mischen

| Klasse | Bedeutung |
|---|---|
| `pdf-druck` | Gedrucktes Arbeitsblatt, Schulvorlage oder Lehrbuchseite aus den bereitgestellten PDFs |
| `pdf-mitschrift` | Handschrift. Keine Musterlösung, auch wenn sie Paragraphen nennt |
| `pdf-beilage` | Gesetzestext oder Dublette zu einer schon gezählten Einheit |
| `kmk` | Offizieller Rahmenlehrplan, nur wenn die Datei selbst gelesen wurde |
| `praxis` | Rathaus oder anderes Übungsamt. Keine Unterrichtseinheit |

Fehlt eine Quelle, bleibt das Feld leer. Es wird nicht aus Allgemeinwissen gefüllt.

## Abdeckung

Gezählt wird nur benutzbarer Inhalt, nicht der Titel in der Navigation.

| Stufe | Bedeutung |
|---|---|
| Vollständig | Erklärung, passende Übung, Rückmeldung und Lernkontrolle treffen die Einheit, nicht nur das Themenfeld |
| Teilweise | Eine verwandte Erklärung oder ein Werkzeug existiert. Die Aufgabe aus der Quelle fehlt oder ist deutlich flacher |
| Nur erwähnt | Begriff im Glossar, in einer Karte oder in der Navigation, ohne benutzbare Erklärung der Einheit |
| Fehlt | Kein passender benutzbarer Inhalt |
| Nicht bewertet | Quelle unvollständig oder nicht gelesen |

Platzhalter mit `kommt-bald` sind Fehlt, nicht Teilweise.

## Prozent

Prozent nur als `Zähler / Nenner = Prozent`, mit genannter Zählmenge.
Keine Aussage über „die Ausbildung“, wenn die Quellen nur einen Ausschnitt enthalten.

## Prüfung

Eine zweite Person prüft Stichproben: Seitenvollständigkeit, Fundstelle, Stufe, Rechenweg.
Windows, Firefox und NVDA werden nur genannt, wenn sie gelaufen sind.
