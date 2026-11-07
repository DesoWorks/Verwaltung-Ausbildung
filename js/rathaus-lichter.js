(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.RATHAUS_LICHTER = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function objekt(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function fingerprint(antwort) { return JSON.stringify(antwort === undefined ? null : antwort); }
  function gleicheFingerprints(a, b) { return fingerprint(a) === fingerprint(b); }
  function hatBooleanRichtig(optionen) {
    return Array.isArray(optionen) && optionen.length > 0 && optionen.every(function (o) { return o && typeof o.richtig === 'boolean'; });
  }
  function hatPflichtFalle(optionen) {
    return Array.isArray(optionen) && optionen.some(function (o) { return o && (o.pflicht === true || o.falle === true); });
  }
  function hatErforderlichVerboten(optionen) {
    return Array.isArray(optionen) && optionen.some(function (o) { return o && (o.erforderlich === true || o.verboten === true); }) && !hatBooleanRichtig(optionen);
  }
  function statusFeld(feld) {
    return objekt(feld) && feld.art === 'status' && Array.isArray(feld.status) && Array.isArray(feld.optionen) && feld.optionen.every(function (o) { return o && typeof o.erwartet === 'string'; });
  }
  function zeile(id, zustand) { return { id: id, zustand: zustand }; }
  function blockAus(optionen) {
    return optionen.some(function (o) { return o.zustand === 'falsch-gewaehlt' || o.zustand === 'fehlt'; }) ? 'fehler' : 'richtig';
  }
  function klassifiziereEinzel(feld, antwort) {
    var id = typeof antwort === 'string' ? antwort : '';
    var optionen = feld.optionen.map(function (o) {
      var gewaehlt = id !== '' && o.id === id;
      var zustand = 'neutral';
      if (gewaehlt && o.richtig) zustand = 'richtig-gewaehlt';
      else if (gewaehlt && !o.richtig) zustand = 'falsch-gewaehlt';
      else if (!gewaehlt && o.richtig) zustand = 'fehlt';
      return zeile(o.id, zustand);
    });
    return { bewertbar: true, grund: 'einzel-richtig', block: blockAus(optionen), optionen: optionen };
  }
  function klassifiziereMehrfach(feld, antwort) {
    var liste = Array.isArray(antwort) ? antwort : [];
    var pflichtFalle = hatPflichtFalle(feld.optionen);
    var optionen = feld.optionen.map(function (o) {
      var gewaehlt = liste.indexOf(o.id) !== -1;
      var zustand = 'neutral';
      if (pflichtFalle) {
        if (gewaehlt && o.falle) zustand = 'falsch-gewaehlt';
        else if (gewaehlt && o.richtig) zustand = 'richtig-gewaehlt';
        else if (gewaehlt && o.richtig === false) zustand = 'falsch-gewaehlt';
        else if (!gewaehlt && o.pflicht === true) zustand = 'fehlt';
      } else if (gewaehlt && o.richtig) zustand = 'richtig-gewaehlt';
      else if (gewaehlt && o.richtig === false && o.optional !== true) zustand = 'falsch-gewaehlt';
      else if (!gewaehlt && o.richtig && o.optional !== true) zustand = 'fehlt';
      return zeile(o.id, zustand);
    });
    return { bewertbar: true, grund: pflichtFalle ? 'mehrfach-pflicht' : 'mehrfach-richtig', block: blockAus(optionen), optionen: optionen };
  }
  function klassifiziereBausteine(feld, antwort) {
    var liste = Array.isArray(antwort) ? antwort : [];
    var optionen = feld.optionen.map(function (o) {
      var gewaehlt = liste.indexOf(o.id) !== -1;
      var zustand = 'neutral';
      if (gewaehlt && o.erforderlich === true) zustand = 'richtig-gewaehlt';
      else if (!gewaehlt && o.erforderlich === true) zustand = 'fehlt';
      else if (gewaehlt && o.verboten === true) zustand = 'falsch-gewaehlt';
      return zeile(o.id, zustand);
    });
    return { bewertbar: true, grund: 'erforderlich-verboten', block: blockAus(optionen), optionen: optionen };
  }
  function klassifiziereStatusZeile(feld, antwort, def) {
    var statusId = objekt(antwort) && typeof antwort[def.id] === 'string' ? antwort[def.id] : '';
    var optionen = feld.status.map(function (s) {
      var gewaehlt = statusId !== '' && s.id === statusId;
      var erwartet = s.id === def.erwartet;
      var zustand = 'neutral';
      if (gewaehlt && erwartet) zustand = 'richtig-gewaehlt';
      else if (gewaehlt && !erwartet) zustand = 'falsch-gewaehlt';
      else if (!gewaehlt && erwartet) zustand = 'fehlt';
      return zeile(s.id, zustand);
    });
    return { bewertbar: true, grund: 'status-erwartet', block: blockAus(optionen), zeileId: def.id, optionen: optionen };
  }
  function klassifiziere(feld, antwort) {
    if (!objekt(feld)) return { bewertbar: false, grund: 'kein-feld', block: 'unbewertet', optionen: [] };
    if (feld.art === 'freitext' || feld.art === 'text') return { bewertbar: false, grund: 'freitext', block: 'unbewertet', optionen: [] };
    if (statusFeld(feld)) {
      var zeilen = feld.optionen.map(function (z) { return klassifiziereStatusZeile(feld, antwort, z); });
      return { bewertbar: true, grund: 'status-erwartet', block: zeilen.some(function (z) { return z.block === 'fehler'; }) ? 'fehler' : 'richtig', optionen: zeilen.length === 1 ? zeilen[0].optionen : [], zeilen: zeilen };
    }
    if (hatErforderlichVerboten(feld.optionen)) return klassifiziereBausteine(feld, antwort);
    if (feld.art !== 'mehrfach' && hatBooleanRichtig(feld.optionen) && !hatPflichtFalle(feld.optionen)) return klassifiziereEinzel(feld, antwort);
    if (hatBooleanRichtig(feld.optionen) || hatPflichtFalle(feld.optionen)) return klassifiziereMehrfach(feld, antwort);
    return { bewertbar: false, grund: 'keine-flags', block: 'unbewertet', optionen: [] };
  }
  var TEXTE = { 'richtig-gewaehlt': 'Richtig ausgewählt', 'falsch-gewaehlt': 'Falsch ausgewählt', fehlt: 'Relevante Antwort fehlt' };
  var SYMBOLE = { 'richtig-gewaehlt': '✓', 'falsch-gewaehlt': '✕', fehlt: '✓' };
  function entferneMarken(knoten) {
    if (!knoten || !knoten.querySelectorAll) return;
    knoten.classList.remove('rathaus-licht', 'ist-richtig', 'ist-fehler', 'ist-veraltet');
    knoten.querySelectorAll('.rathaus-licht-symbol, .rathaus-licht-text, .rathaus-licht-hinweis').forEach(function (n) { n.remove(); });
    knoten.querySelectorAll('.rathaus-licht-option').forEach(function (n) {
      n.classList.remove('rathaus-licht-option', 'ist-richtig-gewaehlt', 'ist-falsch-gewaehlt', 'ist-fehlt');
    });
  }
  function haenge(label, zustand) {
    if (!label || !TEXTE[zustand]) return;
    label.classList.add('rathaus-licht-option', 'ist-' + zustand);
    var sym = document.createElement('span');
    sym.className = 'rathaus-licht-symbol';
    sym.setAttribute('aria-hidden', 'true');
    sym.textContent = SYMBOLE[zustand];
    var txt = document.createElement('span');
    txt.className = 'rathaus-licht-text';
    txt.textContent = TEXTE[zustand];
    label.appendChild(sym);
    label.appendChild(txt);
  }
  function hinweis(container, text) {
    var p = document.createElement('p');
    p.className = 'rathaus-licht-hinweis';
    p.textContent = text;
    var legend = container.querySelector('legend');
    if (legend && legend.nextSibling) container.insertBefore(p, legend.nextSibling);
    else container.insertBefore(p, container.firstChild);
  }
  function markiere(container, ergebnis) {
    if (!container) return;
    entferneMarken(container);
    if (!ergebnis) return;
    container.classList.add('rathaus-licht');
    if (ergebnis.veraltet) {
      container.classList.add('ist-veraltet');
      hinweis(container, 'Bewertung veraltet');
      return;
    }
    if (!ergebnis.bewertbar) { container.classList.remove('rathaus-licht'); return; }
    container.classList.add(ergebnis.block === 'richtig' ? 'ist-richtig' : 'ist-fehler');
    var titel = ergebnis.block === 'richtig' ? 'Frageblock richtig' : 'Frageblock nicht richtig';
    hinweis(container, (ergebnis.block === 'richtig' ? '✓ ' : '✕ ') + titel);
    (ergebnis.optionen || []).forEach(function (o) {
      if (o.zustand === 'neutral') return;
      var input = container.querySelector('input[value="' + o.id + '"]');
      if (input && input.closest) haenge(input.closest('label'), o.zustand);
    });
  }
  function zeigeFeld(container, feld, antwort, snapshot) {
    if (!container) return;
    if (snapshot === undefined || snapshot === null) { entferneMarken(container); return; }
    if (!gleicheFingerprints(antwort, snapshot)) { markiere(container, { veraltet: true }); return; }
    markiere(container, klassifiziere(feld, antwort));
  }
  function gruppenStand(schluessel, felder, antworten, stand) {
    var liste = Array.isArray(schluessel) ? schluessel : [];
    var gesehen = 0;
    var veraltet = false;
    var fehler = false;
    liste.forEach(function (key) {
      if (!objekt(stand) || !Object.prototype.hasOwnProperty.call(stand, key)) return;
      if (stand[key] === undefined || stand[key] === null) return;
      gesehen += 1;
      var aktuell = objekt(antworten) ? antworten[key] : undefined;
      if (!gleicheFingerprints(aktuell, stand[key])) veraltet = true;
      else if (objekt(felder)) {
        var erg = klassifiziere(felder[key], aktuell);
        if (!erg.bewertbar || erg.block !== 'richtig') fehler = true;
      }
    });
    if (!gesehen) return 'ungeprueft';
    if (veraltet) return 'veraltet';
    if (gesehen < liste.length) return 'ungeprueft';
    if (fehler) return 'fehler';
    return 'richtig';
  }
  function erweitere(namen, felder) {
    var aus = [];
    (Array.isArray(namen) ? namen : []).forEach(function (name) {
      if (objekt(felder) && felder[name]) aus.push(name);
      Object.keys(felder || {}).forEach(function (key) {
        if (key.indexOf(name + '.') === 0) aus.push(key);
      });
    });
    return aus;
  }
  function filtereStand(stand, antworten) {
    var aus = {};
    if (!objekt(stand) || !objekt(antworten)) return aus;
    Object.keys(stand).forEach(function (schluessel) {
      if (Object.prototype.hasOwnProperty.call(antworten, schluessel) && gleicheFingerprints(antworten[schluessel], stand[schluessel])) {
        aus[schluessel] = stand[schluessel];
      }
    });
    return aus;
  }
  // Gemeinsamer Adapter für Fälle mit Katalog { feld: { art, optionen, status? } }: liefert je bewertbarem
  // Frageblock die Felddefinition und den normalisierten Antwortwert. Freitext und Felder ohne Katalogart fehlen.
  function ausKatalog(katalog, eingaben) {
    var felder = {};
    var antworten = {};
    var e = objekt(eingaben) ? eingaben : {};
    if (!objekt(katalog)) return { felder: felder, antworten: antworten };
    Object.keys(katalog).forEach(function (key) {
      var k = katalog[key];
      if (!objekt(k) || !Array.isArray(k.optionen)) return;
      if (k.art === 'status' && Array.isArray(k.status)) {
        k.optionen.forEach(function (o) {
          var zeileKey = key + '.' + o.id;
          var zeileWert = objekt(e[key]) && typeof e[key][o.id] === 'string' ? e[key][o.id] : '';
          var antwort = {};
          antwort[o.id] = zeileWert;
          felder[zeileKey] = { art: 'status', status: k.status, optionen: [o] };
          antworten[zeileKey] = antwort;
        });
      } else if (k.art === 'einzel') {
        felder[key] = k;
        antworten[key] = typeof e[key] === 'string' ? e[key] : '';
      } else if (k.art === 'mehrfach') {
        felder[key] = k;
        antworten[key] = Array.isArray(e[key]) ? e[key].slice() : [];
      }
    });
    return { felder: felder, antworten: antworten };
  }
  return {
    ausKatalog: ausKatalog,
    filtereStand: filtereStand,
    gruppenStand: gruppenStand,
    erweitere: erweitere,
    klassifiziere: klassifiziere,
    fingerprint: fingerprint,
    gleicheFingerprints: gleicheFingerprints,
    markiere: markiere,
    entferneMarken: entferneMarken,
    zeigeFeld: zeigeFeld,
    TEXTE: TEXTE
  };
}));
