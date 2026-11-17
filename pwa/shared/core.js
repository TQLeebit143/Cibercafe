/* ============================================================
   CORE COMPARTIDO — Diseño Web II
   Utilidades sin dependencias: toasts, modales, tema, navegación,
   almacenamiento seguro, imágenes de respaldo y service worker.
   ============================================================ */
(function () {
  'use strict';

  const App = window.App = window.App || {};

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  App.escape = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
  };

  App.money = function (value) {
    const n = Number(value);
    return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);
  };

  App.time = function () {
    return new Date().toLocaleTimeString('es-BO', { hour12: false });
  };

  App.dateTime = function (value) {
    const d = value ? new Date(value) : new Date();
    return d.toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
  };

  App.uid = function (prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  };

  App.clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  };

  /* ── ALMACENAMIENTO ─────────────────────────────────────── */
  App.store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (error) { /* noop */ }
    }
  };

  /* ── TOASTS ─────────────────────────────────────────────── */
  const TOAST_META = {
    ok: { icon: '✅', title: 'Listo' },
    warn: { icon: '⚠️', title: 'Atención' },
    error: { icon: '⛔', title: 'Error' },
    info: { icon: 'ℹ️', title: 'Información' }
  };

  function ensureToastHost() {
    let host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'false');
      document.body.appendChild(host);
    }
    return host;
  }

  App.toast = function (message, type, title) {
    const meta = TOAST_META[type] || TOAST_META.info;
    const host = ensureToastHost();
    const toast = document.createElement('div');
    toast.className = 'toast ' + (TOAST_META[type] ? type : 'info');
    toast.setAttribute('role', 'status');

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = meta.icon;

    const body = document.createElement('div');
    const heading = document.createElement('strong');
    heading.className = 'toast-title';
    heading.textContent = title || meta.title;
    const text = document.createElement('span');
    text.textContent = message == null ? '' : String(message);

    body.append(heading, text);
    toast.append(icon, body);
    host.appendChild(toast);

    window.setTimeout(() => {
      toast.classList.add('leaving');
      window.setTimeout(() => toast.remove(), 220);
    }, 3400);

    return toast;
  };

  /* ── IMÁGENES DE RESPALDO ───────────────────────────────── */
  App.placeholder = function (emoji, tone) {
    const palette = tone === 'light'
      ? ['#fff1f7', '#ffd9e8', '#e64980']
      : tone === 'cyber'
        ? ['#08111a', '#0d2233', '#00f0ff']
        : ['#1a0a24', '#3d1060', '#f5c518'];
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">',
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="' + palette[0] + '"/>',
      '<stop offset="1" stop-color="' + palette[1] + '"/>',
      '</linearGradient></defs>',
      '<rect width="640" height="420" fill="url(#g)"/>',
      '<circle cx="320" cy="200" r="112" fill="none" stroke="' + palette[2] + '" stroke-opacity=".28" stroke-width="4"/>',
      '<text x="320" y="238" font-size="118" text-anchor="middle" dominant-baseline="middle">' + (emoji || '✨') + '</text>',
      '<text x="320" y="356" font-size="20" text-anchor="middle" fill="' + palette[2] + '" font-family="Segoe UI, sans-serif" font-weight="700" letter-spacing="3">IMAGEN NO DISPONIBLE</text>',
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  };

  App.imgFallback = function (img, emoji, tone) {
    if (!img) return;
    img.onerror = null;
    img.src = App.placeholder(emoji, tone);
    img.classList.add('img-fallback');
  };

  /* ── TEMA CLARO / OSCURO ────────────────────────────────── */
  const THEME_KEY = 'dw2-theme';

  App.theme = {
    key: THEME_KEY,
    current() {
      return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    },
    apply(theme, persist) {
      const next = theme === 'light' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      if (persist !== false) {
        try { localStorage.setItem(THEME_KEY, next); } catch (error) { /* noop */ }
      }
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        const label = btn.querySelector('.theme-label');
        const icon = btn.querySelector('.theme-icon');
        if (label) label.textContent = next === 'dark' ? 'Modo día' : 'Modo noche';
        if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', String(next === 'dark'));
        btn.title = next === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche';
      });
    },
    toggle() {
      const next = this.current() === 'dark' ? 'light' : 'dark';
      this.apply(next, true);
      App.toast(next === 'dark' ? 'Modo noche activado.' : 'Modo día activado.', 'info', 'Tema');
    },
    init() {
      let saved = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch (error) { saved = null; }
      this.apply(saved || document.documentElement.dataset.defaultTheme || 'dark', false);
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => this.toggle());
      });
    }
  };

  /* ── MODALES ────────────────────────────────────────────── */
  App.openModal = function (id) {
    const modal = typeof id === 'string' ? document.getElementById(id) : id;
    if (!modal) return null;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const focusable = modal.querySelector('[data-autofocus], input, select, textarea, button:not([data-close-modal])');
    if (focusable) window.setTimeout(() => focusable.focus(), 80);
    return modal;
  };

  App.closeModal = function (target) {
    const modal = typeof target === 'string'
      ? document.getElementById(target)
      : (target && target.closest ? target.closest('.modal') : null);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.open')) document.body.classList.remove('modal-open');
  };

  App.closeAllModals = function () {
    document.querySelectorAll('.modal.open').forEach((modal) => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.remove('modal-open');
  };

  App.initModals = function () {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-open-modal]');
      if (opener) {
        event.preventDefault();
        App.openModal(opener.dataset.openModal);
        return;
      }
      const closer = event.target.closest('[data-close-modal]');
      if (closer) {
        event.preventDefault();
        App.closeModal(closer.dataset.closeModal || closer);
        return;
      }
      if (event.target.classList.contains('modal')) {
        App.closeModal(event.target);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') App.closeAllModals();
    });
  };

  /* ── NAVEGACIÓN MÓVIL / MENÚ DESPLEGABLE ────────────────── */
  App.initNav = function () {
    const closeAll = () => {
      document.querySelectorAll('[data-nav].open').forEach((nav) => nav.classList.remove('open'));
      document.querySelectorAll('[data-nav-toggle]').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    };

    document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
      const nav = document.getElementById(btn.dataset.navToggle || btn.getAttribute('aria-controls'));
      if (!nav) return;
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !nav.classList.contains('open');
        closeAll();
        nav.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-nav], [data-nav-toggle]')) closeAll();
    });

    document.querySelectorAll('[data-nav] a').forEach((link) => {
      link.addEventListener('click', closeAll);
    });
  };

  /* ── SERVICE WORKER ─────────────────────────────────────── */
  App.registerSW = function (path) {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(path).catch((error) => {
        console.warn('[PWA] No se pudo registrar el service worker:', error);
      });
    });
  };

  /* ── ARRANQUE ───────────────────────────────────────────── */
  App.ready = function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  App.init = function () {
    App.theme.init();
    App.initModals();
    App.initNav();
  };

  App.ready(() => {
    App.init();
    if (!document.querySelector('.toast-host')) ensureToastHost();
  });
})();


/* ============================================================
   VISOR DE IMÁGENES (integrado)
   Antes vivía en zoom.js; ahora forma parte del script central
   para evitar archivos repetidos.
   ============================================================ */
(function () {
  'use strict';

  if (window.__imageZoomReady) return;
  window.__imageZoomReady = true;

  var doc = document;
  var overlay;
  var imageEl;
  var captionEl;
  var countEl;
  var prevBtn;
  var nextBtn;
  var closeBtn;
  var gallery = [];
  var index = 0;
  var lastFocus = null;
  var previousOverflow = '';
  var touchStartX = null;
  var marcando = false;
  var EXCLUDE_KEY = /logo|icon|favicon|avatar|emoji|marca|brand/i;
  var EXCLUDE_ZONE = '.vet-brand-logo, .ice-brand-logo, .pwa-brand-logo, .hud-brand, .pwa-brand, .navbar-brand, .site-footer, .vet-footer, .ice-footer, .zoom-overlay';

  function texto(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function etiqueta(img) {
    var alt = (img.getAttribute('alt') || '').trim();
    if (alt) return alt;

    var host = img.closest('[data-titulo]');
    if (host) return host.getAttribute('data-titulo') || 'Imagen';

    host = img.closest('article, .card, .pwa-card, .ice-card, .fav-card');
    if (host) {
      var titulo = host.querySelector('h1, h2, h3, h4, h5, h6, strong');
      if (titulo) return texto(titulo);
    }
    return 'Imagen';
  }

  function visible(img) {
    if (!img.getClientRects().length) return false;
    var cs = window.getComputedStyle(img);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  }

  function elegible(img) {
    if (!img || img.tagName !== 'IMG') return false;
    if (img.closest('.zoom-overlay')) return false;
    if (img.hasAttribute('data-no-zoom')) return false;
    if (img.closest('a, button')) return false;
    if (img.closest(EXCLUDE_ZONE)) return false;

    var key = (img.className || '') + ' ' + (img.id || '') + ' ' + (img.getAttribute('alt') || '') + ' ' + (img.getAttribute('src') || '');
    if (EXCLUDE_KEY.test(key)) return false;
    if (!visible(img)) return false;

    var rect = img.getBoundingClientRect();
    if (rect.width < 64 || rect.height < 64) return false;
    if (img.naturalWidth && img.naturalWidth < 160) return false;
    return true;
  }

  function marcar() {
    if (marcando) return;
    marcando = true;
    var imgs = doc.images;
    for (var i = 0; i < imgs.length; i += 1) {
      var img = imgs[i];
      if (!elegible(img)) {
        if (img.classList.contains('zoomable')) img.classList.remove('zoomable');
        if (img.hasAttribute('data-zoom-ready')) img.removeAttribute('data-zoom-ready');
        if (img.getAttribute('data-zoom-owned') === 'true') {
          img.removeAttribute('data-zoom-owned');
          img.removeAttribute('tabindex');
          img.removeAttribute('role');
          img.removeAttribute('aria-label');
        }
        continue;
      }
      if (!img.classList.contains('zoomable')) img.classList.add('zoomable');
      if (img.getAttribute('data-zoom-ready') !== 'true') img.setAttribute('data-zoom-ready', 'true');

      var interactivo = img.closest('[data-bs-toggle], [role="button"], a, button');
      if (!interactivo && !img.hasAttribute('tabindex')) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Ampliar imagen: ' + etiqueta(img));
        img.setAttribute('data-zoom-owned', 'true');
      }
    }
    marcando = false;
  }

  function crearVisor() {
    overlay = doc.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Visor de imágenes');
    overlay.hidden = true;

    closeBtn = doc.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'zoom-btn zoom-close';
    closeBtn.setAttribute('aria-label', 'Cerrar visor');
    closeBtn.textContent = '✕';

    prevBtn = doc.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'zoom-btn zoom-prev';
    prevBtn.setAttribute('aria-label', 'Imagen anterior');
    prevBtn.textContent = '‹';

    nextBtn = doc.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'zoom-btn zoom-next';
    nextBtn.setAttribute('aria-label', 'Imagen siguiente');
    nextBtn.textContent = '›';

    var figure = doc.createElement('figure');
    figure.className = 'zoom-figure';

    imageEl = doc.createElement('img');
    imageEl.className = 'zoom-img';
    imageEl.alt = '';
    imageEl.decoding = 'async';

    var figcaption = doc.createElement('figcaption');
    figcaption.className = 'zoom-caption';

    captionEl = doc.createElement('span');
    captionEl.className = 'zoom-caption-text';

    countEl = doc.createElement('span');
    countEl.className = 'zoom-count';

    figcaption.appendChild(captionEl);
    figcaption.appendChild(countEl);
    figure.appendChild(imageEl);
    figure.appendChild(figcaption);

    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(figure);
    overlay.appendChild(nextBtn);
    doc.body.appendChild(overlay);
  }

  function inyectarEstilos() {
    var style = doc.createElement('style');
    style.textContent = [
      'img.zoomable{cursor:zoom-in}',
      '.zoom-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(5,6,10,.94);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}',
      '.zoom-overlay[hidden]{display:none!important}',
      '.zoom-figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:10px;max-width:96vw;max-height:94vh;}',
      '.zoom-img{max-width:94vw;max-height:82vh;width:auto;height:auto;object-fit:contain;border-radius:12px;background:#111;box-shadow:0 24px 80px rgba(0,0,0,.65);}',
      '.zoom-caption{display:flex;flex-direction:column;align-items:center;gap:2px;color:#f4f5f7;text-align:center;font:500 14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;max-width:86vw;}',
      '.zoom-count{color:#b9bec9;font-size:12px;font-weight:600;letter-spacing:.04em;}',
      '.zoom-btn{position:absolute;display:flex;align-items:center;justify-content:center;min-width:48px;min-height:48px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(15,17,23,.72);color:#fff;font-size:24px;line-height:1;cursor:pointer;}',
      '.zoom-btn:hover,.zoom-btn:focus-visible{border-color:#fff;background:rgba(230,57,70,.9);outline:none;}',
      '.zoom-close{top:16px;right:16px;font-size:18px;}',
      '.zoom-prev{left:14px;top:50%;transform:translateY(-50%);font-size:34px;}',
      '.zoom-next{right:14px;top:50%;transform:translateY(-50%);font-size:34px;}',
      '.zoom-btn[hidden]{display:none!important}',
      'body.zoom-abierto{overflow:hidden!important;}',
      '@media (max-width:600px){.zoom-overlay{padding:10px}.zoom-img{max-height:74vh;max-width:96vw}.zoom-caption{font-size:12px}.zoom-close{top:10px;right:10px}.zoom-prev{left:6px}.zoom-next{right:6px}}'
    ].join('');
    doc.head.appendChild(style);
  }

  function construirGaleria(actual) {
    var imgs = doc.images;
    var lista = [];
    for (var i = 0; i < imgs.length; i += 1) {
      if (elegible(imgs[i])) lista.push(imgs[i]);
    }
    if (lista.indexOf(actual) === -1) lista.push(actual);
    return lista;
  }

  function pintar() {
    var actual = gallery[index];
    if (!actual) return;
    imageEl.src = actual.currentSrc || actual.src;
    imageEl.alt = actual.getAttribute('alt') || '';
    captionEl.textContent = etiqueta(actual);
    countEl.textContent = (index + 1) + ' / ' + gallery.length;
    var varias = gallery.length > 1;
    prevBtn.hidden = !varias;
    nextBtn.hidden = !varias;
  }

  function abrir(img) {
    gallery = construirGaleria(img);
    index = gallery.indexOf(img);
    if (index < 0) index = 0;
    lastFocus = img;
    pintar();
    overlay.hidden = false;
    previousOverflow = doc.body.style.overflow;
    doc.body.classList.add('zoom-abierto');
    closeBtn.focus();
  }

  function cerrar() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    imageEl.removeAttribute('src');
    doc.body.classList.remove('zoom-abierto');
    doc.body.style.overflow = previousOverflow;
    if (lastFocus && typeof lastFocus.focus === 'function' && doc.contains(lastFocus)) {
      lastFocus.focus();
    }
  }

  function mover(delta) {
    if (gallery.length < 2) return;
    index = (index + delta + gallery.length) % gallery.length;
    pintar();
  }

  function focusables() {
    return [closeBtn, prevBtn, nextBtn].filter(function (btn) {
      return btn && !btn.hidden;
    });
  }

  function iniciar() {
    inyectarEstilos();
    crearVisor();

    doc.addEventListener('click', function (event) {
      var img = event.target && event.target.closest ? event.target.closest('img') : null;
      if (!img || !elegible(img)) return;
      event.preventDefault();
      event.stopPropagation();
      abrir(img);
    }, true);

    doc.addEventListener('keydown', function (event) {
      if (!overlay.hidden) {
        if (event.key === 'Escape') { event.preventDefault(); cerrar(); return; }
        if (event.key === 'ArrowLeft') { event.preventDefault(); mover(-1); return; }
        if (event.key === 'ArrowRight') { event.preventDefault(); mover(1); return; }
        if (event.key === 'Tab') {
          var lista = focusables();
          if (!lista.length) return;
          var primero = lista[0];
          var ultimo = lista[lista.length - 1];
          if (event.shiftKey && doc.activeElement === primero) {
            event.preventDefault(); ultimo.focus();
          } else if (!event.shiftKey && doc.activeElement === ultimo) {
            event.preventDefault(); primero.focus();
          }
        }
        return;
      }

      var target = event.target;
      if (target && target.tagName === 'IMG' && elegible(target) && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        abrir(target);
      }
    }, true);

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) cerrar();
    });
    closeBtn.addEventListener('click', cerrar);
    prevBtn.addEventListener('click', function () { mover(-1); });
    nextBtn.addEventListener('click', function () { mover(1); });

    overlay.addEventListener('touchstart', function (event) {
      if (event.touches.length === 1) touchStartX = event.touches[0].clientX;
    }, { passive: true });

    overlay.addEventListener('touchend', function (event) {
      if (touchStartX === null || !event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 50) mover(dx > 0 ? -1 : 1);
    }, { passive: true });

    marcar();

    if (window.MutationObserver) {
      new MutationObserver(function () { marcar(); }).observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'open', 'src']
      });
    }

    var pendiente = false;
    function refrescar() {
      if (pendiente) return;
      pendiente = true;
      var raf = window.requestAnimationFrame || function (cb) { return window.setTimeout(cb, 16); };
      raf(function () { pendiente = false; marcar(); });
    }

    window.addEventListener('load', marcar);
    doc.addEventListener('load', marcar, true);
    window.addEventListener('scroll', refrescar, { passive: true });
    window.addEventListener('resize', refrescar, { passive: true });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
