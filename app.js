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

  /* ---------- formulario: envía al webhook de aviso ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');
  if (form && status) {
    var button = form.querySelector('button[type="submit"]');
    var label = button ? button.innerHTML : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.empresa && form.empresa.value) { status.textContent = 'Solicitud recibida. Gracias.'; return; }
      var datos = {
        nombre: (form.nombre.value || '').trim(),
        telefono: (form.telefono.value || '').trim(),
        poblacion: (form.poblacion.value || '').trim(),
        empresa: ''
      };
      if (datos.nombre.length < 2 || datos.telefono.replace(/\D/g, '').length < 6) {
        status.textContent = 'Revisa el nombre y el teléfono antes de enviar.';
        return;
      }
      if (button) { button.disabled = true; button.textContent = 'Enviando…'; }
      status.textContent = '';
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (res) {
        if (!res || res.ok !== true) throw new Error('respuesta no válida');
        status.textContent = 'Solicitud recibida. Gracias; te contactaremos para concretar la visita.';
        form.reset();
        if (button) { button.disabled = false; button.innerHTML = label; }
      }).catch(function () {
        status.textContent = 'No se pudo enviar la solicitud. Inténtalo de nuevo en un momento.';
        if (button) { button.disabled = false; button.innerHTML = label; }
      });
    });
  }
})();
