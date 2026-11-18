/* Albert Guerra · Agua y Bienestar — vista previa.
   Sin dependencias. Nada de lo que hay aquí envía datos a ningún sitio. */
(function () {
  'use strict';

  /* ---------- cuatro funciones: pestañas ARIA (flechas, Inicio, Fin) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t && root.contains(t)) select(t);
    });

    root.querySelector('[role="tablist"]').addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      select(next, true);
    });

    select(root.querySelector('[role="tab"][aria-selected="true"]') || tabs[0]);
  });

  /* ---------- comparador antes / después: un input range nativo (teclado y puntero) ---------- */
  var frame = document.getElementById('ba');
  if (frame) {
    var range = frame.querySelector('.ba__range');
    var update = function () {
      var v = Number(range.value);
      frame.style.setProperty('--p', v + '%');
      range.setAttribute('aria-valuetext', v + ' % sin protección, ' + (100 - v) + ' % con protección');
    };
    range.addEventListener('input', update);
    update();
  }

  /* ---------- formulario de vista previa: valida, no envía y no simula éxito ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Vista previa: el formulario todavía no está conectado y no se ha enviado ningún dato. ' +
        'La visita aún no puede solicitarse desde esta página.';
    });
  }
})();
