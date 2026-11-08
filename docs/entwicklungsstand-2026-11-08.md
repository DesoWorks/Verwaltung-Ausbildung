# Entwicklungsfassung

**Entwicklungsfassung – automatisierte Tests bestanden, vollständige Browser- und Windows-Abnahme ausstehend.**

Stand: 08.11.2026. Dieser Branch ist der laufende Entwicklungsstand der Verwaltung-Ausbildung. Keine Produktionsfreigabe, kein Release, kein Deployment.

## Dieser Commit

- Branch: `pre-dev/verwaltung-aktuell`
- Grundlage: `001c1ef0666ac02424e965a91a3097ddc355faf5` auf `feature/verwaltung-rathaus-refit-a-2026-11-06`
- Öffentliche Pre-Dev-Basis: `b2f89f06a4b00d3d30a9ec63ca3b7d8c0612c28e` auf `pre-dev/verwaltung-2026-11-05`
- Der LF1-Nachtlauf `7c87174` ist nicht enthalten.

## Was enthalten ist

Rathaus-Navigation, sichtbare Rechtsgrundlagen vor den bewerteten Fragen und die farbigen Frageblock-Rückmeldungen aus den vorhandenen Flags. Der Bauplan für LF1-A liegt unter `docs/lf1-a-bauplan-2026-11-08.md`. Das ist ein Plan, keine fertige Lektion.

## Tests

Am 08.11.2026 im Worktree ausgeführt:

`node --test tests/*.test.js`

Ergebnis: 445 bestanden, 0 fehlgeschlagen, 0 übersprungen.

## Nicht geprüft

- Vollständige Browserabnahme der Frageblock-Lichter. Mehrere Versuche sind an Testserver, Browserwerkzeug, Scrollen und Interaktion gescheitert. Das ist kein festgestellter Fachfehler der Anwendung.
- Windows, Firefox und NVDA sind nicht getestet.
- `file://` ist nicht als vollständiger Durchklick geprüft.

## Tastaturauslösung, Codeprüfung ohne neuen Browserlauf

Der Knopf „Auswertung prüfen“ ist in `js/rathaus-buergerbuero-ui.js` und `js/rathaus-b03-ui.js` ein natives `button` mit `type="button"`. Ein fokussierter nativer Knopf reagiert auf Eingabe und Leertaste ohne eigene Tastenbehandlung. Die frühere fehlgeschlagene Auslösung im Browserwerkzeug ist damit kein belegter Anwendungsfehler. Ob der Fokus den Knopf im echten Browser erreicht, bleibt unbewiesen und ist nicht erneut als bestanden gemeldet.

## Windows-Download

Diesen Branch von GitHub laden, nicht `main` und nicht `dev`.

https://github.com/DesoWorks/Verwaltung-Ausbildung/tree/pre-dev/verwaltung-aktuell

Nach dem Klon die Datei `index.html` lokal öffnen. Das ist eine Entwicklungsfassung. Die Schritte in `docs/rathaus-feedback-lights-windows-2026-11-07.md` sind eine Anleitung, kein bestandener Test.
