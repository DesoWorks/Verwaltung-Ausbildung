"use strict";

// Echte Browserprüfung für Fall B02 über file:// (Linux-Chrome, CDP). Kein node:test-Test.
// Aufruf: node tests/browser-b02-cdp.js
// Breiten-Checks sind Viewport-Emulation, KEIN echter Browserzoom (dafür starteBrowser({zoomProzent})).

const { starteBrowser, pruefer } = require("./browser-cdp-helfer.js");

const SOLL = [
  ["b2-anliegen", "eigene-meldebescheinigung"],
  ["b2-angaben-familienname", "vorhanden-stimmt"],
  ["b2-angaben-vorname", "vorhanden-stimmt"],
  ["b2-angaben-geburtsdatum", "vorhanden-stimmt"],
  ["b2-angaben-anschrift", "vorhanden-stimmt"],
  ["b2-identitaet", "abgleich-passt"],
  ["b2-umfang", "einfach-abs1"],
  ["b2-regeln", "antrag-eigene-person"],
  ["b2-regeln", "bmg18"],
  ["b2-regeln", "umfang-nach-antrag"],
  ["b2-regeln", "schriftliche-gebuehr-pruefen"],
  ["b2-aussagen", "keine"],
  ["b2-vorbereitung", "ausstellung-vorbereiten"],
  ["b2-bausteine", "anliegen"],
  ["b2-bausteine", "vorbereitung"],
  ["b2-bausteine", "nur-umfang"],
  ["b2-bausteine", "gebuehr-pruefen"],
  ["b2-bausteine", "uebung"]
];

const HELFER = `
window.__klick = (name, wert) => { const i = document.querySelector('input[name="' + name + '"][value="' + wert + '"]'); if (!i) return false; i.click(); return true; };
window.__knopf = (text) => { const k = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text); if (!k || k.disabled) return false; k.click(); return true; };
window.__hat = (text) => document.getElementById('hauptinhalt').innerText.toLowerCase().includes(text.toLowerCase());
`;

(async () => {
  const { check } = pruefer("B02-Browser");
  const b = await starteBrowser({ breite: 1280, hoehe: 900 });
  try {
    await b.oeffne("module/rathaus.html#buerger");
    await b.ev("localStorage.clear()");
    await b.neuLaden();
    await b.ev("[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()");
    await b.warte(250);
    await b.ev(HELFER);

    check("Übersicht zeigt B02 und B03 startbar",
      await b.ev("__hat('Fall B02')") && await b.ev("Array.from(document.querySelectorAll('button')).filter((k)=>k.textContent==='geplant, noch nicht startbar' && k.disabled).length") === 0);
    check("Fall B02 öffnen", await b.ev("__knopf('Fall B02 öffnen')"));
    await b.warte(200);
    await b.ev(HELFER);
    check("Fallansicht B02 sichtbar", await b.ev("__hat('Alex Weber') && __hat('6. Auswertung')"));

    // Fehlerpfad: leer prüfen ist nicht bestanden, Abschluss gesperrt
    check("Auswertung prüfen (leer)", await b.ev("__knopf('Auswertung prüfen')"));
    await b.warte(300);
    check("Leer: Abschluss gesperrt", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === true"));
    check("Leer: Bereiche als 'Noch offen' statt falsch", await b.ev("__hat('Noch offen')"));

    // Falsche Antwort
    await b.ev("__klick('b2-anliegen','anmeldung')");
    await b.ev("__knopf('Erneut prüfen') || __knopf('Auswertung prüfen')");
    await b.warte(300);
    check("Falsch: als 'Noch nicht richtig' markiert, Abschluss gesperrt",
      await b.ev("__hat('Noch nicht richtig') && document.getElementById('b2-abschluss-knopf').disabled === true"));

    // Sollpfad
    for (const [n, w] of SOLL) {
      check("Auswahl " + n + "=" + w, await b.ev("__klick(" + JSON.stringify(n) + "," + JSON.stringify(w) + ")"));
    }
    check("Nach Änderung: Abschluss gesperrt bis erneut geprüft", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === true"));
    await b.ev("__knopf('Erneut prüfen') || __knopf('Auswertung prüfen')");
    await b.warte(300);
    check("Soll: Abschluss freigegeben", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === false"));

    // Freitext ändert die Auswertung (veraltet), bewertet aber nicht
    await b.ev("(() => { const t = document.getElementById('b2-freitext'); t.value = 'Mein Entwurf'; t.dispatchEvent(new Event('input', {bubbles:true})); })()");
    check("Freitext entwertet Auswertung, Abschluss gesperrt", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === true"));
    await b.ev("__knopf('Auswertung prüfen') || __knopf('Erneut prüfen')");
    await b.warte(300);
    check("Erneut geprüft: wieder freigegeben", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === false"));
    check("Abschließen", await b.ev("__knopf('Übungsfall abschließen')"));
    await b.warte(300);
    check("Abgeschlossen-Text ohne echte Bescheinigung", await b.ev("__hat('keine echte Bescheinigung ausgestellt')"));

    // Persistenz und Speichertrennung
    await b.neuLaden();
    await b.ev(HELFER);
    check("Nach Neuladen von #buerger: Übersicht zeigt B02 abgeschlossen",
      await b.ev("__hat('Übungsfall abgeschlossen')"));
    const keys = await b.ev("Object.keys(localStorage).sort().join(',')");
    check("Eigener B02-Schlüssel vorhanden, B01 nicht angelegt",
      keys.includes("buergerbuero.b02.v1") && !/buergerbuero\.v1(,|$)/.test(keys), keys);

    // Manipulation: unbekannte Regel mit altem Abschluss -> gesperrt
    await b.ev(`(() => { const k = Object.keys(localStorage).find((x) => x.includes('b02')); const s = JSON.parse(localStorage.getItem(k)); s.eingaben.regeln.push('erfundene-regel'); localStorage.setItem(k, JSON.stringify(s)); })()`);
    await b.neuLaden();
    await b.ev(HELFER);
    check("Manipulierter Abschluss wird nicht übernommen", !(await b.ev("__hat('Stand: Übungsfall abgeschlossen')")));

    // Fall öffnen, Lehrkraft, Reset
    await b.ev("__knopf('Fall B02 öffnen')");
    await b.warte(200);
    await b.ev(HELFER);
    await b.ev("window.confirm = () => true");
    check("Reset B02", await b.ev("__knopf('Fall B02 zurücksetzen')"));
    await b.warte(300);
    check("Nach Reset kein B02-Schlüssel", !(await b.ev("Object.keys(localStorage).some((x) => x.includes('b02'))")));

    await b.ev("document.getElementById('lehrkraft-schalter').click()");
    await b.warte(300);
    check("Lehrkraftansicht zeigt B02 fallbezogen", await b.ev("document.body.innerText.includes('Bürgerbüro B02') && document.body.innerText.includes('§ 18')"));

    // Reflow (Viewport-Emulation, kein echter Zoom)
    await b.ev("document.getElementById('lehrkraft-schalter').click()");
    await b.ev("__knopf('Bürgerbüro')");
    for (const breite of [320, 360, 400]) {
      await b.call("Emulation.setDeviceMetricsOverride", { width: breite, height: 800, deviceScaleFactor: 1, mobile: false });
      await b.ev("[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()");
      await b.warte(200);
      await b.ev(HELFER);
      await b.ev("__knopf('Fall B02 öffnen')");
      await b.warte(300);
      const ueber = await b.ev("document.documentElement.scrollWidth - document.documentElement.clientWidth");
      check("Kein horizontaler Überlauf bei " + breite + " px (emuliert) in B02", ueber <= 0, ueber);
      await b.ev("[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()");
    }

    check("Keine JavaScript-Ausnahmen", b.konsole.length === 0, b.konsole);
    console.log("B02-Browserprüfung vollständig bestanden.");
  } catch (e) {
    console.error("FEHLER:", e.message);
    process.exitCode = 1;
  } finally {
    await b.schliessen();
  }
})();
