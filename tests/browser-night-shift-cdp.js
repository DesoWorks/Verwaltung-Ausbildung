'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { starteBrowser, pruefer, WURZEL } = require('./browser-cdp-helfer.js');
const B = require('../js/rathaus-b03.js');
(async () => {
  const { check, ergebnisse } = pruefer('NIGHT SHIFT');
  const b = await starteBrowser();
  const klick = async text => b.ev(`(() => { const x = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === ${JSON.stringify(text)}); if (!x || x.disabled) return false; x.click(); return true; })()`);
  try {
    await b.oeffne('index.html');
    check('Alle Tools-Karten sichtbar hinter sämtlichen Ausbildungsjahren', await b.ev(`(() => {
      const tools = document.querySelector('.overview-tools'), years = [...document.querySelectorAll('.overview-year')];
      return tools && years.length === 3 && years.every(y => y.getBoundingClientRect().bottom <= tools.getBoundingClientRect().top)
        && tools.querySelectorAll('a').length === MODULE_TOOLS.length && getComputedStyle(tools).display !== 'none';
    })()`));
    check('Tools alphabetisch und Rathaus nur einmal in Startseiteninhalt', await b.ev(`(() => {
      const titles = [...document.querySelectorAll('.overview-tools .modul-titel')].map(x => x.textContent);
      return JSON.stringify(titles) === JSON.stringify([...titles].sort(new Intl.Collator('de').compare))
        && document.querySelectorAll('#jahre a[href*="rathaus"]').length === 1;
    })()`));
    await b.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }).then(r => {
      fs.mkdirSync(path.join(WURZEL, '.output/night-shift'), { recursive: true });
      fs.writeFileSync(path.join(WURZEL, '.output/night-shift/startseite.png'), Buffer.from(r.data, 'base64'));
    });
    await b.oeffne('module/rathaus.html#buerger');
    await b.ev('localStorage.clear()'); await b.neuLaden();
    await klick('Bürgerbüro');
    check('B03 erreichbar', await klick('Fall B03 öffnen'));
    check('Lernansicht ohne Musterlösung', await b.ev("!document.querySelector('#hauptinhalt').innerText.includes('Musterlösung') && document.querySelector('h2').innerText.includes('B03')"));
    await klick('Auswertung prüfen');
    check('Unbeantworteter B03 sperrt', await b.ev("document.querySelector('#b3-abschluss-knopf').disabled && document.querySelector('#hauptinhalt').innerText.includes('Noch offen')"));
    await b.ev("document.querySelector('input[name=\"b3-art\"][value=\"erweitert-immer\"]').click()");
    await klick('Auswertung prüfen');
    check('Falscher B03 unterscheidbar und gesperrt', await b.ev("document.querySelector('#b3-abschluss-knopf').disabled && document.querySelector('#hauptinhalt').innerText.includes('Noch nicht richtig')"));
    for (const [f, k] of Object.entries(B.katalog())) {
      if (k.art === 'status') for (const o of k.optionen) await b.ev(`document.querySelector('input[name="b3-${f}-${o.id}"][value="${o.erwartet}"]').click()`);
      else for (const o of k.optionen.filter(o => o.richtig)) await b.ev(`document.querySelector('input[name="b3-${f}"][value="${o.id}"]').click()`);
    }
    await klick('Auswertung prüfen');
    check('Richtiger B03 freigegeben', await b.ev("!document.querySelector('#b3-abschluss-knopf').disabled"));
    await klick('Übungsfall abschließen');
    check('Abschluss gespeichert', await b.ev("JSON.parse(localStorage.getItem(RATHAUS_B03.SPEICHER_SCHLUESSEL)).abgeschlossen === true"));
    await b.ev("const t = document.querySelector('#b3-freitext'); t.value='Mein Entwurf'; t.dispatchEvent(new Event('input'))");
    check('Freitext invalidiert Abschluss', await b.ev("document.querySelector('#b3-abschluss-knopf').disabled && !JSON.parse(localStorage.getItem(RATHAUS_B03.SPEICHER_SCHLUESSEL)).abgeschlossen"));
    await klick('Zurück zum Bürgerbüro'); await klick('Fall B02 öffnen'); await klick('Zurück zum Bürgerbüro'); await klick('Fall B03 öffnen');
    check('Fallwechsel erhält Entwurf', await b.ev("document.querySelector('#b3-freitext').value === 'Mein Entwurf'"));
    await b.neuLaden(); await klick('Fall B03 öffnen');
    check('Reload erhält Entwurf', await b.ev("document.querySelector('#b3-freitext').value === 'Mein Entwurf'"));
    await b.ev("localStorage.setItem(RATHAUS_B02.SPEICHER_SCHLUESSEL, 'sentinel'); window.confirm=()=>true");
    await klick('Fall B03 zurücksetzen');
    check('Reset nur B03', await b.ev("localStorage.getItem(RATHAUS_B02.SPEICHER_SCHLUESSEL)==='sentinel' && localStorage.getItem(RATHAUS_B03.SPEICHER_SCHLUESSEL)===null"));
    await b.ev("localStorage.setItem(RATHAUS_B03.SPEICHER_SCHLUESSEL,'{defekt')");
    await b.neuLaden();
    check('Beschädigter Stand in Übersicht kenntlich', await b.ev("document.querySelector('#hauptinhalt').innerText.toLowerCase().includes('beschädigt oder veraltet')"));
    await klick('Fall B03 öffnen');
    check('Beschädigter Stand sperrt und meldet', await b.ev("document.querySelector('#b3-abschluss-knopf').disabled && document.querySelector('#hauptinhalt').innerText.includes('Kein alter Abschluss')"));
    for (const breite of [320, 360, 400]) {
      await b.call('Emulation.setDeviceMetricsOverride', { width: breite, height: 800, deviceScaleFactor: 1, mobile: false });
      check('B03 Reflow ' + breite, await b.ev('document.documentElement.scrollWidth <= document.documentElement.clientWidth'));
    }
    await b.ev("document.querySelector('#lehrkraft-schalter').click()");
    check('Lehrkraft: Auswahl vorhanden, B03 anfangs nicht offen', await b.ev("!!document.querySelector('#lehrkraft-fall') && !document.querySelector('#hauptinhalt').innerText.includes('Bürgerbüro B03: Robin Keller')"));
    await b.ev("(() => { const s = document.querySelector('#lehrkraft-fall'); s.value = 'b03'; s.dispatchEvent(new Event('change', { bubbles: true })); })()");
    check('Lehrkraft B03 Musterlösung getrennt erreichbar', await b.ev("document.querySelector('#hauptinhalt').innerText.includes('Bürgerbüro B03: Robin Keller') && document.querySelector('#hauptinhalt').innerText.includes('Musterlösung')"));
    check('Keine JS-Ausnahmen', b.konsole.length === 0, b.konsole);
  } finally {
    fs.mkdirSync(path.join(WURZEL, '.output/night-shift'), { recursive: true });
    fs.writeFileSync(path.join(WURZEL, '.output/night-shift/browser.json'), JSON.stringify(ergebnisse, null, 2));
    await b.schliessen();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
