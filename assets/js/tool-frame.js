/* HCDT tool frame sizing: the ONE implementation used by index.html and wordpress/visual-guideline-block.html.
   Edit this file, then run: node scripts/sync-tool-frame.js   (it inlines this file between the tool-frame markers of both pages). */
(function () {
  var vpH = 0, last = { app: false, h: 0 };
  /* top window: its own viewport. Inside the WordPress iframe: the height the bridge reports (hcdtViewport), else the screen. */
  function viewportH() {
    if (window.parent === window) return window.innerHeight;
    return vpH || ((window.screen && screen.availHeight) || 900) - 120;
  }
  /* editors (Poster, Slides) use the visible viewport minus the sticky header and the tab row; no fixed 680-900px cap */
  function editorH() { return Math.max(640, Math.min(1400, viewportH() - 96)); }
  window.hcdtToolFrame = {
    height: function (frame) { frame.style.height = (last.app ? editorH() : Math.max(480, last.h + 2)) + 'px'; },
    onViewport: function (frame, d) { vpH = +d.h || 0; this.height(frame); },
    onFrame: function (frame, d) { last = { app: !!d.app, h: d.h || 0 }; this.height(frame); }
  };
})();
