# Virtuelles Rathaus – lokale Testfassung MVP 1

Stand: 01.11.2026. Worktree: `/home/starnet/projects/Verwaltung-Ausbildung-rathaus`. Branch: `feature/operation-rathaus-mvp1`, Basis `dev` bei `921de9c`.

Nicht veröffentlicht. Kein Push, kein Pull Request, kein Merge.

## Start

Im Worktree:

```sh
./start-rathaus.sh
```

Dann im Browser öffnen: `http://127.0.0.1:8117/module/rathaus.html`

Die bestehende Plattform startet weiter mit `./start.sh` auf Port `8107`. Diesen Port lässt die Rathaus-Fassung unangetastet. Wenn `8117` schon belegt ist, den Prozess nicht aus einem anderen Projekt beenden, sondern den Konflikt melden.

Themenübersicht der Plattform: `http://127.0.0.1:8117/index.html`. Der Eintrag steht in Lernfeld 1 als „Virtuelles Rathaus: Berufsschule oder Dienststelle“.

## Was der Test kann

- Stadtübersicht der fiktiven Stadtverwaltung Sonnenthal
- Personalamt benutzbar
- Bürgerbüro, Ordnungsamt und Stadtkasse nur als Vorschau
- Posteingang, Ausbildungsakte, Fortschritt in sieben Schritten
- Ein vollständiger Übungsvorgang: Berufsschule oder Dienststelle
- Mehrere Versuche, keine dauerhafte Blockade
- Lehrkraftansicht nur lokal, ohne Rollenprüfung, mit Banner und Zurücksetzen des Rathaus-Zustands

Der Zustand liegt nur in `localStorage` unter `verwaltung-ausbildung.rathaus.v1`. Es gibt keine Schülerdatenbank und keinen Cloud-Dienst.

## Fachliche Grenze

Die Unterrichts-PDFs lagen nicht vor und wurden nicht erfunden. Ablageort, sobald sie da sind:

`quellen/unterricht/` im Worktree, absolut `/home/starnet/projects/Verwaltung-Ausbildung-rathaus/quellen/unterricht/`

Fehlend:

- `LS03-Ausbildungsvertrag.pdf`
- `LS04-Rechte-und-Pflichten.pdf`
- `LS06-Jugendarbeitsschutz.pdf`

Die Übungslösung im Lehrkraftmodus ist vorläufig und nicht verbindlich.

Benutzt wurden die vorhandene Lektion `module/lf1-rechte.html`, der KMK-Rahmenlehrplan vom 20.03.2025, Lernfeld 1 Seite 9, sowie die nichtamtlichen Fassungen von BBiG § 14, BBiG § 15 und JArbSchG § 9 auf gesetze-im-internet.de, abgerufen am 01.11.2026.

Das ist Übungsmaterial, keine Rechtsberatung. Länderregeln zur Berufsschulpflicht können abweichen. Personalmangel ist in diesen Normen kein Ausnahmegrund.

## Prüfung

```sh
node --test tests/rathaus-kern.test.js
```

`js/fortschritt.js` und `js/navigation.js` sind absichtlich unverändert. Der Rathaus-Fortschritt erscheint in der Rathaus-Seite, nicht als Haken in der allgemeinen Lernfeldübersicht.
