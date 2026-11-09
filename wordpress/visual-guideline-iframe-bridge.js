/* HCDT Visual Guideline iframe colour bridge.
 * Load on the test Visual System Guideline page only.
 * WordPress/header is the single source of truth for the auxiliary colour. */
(function () {
  'use strict';
  var ALLOWED = ['#64D8D8', '#E8B9AA', '#73D888', '#E8E041'];
  function normalise(value) {
    value = String(value || '').trim().toUpperCase();
    return ALLOWED.indexOf(value) > -1 ? value : '';
  }
  function current() {
    var fromState = window.unistdesignSub && window.unistdesignSub.hex;
    var fromCss = getComputedStyle(document.documentElement).getPropertyValue('--sub');
    return normalise(fromState) || normalise(fromCss) || ALLOWED[0];
  }
  function frames() {
    return [].slice.call(document.querySelectorAll('iframe')).filter(function (f) {
      return /HCDT_Guideline|test-visual-system-guideline|aghartakr-glitch\.github\.io/i.test(f.src || '');
    });
  }
  function send(frame) {
    try { frame.contentWindow.postMessage({ hcdtAux: current() }, '*'); } catch (_) {}
  }
  function apply(hex) {
    hex = normalise(hex); if (!hex) return;
    document.documentElement.style.setProperty('--sub', hex);
    document.documentElement.style.setProperty('--ui', hex);
    window.unistdesignSub = Object.assign({}, window.unistdesignSub || {}, { hex: hex });
    frames().forEach(send);
  }
  function bind() { frames().forEach(function (f) { f.addEventListener('load', function () { send(f); }); send(f); }); }
  window.addEventListener('message', function (event) {
    var d = event.data || {};
    if (d.hcdtRequestAux) { frames().forEach(send); return; }
    if (d.hcdtAuxChange) apply(d.hcdtAuxChange);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
