/* Rathaus – Bürgerbüro, Fall B01: Kern und Bewertung.
 * Reine Funktionen: kein DOM, kein Browser-Speicher, kein Netzzugriff.
 * Rechtsquellen: quellen/bmg-b01-2026-11-01.md (lokale Datei).
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_BUERGERBUERO = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var FALL_ID = 'b01';
  var SPEICHER_SCHLUESSEL = 'verwaltung-ausbildung.rathaus.buergerbuero.b01.v1';
  var BEWERTUNGSSTAND = 'b01-2026-11-04-r3';
  var QUELLEN_DATEI = 'quellen/bmg-b01-2026-11-01.md';
  var UEBUNGSANNAHME = 'Das Bürgerbüro Sonnenthal nimmt in dieser Übung Meldesachen entgegen. ' +
    'Das ist keine geprüfte Landesnorm.';
  var FREITEXT_MAX = 2000;

  function opt(id, text, richtig) {
    return { id: id, text: text, richtig: !!richtig };
  }

  var KATALOG = {
    anliegen: {
      art: 'einzel',
      frage: 'Worum geht es bei dem Anliegen?',
      optionen: [
        opt('zuzug', 'Anmeldung nach einem Zuzug', true),
        opt('abmeldung', 'Abmeldung der bisherigen Wohnung', false),
        opt('meldebescheinigung', 'Meldebescheinigung ausstellen', false),
        opt('fuehrungszeugnis', 'Führungszeugnis beantragen', false)
      ]
    },
    einzug: {
      art: 'einzel',
      frage: 'Welches Datum zählt für die Frist?',
      optionen: [
        opt('datum-09-11', 'Das Einzugsdatum: 09.11.2026', true),
        opt('vertragsbeginn', 'Der Beginn des Mietvertrags', false),
        opt('unbekannt', 'Das Datum ist nicht wichtig', false)
      ]
    },
    weitereWohnung: {
      art: 'einzel',
      frage: 'Gibt es weitere Wohnungen?',
      optionen: [
        opt('keine', 'Nein, laut Gespräch bezieht Frau Yilmaz nur diese eine Wohnung', true),
        opt('weitere', 'Ja, es gibt eine weitere Wohnung', false),
        opt('ungefragt', 'Das wurde nicht gefragt und bleibt offen', false)
      ]
    },
    dokumente: {
      art: 'status',
      frage: 'Wie ist der Stand der einzelnen Unterlagen?',
      status: [
        { id: 'passt', text: 'liegt vor und passt' },
        { id: 'kein-ersatz', text: 'liegt vor, ersetzt aber den Nachweis nicht' },
        { id: 'fehlt', text: 'liegt nicht vor' },
        { id: 'unklar', text: 'unklar' }
      ],
      optionen: [
        { id: 'ausweis', text: 'Ausweis', erwartet: 'passt' },
        { id: 'mietvertrag', text: 'Mietvertrag', erwartet: 'kein-ersatz' },
        { id: 'bestaetigung', text: 'Bestätigung des Wohnungsgebers', erwartet: 'fehlt' },
        { id: 'merkmal', text: 'Elektronisches Zuordnungsmerkmal', erwartet: 'fehlt' }
      ]
    },
    regeln: {
      art: 'mehrfach',
      frage: 'Welche Regeln und Zuständigkeiten gehören zum Fall?',
      optionen: [
        opt('bmg17', 'Anmeldung innerhalb von zwei Wochen nach dem Einzug (§ 17 BMG)', true),
        opt('bmg19', 'Mitwirkung des Wohnungsgebers und Mitteilung bei fehlender Bestätigung (§ 19 BMG)', true),
        opt('bmg23', 'Vorlage von Ausweis und Bestätigung oder Zuordnungsmerkmal (§ 23 BMG)', true),
        opt('ortskarte', 'Übungsannahme: Das Bürgerbüro Sonnenthal nimmt die Meldesache entgegen', true)
      ]
    },
    fallen: {
      art: 'einzel',
      frage: 'Welche dieser Aussagen trifft im Fall von Frau Yilmaz zu?',
      optionen: [
        opt('abmeldung-pflicht', 'Frau Yilmaz muss sich zuerst bei ihrer alten Stadt abmelden', false),
        opt('gebuehr', 'Für die Anmeldung muss eine bestimmte Gebühr bezahlt werden', false),
        opt('ablehnung-ohne-nachweis', 'Ohne Bestätigung kann der Antrag sofort abgelehnt werden', false),
        opt('keine', 'Keine dieser Aussagen trifft zu.', true)
      ]
    },
    vorbereitung: {
      art: 'einzel',
      frage: 'Wie wird die weitere Bearbeitung vorbereitet?',
      optionen: [
        opt('mitteilung-klaerung', 'Die Mitteilung aufnehmen und den Fall zur weiteren Klärung vorbereiten', true),
        opt('abgelehnt', 'Den Fall als abgelehnt eintragen', false),
        opt('erledigt', 'Den Fall als erledigt eintragen', false),
        opt('wegschicken', 'Frau Yilmaz ohne Eintrag wieder wegschicken', false),
        opt('zuwarten', 'Nichts eintragen und abwarten', false)
      ]
    },
    bausteine: {
      art: 'mehrfach',
      frage: 'Welche Bausteine gehören in die Antwort an Frau Yilmaz?',
      optionen: [
        { id: 'anliegen', text: 'Ich habe verstanden: Sie möchten Ihren Zuzug nach Sonnenthal anmelden.', erforderlich: true },
        { id: 'nachweis-fehlt', text: 'Für die Anmeldung fehlt noch die Bestätigung des Wohnungsgebers oder das elektronische Zuordnungsmerkmal. Der Mietvertrag ersetzt sie nicht.', erforderlich: true },
        { id: 'mitteilung-aufgenommen', text: 'Ihre Mitteilung, dass Sie die Bestätigung noch nicht haben, nehmen wir auf.', erforderlich: true },
        { id: 'naechster-schritt', text: 'Als Nächstes bitten Sie Ihren Wohnungsgeber um die Bestätigung. Wir bereiten die weitere Bearbeitung vor.', erforderlich: true },
        { id: 'nicht-abgeschlossen', text: 'Ihre Anmeldung ist mit dieser Beratung noch nicht abgeschlossen.', erforderlich: true },
        { id: 'anmeldung-abgeschlossen', text: 'Ihre Anmeldung ist hiermit erledigt.', verboten: true },
        { id: 'gebuehr', text: 'Für die Anmeldung zahlen Sie eine Gebühr.', verboten: true },
        { id: 'bestaetigung-erfunden', text: 'Die Bestätigung des Wohnungsgebers haben wir bereits selbst ausgestellt.', verboten: true },
        { id: 'mietvertrag-reicht', text: 'Ihr Mietvertrag reicht als Nachweis aus.', verboten: true }
      ]
    }
  };

  function kopie(x) { return JSON.parse(JSON.stringify(x)); }
  function katalog() { return kopie(KATALOG); }

  function fallListe() {
    return [
      { id: 'b01', titel: 'Neu in Sonnenthal – reicht mein Mietvertrag?', startbar: true },
      { id: 'b02', titel: 'Meldebescheinigung für die eigene Person', startbar: true },
      { id: 'b03', titel: 'Führungszeugnis für einen privaten Arbeitgeber', startbar: true },
      { id: 'b04', titel: 'Auskunftssperre im Melderegister', startbar: true }
    ];
  }

  function fallDaten() {
    return {
      fallId: FALL_ID,
      titel: 'Neu in Sonnenthal – reicht mein Mietvertrag?',
      bewertungsstand: BEWERTUNGSSTAND,
      person: { name: 'Samira Yilmaz', alter: 22, fiktiv: true },
      einzug: '09.11.2026',
      vorsprache: '12.11.2026',
      anliegenText: 'Guten Tag, ich bin neu in Sonnenthal und möchte mich hier anmelden. ' +
        'Meinen Ausweis und meinen Mietvertrag habe ich dabei. Reicht das?',
      uebungsannahme: UEBUNGSANNAHME,
      hinweis: 'Die Anmeldung ist mit der Beratung nicht abgeschlossen.',
      quelle: QUELLEN_DATEI
    };
  }

  function istText(x) { return typeof x === 'string'; }
  function ids(kat) { return kat.optionen.map(function (o) { return o.id; }); }

  function normalisiere(eingabe) {
    var e = (eingabe && typeof eingabe === 'object' && !Array.isArray(eingabe)) ? eingabe : {};
    function einzel(key) {
      return istText(e[key]) && ids(KATALOG[key]).indexOf(e[key]) >= 0 ? e[key] : null;
    }
    function mehrfach(key) {
      var liste = Array.isArray(e[key]) ? e[key] : [];
      var out = [];
      liste.forEach(function (v) {
        if (istText(v) && ids(KATALOG[key]).indexOf(v) >= 0 && out.indexOf(v) < 0) out.push(v);
      });
      return out;
    }
    var dok = {};
    var roh = (e.dokumente && typeof e.dokumente === 'object') ? e.dokumente : {};
    var stat = KATALOG.dokumente.status.map(function (s) { return s.id; });
    ids(KATALOG.dokumente).forEach(function (id) {
      if (istText(roh[id]) && stat.indexOf(roh[id]) >= 0) dok[id] = roh[id];
    });
    return {
      anliegen: einzel('anliegen'),
      einzug: einzel('einzug'),
      weitereWohnung: einzel('weitereWohnung'),
      dokumente: dok,
      regeln: mehrfach('regeln'),
      // Einfachauswahl; alte Listen (frühere Mehrfachauswahl) ergeben bewusst keine Antwort.
      fallen: einzel('fallen'),
      vorbereitung: einzel('vorbereitung'),
      bausteine: mehrfach('bausteine'),
      freitext: istText(e.freitext) ? e.freitext.slice(0, FREITEXT_MAX) : ''
    };
  }

  function eingabeVersion(eingabe) {
    var n = normalisiere(eingabe);
    var dok = ids(KATALOG.dokumente).map(function (id) { return id + ':' + (n.dokumente[id] || '-'); });
    return [
      'anliegen=' + (n.anliegen || '-'),
      'einzug=' + (n.einzug || '-'),
      'weitere=' + (n.weitereWohnung || '-'),
      'dok=' + dok.join(','),
      'regeln=' + n.regeln.slice().sort().join(','),
      'fallen=' + (n.fallen || '-'),
      'vorb=' + (n.vorbereitung || '-'),
      'bausteine=' + n.bausteine.slice().sort().join(','),
      'freitext=' + n.freitext
    ].join('|');
  }

  /* Prüft rohe Eingabe auf unbekannte Werte (vor der Normalisierung). */
  function ungueltigeWerte(eingabe) {
    var e = (eingabe && typeof eingabe === 'object') ? eingabe : {};
    var liste = [];
    ['anliegen', 'einzug', 'weitereWohnung', 'vorbereitung', 'fallen'].forEach(function (k) {
      if (e[k] !== undefined && e[k] !== null && e[k] !== '' &&
          !(istText(e[k]) && ids(KATALOG[k]).indexOf(e[k]) >= 0)) liste.push(k);
    });
    ['regeln', 'bausteine'].forEach(function (k) {
      if (e[k] === undefined || e[k] === null) return;
      if (!Array.isArray(e[k])) { liste.push(k); return; }
      e[k].forEach(function (v) {
        if (!(istText(v) && ids(KATALOG[k]).indexOf(v) >= 0)) liste.push(k);
      });
    });
    if (e.dokumente !== undefined && e.dokumente !== null) {
      if (typeof e.dokumente !== 'object' || Array.isArray(e.dokumente)) liste.push('dokumente');
      else {
        var stat = KATALOG.dokumente.status.map(function (s) { return s.id; });
        Object.keys(e.dokumente).forEach(function (k) {
          if (ids(KATALOG.dokumente).indexOf(k) < 0 || stat.indexOf(e.dokumente[k]) < 0) liste.push('dokumente');
        });
      }
    }
    return liste.filter(function (v, i) { return liste.indexOf(v) === i; });
  }

  function bereich(status, hinweise, sperren) {
    return { status: status, hinweise: hinweise || [], sperren: sperren || [] };
  }

  function istUngueltig(ungueltig, keys) {
    return ungueltig.some(function (k) { return keys.indexOf(k) >= 0; });
  }

  /* Gemeinsame Auswertung eines Bereichs mit den Zuständen offen / unvollständig / falsch / richtig.
   * Die Hinweise nennen nur den Abschnitt, nie die richtige Lösung. */
  function bewerteBereich(name, abschnitt, angaben, unvollstaendig, falsch, sperren) {
    var beantwortet = angaben.filter(Boolean).length;
    if (!beantwortet) return bereich('offen', ['Im Abschnitt ' + abschnitt + ' (' + name + ') ist noch nichts ausgewählt.']);
    if (unvollstaendig) {
      return bereich('unvollstaendig', ['Im Abschnitt ' + abschnitt + ' (' + name + ') fehlen noch Angaben.'], sperren);
    }
    if (falsch) {
      return bereich('falsch', ['Im Abschnitt ' + abschnitt + ' (' + name + ') ist alles beantwortet, aber mindestens eine Einordnung stimmt noch nicht. Prüfe diesen Abschnitt erneut.'], sperren);
    }
    return bereich('richtig', ['Der Abschnitt ' + abschnitt + ' (' + name + ') ist richtig bearbeitet.']);
  }

  /* Bereich Unterlagen: nur die vier Dokumente. */
  function pruefeUnterlagen(n, ungueltig) {
    if (istUngueltig(ungueltig, ['dokumente'])) {
      return bereich('ungueltig', ['Mindestens eine Angabe bei den Unterlagen ist ungültig.']);
    }
    var dok = KATALOG.dokumente.optionen;
    var angaben = dok.map(function (o) { return n.dokumente[o.id]; });
    var unvollstaendig = angaben.some(function (v) { return !v; });
    var falsch = dok.some(function (o) { return n.dokumente[o.id] !== o.erwartet; });
    var sperren = [];
    if (n.dokumente.mietvertrag === 'passt') {
      sperren.push('Eine Unterlage wurde so eingeordnet, dass der Nachweis fälschlich als erbracht gilt.');
    }
    return bewerteBereich('Unterlagen', '2', angaben, unvollstaendig, falsch, sperren);
  }

  /* Bereich Anliegen: Anliegen, Einzugsdatum, weitere Wohnung. */
  function pruefeAnliegen(n, ungueltig) {
    if (istUngueltig(ungueltig, ['anliegen', 'einzug', 'weitereWohnung'])) {
      return bereich('ungueltig', ['Mindestens eine Angabe beim Anliegen ist ungültig.']);
    }
    var angaben = [n.anliegen, n.einzug, n.weitereWohnung];
    var unvollstaendig = angaben.some(function (v) { return !v; });
    var falsch = n.anliegen !== 'zuzug' || n.einzug !== 'datum-09-11' || n.weitereWohnung !== 'keine';
    return bewerteBereich('Anliegen', '1', angaben, unvollstaendig, falsch);
  }

  /* Bereich Regeln: vier richtige Regeln (Mehrfachauswahl) und die Einfachfrage zu den Aussagen.
   * Keine Auswahl bei der Einfachfrage bedeutet "noch nicht beantwortet", nie "richtig".
   * Die Hinweise nennen nur den Abschnitt, nie die richtige Lösung. */
  function pruefeRegeln(n, ungueltig) {
    if (istUngueltig(ungueltig, ['regeln', 'fallen'])) {
      return bereich('ungueltig', ['Mindestens eine Angabe bei den Regeln ist ungültig.']);
    }
    var soll = KATALOG.regeln.optionen.filter(function (o) { return o.richtig; });
    var regelnFehlen = soll.some(function (o) { return n.regeln.indexOf(o.id) < 0; });
    var regelnFalsch = n.regeln.some(function (r) {
      return !soll.some(function (o) { return o.id === r; });
    });
    if (!n.regeln.length && !n.fallen) {
      return bereich('offen', ['Im Abschnitt 3 (Regeln) ist noch nichts ausgewählt.']);
    }
    var hinweise = [];
    var sperren = [];
    var falschEingeordnet = Boolean(n.fallen) && n.fallen !== 'keine';
    if (falschEingeordnet) {
      hinweise.push('Bei der Frage nach den Aussagen im Abschnitt 3 (Regeln) wurde eine Aussage als zutreffend gewählt, die nicht zutrifft. Prüfe sie noch einmal anhand der Unterlagen und Regeln.');
      sperren.push('Eine unzutreffende Aussage wurde als zutreffend eingeordnet.');
    }
    if (regelnFalsch) hinweise.push('Bei den Regeln im Abschnitt 3 stimmt mindestens eine Einordnung nicht.');
    if (regelnFehlen) hinweise.push('Bei den Regeln im Abschnitt 3 fehlen noch Angaben.');
    if (!n.fallen) hinweise.push('Die Frage nach den Aussagen im Abschnitt 3 ist noch nicht beantwortet. Keine Auswahl gilt nicht als Antwort.');
    if (falschEingeordnet || regelnFalsch) return bereich('falsch', hinweise, sperren);
    if (regelnFehlen || !n.fallen) return bereich('unvollstaendig', hinweise);
    return bereich('richtig', ['Der Abschnitt 3 (Regeln) ist richtig bearbeitet.']);
  }

  function pruefeVorbereitung(n, ungueltig) {
    if (ungueltig.indexOf('vorbereitung') >= 0) return bereich('ungueltig', ['Die Auswahl ist ungültig.']);
    if (!n.vorbereitung) return bereich('offen', ['Noch nichts ausgewählt.']);
    if (n.vorbereitung === 'mitteilung-klaerung') {
      return bereich('richtig', ['Der Abschnitt 4 (Vorbereitung) ist richtig bearbeitet.']);
    }
    var sperren = [];
    if (n.vorbereitung === 'abgelehnt' || n.vorbereitung === 'erledigt') {
      sperren.push('Der Fall darf nicht als abgelehnt oder erledigt eingetragen werden.');
    }
    return bereich('falsch', ['Die gewählte Vorbereitung stimmt noch nicht mit dem Fall überein. Prüfe den Abschnitt 4 (Vorbereitung) erneut.'], sperren);
  }

  function pruefeAntwort(n, ungueltig) {
    if (ungueltig.indexOf('bausteine') >= 0) return bereich('ungueltig', ['Mindestens ein Baustein ist ungültig.']);
    if (!n.bausteine.length) return bereich('offen', ['Noch kein Baustein ausgewählt.']);
    var erforderlich = KATALOG.bausteine.optionen.filter(function (o) { return o.erforderlich; }).map(function (o) { return o.id; });
    var verboten = KATALOG.bausteine.optionen.filter(function (o) { return o.verboten; }).map(function (o) { return o.id; });
    var sperren = [];
    var hin = [];
    var vorhanden = verboten.filter(function (id) { return n.bausteine.indexOf(id) >= 0; });
    if (n.bausteine.indexOf('anmeldung-abgeschlossen') >= 0) {
      sperren.push('Die Antwort darf nicht sagen, die Anmeldung sei erledigt.');
    }
    if (vorhanden.length) {
      hin.push('Die Antwort enthält mindestens eine Aussage, die nicht stimmt oder nicht belegt ist.');
      return bereich('falsch', hin, sperren);
    }
    var fehlend = erforderlich.filter(function (id) { return n.bausteine.indexOf(id) < 0; });
    if (fehlend.length) {
      return bereich('unvollstaendig', ['In der Antwort fehlt noch mindestens ein wichtiger Teil.']);
    }
    return bereich('richtig', ['Die Antwort enthält alle wichtigen Teile und keine falschen Aussagen.']);
  }

  function auswertung(eingabe) {
    var ungueltig = ungueltigeWerte(eingabe);
    var n = normalisiere(eingabe);
    var b = {
      anliegen: pruefeAnliegen(n, ungueltig),
      unterlagen: pruefeUnterlagen(n, ungueltig),
      regeln: pruefeRegeln(n, ungueltig),
      vorbereitung: pruefeVorbereitung(n, ungueltig),
      antwort: pruefeAntwort(n, ungueltig)
    };
    var sperren = [];
    var bestanden = true;
    Object.keys(b).forEach(function (k) {
      sperren = sperren.concat(b[k].sperren);
      if (b[k].status !== 'richtig') bestanden = false;
    });
    return {
      fallId: FALL_ID,
      bewertungsstand: BEWERTUNGSSTAND,
      eingabeVersion: eingabeVersion(eingabe),
      bereiche: b,
      sperren: sperren,
      bestanden: bestanden,
      darfAbschliessen: bestanden && sperren.length === 0,
      freitext: { text: n.freitext, automatischGeprueft: false }
    };
  }

  function hilfe(stufe) {
    if (stufe === 1) {
      return 'Gehen Sie in Ruhe vor: Was möchte Frau Yilmaz? Welche Unterlagen liegen vor, ' +
        'welche fehlen? Danach überlegen Sie, was Sie notieren und was Sie ihr antworten.';
    }
    if (stufe === 2) {
      return 'Schauen Sie auf das Einzugsdatum und nicht auf den Beginn des Mietvertrags. ' +
        'Fragen Sie sich, wer die Einzugsbestätigung ausstellen darf und woran Sie ein elektronisches ' +
        'Zuordnungsmerkmal erkennen. Prüfen Sie, ob der Mietvertrag diese Bestätigung ersetzen kann.';
    }
    if (stufe === 3) {
      return 'Eine gute Antwort hat vier Teile: erst das Anliegen in eigenen Worten wiedergeben, ' +
        'dann klar sagen, was fehlt, dann sagen, was Sie aufnehmen und vorbereiten, und zuletzt ' +
        'ehrlich festhalten, dass die Anmeldung noch nicht abgeschlossen ist. Versprechen Sie nichts, ' +
        'was nicht geprüft ist.';
    }
    return '';
  }

  function lehrkraft() {
    return {
      warnung: 'Diese lokale Lehrkraftansicht ist keine Zugriffssicherung.',
      sachverhalt: 'Samira Yilmaz (22, fiktiv) möchte ihren Zuzug anmelden. Ausweis und Mietvertrag liegen ' +
        'vor. Die Wohnungsgeberbestätigung und das elektronische Zuordnungsmerkmal fehlen. Einzug: 09.11.2026, ' +
        'Vorsprache: 12.11.2026.',
      lernziele: [
        'Das Anliegen erkennen und die Frist am Einzugsdatum festmachen.',
        'Erkennen, dass der Mietvertrag die Bestätigung des Wohnungsgebers nicht ersetzt.',
        'Die Mitteilung über die fehlende Bestätigung aufnehmen.',
        'Die weitere Bearbeitung vorbereiten, ohne den Fall als erledigt oder abgelehnt zu führen.',
        'Eine ehrliche, verständliche Antwort ohne erfundene Gebühren formulieren.'
      ],
      typischeFehler: [
        'Den Mietvertrag als ausreichenden Nachweis werten.',
        'Den Fall ablehnen oder als erledigt eintragen.',
        'Der Bürgerin sagen, die Anmeldung sei abgeschlossen.',
        'Gebühren oder Abmeldepflichten erfinden.',
        'Alle Antwortbausteine ankreuzen, ohne zu unterscheiden.'
      ],
      musterantwort: 'Ich habe verstanden, dass Sie Ihren Zuzug anmelden möchten. Für die Anmeldung brauchen ' +
        'wir noch die Bestätigung Ihres Wohnungsgebers oder das elektronische Zuordnungsmerkmal; der ' +
        'Mietvertrag ersetzt sie nicht. Ihre Mitteilung, dass Sie die Bestätigung noch nicht haben, nehme ' +
        'ich auf und bereite die weitere Bearbeitung vor. Bitte bitten Sie Ihren Wohnungsgeber um die ' +
        'Bestätigung. Die Anmeldung ist mit dieser Beratung noch nicht abgeschlossen.',
      kriterien: [
        'Anliegen und Regeln: Zuzug, Einzugsdatum, eine Wohnung; vier Regeln, keine Falle.',
        'Unterlagen: Ausweis passt, Mietvertrag kein Ersatz, Bestätigung und Merkmal fehlen.',
        'Vorbereitung: Mitteilung aufnehmen und zur Klärung vorbereiten.',
        'Antwort: alle erforderlichen Teile, keine verbotene Aussage.',
        'Freitext wird gespeichert und angezeigt, aber nicht automatisch bewertet.'
      ],
      quellen: {
        datei: QUELLEN_DATEI,
        normen: ['§ 1 BMG', '§ 17 BMG', '§ 19 BMG', '§ 23 BMG', '§ 24 BMG'],
        uebungsannahme: UEBUNGSANNAHME,
        luecke: 'Die baden-württembergische Landesnorm zur Meldebehörde wurde nicht gelesen.'
      }
    };
  }

  function nachschlagen() {
    return {
      titel: 'Nachschlagekarte Meldewesen',
      themen: [
        { titel: 'Meldebehörde', text: 'Meldebehörden sind die Behörden, die das Landesrecht dazu bestimmt (§ 1 BMG). In dieser Übung nimmt das Bürgerbüro Sonnenthal Meldesachen entgegen; das ist eine Übungsannahme.' },
        { titel: 'Einzug und Vertragsbeginn', text: 'Die Anmeldefrist von zwei Wochen beginnt mit dem Einzug (§ 17 BMG). Der Beginn des Mietvertrags kann ein anderer Tag sein.' },
        { titel: 'Wohnungsgeber', text: 'Der Wohnungsgeber muss bei der Anmeldung mitwirken und den Einzug bestätigen (§ 19 BMG).' },
        { titel: 'Bestätigung und Zuordnungsmerkmal', text: 'Zur Anmeldung gehören Ausweis und die Bestätigung des Wohnungsgebers oder das Zuordnungsmerkmal (§ 23 BMG). Erhält jemand die Bestätigung nicht rechtzeitig, teilt die Person das der Meldebehörde unverzüglich mit (§ 19 BMG).' },
        { titel: 'Anmeldung und Meldebestätigung', text: 'Die amtliche Meldebestätigung gibt es erst, wenn die Anmeldung durchgeführt ist (§ 24 BMG).' }
      ],
      quelle: 'Quelle: lokale Datei ' + QUELLEN_DATEI + '. ' + UEBUNGSANNAHME
    };
  }

  function leereSicht(verworfen, eingaben) {
    return { verworfen: verworfen, eingaben: eingaben, letzteAuswertung: null, abgeschlossen: false };
  }

  function bereinigeGespeichert(roh) {
    var obj = roh;
    if (istText(roh)) {
      try { obj = JSON.parse(roh); } catch (err) { return leereSicht(true, normalisiere({})); }
    }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return leereSicht(true, normalisiere({}));
    var eingaben = normalisiere(obj.eingaben);
    if (obj.fallId !== FALL_ID || obj.bewertungsstand !== BEWERTUNGSSTAND) {
      return leereSicht(true, eingaben);
    }
    var neu = obj.letzteAuswertung ? auswertung(eingaben) : null;
    // Eine gespeicherte Auswertung gilt nur für genau die Eingaben (inkl. Freitext), für die sie erstellt wurde.
    var gespeicherteVersion = obj.letzteAuswertung && obj.letzteAuswertung.eingabeVersion;
    if (neu && istText(gespeicherteVersion) && gespeicherteVersion !== neu.eingabeVersion) neu = null;
    return {
      verworfen: false,
      eingaben: eingaben,
      letzteAuswertung: neu,
      abgeschlossen: obj.abgeschlossen === true && !!neu && neu.darfAbschliessen
    };
  }

  function resetText() {
    return 'Dies setzt nur den Übungsfall B01 mit Samira Yilmaz zurück. Luca, Noelle und die anderen ' +
      'Ämter bleiben unverändert.';
  }

  return {
    FALL_ID: FALL_ID,
    SPEICHER_SCHLUESSEL: SPEICHER_SCHLUESSEL,
    BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    fallListe: fallListe,
    fallDaten: fallDaten,
    katalog: katalog,
    normalisiere: normalisiere,
    eingabeVersion: eingabeVersion,
    auswertung: auswertung,
    hilfe: hilfe,
    lehrkraft: lehrkraft,
    nachschlagen: nachschlagen,
    bereinigeGespeichert: bereinigeGespeichert,
    resetText: resetText
  };
}));
