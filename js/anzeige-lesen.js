/* Anzeige & Lesen: Textgröße, Abstände, Darstellung, ruhige Ansicht. Offline, ohne Server. */
(function (root) {
  "use strict";
  var KEY = "verwaltung-ausbildung.anzeige.v1";
  var THEMES = ["hell", "dunkel", "kontrast"];
  var defaults = { text: 100, spacing: false, theme: "hell", ruhig: false };
  var TEXT_MIN = 80, TEXT_MAX = 150, TEXT_STEP = 10;

  function clampText(v) {
    var n = Number(v);
    if (!isFinite(n)) return defaults.text;
    n = Math.round(n / TEXT_STEP) * TEXT_STEP;
    return Math.min(TEXT_MAX, Math.max(TEXT_MIN, n));
  }
  function normalisiere(saved) {
    var merged = Object.assign({}, defaults, saved && typeof saved === "object" ? saved : {});
    merged.text = clampText(merged.text);
    if (THEMES.indexOf(merged.theme) < 0) merged.theme = defaults.theme;
    merged.spacing = !!merged.spacing;
    merged.ruhig = !!merged.ruhig;
    return merged;
  }
  function ableiten(einstellung, systemRuhig) {
    var scale = einstellung.text / 100;
    if (!isFinite(scale) || scale <= 0) scale = 1;
    return {
      scale: String(scale),
      theme: einstellung.theme,
      mehrAbstand: !!einstellung.spacing,
      ruhig: !!einstellung.ruhig || !!systemRuhig
    };
  }

  var api = { KEY: KEY, defaults: defaults, clampText: clampText, normalisiere: normalisiere, ableiten: ableiten };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ANZEIGE_LESEN = api;
  if (typeof document === "undefined") return;

  var current;
  var systemReduceMotion = false;
  function load() {
    try { return normalisiere(JSON.parse(root.localStorage.getItem(KEY) || "null")); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function apply() {
    var d = ableiten(current, systemReduceMotion);
    var el = document.documentElement;
    el.style.setProperty("--text-scale", d.scale);
    el.dataset.theme = d.theme;
    el.classList.toggle("mehr-abstand", d.mehrAbstand);
    el.classList.toggle("ruhige-ansicht", d.ruhig);
  }
  function save() {
    apply();
    try { root.localStorage.setItem(KEY, JSON.stringify(current)); } catch (e) { /* Seite bleibt nutzbar. */ }
  }
  function addControl() {
    var box = document.createElement("details");
    box.className = "leseoptionen";
    var summary = document.createElement("summary");
    summary.textContent = "Anzeige & Lesen";
    box.appendChild(summary);
    var panel = document.createElement("div");
    panel.className = "leseoptionen-inhalt";

    var sizeLabel = document.createElement("label");
    sizeLabel.htmlFor = "textgroesse"; sizeLabel.textContent = "Textgröße";
    var size = document.createElement("input");
    size.id = "textgroesse"; size.type = "range"; size.min = String(TEXT_MIN); size.max = String(TEXT_MAX); size.step = String(TEXT_STEP);
    size.value = String(current.text);
    size.setAttribute("aria-describedby", "textgroesse-wert");
    var value = document.createElement("output"); value.id = "textgroesse-wert"; value.textContent = current.text + "%";
    size.addEventListener("input", function () { current.text = clampText(size.value); value.textContent = current.text + "%"; save(); });
    panel.append(sizeLabel, size, value);

    var space = document.createElement("button"); space.type = "button"; space.textContent = "Größere Zeilen- und Absatzabstände";
    space.setAttribute("aria-pressed", String(!!current.spacing));
    space.addEventListener("click", function () { current.spacing = !current.spacing; space.setAttribute("aria-pressed", String(current.spacing)); save(); });
    panel.appendChild(space);

    var themeLabel = document.createElement("label"); themeLabel.htmlFor = "farbmodus"; themeLabel.textContent = "Darstellung";
    var theme = document.createElement("select"); theme.id = "farbmodus";
    [["hell", "Hell"], ["dunkel", "Dunkel"], ["kontrast", "Hoher Kontrast"]].forEach(function (item) {
      var option = document.createElement("option"); option.value = item[0]; option.textContent = item[1]; theme.appendChild(option);
    });
    theme.value = current.theme;
    theme.addEventListener("change", function () { current.theme = theme.value; save(); });
    panel.append(themeLabel, theme);

    var calmLabel = document.createElement("label"); calmLabel.className = "bewegung-label";
    var calm = document.createElement("input"); calm.type = "checkbox"; calm.id = "bewegung-reduzieren"; calm.checked = !!current.ruhig;
    calm.addEventListener("change", function () { current.ruhig = calm.checked; save(); });
    calmLabel.append(calm, document.createTextNode(" Bewegungen reduzieren"));
    var calmHelp = document.createElement("p"); calmHelp.id = "bewegung-hilfe"; calmHelp.className = "klein";
    calmHelp.textContent = "Schaltet Animationen und Übergänge aus und verhindert weiches Scrollen. Inhalte und Rückmeldungen bleiben erhalten.";
    calm.setAttribute("aria-describedby", "bewegung-hilfe");
    panel.append(calmLabel, calmHelp);
    var motionNote = document.createElement("p"); motionNote.id = "bewegung-system-hinweis"; motionNote.className = "klein";
    motionNote.hidden = !systemReduceMotion;
    motionNote.textContent = "Dein System verlangt reduzierte Bewegung; die entsprechende Einstellung bleibt aktiv.";
    panel.appendChild(motionNote);

    var reset = document.createElement("button"); reset.type = "button"; reset.textContent = "Auf Standard zurücksetzen";
    reset.addEventListener("click", function () {
      current = Object.assign({}, defaults); size.value = "100"; value.textContent = "100%";
      space.setAttribute("aria-pressed", "false"); calm.checked = false; theme.value = "hell"; save();
    });
    panel.appendChild(reset);
    box.appendChild(panel);
    var target = document.getElementById("nav-options");
    if (target) target.appendChild(box);
    else {
      var header = document.querySelector("header");
      if (header) header.insertAdjacentElement("afterend", box); else document.body.insertBefore(box, document.body.firstChild);
    }
  }
  function init() {
    current = load();
    if (root.matchMedia && root.matchMedia("(prefers-contrast: more)").matches && current.theme === "hell") current.theme = "kontrast";
    var motion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
    systemReduceMotion = !!(motion && motion.matches);
    function onMotion(event) {
      systemReduceMotion = event.matches; apply();
      var note = document.getElementById("bewegung-system-hinweis"); if (note) note.hidden = !systemReduceMotion;
    }
    if (motion && motion.addEventListener) motion.addEventListener("change", onMotion);
    else if (motion && motion.addListener) motion.addListener(onMotion);
    apply(); addControl();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})(typeof window !== "undefined" ? window : globalThis);
