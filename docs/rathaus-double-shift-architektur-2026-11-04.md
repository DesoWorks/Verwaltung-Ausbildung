# DOUBLE SHIFT – Rathaus-Architektur in kleinen Schritten

Terminus · 04.11.2026 · Fortsetzung von `rathaus-foundation-grundgeruest-2026-11-04.md`. **Vorschlag, keine Großrefaktorierung.** Die abschließende B02-Istprüfung wird nach Implementierung ergänzt.

## Gelesener Iststand und konkrete Unterschiede

Basis `ab5f2f8`, geprüft anhand `js/rathaus-ui.js`, `rathaus-navigation.js`, `rathaus-lehrkraft.js`, `rathaus-buergerbuero-ui.js` und vorhandenen Foundation-Plänen.

- Personalamt nutzt `rathaus-kern.js`/`rathaus-hochbetrieb.js` und einen gemeinsamen Controller. Luca und Noelle haben etablierte verschiedene Schlüssel. Der Luca-Schlüssel trägt zusätzlich die aktive Personalamtwahl. Navigation und Lernzustand sind dadurch historisch gekoppelt.
- Personalamt-Fortschritt zählt sieben Arbeitsschritte einschließlich Lesen, Auswertung und Abschluss. B01 zählt sechs bearbeitete Etappen, bewertet aber fünf fachliche Bereiche. Das ist **kein identisches fachliches Schema**. Eine gemeinsame Prozentzahl dürfte diese Unterschiede nicht verdecken.
- B01 trennt reinen Fachkern und DOM-Controller, schreibt eigenen Speicher und verwirft Auswertung nach jeder Änderung. Es gibt wiederkehrende Renderer für Radios, Checkboxen, Etappen, aufklappbare Materialien, Hilfe, Ergebnis, Fokus und Speicherhinweise.
- `rathaus-navigation.js` kennt Amtsansichten und bisher B01-spezifische Bürgerbürotexte; `rathaus-ui.js` hält den Bürgerbüromodus getrennt vom Personalamtfall. Fall-ID, Ansicht und Amtszugehörigkeit sind noch kein gemeinsamer Vertrag.
- `rathaus-lehrkraft.js` leitet Personalamt-Ziele aus Entscheidung/Pflichtgrund ab; Bürgerbüro liefert eigene Kriterien. Nicht dieselbe Datenstruktur erzwingen, bevor konkrete Adapter beide nachweislich abbilden.
- Anzeige ist bereits plattformweit: `anzeige-lesen.js`, globale Styles und Rathaus-CSS. Keine zweite Anzeigeverwaltung pro Amt/Fall.

## Zielbild und Grenzen

**Gemeinsam machen:** Registrierung, sichere technische Speicheroperationen, semantische UI-Grundbausteine, Hilfe-/Quellencontainer, Statusdarstellung und Fokusdienst. **Fallbezogen lassen:** fachliche Antwortmengen, Widerspruchsregeln, Pflichtfelder, Fallakte, Quellenstand und Lehrkraftbegründungen. Keine universelle Punkte- oder Schlüsselwortmaschine.

```text
Registry → Navigation/Fallwahl → Falladapter → vorhandener Fachkern
                            ↘ lokale Speicherschnittstelle
                            ↘ gemeinsame UI-Bausteine / Fokus / Status
Global: Anzeige & Lesen (einmalig)
```

Vorläufiger Registryvertrag: `id`, `amtId`, `titel`, `startbar`, `ansicht`, `speicherKey`, `bewertungsstand`, `quellenstand`, `adapter`. Geplant ist ein eigener Status, kein fehlgeschlagener Ladeversuch. IDs `luca`, `noelle`, `b01`, `b02`, später `b03` bleiben stabil. B03 ohne Implementierung nicht startbar. Kein dynamischer Netzimport: offline ladbare klassische Skripte sind weiterhin zulässig.

Falladapter trennt drei Fragen: `normalisiere(roh)` rettet zulässige Eingaben, `bewerte(eingaben)` liefert fachliche Status, `ladeGespeichert(payload)` prüft Versions-/Fallbindung und aktuelle Auswertung. Eingabeversion und Bewertungsstand müssen zusammenpassen. Renderer erhält ausschließlich Darstellungsdaten; Lehrkraftmuster werden nicht versehentlich als Lernansicht angehängt.

## Wiederverwendungsmatrix und Abnahmerisiken

| Gegenstand | Gemeinsamer technischer Vertrag | Nicht vereinheitlichen / Nachweis |
|---|---|---|
| Registrierung/Navigation | stabile Fall-ID, Amt, verfügbar/geplant, aktiver Fall, Rückweg | Bisherige Hashziele und Personalamtwahl erhalten; Zurück/Vorwärts/Reload prüfen |
| Speicher | `lesen(key)`, `schreiben(key,payload)`, `entfernen(key)` mit sichtbaren Fehlern | Keine Schlüsselmigration im B02-Auftrag; kein `localStorage.clear`; bestehende Payloads samt Luca-Metadaten erhalten |
| Fortschritt | Liste `{id,label,bearbeitet,status}` und verständlicher Text | Bearbeitet ≠ richtig, Personalamt 7 vs Bürgerbüro 6; kein Abschluss durch Prozentkompensation |
| Hilfe | Stufen 1–3, Auf-/Zuklappen, Fokus auf gültigen Auslöser | Orientierung → fachlicher Hinweis → Arbeitsgerüst; kein unsichtbarer Lernansicht-Mustertext |
| Rückmeldung | `offen/unvollstaendig/falsch/ungueltig/richtig`, Hinweise und Sperren | Explizite fallbezogene Verbotskombinationen bleiben Fachkern; `veraltet` beschreibt Bewertung, nicht Antwort |
| Lehrkraft | Akte, Lernziel, Kriterien, typische Fehler, Muster, Quellen | Adapter pro Fallfamilie; keine lokale Ansicht als Zugriffsschutz ausgeben |
| Barrierefreiheit | Labels/Fieldsets, Fokusüberschriften, Statusregion, flexible Raster | Radios/Checkboxen nach Fachentscheidung; kein Abschneiden/Overflow-Verstecken; echte Zoomprüfung separat |
| Neue Ämter/Fälle | Registry-/Adaptereintrag und quellengeprüfte Falldefinition | Kein neues Amt ohne konkreten Auftrag, keine automatischen Bewertungsannahmen |

## Reihenfolge für einen späteren Architekturauftrag

1. **B02 fertigstellen und einfrieren.** Tests für bestehende vier Fälle, Speicherisolation und tatsächlich bedienbare Erfolge sichern. Erst dann Duplikate messen und benennen.
2. **Kleine Fallregistry einführen**, nur Übersicht/Navigation/Lehrkraft-Fallwahl daraus speisen. Noch keine fachliche Kern- oder Speicheränderung. Abnahme: alle Ziele/Zurückpfade gleich, geplante Fälle gesperrt.
3. **Ein UI-Primitiv extrahieren**, vorzugsweise Quellen-/Hilfecontainer oder Statusliste. B01/B02 zuerst; Vorher-Nachher DOM-/Tastatur-/Sichtvergleich. Keine Komplettengine.
4. **Speicher-I/O kapseln**, bestehende Keys/JSON genau erhalten. Alte/gültige/beschädigte Fixtures sowie Schreib-/Lesefehler und Reset pro Fall testen. Semantische Migration bleibt in Kernadaptern.
5. **Lehrkraftadapter vereinheitlichen**, nachdem beide Fallfamilien vollständig dargestellt sind. Fachbegründungen dürfen nicht durch leere Standardfelder ersetzt werden.
6. **Neuen Fall als Nutzentest der Architektur ergänzen**, erst nach separater Inhaltsfreigabe. B03 ist Kandidat, kein Vorwand für Großumbau. Neue Ämter später nach tatsächlichem Bedarf.

Jede Stufe kleiner eigener Commit mit Rückkehrpunkt und eigenem Prüfumfang. Kein neues Framework/Buildsystem/Serverbedarf. Vorteile sind geringere doppelte Navigations-/Speicherfehler und weniger Arbeit je Fall; Risiko ist insbesondere Fokusverlust durch Neuzeichnen und unbemerkte Änderung alter Stände. Diese Risiken überwiegen den Nutzen einer sofortigen Totalvereinheitlichung.

## Mindestvertrag für jeden neuen Fall

Vor Code: konkrete fiktive Akte; fachlich überprüfte Sollmatrix mit Quellen/Prüfdatum; alle Pflichtfelder einem Bereich zuordnen; falsche Alternativen und Widersprüche; Verhalten bei leer/ungültig/veraltet; freie Texte klar manuell; Hilfe und Lehrkraft; eigenes Reset; offline komplette Materialien. Danach Kern-/UI-/Speichertests, realer Browsererfolg und Fehlerpfad, Fallwechsel, Reflow/Themes, file://. Windows und NVDA bleiben eigenständige Umgebungsabnahmen.
