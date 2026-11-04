# FOUNDATION & EXPANSION – Bestandsaufnahme und Anzeige-Referenz

Prüfdatum: 04.11.2026. Verantwortlich: Terminus. Implementierung: Jarvis.

## Ausgangslage und Arbeitsteilung

Der Hauptcheckout `/home/starnet/projects/Verwaltung-Ausbildung` steht auf `review/bwl-werkstatt-verwaltung-2026-10-26`, HEAD `42e20ddddca4f0d7a5c417dbc0ca362ea906dfca`. Dort keine Änderungen dieses Auftrags.
Der bestehende Worktree `/home/starnet/projects/Verwaltung-Ausbildung-rathaus` steht auf `feature/operation-rathaus-mvp1`, HEAD `acc3f56a45eb53fdaef5dfe12f9ebebafa6b2fa2`. Arbeitsbaum: ausschließlich fremdes `docs/uebergaben/` untracked. Dieser Ordner bleibt unangetastet. Die relevanten bestehenden Crew-Sitzungen waren bei der Bestandsaufnahme nicht beschäftigt.

Vorhandene B01-Reparaturen: `557a3d9` trennt Unterlagen und weitere Bewertungsbereiche; `acc3f56` verbreitert den Antwortentwurf tatsächlich. Nicht doppelt implementieren. Offen: die untere Regelnfrage wertet ein leeres Mehrfachauswahl-Array als richtig. Das widerspricht einer ausdrücklichen Lernantwort. Aktueller Bewertungsstand im Kern: `b01-2026-11-01-r2`.

Jarvis schreibt Anwendung und Regressionstests. Terminus schreibt diese Foundation-Dokumente und übernimmt allein lokale Commits. GLaDOS prüft anschließend eingefrorenen, benannten Produktcommit. Keine Pushes, Merges oder Deployments. Keine Änderungen im IT-Projekt.

## Gelesene Referenz (nur lesend)

- IT: `/home/starnet/projects/IT-Ausbildung/js/anzeige-glossar.js`, erster IIFE. Der zweite IIFE verändert Lernfeld-Glossarhinweise und gehört ausdrücklich nicht zur Anzeigeübernahme.
- Verwaltung: `js/anzeige-lesen.js`, `css/styles.css`, `tests/anzeige-lesen.test.js`.
- Rathaus: `js/rathaus-ui.js`, `js/rathaus-buergerbuero.js`, `js/rathaus-buergerbuero-ui.js`, `js/rathaus-lehrkraft.js`.

## Ergebnis: wiederverwenden statt neu bauen

Verwaltung besitzt bereits eine vom IT-Modul abgespaltene, gleichwertige Komponente! Keine zweite Einstellungenverwaltung einführen.

| Funktion | IT-Referenz | Verwaltung/Iststand und Auftrag |
|---|---|---|
| Textgröße | Range 80–150 %, Schritte 10; `--text-scale` | identisch; Verwaltung begrenzt zusätzlich beim Input. Tatsächliche Wirkung auch in Formularen prüfen |
| Abstände | `spacing`, Klasse `mehr-abstand` | identisch; dynamische Rathaus-Ansichten auf erfasste Selektoren prüfen |
| Darstellung | `data-theme`: hell/dunkel/kontrast | identisch, Verwaltung mit Allowlist; hartcodierte Rathausfarben und Formflächen prüfen |
| Weniger Bewegung | `ruhig` ODER Systemvorgabe, Klasse `ruhige-ansicht` | identisch; Animationen/Übergänge/Scrollen auch in Rathaus prüfen |
| Bedienung | natives details/summary in `#nav-options`, beschrifteter Slider/Output, aria-pressed, Select, Checkbox, Reset | vorhanden; nach Navigationsaufbau auf allen HTML-Seiten testen |
| Persistenz | `it-ausbildung.anzeige.v1` | eigener Schlüssel `verwaltung-ausbildung.anzeige.v1`; kein Zugriff auf IT- oder Fall-Schlüssel |
| System | prefers-contrast und prefers-reduced-motion samt Änderungslistener | vorhanden; Systemvorgabe für Bewegung bleibt auch nach Nutzerreset aktiv |

`css/styles.css` setzt die Wurzelschrift bereits auf `calc(18px * var(--text-scale, 1))`. Der vorhandene Einbindungstest erwartet 45 Navigationsseiten. Das ist ein Prüfhinweis, kein Beleg tatsächlicher Browserwirkung. Fokus, native Tastaturbedienung und Screenreader-Ankündigungen dürfen durch Nacharbeit nicht verloren gehen.

## Prüfreihenfolge und Grenzen

1. B01: Radio mit ausdrücklicher vierter Antwort; fehlend/falsch/richtig differenzieren; Legacy-Arrays nicht zu richtigen Antworten umdeuten. Bewertungsstand ändern und alte Auswertungen/Abschlüsse verwerfen, sinnvolle Eingaben erhalten.
2. Bestehende globale Anzeige nutzen; fehlende Wirkungen eng korrigieren und alle HTML-Einbindungen prüfen.
3. Node-Regressionsprüfungen; dann reale Browserpfade einschließlich Persistenz und direkter Dateiöffnung. Größere Schrift/Abstände auf schmalem und breitem Bildschirm visuell kontrollieren.
4. Windows und NVDA separat durch Menschen prüfen; Linux-Chrome ist kein Ersatzbeleg.

Keine Änderung fachlicher Regeln zur Vereinfachung von Tests, keine großflächige Rathaus-Refaktorierung und kein B02-Anwendungscode.
