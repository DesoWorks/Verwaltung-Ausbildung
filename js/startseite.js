/* Baut die kompakte Themenübersicht aus dem zentralen MODULE_DATEN-Katalog. */
(function () {
  "use strict";
  var STORAGE_KEY = "verwaltung-ausbildung.uebersicht-aufklappzustand.v1";
  var RETURN_KEY = "verwaltung-ausbildung.uebersicht-letztes-lernfeld.v1";

  function erzeuge(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (_) { return {}; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Übersicht bleibt bedienbar. */ }
  }
  function allLessons(field) { return (field.unterthemen || []).filter(function (x) { return x.typ !== "werkzeug"; }); }
  function isAvailable(lesson) { return lesson.status === "verfuegbar" && !!lesson.datei; }
  function completionCount(lessons) {
    return lessons.filter(function (lesson) {
      return isAvailable(lesson) && window.LERNFORTSCHRITT && window.LERNFORTSCHRITT.abgeschlossen(lesson.id);
    }).length;
  }
  function makeLesson(lesson) {
    var li = erzeuge("li", isAvailable(lesson) ? "overview-lesson available" : "overview-lesson planned");
    if (isAvailable(lesson)) {
      var a = erzeuge("a", "overview-lesson-link");
      a.href = lesson.datei;
      a.setAttribute("data-progress-id", lesson.id);
      a.classList.add("unterthema-link");
      var line = erzeuge("span", "modul-titelzeile");
      line.appendChild(erzeuge("span", "unterthema-titel", lesson.titel));
      if (window.LERNFORTSCHRITT && window.LERNFORTSCHRITT.abgeschlossen(lesson.id)) line.appendChild(window.LERNFORTSCHRITT.abschlusszeichen());
      a.appendChild(line);
      if (lesson.beschreibung) a.appendChild(erzeuge("span", "modul-beschreibung", lesson.beschreibung));
      a.appendChild(erzeuge("span", "modul-status", "▸ Jetzt lernen"));
      li.appendChild(a);
    } else {
      li.setAttribute("aria-disabled", "true");
      li.appendChild(erzeuge("span", "unterthema-titel", lesson.titel));
      li.appendChild(erzeuge("span", "modul-status", "◷ In Kürze"));
    }
    return li;
  }
  function configureDisclosure(details, summary, state, key, defaultOpen, forceOpen) {
    var saved = state[key];
    details.open = forceOpen || (typeof saved === "boolean" ? saved : defaultOpen);
    function update() {
      state[key] = details.open;
      summary.setAttribute("aria-expanded", String(details.open));
      summary.setAttribute("aria-label", summary.dataset.baseLabel + (details.open ? " – schließen" : " – öffnen"));
      saveState(state);
    }
    summary.dataset.baseLabel = summary.textContent.trim();
    update();
    details.addEventListener("toggle", update);
  }
  function makeField(field, year, state, forceOpen) {
    var details = erzeuge("details", "overview-field");
    details.dataset.fieldId = field.id;
    var summary = erzeuge("summary", "overview-field-summary");
    var title = erzeuge("span", "overview-field-title", (field.lernfeld ? field.lernfeld + " · " : "") + field.titel);
    summary.appendChild(title);
    var lessons = allLessons(field);
    var available = lessons.filter(isAvailable).length;
    var planned = lessons.length - available;
    var completed = completionCount(lessons);
    var status = lessons.length
      ? available + " verfügbar" + (planned ? " · " + planned + " In Kürze" : "") + " · " + completed + " abgeschlossen"
      : "In Kürze";
    summary.appendChild(erzeuge("span", "overview-field-count", status));
    details.appendChild(summary);
    if (lessons.length) {
      var list = erzeuge("ul", "overview-lessons");
      list.setAttribute("aria-label", "Lektionen: " + field.titel);
      lessons.forEach(function (lesson) { list.appendChild(makeLesson(lesson)); });
      details.appendChild(list);
    } else {
      var plannedBox = erzeuge("p", "overview-planned", "◷ In Kürze");
      plannedBox.setAttribute("aria-disabled", "true"); details.appendChild(plannedBox);
    }
    configureDisclosure(details, summary, state, "field:" + field.id, false, !!forceOpen);
    return details;
  }
  function makeYear(year, state, forceField) {
    var details = erzeuge("details", "overview-year");
    details.dataset.yearId = String(year.jahr);
    var summary = erzeuge("summary", "overview-year-summary", year.titel);
    details.appendChild(summary);
    var list = erzeuge("div", "overview-fields");
    (year.module || []).filter(function (field) { return field.typ !== "werkzeug" && field.id !== "einstieg"; })
      .forEach(function (field) { list.appendChild(makeField(field, year, state, forceField === field.id)); });
    details.appendChild(list);
    configureDisclosure(details, summary, state, "year:" + year.jahr, year.jahr === 1, !!forceField);
    return details;
  }
  function makeEntry(entry) {
    var li = erzeuge("li", "modul modul-verfuegbar");
    var a = erzeuge("a", "modul-inhalt"); a.href = entry.datei;
    a.appendChild(erzeuge("span", "modul-titel", entry.titel));
    if (entry.beschreibung) a.appendChild(erzeuge("span", "modul-beschreibung", entry.beschreibung));
    a.appendChild(erzeuge("span", "modul-status", "▸ Jetzt lernen")); li.appendChild(a); return li;
  }
  function init() {
    var target = document.getElementById("jahre");
    var years = window.MODULE_DATEN || [];
    if (!target) return;
    target.textContent = "";
    var state = readState();
    var returningField = "";
    try { returningField = sessionStorage.getItem(RETURN_KEY) || ""; } catch (_) {}
    var entry = window.MODULE_EINSTIEG || [];
    if (entry.length) {
      var section = erzeuge("section", "overview-entry");
      section.setAttribute("aria-labelledby", "einstieg-titel");
      var h = erzeuge("h2", null, "Einstieg"); h.id = "einstieg-titel"; section.appendChild(h);
      var list = erzeuge("ul", "modul-liste"); entry.forEach(function (m) { list.appendChild(makeEntry(m)); }); section.appendChild(list); target.appendChild(section);
    }
    years.forEach(function (year) {
      var detail = makeYear(year, state, returningField);
      if (returningField) {
        var hasField = detail.querySelector('[data-field-id="' + returningField.replace(/"/g, "") + '"]');
        if (hasField) { detail.open = true; hasField.open = true; }
      }
      target.appendChild(detail);
    });
    if (returningField) { try { sessionStorage.removeItem(RETURN_KEY); } catch (_) {} }
    target.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (!link) return;
      var path = link.getAttribute("href");
      var lesson = years.flatMap(function (y) { return y.module || []; }).flatMap(allLessons).find(function (x) { return x.datei === path; });
      if (lesson) {
        var field = years.flatMap(function (y) { return y.module || []; }).find(function (item) {
          return (item.unterthemen || []).some(function (topic) { return topic.id === lesson.id; });
        });
        if (field) { try { sessionStorage.setItem(RETURN_KEY, field.id); } catch (_) {} }
      }
      if (lesson) {
        var progressId = lesson.id;
        if (window.LERNFORTSCHRITT && window.LERNFORTSCHRITT.abgeschlossen(progressId)) {
          link.dataset.completed = "true";
        }
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
