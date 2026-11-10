/* HCDT Visual Guideline iframe colour bridge.
 * Load on the test Visual System Guideline page only.
 * WordPress/header is the single source of truth for the auxiliary colour. */
(function () {
  'use strict';
  var ALLOWED = ['#64D8D8', '#E8B9AA', '#73D888', '#E8E041'];
  var PAGE_CLASS = 'page-id-8893';
  function isTargetPage() { return document.body && document.body.classList.contains(PAGE_CLASS); }
  function installPageLayout() {
    if (!isTargetPage()) return;
    /* The component library's real grid is 1280px inner width + 64px page
       margins.  `uses-grid` makes WordPress expose that full 1408px shell;
       the embedded document then starts at the iframe edge without a second
       set of 64px margins. */
    document.body.classList.add('uses-grid');

    /* Keep the normal and collapsed headers on one identical, deterministic
       strip.  The theme's two pseudo-elements otherwise use different tile
       sizing while the sticky header changes state, which creates the broken
       fragments seen during scroll.  This is scoped to the test page only. */
    var style = document.createElement('style');
    style.id = 'hcdt-test-page-layout';
    style.textContent = [
      'body.page-id-8893.has-sub-header .header::after,',
      'body.page-id-8893.has-sub-header .mini-header::before{',
      'content:""!important;display:block!important;height:12px!important;',
      'background-image:repeating-linear-gradient(90deg,#6b00ff 0,#6b00ff 24px,transparent 24px,transparent 48px),repeating-linear-gradient(90deg,transparent 0,transparent 24px,var(--sub) 24px,var(--sub) 48px)!important;',
      'background-position:0 0,0 6px!important;background-size:48px 6px!important;background-repeat:repeat-x!important;',
      'transform:none!important;clip-path:none!important;mask:none!important;-webkit-mask:none!important;',
      '}',
      'body.page-id-8893.has-sub-header .mini-header::before{top:auto!important;bottom:-6px!important;}',
      'body.page-id-8893 .mini-header__container::after{content:none!important;display:none!important;}'
    ].join('');
    document.head.appendChild(style);
  }
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
  /* tell the embedded guideline how tall the visible viewport is, so editor frames can be sized to it */
  function sendViewport() {
    frames().forEach(function (f) { try { f.contentWindow.postMessage({ hcdtViewport: { h: window.innerHeight } }, '*'); } catch (_) {} });
  }
  window.addEventListener('resize', sendViewport);
  function fit(source, value) {
    var height = Math.ceil(Number(value));
    if (!Number.isFinite(height) || height < 200 || height > 20000) return;
    frames().forEach(function (frame) {
      if (frame.contentWindow !== source) return;
      frame.style.height = height + 'px';
      frame.setAttribute('height', String(height));
    });
  }
  function bind() {
    installPageLayout();
    frames().forEach(function (f) { f.addEventListener('load', function () { send(f); sendViewport(); }); send(f); });
    sendViewport();
  }
  window.addEventListener('message', function (event) {
    var d = event.data || {};
    if (d.hcdtHeight) { fit(event.source, d.hcdtHeight); return; }
    if (d.hcdtRequestAux) { frames().forEach(send); return; }
    if (d.hcdtAuxChange) apply(d.hcdtAuxChange);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
