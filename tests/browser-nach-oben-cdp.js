'use strict';
// Echte Browserprüfung (Linux-Chrome über file://) für den Knopf "Nach oben".
const fs = require('node:fs');
const path = require('node:path');
const { starteBrowser, pruefer, warte, WURZEL } = require('./browser-cdp-helfer.js');

const SEITEN = ['glossar.html', 'module/lf1-rolle.html', 'module/rathaus.html', 'module/werkzeuge/rechner.html', 'index.html'];
const KNOPF = "document.querySelector('button.nach-oben')";

(async () => {
  const { check, ergebnisse } = pruefer('NACH OBEN');
  const b = await starteBrowser({ breite: 1280, hoehe: 900 });
  const scrolleZu = async y => { await b.ev(`window.scrollTo(0, ${y})`); await warte(400); };
  const weitGenug = async () => {
    const y = await b.ev(`(() => { const z = document.getElementById('hauptinhalt'); const top = z ? z.getBoundingClientRect().top + scrollY : 0; return Math.ceil(Math.max(400, top + 320)); })()`);
    await scrolleZu(y);
    return y;
  };
  const amInhalt = () => b.ev(`(() => { const z = document.getElementById('hauptinhalt'); return !!z && z.getBoundingClientRect().top <= 12; })()`);
  const sichtbar = () => b.ev(`(() => { const k = ${KNOPF}; const s = k && getComputedStyle(k); return !!k && !k.hidden && s.display !== 'none' && s.visibility === 'visible' && Number(s.opacity) === 1 && s.pointerEvents !== 'none'; })()`);
  const zustand = () => b.ev(`(() => { const k = ${KNOPF}, s = getComputedStyle(k); return { hidden: k.hidden, opacity: Number(s.opacity), visibility: s.visibility, pointer: s.pointerEvents, tabindex: k.getAttribute('tabindex'), aria: k.getAttribute('aria-hidden'), transition: s.transitionProperty + ' ' + s.transitionDuration }; })()`);
  const lang = () => b.ev(`(() => { if (document.documentElement.scrollHeight - innerHeight < 700) { const s = document.createElement('div'); s.id = 'test-abstandhalter'; s.style.height = '2500px'; document.body.appendChild(s); } return document.documentElement.scrollHeight - innerHeight; })()`);
  const rechtsUnten = () => b.ev(`(() => { const r = ${KNOPF}.getBoundingClientRect(); return getComputedStyle(${KNOPF}).position === 'fixed' && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5 && r.left >= 0 && r.top >= 0 && r.left > innerWidth / 2 && r.top > innerHeight / 2; })()`);
  const bedienbar = () => b.ev(`(() => { const k = ${KNOPF}, r = k.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !k.hidden && r.width >= 40 && r.height >= 40 && (e === k || k.contains(e)); })()`);
  const taste = async key => {
    await b.call('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode: 13, text: '\r' });
    await b.call('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: 13 });
  };
  try {
    for (const seite of SEITEN) {
      await b.oeffne(seite);
      await b.call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
      await lang();
      await scrolleZu(0);
      check(seite + ': Knopf existiert, oben verborgen', await b.ev(`!!${KNOPF} && ${KNOPF}.hidden && getComputedStyle(${KNOPF}).display === 'none'`));
      check(seite + ': Beschriftung "Nach oben", type=button', await b.ev(`${KNOPF}.textContent.trim() === 'Nach oben' && ${KNOPF}.type === 'button'`));
      await scrolleZu(200);
      check(seite + ': bei 200 px noch verborgen', !(await sichtbar()));
      await weitGenug();
      check(seite + ': nach ausreichender Strecke sichtbar', await sichtbar());
      check(seite + ': fixed und rechts unten im Viewport', await rechtsUnten());
      check(seite + ': in der Tab-Reihenfolge erreichbar', await b.ev(`(() => { ${KNOPF}.focus(); return document.activeElement === ${KNOPF}; })()`));
      check(seite + ': über Dialogen (z-index < 50)', await b.ev(`Number(getComputedStyle(${KNOPF}).zIndex) < 50`));

      // Fade: sichtbarer Zustand, Mitte des Ausblendens, Zustand nach dem Ausblenden.
      let z = await zustand();
      check(seite + ': sichtbar = opacity 1, tabindex 0, aria-hidden false', z.opacity === 1 && z.tabindex === '0' && z.aria === 'false' && z.pointer === 'auto', z);
      check(seite + ': Fade nur über opacity, 200 ms', /opacity/.test(z.transition) && /0\.2s/.test(z.transition), z.transition);
      await b.ev('window.scrollTo(0, 0)');
      await warte(100);
      z = await zustand();
      check(seite + ': Mitte des Ausblendens: noch da, halbtransparent, ohne Klicks und Tab', !z.hidden && z.opacity < 1 && z.pointer === 'none' && z.tabindex === '-1' && z.aria === 'true', z);
      await warte(400);
      z = await zustand();
      check(seite + ': nach dem Ausblenden hidden, tabindex -1, aria-hidden true', z.hidden && z.tabindex === '-1' && z.aria === 'true', z);
      check(seite + ': unsichtbar nicht per Fokus erreichbar', await b.ev(`(() => { ${KNOPF}.focus(); return document.activeElement !== ${KNOPF}; })()`));
      // Schnelles Hin und Her endet nie in einem hängenden Zwischenzustand.
      for (const y of [900, 0, 900, 0, 900, 0, 900]) { await b.ev(`window.scrollTo(0, ${y})`); await warte(45); }
      await warte(450);
      z = await zustand();
      check(seite + ': schnelles Hin und Her: am Ende sichtbar, voll deckend, bedienbar', !z.hidden && z.opacity === 1 && z.pointer === 'auto' && z.tabindex === '0' && z.aria === 'false' && (await bedienbar()), z);
      for (const y of [900, 0, 900, 0]) { await b.ev(`window.scrollTo(0, ${y})`); await warte(45); }
      await warte(450);
      z = await zustand();
      check(seite + ': schnelles Hin und Her: am Ende verborgen', z.hidden && z.tabindex === '-1' && z.aria === 'true', z);
      await weitGenug();

      await b.ev(`${KNOPF}.click()`);
      await warte(1500);
      check(seite + ': Klick erreicht den Inhaltsanfang', await amInhalt(), await b.ev("document.getElementById('hauptinhalt').getBoundingClientRect().top"));
      check(seite + ': nach Klick verborgen', !(await sichtbar()));
      check(seite + ': Fokus auf Hauptinhalt', await b.ev("document.activeElement && document.activeElement.id === 'hauptinhalt'"));

      await weitGenug();
      await b.ev(`${KNOPF}.focus()`);
      await taste('Enter');
      await warte(1500);
      check(seite + ': Enter erreicht den Inhaltsanfang', await amInhalt());
      check(seite + ': nach Enter verborgen', !(await sichtbar()));

      for (const modus of ['dunkel', 'kontrast']) {
        await b.ev(`document.documentElement.dataset.theme = '${modus}'`);
        await weitGenug();
        await warte(250);
        const abgesetzt = await b.ev(`(() => { const k = ${KNOPF}; if (!k) return { ok: false, grund: 'fehlt' }; const s = getComputedStyle(k); const r = k.getBoundingClientRect(); const e = document.elementFromPoint(Math.min(innerWidth - 2, Math.max(1, r.left + r.width / 2)), Math.min(innerHeight - 2, Math.max(1, r.top + r.height / 2))); return { ok: !k.hidden && s.visibility === 'visible' && Number(s.opacity) === 1 && s.pointerEvents !== 'none' && r.width >= 40 && r.height >= 40 && (e === k || (k.contains && k.contains(e))) && s.color !== s.backgroundColor, hidden: k.hidden, opacity: Number(s.opacity), color: s.color, bg: s.backgroundColor, hit: e ? (e.id || e.className || e.tagName) : null }; })()`);
        check(seite + ': ' + modus + ' bedienbar und lesbar abgesetzt', !!(abgesetzt && abgesetzt.ok), abgesetzt);
        await b.ev("document.documentElement.dataset.theme = 'hell'");
      }
      await b.ev("document.documentElement.classList.add('mehr-abstand')");
      await weitGenug();
      check(seite + ': mehr-abstand bedienbar', (await sichtbar()) && (await bedienbar()) && (await rechtsUnten()));
      await b.ev("document.documentElement.classList.remove('mehr-abstand')");

      await b.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 700, deviceScaleFactor: 1, mobile: false });
      await lang();
      await weitGenug();
      check(seite + ': 390x700 sichtbar und im Viewport', (await sichtbar()) && (await rechtsUnten()));
      check(seite + ': 390x700 verdeckt nav-toggle nicht', await b.ev(`(() => { const t = document.querySelector('.nav-toggle'); if (!t || getComputedStyle(t).display === 'none') return true; const a = t.getBoundingClientRect(), r = ${KNOPF}.getBoundingClientRect(), x = a.left + a.width / 2, y = a.top + a.height / 2; return !(x >= r.left && x <= r.right && y >= r.top && y <= r.bottom); })()`));
      check(seite + ': 390x700 kein Querscrollen durch den Knopf', await b.ev('document.documentElement.scrollWidth <= document.documentElement.clientWidth'));
      await b.call('Emulation.clearDeviceMetricsOverride');
    }
    // Fallmarkierungen stehen in den von rathaus.html geladenen rathaus-*.js; hier nur lesend geprüft.
    const jsDir = path.join(WURZEL, 'js');
    const rathaus = fs.readFileSync(path.join(WURZEL, 'module/rathaus.html'), 'utf8') +
      fs.readdirSync(jsDir).filter(n => /^rathaus-.*\.js$/.test(n)).map(n => fs.readFileSync(path.join(jsDir, n), 'utf8')).join('\n');
    await b.oeffne('glossar.html');
    await b.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await b.ev("document.documentElement.classList.add('ruhige-ansicht')");
    await lang();
    await weitGenug();
    const ohneFade = await b.ev(`(() => { const s = getComputedStyle(${KNOPF}); return { duration: s.transitionDuration, property: s.transitionProperty, opacity: Number(s.opacity), hidden: ${KNOPF}.hidden }; })()`);
    check('reduzierte Bewegung: keine Transition, Knopf sichtbar', ohneFade && (ohneFade.duration === '0s' || ohneFade.duration.split(',').every(t => t.trim() === '0s')) && ohneFade.opacity === 1 && ohneFade.hidden === false, ohneFade);
    await b.ev('window.scrollTo(0, 0)');
    await warte(40);
    check('reduzierte Bewegung: sofort verborgen, ohne Ausblendwartezeit', await b.ev(`${KNOPF}.hidden === true && getComputedStyle(${KNOPF}).display === 'none'`));
    await b.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: '' }] });
    await b.ev("document.documentElement.classList.remove('ruhige-ansicht')");

    check('Rathaus (Seite und rathaus-*.js) enthält weiter B01, B02, B03', ['B01', 'B02', 'B03'].every(f => rathaus.includes(f)));
    check('Keine JS-Ausnahmen (1280)', b.konsole.length === 0, b.konsole);
  } finally {
    fs.mkdirSync(path.join(WURZEL, '.output/nach-oben'), { recursive: true });
    fs.writeFileSync(path.join(WURZEL, '.output/nach-oben/browser.json'), JSON.stringify(ergebnisse, null, 2));
    await b.schliessen();
  }
  for (const zoom of [200, 400]) {
    const z = await starteBrowser({ zoomProzent: zoom, breite: 1280, hoehe: 900 });
    try {
      await z.oeffne('glossar.html');
      const hoch = await z.ev('document.documentElement.scrollHeight - innerHeight');
      if (hoch < 800) { await z.ev("(() => { const s = document.createElement('div'); s.style.height = '3000px'; document.body.appendChild(s); })()"); }
      await z.ev(`(() => { const z = document.getElementById('hauptinhalt'); const top = z ? z.getBoundingClientRect().top + scrollY : 0; window.scrollTo(0, Math.ceil(Math.max(400, top + 320))); })()`);
      await warte(300);
      const info = await z.ev(`(() => { const k = ${KNOPF}, r = k.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { sichtbar: !k.hidden, imViewport: r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5, bedienbar: e === k, anteil: (r.width * r.height) / (innerWidth * innerHeight), iw: innerWidth }; })()`);
      const ok = info.sichtbar && info.imViewport && info.bedienbar && info.anteil < 0.25;
      console.log((ok ? 'OK   ' : 'FAIL ') + 'Zoom ' + zoom + '%: ' + JSON.stringify(info));
      ergebnisse.push({ name: 'Zoom ' + zoom, ok, detail: info });
      if (!ok) throw new Error('Zoom ' + zoom + ' fehlgeschlagen');
      await z.ev(`${KNOPF}.click()`); await warte(1500);
      const oben = await z.ev(`(() => { const z = document.getElementById('hauptinhalt'); return !!z && z.getBoundingClientRect().top <= 12 && ${KNOPF}.hidden; })()`);
      console.log((oben ? 'OK   ' : 'FAIL ') + 'Zoom ' + zoom + '%: Klick scrollt nach oben und verbirgt');
      if (!oben) throw new Error('Zoom ' + zoom + ' Klick fehlgeschlagen');
    } finally { await z.schliessen(); }
  }

  const eng = await starteBrowser({ breite: 390, hoehe: 700 });
  try {
    await eng.oeffne('module/rathaus.html');
    await eng.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 700, deviceScaleFactor: 1, mobile: false });
    await eng.ev("document.documentElement.style.setProperty('--text-scale', '1.5'); document.documentElement.classList.add('mehr-abstand');");
    await eng.ev("(() => { const s = document.createElement('div'); s.style.height = '1800px'; document.body.appendChild(s); })()");
    await warte(400);
    const scan = await eng.ev(`(() => {
      const ziel = Array.from(document.querySelectorAll('button, a')).find(el => (el.textContent || '').indexOf('Bürgerbüro öffnen') >= 0);
      if (!ziel) return { fehlt: true, treffer: [] };
      const treffer = [];
      const max = document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= max; y += 40) {
        window.scrollTo(0, y);
        const a = ziel.getBoundingClientRect();
        if (a.width < 8 || a.bottom < 0 || a.top > innerHeight) continue;
        const hit = document.elementFromPoint(a.left + a.width / 2, a.top + a.height / 2);
        const k = document.querySelector('button.nach-oben');
        if (k && !k.hidden && (hit === k || (k.contains && k.contains(hit)))) treffer.push(Math.round(y));
      }
      return { fehlt: false, treffer: treffer.slice(0, 8), anzahl: treffer.length };
    })()`);
    const frei = scan && !scan.fehlt && scan.anzahl === 0;
    console.log((frei ? 'OK   ' : 'FAIL ') + '390x700 große Schrift: Bürgerbüro öffnen bleibt treffbar  ' + JSON.stringify(scan));
    if (!frei) throw new Error('Bürgerbüro öffnen wird verdeckt');
    await eng.ev("document.getElementById('lehrkraft-schalter').click()");
    await warte(300);
    await eng.ev("(() => { const z = document.getElementById('hauptinhalt'); const top = z ? z.getBoundingClientRect().top + scrollY : 0; window.scrollTo(0, Math.ceil(top + 360)); })()");
    await warte(300);
    const lehr = await eng.ev("(() => { const k = document.querySelector('button.nach-oben'); return { modus: document.getElementById('lehrkraft-schalter').getAttribute('aria-pressed'), sichtbar: !!k && !k.hidden, scrollY }; })()");
    console.log((lehr.modus === 'true' && lehr.sichtbar ? 'OK   ' : 'FAIL ') + 'Lehrkraftansicht: Knopf sichtbar  ' + JSON.stringify(lehr));
    if (!(lehr.modus === 'true' && lehr.sichtbar)) throw new Error('Lehrkraftansicht ohne Knopf');
    const auswahl = await eng.ev(`(() => { const s = document.getElementById('lehrkraft-fall'); if (!s) return { fehlt: true }; const r = s.getBoundingClientRect(); s.value = 'b03'; s.dispatchEvent(new Event('change', { bubbles: true })); const text = document.getElementById('hauptinhalt').innerText; return { fehlt: false, breite: r.width, rechts: r.right, iw: innerWidth, ueber: document.documentElement.scrollWidth - document.documentElement.clientWidth, b03: text.includes('Bürgerbüro B03: Robin Keller'), lucaLoesung: text.includes('Luca Berger wird am Dienstag') }; })()`);
    const auswahlOk = auswahl && !auswahl.fehlt && auswahl.breite >= 44 && auswahl.rechts <= auswahl.iw + 1 && auswahl.ueber <= 1 && auswahl.b03 && !auswahl.lucaLoesung;
    console.log((auswahlOk ? 'OK   ' : 'FAIL ') + 'Lehrkraftauswahl 390x700 große Schrift  ' + JSON.stringify(auswahl));
    if (!auswahlOk) throw new Error('Lehrkraftauswahl bei schmaler großer Schrift');
  } finally { await eng.schliessen(); }

  const gross = await starteBrowser({ zoomProzent: 400, breite: 1280, hoehe: 900 });
  try {
    await gross.oeffne('glossar.html');
    await gross.ev("document.documentElement.style.setProperty('--text-scale', '1.5'); document.documentElement.classList.add('mehr-abstand');");
    await gross.ev("(() => { const s = document.createElement('div'); s.style.height = '3000px'; document.body.appendChild(s); })()");
    await gross.ev("(() => { const z = document.getElementById('hauptinhalt'); const top = z ? z.getBoundingClientRect().top + scrollY : 0; window.scrollTo(0, Math.ceil(top + 360)); })()");
    await warte(300);
    const lage = await gross.ev(`(() => { const k = document.querySelector('button.nach-oben'); const r = k.getBoundingClientRect(); return { hidden: k.hidden, top: r.top, bottom: r.bottom, left: r.left, right: r.right, ih: innerHeight, iw: innerWidth, hoehe: r.height }; })()`);
    const drin = lage && !lage.hidden && lage.top >= -0.5 && lage.left >= -0.5 && lage.bottom <= lage.ih + 0.5 && lage.right <= lage.iw + 0.5 && lage.hoehe <= lage.ih;
    console.log((drin ? 'OK   ' : 'FAIL ') + 'Zoom 400% plus große Schrift: Knopf im Fenster  ' + JSON.stringify(lage));
    if (!drin) throw new Error('Knopf ragt bei 400% und großer Schrift aus dem Fenster');
  } finally { await gross.schliessen(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
