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
