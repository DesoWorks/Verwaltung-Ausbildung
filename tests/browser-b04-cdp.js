"use strict";

// Echte Browserprüfung für Fall B04 über file:// (Linux-Chrome, CDP). Kein node:test-Test, kein Netzwerk.
// Aufruf: node tests/browser-b04-cdp.js
// Positiv: richtiger Durchlauf bis zum Abschluss, Speicher, Reload, Lehrkraft, Reset nur B04.
// Negativ: falsche Gebühr und verratene Sperre verhindern den Abschluss; B01 bis B03 bleiben startbar und lesbar.

const { starteBrowser, pruefer } = require("./browser-cdp-helfer.js");

const SOLL = [
  ["b4-anliegen", "anl-eigene-sperre"],
  ["b4-daten-name", "vorhanden-stimmt"],
  ["b4-daten-geburt", "vorhanden-stimmt"],
  ["b4-daten-anschrift", "vorhanden-stimmt"],
  ["b4-daten-notiz", "vorhanden-stimmt"],
  ["b4-identitaet", "id-nachgewiesen"],
  ["b4-tatsachen", "tat-ja"],
  ["b4-grundlage", "gr-bmg51-1"],
  ["b4-gebuehr", "geb-unentgeltlich"],
  ["b4-dauer", "dauer-zwei-jahre"],
  ["b4-wirkung", "wirk-einfache-auskunft"],
  ["b4-entscheidung", "ent-sperre-vorbereiten"],
  ["b4-naechster", "nae-vorbereiten"],
  ["b4-dritte", "dri-neutral"],
  ["b4-bausteine", "bau-sperre"],
  ["b4-bausteine", "bau-unentgeltlich"],
  ["b4-bausteine", "bau-zwei-jahre"],
  ["b4-bausteine", "bau-neutral"],
  ["b4-bausteine", "bau-grenze"],
  ["b4-bausteine", "bau-uebung"]
];

const HELFER = `
window.__klick = (name, wert) => { const i = document.querySelector('input[name="' + name + '"][value="' + wert + '"]'); if (!i) return false; i.click(); return true; };
window.__knopf = (text) => { const k = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text); if (!k || k.disabled) return false; k.click(); return true; };
window.__hat = (text) => document.getElementById('hauptinhalt').innerText.toLowerCase().includes(text.toLowerCase());
`;

(async () => {
  const { check } = pruefer("B04-Browser");
  const b = await starteBrowser({ breite: 1280, hoehe: 900 });
  const zumAmt = async () => {
    await b.ev("[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()");
    await b.warte(250);
    await b.ev(HELFER);
  };
  const pruefe = async () => {
    await b.ev("__knopf('Auswertung prüfen')");
    await b.warte(300);
  };
  try {
    await b.oeffne("module/rathaus.html#buerger");
    await b.ev("localStorage.clear()");
    await b.neuLaden();
    await zumAmt();

    check("Übersicht: B04 ist startbar, kein Fall ist gesperrt",
      await b.ev("__hat('Auskunftssperre im Melderegister') && Array.from(document.querySelectorAll('button')).filter((k)=>k.textContent==='geplant, noch nicht startbar').length") === 0);
    check("Übersicht: B04 noch nicht begonnen", await b.ev("__hat('Fall B04') && Array.from(document.querySelectorAll('article')).find((a) => a.innerText.includes('Fall B04')).innerText.toLowerCase().includes('noch nicht begonnen')"));
    check("Fall B04 öffnen", await b.ev("__knopf('Fall B04 öffnen')"));
    await b.warte(250);
    await b.ev(HELFER);
    check("Fallansicht B04 sichtbar", await b.ev("__hat('Mira Hoffmann') && __hat('6. Auswertung') && __hat('Fall B04')"));
    check("Lernansicht ohne Musterlösung", !(await b.ev("__hat('Musterlösung')")));

    // Negativ 1: leer
    check("Auswertung prüfen (leer)", await b.ev("__knopf('Auswertung prüfen')"));
    await b.warte(300);
    check("Leer: Abschluss gesperrt, Bereiche offen", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === true && __hat('Noch offen')"));

    // Negativ 2: falsche Gebühr bei sonst richtigem Pfad
    for (const [n, w] of SOLL) check("Auswahl " + n + "=" + w, await b.ev("__klick(" + JSON.stringify(n) + "," + JSON.stringify(w) + ")"));
    check("Falsche Gebühr wählen", await b.ev("__klick('b4-gebuehr','geb-pauschale')"));
    await pruefe();
    check("Falsche Gebühr: Abschluss gesperrt, 'Noch nicht richtig'", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === true && __hat('Noch nicht richtig')"));
    check("Gebühr korrigieren", await b.ev("__klick('b4-gebuehr','geb-unentgeltlich')"));

    // Negativ 3: verratene Sperre an die dritte Person
    check("Sperre an Dritte verraten wählen", await b.ev("__klick('b4-dritte','dri-sperre')"));
    await pruefe();
    check("Verratene Sperre: Abschluss gesperrt", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === true && __hat('Noch nicht richtig')"));
    check("Dritte neutral korrigieren", await b.ev("__klick('b4-dritte','dri-neutral')"));

    // Negativ 4: falscher Zusatzbaustein
    check("Falschen Baustein 'bereits eingetragen' wählen", await b.ev("__klick('b4-bausteine','bau-bereits')"));
    await pruefe();
    check("Falscher Baustein: Abschluss gesperrt", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === true"));
    check("Falschen Baustein abwählen", await b.ev("__klick('b4-bausteine','bau-bereits')"));

    check("Nach Änderung: Abschluss gesperrt bis erneut geprüft", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === true"));
    await pruefe();
    check("Soll: Abschluss freigegeben", await b.ev("document.getElementById('b4-abschluss-knopf').disabled === false"));
    check("Abschließen", await b.ev("__knopf('Übungsfall abschließen')"));
    await b.warte(300);
    check("Abgeschlossen-Text ohne echte Eintragung", await b.ev("__hat('Keine echte Eintragung im Melderegister')"));

    // Speicher
    const keys = await b.ev("Object.keys(localStorage).sort().join(',')");
    check("Eigener B04-Schlüssel, B01 bis B03 nicht angelegt",
      keys.includes("buergerbuero.b04.v1") && !/buergerbuero\.(b02|b03)\.v1/.test(keys) && !/buergerbuero\.v1(,|$)/.test(keys), keys);
    await b.neuLaden();
    await zumAmt();
    check("Nach Neuladen: B04 abgeschlossen in der Übersicht", await b.ev("Array.from(document.querySelectorAll('article')).find((a) => a.innerText.includes('Fall B04')).innerText.toLowerCase().includes('übungsfall abgeschlossen')"));
    check("Nach Neuladen: B01 bis B03 weiter startbar und nicht als abgeschlossen angezeigt",
      await b.ev("['Fall B01 öffnen','Fall B02 öffnen','Fall B03 öffnen','Fall B04 öffnen'].every((t) => Array.from(document.querySelectorAll('button')).some((k) => k.textContent === t && !k.disabled))")
      && await b.ev("Array.from(document.querySelectorAll('article')).filter((a) => !a.innerText.includes('Fall B04')).every((a) => !a.innerText.toLowerCase().includes('übungsfall abgeschlossen'))"));

    // Manipulation: Abschluss mit erfundenem Baustein wird nicht übernommen
    await b.ev(`(() => { const k = Object.keys(localStorage).find((x) => x.includes('b04')); const s = JSON.parse(localStorage.getItem(k)); s.eingaben.bausteine.push('erfunden'); localStorage.setItem(k, JSON.stringify(s)); })()`);
    await b.neuLaden();
    await zumAmt();
    check("Manipulierter Abschluss wird nicht übernommen", !(await b.ev("Array.from(document.querySelectorAll('article')).find((a) => a.innerText.includes('Fall B04')).innerText.toLowerCase().includes('übungsfall abgeschlossen')")));

    // Fremde Speicher als Sentinel: Reset darf sie nicht berühren
    await b.ev("localStorage.setItem('verwaltung-ausbildung.rathaus.buergerbuero.b03.v1', 'sentinel-b03'); localStorage.setItem('verwaltung-ausbildung.rathaus.buergerbuero.b02.v1', 'sentinel-b02')");
    check("Fall B04 erneut öffnen", await b.ev("__knopf('Fall B04 öffnen')"));
    await b.warte(250);
    await b.ev(HELFER);
    await b.ev("window.confirm = () => true");
    check("Reset B04", await b.ev("__knopf('Fall B04 zurücksetzen')"));
    await b.warte(300);
    check("Nach Reset kein B04-Schlüssel, B02 und B03 unberührt",
      await b.ev("!Object.keys(localStorage).some((x) => x.includes('b04')) && localStorage.getItem('verwaltung-ausbildung.rathaus.buergerbuero.b03.v1') === 'sentinel-b03' && localStorage.getItem('verwaltung-ausbildung.rathaus.buergerbuero.b02.v1') === 'sentinel-b02'"));

    // Lehrkraft
    await b.ev("document.getElementById('lehrkraft-schalter').click()");
    await b.warte(300);
    check("Lehrkraft: B04 anfangs nicht offen", await b.ev("!!document.getElementById('lehrkraft-fall') && !document.body.innerText.includes('Bürgerbüro B04')"));
    await b.ev("(() => { const s = document.getElementById('lehrkraft-fall'); s.value = 'b04'; s.dispatchEvent(new Event('change', { bubbles: true })); })()");
    await b.warte(200);
    check("Lehrkraftansicht zeigt B04 fallbezogen mit Musterlösung", await b.ev("document.body.innerText.includes('Bürgerbüro B04') && document.body.innerText.includes('§ 51 Abs. 1 BMG') && document.body.innerText.includes('Musterlösung')"));

    // Reflow (Viewport-Emulation, kein echter Zoom)
    await b.ev("document.getElementById('lehrkraft-schalter').click()");
    for (const breite of [320, 400]) {
      await b.call("Emulation.setDeviceMetricsOverride", { width: breite, height: 800, deviceScaleFactor: 1, mobile: false });
      await zumAmt();
      await b.ev("__knopf('Fall B04 öffnen')");
      await b.warte(300);
      const ueber = await b.ev("document.documentElement.scrollWidth - document.documentElement.clientWidth");
      check("Kein horizontaler Überlauf bei " + breite + " px (emuliert) in B04", ueber <= 0, ueber);
    }

    check("Keine JavaScript-Ausnahmen", b.konsole.length === 0, b.konsole);
    console.log("B04-Browserprüfung vollständig bestanden.");
  } catch (e) {
    console.error("FEHLER:", e.message);
    process.exitCode = 1;
  } finally {
    await b.schliessen();
  }
})();
