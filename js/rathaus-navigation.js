/* Virtuelles Rathaus, Navigationsmodell. Reine Funktionen: kein DOM, kein localStorage.
 * Die Lehrkraftansicht gehört keinem Amt. Eine zentrale Lehrkraftverwaltung ist nicht Teil dieser Stufe.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_NAVIGATION = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ANSICHTEN = ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "buerger", "buerger-karte", "lehrkraft"];
  var HASH_ANSICHTEN = ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "buerger", "buerger-karte"];
  var PERSONAL_ANSICHTEN = ["personal", "post", "akte", "vorgang", "nachschlagen"];
  var BUERGER_ANSICHTEN = ["buerger", "buerger-karte"];
  var STADT_LABEL = "Stadtverwaltung";
  var RUECK_LABEL = "Zur Stadtübersicht";

  var AEMTER = [
    { id: "personal", titel: "Personalamt", benutzbar: true, ansicht: "personal", beschreibung: "Ausbildungsverhältnisse, Akten und der erste bearbeitbare Vorgang." },
    { id: "buergerbuero", titel: "Bürgerbüro", benutzbar: true, ansicht: "buerger", beschreibung: "Schalter und Anliegen der Einwohnerschaft. Erster Fall: Anmeldung nach einem Zuzug." },
    { id: "ordnungsamt", titel: "Ordnungsamt", benutzbar: false, ansicht: null, beschreibung: "Ordnung und Genehmigungen." },
    { id: "stadtkasse", titel: "Stadtkasse", benutzbar: false, ansicht: null, beschreibung: "Zahlungen und Gebühren." }
  ];

  var TITEL = {
    stadt: "Stadtübersicht",
    personal: "Personalamt",
    post: "Posteingang",
    akte: "Ausbildungsakte",
    vorgang: "Vorgang",
    nachschlagen: "Nachschlagen",
    buerger: "Bürgerbüro",
    "buerger-karte": "Nachschlagen",
    lehrkraft: "Lehrkraftansicht"
  };

  function istAnsicht(wert) {
    return typeof wert === "string" && ANSICHTEN.indexOf(wert) !== -1;
  }

  function hashZuAnsicht(hash) {
    if (typeof hash !== "string") return null;
    var name = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    return HASH_ANSICHTEN.indexOf(name) !== -1 ? name : null;
  }

  function aemter() {
    return AEMTER.map(function (amt) {
      return {
        id: amt.id,
        titel: amt.titel,
        benutzbar: amt.benutzbar,
        ansicht: amt.ansicht,
        beschreibung: amt.beschreibung
      };
    });
  }

  // Zweites Argument nur für das Bürgerbüro: "uebersicht" zeigt die Fallübersicht, sonst gilt Fall B01.
  function brotkrumen(ansicht, modus) {
    var stadt = { label: STADT_LABEL, ziel: "stadt" };
    if (ansicht === "stadt") return [{ label: STADT_LABEL, ziel: null }];
    if (ansicht === "lehrkraft") return [stadt, { label: TITEL.lehrkraft, ziel: null }];
    if (ansicht === "personal") return [stadt, { label: TITEL.personal, ziel: null }];
    if (ansicht === "buerger") {
      if (modus === "uebersicht") return [stadt, { label: TITEL.buerger, ziel: null }];
      return [stadt, { label: TITEL.buerger, ziel: "buerger", modus: "uebersicht" }, { label: "Fall B01", ziel: null }];
    }
    if (ansicht === "buerger-karte") {
      return [stadt, { label: TITEL.buerger, ziel: "buerger", modus: "uebersicht" }, { label: TITEL["buerger-karte"], ziel: null }];
    }
    if (ansicht === "post" || ansicht === "akte" || ansicht === "vorgang" || ansicht === "nachschlagen") {
      return [stadt, { label: TITEL.personal, ziel: "personal" }, { label: TITEL[ansicht], ziel: null }];
    }
    return [{ label: STADT_LABEL, ziel: null }];
  }

  function rueckziel(ansicht) {
    if (!istAnsicht(ansicht) || ansicht === "stadt") return null;
    return { ansicht: "stadt", label: RUECK_LABEL };
  }

  function personalUnternavigation(ansicht) {
    if (PERSONAL_ANSICHTEN.indexOf(ansicht) === -1) return [];
    return [
      { ansicht: "personal", label: "Übersicht Personalamt" },
      { ansicht: "post", label: "Posteingang" },
      { ansicht: "akte", label: "Ausbildungsakte" },
      { ansicht: "vorgang", label: "Vorgang" },
      { ansicht: "nachschlagen", label: "Nachschlagen" }
    ].map(function (eintrag) {
      eintrag.aktuell = eintrag.ansicht === ansicht;
      return eintrag;
    });
  }

  // Kompakte Unternavigation des Bürgerbüros mit Textlabels. Zweites Argument wie bei brotkrumen().
  function buergerUnternavigation(ansicht, modus) {
    if (BUERGER_ANSICHTEN.indexOf(ansicht) === -1) return [];
    var fall = ansicht === "buerger" && modus !== "uebersicht";
    return [
      { ansicht: "buerger", modus: "uebersicht", label: "Übersicht", aktuell: ansicht === "buerger" && modus === "uebersicht" },
      { ansicht: "buerger", modus: "fall", label: "Fall B01", aktuell: fall },
      { ansicht: "buerger-karte", modus: null, label: "Nachschlagen", aktuell: ansicht === "buerger-karte" }
    ];
  }

  // Aktuelle Rathausebene für die Leiste: "stadt", "personal", "buerger" oder null (Lehrkraftansicht).
  function leistenEbene(ansicht) {
    if (ansicht === "stadt") return "stadt";
    if (PERSONAL_ANSICHTEN.indexOf(ansicht) !== -1) return "personal";
    if (BUERGER_ANSICHTEN.indexOf(ansicht) !== -1) return "buerger";
    return null;
  }

  // Die Sieben-Schritte-Anzeige gehört zu genau einem Vorgang. Sie erscheint nur in Akte und Vorgang,
  // nicht in Stadtübersicht, Amtsübersicht, Posteingang (zwei Vorgänge), Nachschlagekarte oder Lehrkraftansicht.
  var FORTSCHRITT_ANSICHTEN = ["akte", "vorgang"];
  function fortschrittSichtbar(ansicht) {
    return FORTSCHRITT_ANSICHTEN.indexOf(ansicht) !== -1;
  }

  // Lehrkraftmodus umschalten. Gibt nur die zwei betroffenen Felder zurück und verändert nichts.
  function lehrkraftUmschalten(ansicht, lehrkraftAn) {
    if (!lehrkraftAn) return { lehrkraft: true, ansicht: "lehrkraft" };
    return { lehrkraft: false, ansicht: ansicht === "lehrkraft" || !istAnsicht(ansicht) ? "stadt" : ansicht };
  }

  // Gespeicherte Ansicht nach dem Laden: keine gesperrte Lehrkraftansicht ohne Lehrkraftmodus.
  function ansichtNachLaden(ansicht, lehrkraftAn) {
    if (!istAnsicht(ansicht)) return "stadt";
    if (ansicht === "lehrkraft" && !lehrkraftAn) return "stadt";
    return ansicht;
  }

  return {
    ANSICHTEN: ANSICHTEN.slice(),
    HASH_ANSICHTEN: HASH_ANSICHTEN.slice(),
    istAnsicht: istAnsicht,
    hashZuAnsicht: hashZuAnsicht,
    aemter: aemter,
    brotkrumen: brotkrumen,
    rueckziel: rueckziel,
    personalUnternavigation: personalUnternavigation,
    buergerUnternavigation: buergerUnternavigation,
    leistenEbene: leistenEbene,
    fortschrittSichtbar: fortschrittSichtbar,
    lehrkraftUmschalten: lehrkraftUmschalten,
    ansichtNachLaden: ansichtNachLaden
  };
});
