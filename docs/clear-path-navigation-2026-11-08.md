# CLEAR PATH – Navigationskonzept und Quellenprüfung

Stand: 08.11.2026. Rick, nach zwei Terminus-Läufen ohne Datei (Werkzeuglimit, `59202b9d`, `3ae70403`). Terminus hat im zweiten Lauf `zeichnePersonal` und `zeichneNavigation` gelesen und die unten festgelegte Navigation bestätigt. Die Normseiten hat Rick selbst gelesen, nichtamtliche Fassung auf gesetze-im-internet.de, Prüfdatum 08.11.2026. Das ist keine Fachfreigabe.

## Navigation, festgelegt

Personalamt zeigt gleichzeitig das Ämter-Menü, das Vorgangs-Menü, den Breadcrumb und in `zeichnePersonal` noch einmal Vorgangsknöpfe. Das ist die Doppelung.

- Ämter-Menü `#rathaus-bereiche` bleibt die einzige Ämternavigation.
- Vorgangsauswahl nur einmal: Aufklappmenü `#rathaus-unterleiste` bleibt.
- Die Knöpfe „Vorgang 1“ und „Vorgang 2“ in `zeichnePersonal` (`js/rathaus-ui.js`) entfallen.
- Posteingang, Ausbildungsakte und Nachschlagekarte bleiben Arbeitsflächen, keine zweite Vorgangswahl.
- Breadcrumb mit genau einem Zurück bleibt.
- Schrittnavigation im Vorgang und Sprünge aus der Auswertung bleiben.
- Gespeicherte Antworten und Fortschritte bleiben unverändert.

## Bürgerbüro-Auswertung

`fuelleAuswertung` in `js/rathaus-buergerbuero-ui.js` zeigt Name, Symbol und Statuswort. Schrittnummer und die Aktion „Schritt öffnen“ fehlen dort. Die Auswertungszeile soll beides bekommen, den Status weiter aus den echten Bewertungsdaten.

Die Überschrift „Noch nicht richtig oder offen“ steht in `js/rathaus-aufgabenfluss.js` Zeile 325. `istOffenStand` markiert alles außer `richtig`, `noch nicht geprüft`, `abgeschlossen` und `Auswertung`. Unter der Überschrift landen damit auch „Bewertung veraltet“ und „Noch nicht vollständig“. Der Satz ist damit weiter als sein Inhalt.

Neue Überschrift: „Offene oder zu prüfende Schritte“. Knopftext bleibt „Zu Schritt N“. Den Test in `tests/rathaus-buergerbuero-ui.test.js` Zeile 454 mitziehen.

## Lehrkraftbereich

`module/rathaus.html` Zeilen 33–41: dauerhaft offenes `aside`. Wird ein `details`, standardmäßig geschlossen. Schalter, Hinweis „Nur lokaler Test. Keine echte Rollenprüfung.“ und die Funktion bleiben. Keine neue Zugriffskontrolle.

## Neu-Markierung

Nur `lf1-dual`, `lf1-vertrag`, `lf1-beendigung` in `js/module-daten.js`. Sichtbar in `js/startseite.js` als Text „Neu“, nicht nur als Farbe, unabhängig vom Abschlusszeichen. Ältere Lektionen nicht markieren. Kein Einfluss auf den Abschluss.

## P0, Bewertung

- `js/lf1-vertrag.js`: der change-Handler leert nur `vertrag-ergebnis`. Eine geänderte Kontrollantwort lässt „Bestanden.“ in `kontrolle-ergebnis` stehen. Nur dieses Feld auf „Antwort geändert – bitte erneut auswerten.“ setzen.
- `js/lf1-dual.js`: `zusammenfassung()` läuft nur beim Auswerten. Nach einer Antwortänderung die sichtbare Zusammenfassung neu berechnen oder als veraltet kennzeichnen. `render()` kennt den Stand schon.

## P1, Quellen, nichtamtlich

§ 14 Absatz 3 BBiG, gelesen 08.11.2026: Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sein. D4 darf in den Lerntext von `module/lf1-dual.html`. Satz: „Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sein.“

§ 14 Absatz 1 Nummer 3 BBiG: Ausbildungsmittel, insbesondere Fachliteratur, kostenlos. D5, Fachbuch-Zeile in `module/lf1-vertrag.html`: ändern zu „Für eine betriebliche Ausbildungsaufgabe wird ein Fachbuch benötigt. Nela soll die Kosten dafür selbst tragen.“

§ 14 Absatz 2 BBiG: Nachweis regelmäßig durchsehen; Gelegenheit, ihn am Arbeitsplatz zu führen. „Am Arbeitsplatz durchzusehen“ ist nicht die gelesene Pflicht. Ändern zu „Der Betrieb sagt zu, den Ausbildungsnachweis regelmäßig durchzusehen.“

§ 13 BBiG nennt die Pflicht der Auszubildenden, den Nachweis zu führen, nicht die Durchsicht. Keine Kammer-, Tarif- oder Landesregel verwendet.

## Reihenfolge für Jarvis

1. `js/rathaus-ui.js`: Vorgangsknöpfe in `zeichnePersonal` entfernen.
2. `js/rathaus-buergerbuero-ui.js`: Auswertungszeile mit Schrittnummer und „Schritt öffnen“.
3. `js/rathaus-aufgabenfluss.js` und der genannte Test: Überschrift.
4. `module/rathaus.html`, `css/rathaus.css`: Lehrkraftbereich einklappbar, Abstand der Nachschlagekarte.
5. `js/module-daten.js`, `js/startseite.js`, Stylesheet der Übersicht: Neu-Markierung.
6. `js/lf1-vertrag.js`, `js/lf1-dual.js`: P0, plus Regressionstests.
7. `module/lf1-dual.html`, `module/lf1-vertrag.html`: die drei Sätze oben, sonst kein Lerntext.
