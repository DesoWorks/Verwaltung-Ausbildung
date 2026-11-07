# Rückmeldelichter im Rathaus (2026-11-07)

Stand: lokale Arbeit auf `feature/verwaltung-rathaus-refit-a-2026-11-06`, Basis `f96f927`. Nicht gepusht.

## Was die Lichter tun

Nach einer ausdrücklich durchgeführten Auswertung ("Auswertung prüfen") wird jeder bewertbare Frageblock markiert:

- Vollständig richtiger Block: grüner, durchgezogener Rahmen, Hinweis "✓ Frageblock richtig".
- Fehlerhafter Block: roter, doppelter Rahmen, Hinweis "✕ Frageblock nicht richtig".
- Richtig ausgewählt: grün hinterlegt, ✓ und "Richtig ausgewählt".
- Falsch ausgewählt: rot hinterlegt, ✕ und "Falsch ausgewählt".
- Richtig, aber nicht ausgewählt: grün, gestrichelter Balken, ✓ und "Relevante Antwort fehlt".
- Nicht ausgewählte falsche Antworten bleiben neutral.
- Einfachauswahl: falsche Wahl rot, richtige Antwort als "Relevante Antwort fehlt".

Farbe wird nie allein verwendet: immer Symbol, Text und ein zweiter Rahmenstil (durchgezogen, gestrichelt, doppelt).

## Gemeinsame Implementierung

- `js/rathaus-lichter.js` (`RATHAUS_LICHTER`): `klassifiziere`, `zeigeFeld`, `markiere`, `filtereStand`, `ausKatalog`.
- Bewertungsdaten stammen nur aus den Flags der fachlich geprüften Kataloge: `richtig`, `pflicht`/`falle`, `erforderlich`/`verboten`, `erwartet` (Statuszeilen). Es wird nichts aus Text oder Optionsposition geraten. Fehlen Flags, bleibt der Block ohne Markierung.
- Optionale Antworten (`optional`) gelten weder als fehlend noch als falsch.

## Stand und Veraltung

- Beim Auswerten wird `lichtStand` gespeichert: Feldschlüssel auf normalisierten Antwortwert (keine Lösung, keine Klassifikation).
- Vor der Auswertung gibt es keinen Stand, also keine Lichter, keine Texte und keine `data-richtig`-Attribute.
- Passt die aktuelle Antwort nicht mehr zum Snapshot, zeigt nur dieser Block "Bewertung veraltet" (gestrichelter Rahmen, keine Grün-/Rot-Markierung). Unveränderte Blöcke bleiben markiert.
- Beim Laden behält `bereinigeGespeichert` nur Einträge, deren Fingerprint zur gespeicherten Antwort passt. Nicht passende werden verworfen, nicht neu berechnet.
- Eine abweichende Gesamtauswertung (B03/B04) verwirft nur Auswertung und Abschluss, nicht die Eingaben und gültigen Lichter.
- Zurücksetzen löscht `lichtStand` mit.
- Der Abschluss bleibt wie bisher gesperrt, bis erneut ausgewertet wurde.

## Unterstützte Frageblöcke (aus den echten Katalogen geprüft)

- B01 (11): anliegen, einzug, weitereWohnung, fallen, vorbereitung, regeln, bausteine, vier Dokumentzeilen (`dokumente.*`).
- B02 (11): anliegen, vier Angabenzeilen (`angaben.*`), identitaet, umfang, regeln, aussagen, vorbereitung, bausteine.
- B03 (14): anliegen, vier Datenzeilen, identitaet, art, empfaenger, weg, regeln, gebuehr, befreiung, vorbereitung, bausteine.
- B04 (15): anliegen, vier Datenzeilen, identitaet, tatsachen, grundlage, gebuehr, dauer, wirkung, entscheidung, naechster, dritte, bausteine.
- Luca und Noelle: Entscheidung (Einfachauswahl) und Gründe (Mehrfachauswahl, nur Pflichtgründe fehlen, Fallen sind falsch).

## Nicht markiert

- Freitext und der Antwortbrief von Luca/Noelle (nicht satzweise bewertbar).
- Antwortentwurf in B03/B04 (Freitext).

## Einschränkungen

- Ändert man eine Antwort, wird die gespeicherte Gesamtauswertung für den Abschluss gelöscht. Unveränderte Frageblöcke behalten ihre Lichter. Der betroffene Block zeigt nur „Bewertung veraltet“. Schrittchips unveränderter Schritte bleiben über `lichtStand` stehen. Die Textrückmeldung eines veralteten Schritts wird nicht weiter angezeigt.
- Ein abweichender Bewertungsstand bei Luca und Noelle verwirft Auswertung, Abschluss und Lichter. Es werden keine Markierungen aus einem ungültigen Stand übernommen.
- Im Wächtertest `rathaus-nachschlagen.test.js` sind jetzt additive Licht-Bausteine in `rathaus-kern.js` und `rathaus-hochbetrieb.js` ausgenommen; die Fachbewertung bleibt zeichengleich geschützt.
- Die UI wurde nicht in einem Browser geprüft (siehe Windows-Anleitung). Unit- und Katalogtests laufen über Node.

## Tests

- `tests/rathaus-lichter.test.js` (16): Klassifikation, Veraltung, Reload-Filter, Reset, Freitext, Luca-Gründe, Bausteine, Statuszeilen.
- `tests/rathaus-lichter-faelle.test.js` (19): echte Kataloge B01–B04, Luca, Noelle, Reload, Versionsabweichung.
