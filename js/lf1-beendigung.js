/* LF1-C: Beendigung der Berufsausbildung (Kern + Oberfläche). Keine Fachfreigabe. */
(function (root) {
  'use strict';

  var KEY = 'verwaltung-ausbildung.lf1-beendigung.v1';
  var MAIN = ['c1', 'c2', 'c3', 'c4'];
  var LC = ['lc_frist', 'lc_wechsel', 'lc_zwei'];
  var SOLL = {
    c1: 'klaeren', c2: 'passt', c3: 'klaeren', c4: 'klaeren',
    lc_frist: 'ohne', lc_wechsel: 'vier', lc_zwei: 'unwirksam'
  };
  var WERTE = {
    c1: ['passt', 'klaeren'], c2: ['passt', 'klaeren'],
    c3: ['passt', 'klaeren'], c4: ['passt', 'klaeren'],
    lc_frist: ['ohne', 'vier', 'drei'],
    lc_wechsel: ['ohne', 'vier', 'drei'],
    lc_zwei: ['unwirksam', 'wirksam']
  };
  /* Hilfen enthalten bewusst kein Sollwort. */
  var HILFEN = {
    c1: [
      'Schau auf den Schultag, nicht auf die Form einer Kündigung.',
      'Der Lerntext sagt, wofür der Betrieb freistellen muss. Steht viel Betrieb dort als Ausnahme?',
      'Vergleiche die Begründung des Betriebs mit dem Satz zur Teilnahme am Unterricht.'
    ],
    c2: [
      'Zuerst: In welchem Abschnitt der Ausbildung befindet sich Mira?',
      'Absatz 1 betrifft den Anfang der Ausbildung. Welche Anforderungen stellt er an Frist und Begründung?',
      'Prüfe Zeitpunkt, Form und Unterschrift nacheinander. Fehlt etwas, das das Gesetz verlangt?'
    ],
    c3: [
      'Zuerst: Ist die Anfangszeit schon vorbei?',
      'Absatz 2 regelt, wer danach unter welchen Voraussetzungen kündigen darf. Wer kündigt hier?',
      'Vergleiche die genannte Art der Kündigung mit den beiden Möglichkeiten aus Absatz 2.'
    ],
    c4: [
      'Zuerst: In welcher Form kommt die Kündigung an?',
      'Absatz 3 sagt, welche Form gilt und welche Form ausgeschlossen ist.',
      'Vergleiche die Nachricht im Fall mit dem Satz zur Form. Eine Begründung allein entscheidet die Form nicht.'
    ],
    lc_frist: [
      'Denke an den Absatz, der die Anfangszeit regelt.',
      'Dieser Absatz nennt keine Zeitspanne bis zum Wirksamwerden. Lies, was er stattdessen sagt.'
    ],
    lc_wechsel: [
      'Es geht um Absatz 2, den Teil für Auszubildende.',
      'Dort steht eine Zahl in Wochen für den Fall der Aufgabe oder eines anderen Berufs. Suche sie im Lerntext.'
    ],
    lc_zwei: [
      'Es geht um Absatz 4 und um Zeitspannen.',
      'Zähle nach: Wie lange kennt der Betrieb die Tatsachen schon, und welche Grenze nennt Absatz 4?'
    ]
  };
  var FEHLER = {
    c1: 'Ausbildende haben für die Teilnahme am Berufsschulunterricht freizustellen (§ 15 Absatz 1 Satz 2 Nummer 1). Viel Betrieb am Schalter steht in dem gelesenen Satz nicht als Ausnahme. Das muss geklärt werden.',
    c2: 'In der Probezeit darf ohne Frist und ohne Angabe von Gründen gekündigt werden (Abs. 1), wenn die Schriftform eingehalten ist (Abs. 3). Hier ist beides erfüllt.',
    c3: 'Nach der Probezeit gibt Abs. 2 dem Betrieb nur die Kündigung aus wichtigem Grund ohne Frist. Eine Kündigung mit Frist durch den Betrieb ist dort nicht vorgesehen. Das muss geklärt werden.',
    c4: 'Die Kündigung muss schriftlich erfolgen. Die elektronische Form ist ausgeschlossen (§ 22 Absatz 3). Eine E-Mail erfüllt die gelesene Form nicht, auch wenn Frist und Grund darin stehen.',
    lc_frist: 'In der Probezeit gilt nach Abs. 1: jederzeit, ohne Einhaltung einer Kündigungsfrist.',
    lc_wechsel: 'Wer die Ausbildung aufgeben oder in einen anderen Beruf wechseln will, kündigt nach Abs. 2 mit einer Frist von vier Wochen.',
    lc_zwei: 'Nach Abs. 4 Satz 1 ist eine Kündigung aus wichtigem Grund unwirksam, wenn die Tatsachen der kündigenden Person länger als zwei Wochen bekannt sind. (Im Lernfall vereinfacht, Ausnahmen nicht geprüft.)'
  };

  function neuerZustand() {
    return { antworten: {}, kontrolle: {}, submitted: false, kontrolleSubmitted: false, hilfe: {} };
  }

  function gueltig(id, wert) {
    return !!WERTE[id] && WERTE[id].indexOf(wert) !== -1;
  }

  function setAntwort(z, id, wert) {
    if (MAIN.indexOf(id) === -1 || !gueltig(id, wert)) { return z; }
    z.antworten[id] = wert;
    z.submitted = false;
    return z;
  }

  function setKontrolle(z, id, wert) {
    if (LC.indexOf(id) === -1 || !gueltig(id, wert)) { return z; }
    z.kontrolle[id] = wert;
    z.kontrolleSubmitted = false;
    return z;
  }

  function pruefen(ids, quelle) {
    var fehlend = [], falsch = [], richtig = [];
    ids.forEach(function (id) {
      if (!quelle[id]) { fehlend.push(id); }
      else if (quelle[id] === SOLL[id]) { richtig.push(id); }
      else { falsch.push(id); }
    });
    return { fehlend: fehlend, falsch: falsch, richtig: richtig, alleRichtig: richtig.length === ids.length };
  }

  function auswerten(z) {
    var r = pruefen(MAIN, z.antworten);
    r.fehler = r.falsch.map(function (id) { return { id: id, text: FEHLER[id] }; });
    if (r.fehlend.length === 0) { z.submitted = true; }
    return r;
  }

  function kontrolleAuswerten(z) {
    var r = pruefen(LC, z.kontrolle);
    r.fehler = r.falsch.map(function (id) { return { id: id, text: FEHLER[id] }; });
    if (r.fehlend.length === 0) { z.kontrolleSubmitted = true; }
    return r;
  }

  function hilfeAnfordern(z, id) {
    var liste = HILFEN[id];
    if (!liste) { return ''; }
    var stufe = Math.min((z.hilfe[id] || 0) + 1, liste.length);
    z.hilfe[id] = stufe;
    return liste[stufe - 1];
  }

  function neuBeginnen() { return neuerZustand(); }

  function laden() {
    try {
      var roh = root.localStorage && root.localStorage.getItem(KEY);
      if (!roh) { return neuerZustand(); }
      var z = JSON.parse(roh);
      var n = neuerZustand();
      n.antworten = z.antworten || {};
      n.kontrolle = z.kontrolle || {};
      n.hilfe = z.hilfe || {};
      n.submitted = z.submitted === true;
      n.kontrolleSubmitted = z.kontrolleSubmitted === true;
      return n;
    } catch (e) { return neuerZustand(); }
  }

  function speichern(z) {
    var answers = {};
    MAIN.concat(LC).forEach(function (id) {
      answers[id] = MAIN.indexOf(id) !== -1 ? z.antworten[id] : z.kontrolle[id];
    });
    var fertig = z.submitted === true && z.kontrolleSubmitted === true &&
      MAIN.concat(LC).every(function (id) { return answers[id] === SOLL[id]; });
    var paket = {
      antworten: z.antworten,
      kontrolle: z.kontrolle,
      hilfe: z.hilfe,
      submitted: z.submitted === true,
      kontrolleSubmitted: z.kontrolleSubmitted === true,
      answers: answers,
      finish: fertig
    };
    try { if (root.localStorage) { root.localStorage.setItem(KEY, JSON.stringify(paket)); } return true; }
    catch (e) { return false; }
  }

  var api = {
    KEY: KEY, MAIN: MAIN, LC: LC, SOLL: SOLL,
    neuerZustand: neuerZustand, setAntwort: setAntwort, setKontrolle: setKontrolle,
    auswerten: auswerten, kontrolleAuswerten: kontrolleAuswerten,
    hilfeAnfordern: hilfeAnfordern, neuBeginnen: neuBeginnen,
    laden: laden, speichern: speichern, _hilfen: HILFEN
  };

  /* ---------- Oberfläche ---------- */
  function starten() {
    var doc = root.document;
    var z = laden();

    function el(id) { return doc.getElementById(id); }
    function radios(name) { return doc.querySelectorAll('input[type="radio"][name="' + name + '"]'); }

    function zeigen() {
      MAIN.concat(LC).forEach(function (id) {
        var q = MAIN.indexOf(id) !== -1 ? z.antworten : z.kontrolle;
        Array.prototype.forEach.call(radios(id), function (r) { r.checked = (q[id] === r.value); });
      });
    }
    function leeren() {
      ['beendigung-ergebnis', 'beendigung-hilfe', 'kontrolle-ergebnis'].forEach(function (id) {
        var e = el(id); if (e) { e.textContent = ''; }
      });
    }
    function liste(e, r, okText) {
      if (!e) { return; }
      if (r.fehlend.length) { e.textContent = 'Bitte beantworte zuerst alle Fragen. Offen: ' + r.fehlend.length + '.'; return; }
      if (r.alleRichtig) { e.textContent = okText; return; }
      e.textContent = 'Noch nicht ganz. ' + r.fehler.map(function (f) {
        return f.id.toUpperCase() + ': ' + f.text;
      }).join(' ');
    }

    doc.addEventListener('change', function (ev) {
      var t = ev.target;
      if (!t || t.type !== 'radio') { return; }
      if (MAIN.indexOf(t.name) !== -1) { setAntwort(z, t.name, t.value); var e1 = el('beendigung-ergebnis'); if (e1) { e1.textContent = ''; } }
      else if (LC.indexOf(t.name) !== -1) { setKontrolle(z, t.name, t.value); var e2 = el('kontrolle-ergebnis'); if (e2) { e2.textContent = ''; } }
      speichern(z);
    });

    doc.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('[data-aktion]') : null;
      if (!b) { return; }
      var a = b.getAttribute('data-aktion');
      if (a === 'auswerten') {
        var r = auswerten(z);
        liste(el('beendigung-ergebnis'), r, 'Alle vier Fälle stimmen mit deiner Lesart von § 22 überein. Das ist eine Lernauswertung, keine Rechtsberatung.');
        speichern(z);
      } else if (a === 'hilfe') {
        var offen = MAIN.filter(function (id) { return !z.antworten[id]; });
        var ziel = b.getAttribute('data-aufgabe') || offen[0] || MAIN[0];
        var h = el('beendigung-hilfe');
        if (h) { h.textContent = ziel.toUpperCase() + ': ' + hilfeAnfordern(z, ziel); }
        speichern(z);
      } else if (a === 'neu') {
        z = neuBeginnen(); speichern(z); zeigen(); leeren();
      } else if (a === 'kontrolle') {
        liste(el('kontrolle-ergebnis'), kontrolleAuswerten(z), 'Alle drei Antworten stimmen. Das ist eine Lernkontrolle, keine Fachfreigabe.');
        speichern(z);
      }
    });

    zeigen();
  }

  if (root.document && root.document.body &&
      root.document.body.getAttribute('data-page') === 'lf1-beendigung') {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', starten);
    } else { starten(); }
  }

  root.Lf1Beendigung = api;
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);
