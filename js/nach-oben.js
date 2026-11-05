/* Nach oben: globaler Knopf unten rechts, erscheint nach 300 Pixeln Scrollstrecke. Offline, ohne Server. */
(function (root) {
  "use strict";
  var SCHWELLE = 300;
  var ZIEL = "hauptinhalt";
  var FADE_MS = 200;

  function sichtbar(scrollY, schwelle) {
    var s = Number(scrollY);
    var t = schwelle === undefined ? SCHWELLE : Number(schwelle);
    if (!isFinite(s) || !isFinite(t)) return false;
    return s >= t;
  }
  // Angekommen heißt: der Inhaltsanfang steht oben im Fenster, auch wenn der Kopf höher als 300 px ist.
  function angekommen(scrollY, inhaltOffset, toleranz) {
    var y = Number(scrollY);
    var o = Number(inhaltOffset);
    var t = toleranz === undefined ? 8 : Number(toleranz);
    if (!isFinite(y)) return false;
    if (!isFinite(t)) t = 8;
    if (!isFinite(o)) return y <= t;
    return y <= o + t;
  }
  // Erst nach 300 px und erst, wenn der Inhaltsanfang hinter dem Fensterrand liegt. Sonst würde „Nach oben“ nach unten scrollen.
  function zeigen(scrollY, inhaltOffset, schwelle) {
    if (!sichtbar(scrollY, schwelle)) return false;
    if (inhaltOffset === undefined) return true;
    return !angekommen(scrollY, inhaltOffset);
  }
  function verhalten(reduziert) { return reduziert ? "auto" : "smooth"; }
  function zielId() { return ZIEL; }

  // Zustandswechsel des Knopfs: "verborgen" (hidden), "sichtbar", "ausblendend" (Fade-out läuft, hidden folgt danach).
  // Reine Funktion: liefert den neuen Zustand und die auszuführende Aktion, ohne den DOM anzufassen.
  function plan(zustand, soll, reduzierteBewegung) {
    var z = zustand === "sichtbar" || zustand === "ausblendend" ? zustand : "verborgen";
    if (soll) {
      if (z === "verborgen") return { zustand: "sichtbar", aktion: "einblenden" };
      if (z === "ausblendend") return { zustand: "sichtbar", aktion: "abbrechen" };
      return { zustand: "sichtbar", aktion: "nichts" };
    }
    if (z === "sichtbar") {
      return reduzierteBewegung ? { zustand: "verborgen", aktion: "verbergen" } : { zustand: "ausblendend", aktion: "ausblenden" };
    }
    return { zustand: z, aktion: "nichts" };
  }

  var api = { SCHWELLE: SCHWELLE, FADE_MS: FADE_MS, sichtbar: sichtbar, angekommen: angekommen, zeigen: zeigen, verhalten: verhalten, zielId: zielId, plan: plan };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NACH_OBEN = api;
  if (typeof document === "undefined") return;

  var knopf;
  function scrollPosition() {
    var se = document.scrollingElement || document.documentElement;
    return Math.max(root.scrollY || 0, se ? se.scrollTop : 0);
  }
  function reduziert() {
    var el = document.documentElement;
    if (el.classList.contains("ruhige-ansicht") || el.classList.contains("bewegung-reduziert")) return true;
    try { return !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    catch (e) { return false; }
  }
  var zustand = "verborgen";
  var timer = null;
  function timerAbbrechen() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
  }
  function bedienbar(an) {
    knopf.setAttribute("tabindex", an ? "0" : "-1");
    knopf.setAttribute("aria-hidden", an ? "false" : "true");
    if (an) knopf.classList.add("ist-sichtbar");
    else knopf.classList.remove("ist-sichtbar");
  }
  function aktualisiere() {
    if (!knopf) return;
    var soll = zeigen(scrollPosition(), inhaltOffset(), SCHWELLE);
    var p = plan(zustand, soll, reduziert());
    zustand = p.zustand;
    if (p.aktion === "einblenden") {
      timerAbbrechen();
      knopf.hidden = false;
      knopf.setAttribute("tabindex", "-1");
      knopf.setAttribute("aria-hidden", "true");
      platziere();
      // Erst nach einem erzwungenen Reflow sichtbar schalten, sonst entfällt der Fade-in.
      void knopf.offsetWidth;
      bedienbar(true);
    } else if (p.aktion === "abbrechen") {
      timerAbbrechen();
      knopf.hidden = false;
      bedienbar(true);
    } else if (p.aktion === "ausblenden") {
      bedienbar(false);
      timerAbbrechen();
      timer = setTimeout(function () {
        timer = null;
        if (zustand !== "ausblendend") return;
        zustand = "verborgen";
        knopf.hidden = true;
        platziere();
      }, FADE_MS + 30);
    } else if (p.aktion === "verbergen") {
      timerAbbrechen();
      bedienbar(false);
      knopf.hidden = true;
    }
    platziere();
  }
  function rechteck(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  }
  function schneidet(a, b) {
    return a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  }
  function imFenster(box, pad) {
    return box.left >= pad - 0.5 && box.top >= pad - 0.5 && box.right <= root.innerWidth - pad + 0.5 && box.bottom <= root.innerHeight - pad + 0.5;
  }
  function bedienfelder() {
    var liste = document.querySelectorAll("button, input, select, textarea, .nav-toggle, .site-nav a, .site-nav summary, header a, .kopf a, .fuss a");
    var aus = [];
    for (var i = 0; i < liste.length; i++) {
      var el = liste[i];
      if (el === knopf || (el.closest && el.closest(".nach-oben"))) continue;
      if (el.hidden || (el.closest && el.closest("[hidden]"))) continue;
      var stil = root.getComputedStyle(el);
      if (stil.display === "none" || stil.visibility === "hidden" || stil.pointerEvents === "none") continue;
      var r = rechteck(el);
      if (r.width < 8 || r.height < 8) continue;
      if (r.bottom <= 0 || r.top >= root.innerHeight || r.right <= 0 || r.left >= root.innerWidth) continue;
      aus.push(r);
    }
    return aus;
  }
  function platziere() {
    if (!knopf || knopf.hidden) {
      knopf.style.transform = "";
      knopf.style.maxHeight = "";
      return;
    }
    var pad = 8;
    knopf.style.transform = "none";
    knopf.style.maxHeight = "";
    var maxH = Math.max(44, root.innerHeight - pad * 2);
    if (knopf.getBoundingClientRect().height > maxH) knopf.style.maxHeight = maxH + "px";
    var basis = rechteck(knopf);
    var felder = bedienfelder();
    var ecken = [
      { x: root.innerWidth - pad - basis.width, y: root.innerHeight - pad - basis.height },
      { x: pad, y: root.innerHeight - pad - basis.height },
      { x: root.innerWidth - pad - basis.width, y: pad },
      { x: pad, y: pad }
    ];
    var gewaehlt = null;
    for (var i = 0; i < ecken.length; i++) {
      var box = {
        left: ecken[i].x, top: ecken[i].y,
        right: ecken[i].x + basis.width, bottom: ecken[i].y + basis.height,
        width: basis.width, height: basis.height
      };
      if (box.left < pad) box.left = pad;
      if (box.top < pad) box.top = pad;
      box.right = box.left + basis.width;
      box.bottom = box.top + basis.height;
      if (!imFenster(box, pad)) continue;
      var treffer = false;
      for (var j = 0; j < felder.length; j++) if (schneidet(box, felder[j])) { treffer = true; break; }
      if (!treffer) { gewaehlt = box; break; }
    }
    if (!gewaehlt) {
      var x = Math.min(Math.max(pad, ecken[0].x), Math.max(pad, root.innerWidth - pad - basis.width));
      var y = Math.min(Math.max(pad, ecken[0].y), Math.max(pad, root.innerHeight - pad - basis.height));
      gewaehlt = { left: x, top: y, right: x + basis.width, bottom: y + basis.height };
    }
    var dx = Math.round(gewaehlt.left - basis.left);
    var dy = Math.round(gewaehlt.top - basis.top);
    knopf.style.transform = (dx === 0 && dy === 0) ? "" : "translate(" + dx + "px, " + dy + "px)";
  }
  function inhaltOffset() {
    var ziel = document.getElementById(ZIEL);
    if (!ziel) return 0;
    return ziel.getBoundingClientRect().top + scrollPosition();
  }
  function nachOben() {
    var modus = verhalten(reduziert());
    var ziel = document.getElementById(ZIEL);
    if (ziel) {
      ziel.scrollIntoView({ behavior: modus, block: "start" });
      if (!ziel.hasAttribute("tabindex")) ziel.setAttribute("tabindex", "-1");
      try { ziel.focus({ preventScroll: true }); } catch (e) { ziel.focus(); }
    } else {
      root.scrollTo({ top: 0, behavior: modus });
    }
  }
  function start() {
    knopf = document.createElement("button");
    knopf.type = "button";
    knopf.className = "nach-oben";
    knopf.textContent = "Nach oben";
    knopf.hidden = true;
    knopf.setAttribute("tabindex", "-1");
    knopf.setAttribute("aria-hidden", "true");
    knopf.addEventListener("click", nachOben);
    document.body.appendChild(knopf);
    root.addEventListener("scroll", aktualisiere, { passive: true });
    root.addEventListener("resize", aktualisiere, { passive: true });
    document.addEventListener("scroll", aktualisiere, { passive: true, capture: true });
    aktualisiere();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof window !== "undefined" ? window : globalThis);
