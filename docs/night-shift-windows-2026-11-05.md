# NIGHT SHIFT – Windows-Testanleitung

## Herunterladen und starten
Maßgebliche Quelle: https://github.com/DesoWorks/Verwaltung-Ausbildung/tree/feature/verwaltung-night-shift-2026-11-04

1. Auf genau diesem Branch **Code → Download ZIP** wählen. Nicht `main` oder `dev` herunterladen.
2. ZIP vollständig in einen eigenen Ordner entpacken. Nicht innerhalb des ZIP starten.
3. `index.html` mit Edge oder Chrome öffnen. Keine Installation, kein Server, kein Docker erforderlich.
4. Praxiswelten → Virtuelles Rathaus → Bürgerbüro. JavaScript und lokaler Browserspeicher müssen erlaubt sein.

Hinweis: Ein neuer Downloadpfad, ein anderer Browser oder ein anderes Profil kann einen eigenen lokalen Speicherbereich haben. Bestehende Speicherstände werden nicht zwischen Computern synchronisiert. Vorhandenen Arbeitsordner nicht mit einem ZIP überschreiben; alte Fassung behalten.

## Startseite und Anzeige
- Sämtliche Ausbildungsjahre/Lernfelder stehen vor **Tools & Nachschlagen**, einschließlich aller vier Tools-Karten. Ausbildungsjahre bei Bedarf aufklappen.
- Tools alphabetisch: Kaufmännischer Rechner, Kleine Tabelle, Nutzwerttabelle, Textbausteine und Formular.
- Rathaus einmal unter Praxiswelten; keine zusätzliche Rathaus-Unterrichtslektion.
- Anzeige & Lesen: Text 150 %, größere Abstände, Hell/Dunkel/Kontrast und weniger Bewegung ausprobieren. Zu Rathaus/B03 wechseln, neu laden; Einstellungen müssen erhalten bleiben.
- Fensterbreiten etwa 320/360/400 px und Browserzoom 200/400 % prüfen. Auch offene Hilfen, Lehrkraftbereich und Navigation kontrollieren: keine abgeschnittenen Bedienelemente, kein horizontaler Seitenüberlauf.
- Mit Tab/Shift+Tab navigieren; Radio mit Pfeilen/Leertaste bedienen, Details mit Enter/Leertaste öffnen. Fokus muss sichtbar und sinnvoll weitergeführt sein. Escape schließt das fokussierte Rathausmenü.

## B03 vollständig richtig
Nur fiktive Person Robin Keller. Keine echten personenbezogenen Daten eingeben.

1. Anliegen: Eigenantrag für privaten Arbeitgeber.
2. Alle vier Datenzeilen: liegt vor und stimmt; Identität nachgewiesen.
3. Einfaches Privatführungszeugnis; Papier an Robin; persönlicher Antrag am vorgegebenen Meldebehördenschalter.
4. Regeln: Identität prüfen, § 30 BZRG, BfJ erteilt, digitale Alternative nach §§ 30c/30d. Keine der beiden falschen Zusatzregeln.
5. 13 Euro Normalfall; Befreiung nicht beantragt/belegt; Antrag vorbereiten, nicht als ausgestellt melden.
6. Antwort: erste sechs Bausteine auswählen. Digitaler Alternativhinweis ist zusätzlich zulässig, aber nicht Pflicht. Keine falschen Zusagen.
7. Auswertung prüfen → alle fünf Bereiche richtig → Übungsfall abschließen.
8. Es wird kein echter Antrag gestellt, keine Zahlung ausgelöst und kein Führungszeugnis erzeugt.

## Fehler, Speicherung und Reset
- Leer prüfen: „Noch offen“, Abschluss gesperrt.
- Erweitert ohne Grundlage, Arbeitgeberdirektversand oder Sofortgarantie wählen: Abschluss gesperrt. Richtige Zusatzantworten dürfen das nicht ausgleichen.
- Nach Erfolg Freitext ändern: Auswertung/Abschluss entwertet; neu prüfen erforderlich. Freitext bleibt ungeprüft, auch wenn er plausibel klingt.
- B03-Entwurf schreiben → B02 → zurück B03 → neu laden → Entwurf erhalten.
- B03 zurücksetzen: nur B03 leer. B01/B02, Luca/Noelle und Anzeige unverändert.
- Beschädigter/veralteter Speicher: Warnhinweis und kein übernommener Abschluss.

## Bisherige Fälle
B01: vierte Regelnoption „Keine dieser Aussagen trifft zu.“ ausdrücklich wählen; leer/falsch sperrt, Freitextänderung entwertet.
B02: eigener Anliegen-/Unterlagen-/Regel-/Antwortpfad weiterhin abschließbar. Schriftliche Gebühren weiterhin nur örtlich prüfen, keinen Betrag erfinden.
Personalamt: Luca und Noelle getrennt öffnen, bearbeiten und speichern; Fallwechsel darf keine Ergebnisse verlieren.

## NVDA (noch auszuführen)
Mit NVDA unter Windows Überschriften, Landmarken, Gruppen/Legenden, Beschriftungen, aktuelle Brotkrumen, Fehlermeldungen und Fokus nach Ansichtwechsel/Auswertung/Reset prüfen. Lehrkraftmusterlösung darf in der Lernansicht nicht vorgelesen werden. Ergebnis mit Windows-/Browser-/NVDA-Version und konkretem Schritt dokumentieren.

## Bekannte Grenzen
Die nachgewiesenen Browserprüfungen erfolgten unter Linux-Chrome direkt per `file://`, nicht unter Windows/NVDA. Lehrkraftmodus ist nur eine lokale Umschaltung, keine Zugriffssicherung. B03 bewertet strukturierte Antworten, keinen freien Text und keine Registerinhalte. Rechts-/Verfahrenssonderfälle sind ausgeschnitten, siehe Quellenkarte. Kein Deployment und keine Produktionsfreigabe.
