/* LF1-B Ausbildungsvertrag: Zustand, Auswertung und Oberfläche. */
(function (root) {
  'use strict';

  var KEY = 'verwaltung-ausbildung.lf1-vertrag.v1';
  var MAIN = ['duration', 'probation', 'pay_details', 'record_owner', 'materials', 'record_support'];
  var SOLL = {
    duration: 'fits',
    probation: 'clarify',
    pay_details: 'clarify',
    record_owner: 'clarify',
    materials: 'clarify',
    record_support: 'fits'
  };
  var FLAG = {
    duration: 'duration_mismatch',
    probation: 'probation_range_missed',
    pay_details: 'pay_content_missing',
    record_owner: 'record_duty_missed',
    materials: 'materials_cost_missed',
    record_support: 'record_support_missed'
  };
  var LC = ['lc_document', 'lc_probation', 'lc_end'];
  var LC_SOLL = { lc_document: 'text_content', lc_probation: 'three', lc_end: 'announcement' };
  var LC_FLAG = {
    lc_document: 'lc_document_missed',
    lc_probation: 'lc_probation_missed',
    lc_end: 'lc_end_missed'
  };
  var HILFEN = [
    'Lies den Vertrag Zeile für Zeile. Vergleiche jede Zeile einzeln mit dem Lerntext.',
    'Frage bei jeder Zeile: Steht dort eine Zahl, ein Zeitraum oder eine Pflicht? Und was sagt der Lerntext dazu?'
  ];
  var ERKLAERUNG = {
    duration_mismatch: 'Drei Jahre sind die Regelausbildungsdauer nach § 2 der Verordnung von 2025. Verkürzung oder Verlängerung nach § 8 BBiG ist nicht Gegenstand dieser Übung.',
    probation_range_missed: 'Die Probezeit muss mindestens einen Monat und darf höchstens vier Monate dauern (§ 20 BBiG).',
    pay_content_missing: 'Zahlung und Höhe der Vergütung gehören zum Mindestinhalt des Vertrags (§ 11 BBiG).',
    record_duty_missed: 'Auszubildende führen den Ausbildungsnachweis (§ 13 BBiG).',
    materials_cost_missed: 'Ausbildende stellen die Ausbildungsmittel kostenlos zur Verfügung (§ 14 BBiG).',
    record_support_missed: 'Ausbildende sehen den Nachweis regelmäßig durch (§ 14 BBiG). Diese Zusage passt.',
    lc_document_missed: 'Der Vertrag wird in Textform abgefasst, spätestens vor Beginn der Ausbildung. Zahlung und Höhe der Vergütung gehören dazu (§ 11 BBiG).',
    lc_probation_missed: 'Die Probezeit liegt zwischen einem und vier Monaten (§ 20 BBiG).',
    lc_end_missed: 'Wer die Abschlussprüfung vorher besteht, dessen Ausbildung endet mit der Bekanntgabe des Ergebnisses durch den Prüfungsausschuss (§ 21 Absatz 2 BBiG).'
  };

  function nullMap(ids) {
    var o = {};
    ids.forEach(function (id) { o[id] = null; });
    return o;
  }

  function neuerZustand() {
    return {
      answers: nullMap(MAIN),
      lcAnswers: nullMap(LC),
      submitted: false,
      lcSubmitted: false,
      hilfe: 0,
      flags: [],
      lcFlags: [],
      score: null,
      complete: false,
      mastered: false
    };
  }

  function bewertungLoeschen(s) {
    s.submitted = false;
    s.flags = [];
    s.score = null;
    s.complete = false;
    s.mastered = false;
  }

  function setAntwort(s, id, wert) {
    if (MAIN.indexOf(id) < 0) return s;
    s.answers[id] = wert;
    bewertungLoeschen(s);
    return s;
  }

  function setKontrolle(s, id, wert) {
    if (LC.indexOf(id) < 0) return s;
    s.lcAnswers[id] = wert;
    s.lcSubmitted = false;
    s.lcFlags = [];
    s.mastered = false;
    return s;
  }

  function neuBeginnen(s) {
    var n = neuerZustand();
    Object.keys(n).forEach(function (k) { s[k] = n[k]; });
    return s;
  }

  function hilfeAnfordern(s) {
    if (s.hilfe >= HILFEN.length) return null;
    s.hilfe += 1;
    return HILFEN[s.hilfe - 1];
  }

  function meisterschaft(s) {
    s.mastered = !!(s.complete && s.lcSubmitted && s.lcFlags.length === 0);
  }

  function auswerten(s) {
    var fehlend = MAIN.filter(function (id) { return s.answers[id] === null; });
    if (fehlend.length) return { status: 'fehlend', fehlend: fehlend, score: null, flags: [] };
    var flags = [];
    var score = 0;
    MAIN.forEach(function (id) {
      if (s.answers[id] === SOLL[id]) score += 1; else flags.push(FLAG[id]);
    });
    s.submitted = true;
    s.flags = flags;
    s.score = score;
    s.complete = score === MAIN.length;
    meisterschaft(s);
    return { status: 'ausgewertet', score: score, total: MAIN.length, flags: flags, complete: s.complete };
  }

  function kontrolleAuswerten(s) {
    var fehlend = LC.filter(function (id) { return s.lcAnswers[id] === null; });
    if (fehlend.length) return { status: 'fehlend', fehlend: fehlend, passed: false, flags: [] };
    var flags = [];
    LC.forEach(function (id) {
      if (s.lcAnswers[id] !== LC_SOLL[id]) flags.push(LC_FLAG[id]);
    });
    s.lcSubmitted = true;
    s.lcFlags = flags;
    meisterschaft(s);
    return { status: 'ausgewertet', score: LC.length - flags.length, total: LC.length, flags: flags, passed: flags.length === 0 };
  }

  function laden(storage) {
    try {
      var raw = storage && storage.getItem(KEY);
      if (!raw) return neuerZustand();
      var d = JSON.parse(raw);
      var s = neuerZustand();
      MAIN.forEach(function (id) { if (d.answers && typeof d.answers[id] === 'string') s.answers[id] = d.answers[id]; });
      LC.forEach(function (id) { if (d.lcAnswers && typeof d.lcAnswers[id] === 'string') s.lcAnswers[id] = d.lcAnswers[id]; });
      s.hilfe = Math.min(HILFEN.length, Math.max(0, d.hilfe | 0));
      return s;
    } catch (e) {
      return neuerZustand();
    }
  }

  function speichern(storage, s) {
    try {
      if (storage) storage.setItem(KEY, JSON.stringify({ answers: s.answers, lcAnswers: s.lcAnswers, hilfe: s.hilfe, mastered: s.mastered, finish: s.mastered === true }));
    } catch (e) { /* Speicher nicht verfügbar */ }
  }

  var api = {
    KEY: KEY,
    MAIN_IDS: MAIN.slice(),
    LC_IDS: LC.slice(),
    SOLL: SOLL,
    LC_SOLL: LC_SOLL,
    HILFEN: HILFEN.slice(),
    neuerZustand: neuerZustand,
    setAntwort: setAntwort,
    setKontrolle: setKontrolle,
    neuBeginnen: neuBeginnen,
    hilfeAnfordern: hilfeAnfordern,
    auswerten: auswerten,
    kontrolleAuswerten: kontrolleAuswerten,
    laden: laden,
    speichern: speichern
  };

  /* Oberfläche: nur im Browser auf der eigenen Seite. */
  function starten() {
    var doc = root.document;
    if (!doc || !doc.body || doc.body.getAttribute('data-page') !== 'lf1-vertrag') return;
    var storage = null;
    try { storage = root.localStorage; } catch (e) { storage = null; }
    var s = laden(storage);

    function el(id) { return doc.getElementById(id); }
    function sagen(id, text) { var n = el(id); if (n) n.textContent = text; }

    function auswahlZeigen() {
      MAIN.concat(LC).forEach(function (id) {
        var wert = s.answers[id] !== undefined ? s.answers[id] : s.lcAnswers[id];
        var radios = doc.querySelectorAll('input[type="radio"][name="' + id + '"]');
        Array.prototype.forEach.call(radios, function (r) { r.checked = r.value === wert; });
      });
    }

    function ergebnisLeeren() {
      sagen('vertrag-ergebnis', '');
      sagen('kontrolle-ergebnis', '');
      sagen('vertrag-hilfe', s.hilfe ? HILFEN.slice(0, s.hilfe).join(' ') : '');
    }

    function erklaerungen(flags) {
      return flags.map(function (f) { return ERKLAERUNG[f]; }).join(' ');
    }

    doc.addEventListener('change', function (ev) {
      var t = ev.target;
      if (!t || t.type !== 'radio') return;
      if (MAIN.indexOf(t.name) >= 0) {
        setAntwort(s, t.name, t.value);
        sagen('vertrag-ergebnis', '');
      } else if (LC.indexOf(t.name) >= 0) {
        setKontrolle(s, t.name, t.value);
        // Nur die Kontrolle ist betroffen; das Ergebnis der Vertragsübung bleibt stehen.
        sagen('kontrolle-ergebnis', 'Antwort geändert – bitte erneut auswerten.');
      } else return;
      speichern(storage, s);
    });

    doc.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button[data-aktion]') : null;
      if (!b) return;
      var a = b.getAttribute('data-aktion');
      if (a === 'auswerten') {
        var r = auswerten(s);
        if (r.status === 'fehlend') sagen('vertrag-ergebnis', 'Bitte beantworte zuerst alle sechs Zeilen.');
        else sagen('vertrag-ergebnis', r.score + ' von ' + r.total + ' Zeilen stimmen. ' + erklaerungen(r.flags));
      } else if (a === 'hilfe') {
        var h = hilfeAnfordern(s);
        sagen('vertrag-hilfe', h ? HILFEN.slice(0, s.hilfe).join(' ') : 'Es gibt keine weitere Hilfe. Lies den Lerntext noch einmal.');
      } else if (a === 'kontrolle') {
        var k = kontrolleAuswerten(s);
        if (k.status === 'fehlend') sagen('kontrolle-ergebnis', 'Bitte beantworte alle drei Fragen.');
        else sagen('kontrolle-ergebnis', k.score + ' von ' + k.total + '. ' + (k.passed ? 'Bestanden.' : 'Noch nicht bestanden. ' + erklaerungen(k.flags)));
      } else if (a === 'neu') {
        neuBeginnen(s);
        auswahlZeigen();
        ergebnisLeeren();
      }
      speichern(storage, s);
    });

    auswahlZeigen();
    ergebnisLeeren();
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Lf1Vertrag = api;
  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', starten);
    else starten();
  }
})(typeof window !== 'undefined' ? window : globalThis);
