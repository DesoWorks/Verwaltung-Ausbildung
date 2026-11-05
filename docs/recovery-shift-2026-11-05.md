# OPERATION RECOVERY SHIFT – Prüfnachweis

Stand: 05.11.2026. Rick hat den vorhandenen Night-Shift-Stand geprüft, nicht neu gebaut.

## Geprüfter Stand
- Repository: https://github.com/DesoWorks/Verwaltung-Ausbildung
- Branch: `feature/verwaltung-night-shift-2026-11-04`
- HEAD vor diesem Nachweis: `b8be500d7784b729d3fdb617143850d045f85cdf`
- Ausgangspunkt: `a4aa436acf2fa17ba230ff47753a883c931d5c54`
- Kein Merge nach `dev` oder `main`. Kein Deployment.

## Bestätigt
Produktcommits `e8368bc`, `1bc0385` und `9ca4691` lagen bereits vor.

- Startseite: Praxiswelten, danach alle Ausbildungsjahre, danach der vollständige Bereich „Tools & Nachschlagen“.
- Tools alphabetisch: Kaufmännischer Rechner, Kleine Tabelle, Nutzwerttabelle, Textbausteine und Formular.
- B03 ist lokal spielbar. Luca, Noelle, B01 und B02 wurden nicht neu geschrieben.

## Prüfungen
- Rick: `node --test tests/*.test.js` – 299 bestanden, 0 fehlgeschlagen.
- Rick: `node tests/browser-night-shift-cdp.js` – 19/19, Exit 0, Linux-Chrome, `file://`.
- Terminus, nur lesend: Fachfreigabe ohne Sperrgrund.
- GLaDOS, unabhängig: Night-Shift-Browserprüfung Exit 0, B02-Browserprüfung Exit 0, keine kritischen Mängel.

## Offen
Windows und NVDA sind nicht geprüft. Schritte: [night-shift-windows-2026-11-05.md](night-shift-windows-2026-11-05.md).

Nächster Schritt ist die Windows-Abnahme dieses Stands, nicht ein neuer Fall.
