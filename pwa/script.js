(function () {
  'use strict';

  const ZONAS = Array.isArray(window.CIBER_ZONAS) ? window.CIBER_ZONAS : [];
  const MENU = Array.isArray(window.CIBER_MENU) ? window.CIBER_MENU : [];
  const CATS = Array.isArray(window.CIBER_CATEGORIAS) && window.CIBER_CATEGORIAS.length
    ? window.CIBER_CATEGORIAS
    : [
        { id: 'cafes', label: 'Cafés', emoji: '☕' },
        { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
        { id: 'snacks', label: 'Snacks & comida', emoji: '🥪' },
        { id: 'postres', label: 'Postres', emoji: '🍰' }
      ];

  const KEYS = {
    sesiones: 'ciber_sesiones_v2',
    orden: 'ciber_orden_v2',
    gamertag: 'ciber_gamertag',
    eventos: 'ciber_logs_eventos_v2',
    ventas: 'ciber_logs_ventas_v2',
    admin: 'ciber_admin_logged',
    karaoke: 'ciber_karaoke_v1'
  };

  const MAX_LOG = 250;
  const CLAVE_ADMIN = { admin: 'ciber123', cajero: 'arena2026' };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (v) => App.escape(v);
  const money = (n) => App.money(n) + ' BOB';

  const estado = {
    sesiones: normalizarSesiones(App.store.get(KEYS.sesiones, [])),
    orden: normalizarOrden(App.store.get(KEYS.orden, [])),
    gamertag: String(App.store.get(KEYS.gamertag, '') || '').slice(0, 32),
    admin: esAdmin(),
    zonaSel: (ZONAS[0] && ZONAS[0].id) || '',
    filtroMenu: 'todos',
    qMenu: ''
  };

  let detalleActual = null;

  /* ── DATOS ──────────────────────────────────────────────── */
  function menuItem(id) {
    return MENU.find((p) => Number(p.id) === Number(id));
  }

  function zonaPorId(id) {
    return ZONAS.find((z) => z.id === id);
  }

  function normalizarSesiones(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((s) => {
        if (!s || typeof s !== 'object') return null;
        const zona = zonaPorId(s.zonaId) || ZONAS[0];
        if (!zona) return null;
        const horas = App.clamp(s.horas || 1, 1, 12);
        const tarifa = Number(s.tarifa) || zona.precio;
        const consumos = Array.isArray(s.consumos)
          ? s.consumos.map((c) => {
              const p = menuItem(c && c.menuId);
              if (!p) return null;
              return {
                menuId: p.id,
                nombre: p.nombre,
                precio: Number(c.precio) || p.precio,
                qty: App.clamp(c.qty || 1, 1, 99),
                pagado: !!c.pagado
              };
            }).filter(Boolean)
          : [];
        return {
          id: typeof s.id === 'string' ? s.id : App.uid('ses'),
          cliente: String(s.cliente || 'Cliente').slice(0, 40),
          zonaId: zona.id,
          zonaNombre: zona.nombre,
          equipo: String(s.equipo || (zona.prefijo + '-01')).slice(0, 12),
          horas: horas,
          tarifa: tarifa,
          cargoEstacion: Number(s.cargoEstacion) || tarifa * horas,
          inicio: Number(s.inicio) || Date.now(),
          consumos: consumos,
          estacionPagada: !!s.estacionPagada
        };
      })
      .filter(Boolean);
  }

  function normalizarOrden(raw) {
    if (!Array.isArray(raw)) return [];
    const mapa = new Map();
    raw.forEach((line) => {
      const p = menuItem(line && line.menuId);
      if (!p) return;
      const qty = App.clamp(line.qty || 1, 1, 99);
      mapa.set(p.id, (mapa.get(p.id) || 0) + qty);
    });
    return Array.from(mapa, ([menuId, qty]) => ({ menuId, qty: App.clamp(qty, 1, 99) }));
  }

  function guardar() {
    App.store.set(KEYS.sesiones, estado.sesiones);
    App.store.set(KEYS.orden, estado.orden);
  }

  function esAdmin() {
    try { return sessionStorage.getItem(KEYS.admin) === 'true'; } catch (e) { return false; }
  }

  function setAdmin(valor) {
    try {
      if (valor) sessionStorage.setItem(KEYS.admin, 'true');
      else sessionStorage.removeItem(KEYS.admin);
    } catch (e) { /* noop */ }
  }

  /* ── BITÁCORAS ──────────────────────────────────────────── */
  function leerLog(key) {
    const data = App.store.get(key, []);
    return Array.isArray(data) ? data : [];
  }

  function agregarLog(key, entrada) {
    const lista = leerLog(key);
    lista.unshift(entrada);
    App.store.set(key, lista.slice(0, MAX_LOG));
  }

  function aliasActual() {
    return estado.gamertag || 'Invitado';
  }

  function logEvento(msg, tipo) {
    agregarLog(KEYS.eventos, {
      t: Date.now(),
      tipo: tipo || 'info',
      alias: aliasActual(),
      msg: String(msg)
    });
    if (estado.admin) renderLogs();
  }

  function logVenta(venta) {
    agregarLog(KEYS.ventas, Object.assign({
      t: Date.now(),
      id: 'CA-' + String(Date.now()).slice(-6),
      alias: aliasActual()
    }, venta));
    if (estado.admin) renderLogs();
  }

  function renderLogs() {
    const eventos = leerLog(KEYS.eventos);
    const ventas = leerLog(KEYS.ventas);
    const cajaEventos = $('#pwaLogEventos');
    const cajaVentas = $('#pwaLogVentas');
    if (!cajaEventos || !cajaVentas) return;

    cajaEventos.innerHTML = eventos.length
      ? eventos.map((e) => `
          <div class="log-entry ${esc(e.tipo || 'info')}">
            <span class="log-time">${esc(App.dateTime(e.t))}</span>
            <span class="log-type">${esc((e.tipo || 'info').toUpperCase())}</span>
            <strong>${esc(e.alias || 'Invitado')}:</strong> ${esc(e.msg)}
          </div>`).join('')
      : '<div class="log-empty">Sin eventos registrados todavía.</div>';

    cajaVentas.innerHTML = ventas.length
      ? ventas.map((v) => {
          const items = Array.isArray(v.items) ? v.items : [];
          const detalle = items.map((i) => `${i.qty}x ${esc(i.nombre)}`).join(' · ');
          return `
            <div class="log-entry ok">
              <span class="log-time">${esc(App.dateTime(v.t))}</span>
              <span class="log-type">VENTA</span>
              <strong>${esc(v.cliente || v.alias || 'Cliente')}</strong>
              · ${esc(money(v.total || 0))}
              <div class="small muted">${esc(v.id || '')}${v.motivo ? ' · ' + esc(v.motivo) : ''} · ${detalle || 'Sin detalle'}</div>
            </div>`;
        }).join('')
      : '<div class="log-empty">Aún no hay ventas registradas.</div>';

    const totalVentas = ventas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    const ticket = ventas.length ? totalVentas / ventas.length : 0;
    const set = (id, valor) => { const el = $(id); if (el) el.textContent = valor; };
    set('#pwaKpiVentas', money(totalVentas));
    set('#pwaKpiEventos', String(eventos.length));
    set('#pwaKpiSesiones', String(estado.sesiones.length));
    set('#pwaKpiTicket', money(ticket));
  }

  /* ── CUENTAS ────────────────────────────────────────────── */
  function lineasDeSesion(s) {
    const lineas = [];
    if (!s.estacionPagada) {
      lineas.push({
        tipo: 'estacion',
        sesionId: s.id,
        nombre: `Estación ${s.equipo}`,
        detalle: `${s.cliente} · ${s.horas}h · ${s.zonaNombre}`,
        monto: s.cargoEstacion,
        qty: 1
      });
    }
    s.consumos.forEach((c, idx) => {
      if (c.pagado) return;
      lineas.push({
        tipo: 'consumo',
        sesionId: s.id,
        idx: idx,
        menuId: c.menuId,
        nombre: c.nombre,
        detalle: `${s.equipo} · ${s.cliente}`,
        monto: c.precio * c.qty,
        qty: c.qty
      });
    });
    return lineas;
  }

  function pendientes() {
    const lineas = [];
    estado.sesiones.forEach((s) => { lineas.push.apply(lineas, lineasDeSesion(s)); });
    estado.orden.forEach((line) => {
      const p = menuItem(line.menuId);
      if (!p) return;
      lineas.push({
        tipo: 'orden',
        menuId: p.id,
        nombre: p.nombre,
        detalle: 'Mostrador · sin estación',
        monto: p.precio * line.qty,
        qty: line.qty
      });
    });
    return {
      lineas: lineas,
      total: lineas.reduce((sum, l) => sum + l.monto, 0),
      items: lineas.reduce((sum, l) => sum + l.qty, 0),
      consumos: lineas.filter((l) => l.tipo !== 'estacion').reduce((sum, l) => sum + l.qty, 0)
    };
  }

  function estacionesOcupadas(zonaId) {
    return estado.sesiones.filter((s) => s.zonaId === zonaId).map((s) => s.equipo);
  }

  function estacionesLibres(zona) {
    const ocupadas = estacionesOcupadas(zona.id);
    const libres = [];
    for (let i = 1; i <= zona.capacidad; i += 1) {
      const codigo = zona.prefijo + '-' + String(i).padStart(2, '0');
      if (!ocupadas.includes(codigo)) libres.push(codigo);
    }
    return libres;
  }

  function duracion(inicio) {
    const segundos = Math.max(0, Math.floor((Date.now() - Number(inicio)) / 1000));
    const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
    const s = String(segundos % 60).padStart(2, '0');
    return h + ':' + m + ':' + s;
  }

  /* ── HUD ────────────────────────────────────────────────── */
  function renderHUD() {
    const pend = pendientes();
    const cart = $('#pwaCartCount');
    if (cart) cart.textContent = String(pend.items);
    const dock = $('#pwaDockBadge');
    if (dock) {
      dock.textContent = String(pend.items);
      dock.classList.toggle('hidden', pend.items === 0);
    }
    const badge = $('#pwaOrdenBadge');
    if (badge) badge.textContent = pend.items + (pend.items === 1 ? ' ítem' : ' ítems');
    const miniBadge = $('#pwaOrdenMiniBadge');
    if (miniBadge) miniBadge.textContent = pend.items + (pend.items === 1 ? ' ítem' : ' ítems');

    const alias = estado.gamertag || 'Invitado';
    const hero = $('#pwaHeroAlias');
    if (hero) hero.textContent = alias;
    const drawerUser = $('#pwaDrawerUser');
    if (drawerUser) drawerUser.textContent = estado.admin ? 'Administrador' : alias;
    const avatar = $('#pwaAvatar');
    if (avatar) {
      if (estado.admin) avatar.textContent = 'AD';
      else if (estado.gamertag) avatar.textContent = estado.gamertag.slice(0, 2).toUpperCase();
      else avatar.textContent = 'VIP';
    }
  }

  function lineaOrdenHTML(linea) {
    const puedeQuitar = linea.tipo !== 'estacion';
    let attrs = '';
    if (linea.tipo === 'consumo') {
      attrs = `data-quitar="consumo" data-sesion="${esc(linea.sesionId)}" data-idx="${linea.idx}"`;
    } else if (linea.tipo === 'orden') {
      attrs = `data-quitar="orden" data-menu="${linea.menuId}"`;
    }
    return `
      <li class="order-line">
        <div class="order-line-main">
          <strong>${esc(linea.nombre)}${linea.qty > 1 ? ' ×' + linea.qty : ''}</strong>
          <small>${esc(linea.detalle)}</small>
        </div>
        <span class="order-line-price">${esc(money(linea.monto))}</span>
        ${puedeQuitar ? `<button type="button" class="order-remove" ${attrs} aria-label="Quitar ${esc(linea.nombre)}">✕</button>` : ''}
      </li>`;
  }

  function renderLista(host, vacio) {
    if (!host) return;
    const pend = pendientes();
    host.innerHTML = pend.lineas.length
      ? pend.lineas.map(lineaOrdenHTML).join('')
      : `<li class="order-empty"><span class="empty-icon">🧾</span><span>${esc(vacio)}</span></li>`;
  }

  function renderOrdenes() {
    const pend = pendientes();
    renderLista($('#pwaMiniOrden'), 'Sin reservas ni consumos pendientes.');
    renderLista($('#pwaOrdenLista'), 'Tu orden está vacía. Elige algo de la cafetería.');
    const miniTotal = $('#pwaMiniTotal');
    if (miniTotal) miniTotal.textContent = money(pend.total);
    const total = $('#pwaOrdenTotal');
    if (total) total.textContent = money(pend.total);
    const miniBtn = $('#pwaMiniCheckout');
    if (miniBtn) miniBtn.disabled = !pend.lineas.length;
    const btn = $('#pwaBtnCheckout');
    if (btn) btn.disabled = !pend.lineas.length;
  }

  function renderLobby() {
    const pend = pendientes();
    const set = (id, valor) => { const el = $(id); if (el) el.textContent = valor; };
    set('#pwaSesiones', String(estado.sesiones.length));
    set('#pwaConsumos', String(pend.consumos));
    set('#pwaTotal', money(pend.total));
    set('#pwaActivasCount', String(estado.sesiones.length));
    set('#pwaSesionesBadge', String(estado.sesiones.length));
    set('#pwaCuentaSesionesBadge', String(estado.sesiones.length));
  }

  /* ── ZONAS / MAPA / SESIONES ────────────────────────────── */
  function renderZonas() {
    const host = $('#pwaZonasGrid');
    if (!host) return;
    host.innerHTML = ZONAS.map((zona) => {
      const libres = estacionesLibres(zona);
      const llena = libres.length === 0;
      return `
        <button type="button" class="zona-card ${estado.zonaSel === zona.id ? 'active' : ''} ${llena ? 'full' : ''}"
          data-zona="${esc(zona.id)}" aria-pressed="${estado.zonaSel === zona.id}">
          <span class="zona-ico">${esc(zona.emoji || '🖥️')}</span>
          <span class="zona-info">
            <strong>${esc(zona.nombre)}</strong>
            <small>${esc(zona.detalle)}</small>
            <span class="zona-free">${llena ? 'Sin estaciones libres' : libres.length + ' de ' + zona.capacidad + ' libres'}</span>
          </span>
          <span class="zona-price"><strong>${esc(money(zona.precio))}</strong><small>por hora</small></span>
        </button>`;
    }).join('');
  }

  function renderMapa() {
    const host = $('#pwaMapa');
    if (!host) return;
    const piezas = [];
    ZONAS.forEach((zona) => {
      for (let i = 1; i <= zona.capacidad; i += 1) {
        const codigo = zona.prefijo + '-' + String(i).padStart(2, '0');
        const sesion = estado.sesiones.find((s) => s.equipo === codigo);
        piezas.push(`
          <button type="button" class="station ${sesion ? 'ocupada' : ''}"
            data-station="${esc(codigo)}" data-zona="${esc(zona.id)}"
            title="${sesion ? esc(sesion.cliente + ' · ' + sesion.horas + 'h') : 'Estación libre'}">
            <span class="st-ico">${esc(zona.emoji || '🖥️')}</span>
            <span class="st-code">${esc(codigo)}</span>
            <span class="st-client">${esc(sesion ? sesion.cliente : 'Libre')}</span>
          </button>`);
      }
    });
    host.innerHTML = piezas.join('') || '<p class="small muted">No hay estaciones configuradas.</p>';
  }

  function sesionHTML(s, conAccion) {
    const consumos = s.consumos.filter((c) => !c.pagado);
    const totalConsumos = consumos.reduce((sum, c) => sum + c.precio * c.qty, 0);
    const pendiente = (s.estacionPagada ? 0 : s.cargoEstacion) + totalConsumos;
    const chips = consumos.length
      ? consumos.map((c) => `<span>${esc(c.nombre)} ×${c.qty}</span>`).join('')
      : '<span>Sin consumos pendientes</span>';
    return `
      <div class="session-item">
        <div class="session-head">
          <span class="session-code">${esc(s.equipo)}</span>
          <span class="badge ${s.estacionPagada ? 'ok' : 'warn'}">${s.estacionPagada ? 'Pagada' : 'Por cobrar'}</span>
        </div>
        <div class="session-meta">
          <span>👤 <b>${esc(s.cliente)}</b></span>
          <span>🎮 ${esc(s.zonaNombre)}</span>
          <span>⏱ <span class="timer" data-inicio="${esc(s.inicio)}">${esc(duracion(s.inicio))}</span> / ${s.horas}h</span>
        </div>
        <div class="session-charges">${chips}</div>
        <div class="session-total"><span>Pendiente</span><strong>${esc(money(pendiente))}</strong></div>
        ${conAccion ? `<button type="button" class="btn btn-ghost btn-xs" data-cargar="${esc(s.equipo)}">🍔 Cargar consumo</button>` : ''}
      </div>`;
  }

  function renderSesiones() {
    const lista = $('#pwaSesionesLista');
    if (lista) {
      lista.innerHTML = estado.sesiones.length
        ? estado.sesiones.map((s) => sesionHTML(s, false)).join('')
        : '<div class="empty-slot">No hay sesiones activas todavía.</div>';
    }
    const activas = $('#pwaActivas');
    if (activas) {
      activas.innerHTML = estado.sesiones.length
        ? estado.sesiones.slice(0, 3).map((s) => sesionHTML(s, false)).join('')
        : '<div class="empty-slot">Reserva una estación para empezar a jugar.</div>';
    }
    const cuenta = $('#pwaCuentaSesiones');
    if (cuenta) {
      cuenta.innerHTML = estado.sesiones.length
        ? estado.sesiones.map((s) => sesionHTML(s, true)).join('')
        : '<div class="empty-slot">Todas las estaciones están libres.</div>';
    }
  }

  /* ── SELECTS ────────────────────────────────────────────── */
  function renderSelects() {
    const zonaSel = $('#pwaReservaZona');
    if (zonaSel) {
      const anterior = zonaSel.value;
      zonaSel.innerHTML = ZONAS.map((zona) => {
        const libres = estacionesLibres(zona);
        const llena = libres.length === 0;
        return `<option value="${esc(zona.id)}" ${llena && zona.id !== anterior ? 'disabled' : ''}>
          ${esc(zona.emoji || '🎮')} ${esc(zona.nombre)} · ${esc(money(zona.precio))}/h${llena ? ' (llena)' : ''}
        </option>`;
      }).join('');
      if (anterior && ZONAS.some((z) => z.id === anterior)) zonaSel.value = anterior;
      else if (estado.zonaSel) zonaSel.value = estado.zonaSel;
    }

    const menuSel = $('#pwaMenuEstacion');
    if (menuSel) {
      const anterior = menuSel.value;
      const opciones = ['<option value="">🍽️ Mostrador (orden general)</option>'];
      estado.sesiones.forEach((s) => {
        opciones.push(`<option value="${esc(s.equipo)}">${esc(s.equipo)} · ${esc(s.cliente)}</option>`);
      });
      menuSel.innerHTML = opciones.join('');
      if (anterior && estado.sesiones.some((s) => s.equipo === anterior)) menuSel.value = anterior;
    }

    const liberar = $('#pwaLiberarSelect');
    if (liberar) {
      const anterior = liberar.value;
      liberar.innerHTML = estado.sesiones.length
        ? estado.sesiones.map((s) => `<option value="${esc(s.equipo)}">${esc(s.equipo)} · ${esc(s.cliente)}</option>`).join('')
        : '<option value="">Sin sesiones activas</option>';
      if (anterior && estado.sesiones.some((s) => s.equipo === anterior)) liberar.value = anterior;
    }
    const btnLiberar = $('#pwaLiberarBtn');
    if (btnLiberar) btnLiberar.disabled = !estado.sesiones.length;
  }

  /* ── MENÚ ───────────────────────────────────────────────── */
  function menuCoincidencias() {
    const q = estado.qMenu.trim().toLowerCase();
    return MENU.filter((p) => {
      const okCat = estado.filtroMenu === 'todos' || p.categoria === estado.filtroMenu;
      if (!okCat) return false;
      if (!q) return true;
      return [p.nombre, p.detalle, p.catLabel, p.categoria].join(' ').toLowerCase().includes(q);
    });
  }

  function menuConteos() {
    const q = estado.qMenu.trim().toLowerCase();
    const base = MENU.filter((p) => {
      if (!q) return true;
      return [p.nombre, p.detalle, p.catLabel, p.categoria].join(' ').toLowerCase().includes(q);
    });
    const map = { todos: base.length };
    CATS.forEach((c) => { map[c.id] = base.filter((p) => p.categoria === c.id).length; });
    return map;
  }

  function renderMenuFiltros() {
    const host = $('#pwaMenuFiltros');
    if (!host) return;
    const counts = menuConteos();
    const chips = [`<button type="button" class="chip ${estado.filtroMenu === 'todos' ? 'active' : ''}" data-menu-cat="todos">🍽️ Todo <span class="count">(${counts.todos})</span></button>`];
    CATS.forEach((cat) => {
      const n = counts[cat.id] || 0;
      if (!n && estado.filtroMenu !== cat.id) return;
      chips.push(`<button type="button" class="chip ${estado.filtroMenu === cat.id ? 'active' : ''}" data-menu-cat="${esc(cat.id)}">${esc(cat.emoji || '•')} ${esc(cat.label)} <span class="count">(${n})</span></button>`);
    });
    host.innerHTML = chips.join('');
  }

  function cantidadEnCuenta(menuId) {
    let total = 0;
    estado.sesiones.forEach((s) => {
      s.consumos.forEach((c) => {
        if (!c.pagado && Number(c.menuId) === Number(menuId)) total += c.qty;
      });
    });
    estado.orden.forEach((l) => {
      if (Number(l.menuId) === Number(menuId)) total += l.qty;
    });
    return total;
  }

  function renderMenu() {
    const grid = $('#pwaMenuGrid');
    if (!grid) return;
    const lista = menuCoincidencias();

    if (!lista.length) {
      grid.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <span class="empty-icon">🍽️</span>
          <strong>Sin resultados</strong>
          <span>Prueba otra palabra o vuelve a ver todo el menú.</span>
          <button type="button" class="btn btn-ghost btn-sm mt-1" data-reset-menu>Ver menú completo</button>
        </div>`;
    } else {
      grid.innerHTML = lista.map((p) => {
        const qty = cantidadEnCuenta(p.id);
        return `
          <article class="menu-card" data-menu-card="${p.id}" tabindex="0" aria-label="${esc(p.nombre)}">
            <div class="menu-media">
              <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy"
                   onerror="App.imgFallback(this,'${esc(p.emoji || '🍽️')}','cyber')">
              <span class="badge info">${esc(p.catLabel || p.categoria)}</span>
              <button type="button" class="menu-zoom" data-detail-menu="${p.id}">🔍</button>
            </div>
            <div class="menu-body">
              <h4>${esc(p.nombre)}</h4>
              <p>${esc(p.detalle)}</p>
              <div class="menu-foot">
                <span class="menu-price">${esc(money(p.precio))}<small>${qty ? qty + ' en la cuenta' : 'unitario'}</small></span>
                <button type="button" class="btn btn-accent" data-add-menu="${p.id}">＋ Añadir</button>
              </div>
            </div>
          </article>`;
      }).join('');
    }

    renderMenuFiltros();

    const info = $('#pwaMenuInfo');
    if (info) {
      const cat = estado.filtroMenu === 'todos'
        ? 'todo el menú'
        : (CATS.find((c) => c.id === estado.filtroMenu) || {}).label || estado.filtroMenu;
      info.textContent = `Mostrando ${lista.length} de ${MENU.length} · ${cat}${estado.qMenu ? ` · “${estado.qMenu}”` : ''}`;
    }
  }

  /* ── CONSUMOS / ORDEN ───────────────────────────────────── */
  function sesionSeleccionada() {
    const sel = $('#pwaMenuEstacion');
    if (!sel || !sel.value) return null;
    return estado.sesiones.find((s) => s.equipo === sel.value) || null;
  }

  function agregarMenu(menuId) {
    const p = menuItem(menuId);
    if (!p) return;
    const sesion = sesionSeleccionada();

    if (sesion) {
      const existente = sesion.consumos.find((c) => c.menuId === p.id && !c.pagado);
      if (existente) existente.qty = App.clamp(existente.qty + 1, 1, 99);
      else sesion.consumos.push({ menuId: p.id, nombre: p.nombre, precio: p.precio, qty: 1, pagado: false });
      guardar();
      renderDespuesDeCambio();
      App.toast(`“${p.nombre}” cargado a ${sesion.equipo}.`, 'ok', 'Consumo');
      logEvento(`Cargó “${p.nombre}” a ${sesion.equipo} de ${sesion.cliente}.`, 'ok');
      return;
    }

    const linea = estado.orden.find((l) => l.menuId === p.id);
    if (linea) linea.qty = App.clamp(linea.qty + 1, 1, 99);
    else estado.orden.push({ menuId: p.id, qty: 1 });
    guardar();
    renderDespuesDeCambio();
    App.toast(`“${p.nombre}” añadido a la orden.`, 'ok', 'Mostrador');
    logEvento(`Añadió “${p.nombre}” a la orden de mostrador.`, 'ok');
  }

  function quitarLinea(boton) {
    const tipo = boton.dataset.quitar;
    if (tipo === 'orden') {
      const menuId = Number(boton.dataset.menu);
      const linea = estado.orden.find((l) => l.menuId === menuId);
      if (!linea) return;
      linea.qty -= 1;
      if (linea.qty <= 0) estado.orden = estado.orden.filter((l) => l.menuId !== menuId);
      guardar();
      renderDespuesDeCambio();
      logEvento('Quitó un producto de la orden de mostrador.', 'warn');
      return;
    }
    if (tipo === 'consumo') {
      const sesion = estado.sesiones.find((s) => s.id === boton.dataset.sesion || s.equipo === boton.dataset.sesion);
      if (!sesion) return;
      const idx = Number(boton.dataset.idx);
      const consumo = sesion.consumos[idx];
      if (!consumo) return;
      consumo.qty -= 1;
      if (consumo.qty <= 0) sesion.consumos.splice(idx, 1);
      guardar();
      renderDespuesDeCambio();
      logEvento(`Quitó “${consumo.nombre}” de ${sesion.equipo}.`, 'warn');
    }
  }

  function renderDespuesDeCambio() {
    renderHUD();
    renderLobby();
    renderOrdenes();
    renderSesiones();
    renderMapa();
    renderZonas();
    renderSelects();
    if (estado.admin) renderLogs();
  }

  /* ── DETALLE ────────────────────────────────────────────── */
  function abrirDetalleMenu(menuId) {
    const p = menuItem(menuId);
    if (!p) return;
    detalleActual = { tipo: 'menu', id: p.id };
    const cat = $('#pwaDetailCat');
    const title = $('#pwaDetailTitle');
    const desc = $('#pwaDetailDesc');
    const price = $('#pwaDetailPrice');
    const img = $('#pwaDetailImg');
    if (cat) cat.textContent = p.catLabel || p.categoria;
    if (title) title.textContent = p.nombre;
    if (desc) desc.textContent = p.detalle + ' · Preparado al momento.';
    if (price) price.textContent = money(p.precio);
    if (img) {
      img.onerror = () => App.imgFallback(img, p.emoji || '🍽️', 'cyber');
      img.src = p.imagen;
      img.alt = p.nombre;
    }
    const accion = $('#pwaDetailAction');
    if (accion) {
      const s = sesionSeleccionada();
      accion.textContent = s ? `Cargar a ${s.equipo}` : 'Añadir a la orden';
    }
    App.openModal('pwaDetailModal');
    logEvento(`Consultó “${p.nombre}” en el menú.`, 'info');
  }

  /* ── RESERVAS ───────────────────────────────────────────── */
  function seleccionarZona(zonaId) {
    if (!zonaPorId(zonaId)) return;
    estado.zonaSel = zonaId;
    const sel = $('#pwaReservaZona');
    if (sel) sel.value = zonaId;
    renderZonas();
  }

  function reservar(event) {
    event.preventDefault();
    const nombreEl = $('#pwaReservaNombre');
    const zonaEl = $('#pwaReservaZona');
    const horasEl = $('#pwaReservaHoras');
    const error = $('#pwaReservaError');
    const nombre = (nombreEl.value || '').trim();
    const zona = zonaPorId(zonaEl.value);
    const horas = App.clamp(horasEl.value, 1, 5);

    nombreEl.classList.remove('invalid');
    if (error) error.textContent = '';

    if (!nombre) {
      nombreEl.classList.add('invalid');
      if (error) error.textContent = 'Escribe el nombre del jugador.';
      nombreEl.focus();
      logEvento('Intento de reserva sin nombre de jugador.', 'error');
      return;
    }
    if (!zona) {
      if (error) error.textContent = 'Selecciona una zona válida.';
      return;
    }

    const libres = estacionesLibres(zona);
    if (!libres.length) {
      if (error) error.textContent = 'La zona está llena. Elige otra o pide al staff liberar una estación.';
      App.toast('No quedan estaciones libres en ' + zona.nombre + '.', 'warn', 'Zona llena');
      logEvento(`Intento de reserva fallido: ${zona.nombre} sin estaciones libres.`, 'warn');
      return;
    }

    const equipo = libres[0];
    const sesion = {
      id: App.uid('ses'),
      cliente: nombre.slice(0, 40),
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      equipo: equipo,
      horas: horas,
      tarifa: zona.precio,
      cargoEstacion: zona.precio * horas,
      inicio: Date.now(),
      consumos: [],
      estacionPagada: false
    };
    estado.sesiones.push(sesion);
    estado.zonaSel = zona.id;
    if (!estado.gamertag) {
      estado.gamertag = nombre.slice(0, 32);
      App.store.set(KEYS.gamertag, estado.gamertag);
    }
    guardar();
    renderDespuesDeCambio();
    actualizarAliasUI();
    const menuSel = $('#pwaMenuEstacion');
    if (menuSel) menuSel.value = equipo;
    nombreEl.value = '';
    App.toast(`Reserva confirmada: ${equipo} · ${horas}h · ${money(sesion.cargoEstacion)}`, 'ok', '¡A jugar!');
    logEvento(`Reservó ${equipo} (${zona.nombre}) por ${horas}h a nombre de ${nombre}.`, 'ok');
    mostrarVista('vista-reservas-pwa');
  }

  function liberarSesion(equipo) {
    if (!estado.admin) {
      App.toast('Solo el personal puede liberar estaciones.', 'warn', 'Acceso restringido');
      return;
    }
    const sesion = estado.sesiones.find((s) => s.equipo === equipo);
    if (!sesion) {
      App.toast('No se encontró esa estación activa.', 'warn');
      return;
    }
    const lineas = lineasDeSesion(sesion);
    const total = lineas.reduce((sum, l) => sum + l.monto, 0);
    const mensaje = total > 0
      ? `¿Liberar ${equipo} y cobrar ${money(total)} de ${sesion.cliente}?`
      : `¿Liberar la estación ${equipo} de ${sesion.cliente}?`;
    if (!window.confirm(mensaje)) return;

    if (total > 0) {
      logVenta({
        cliente: sesion.cliente,
        motivo: 'Cierre de estación ' + equipo,
        items: lineas.map((l) => ({ nombre: l.nombre, qty: l.qty, precio: l.monto / l.qty, subtotal: l.monto })),
        total: total,
        estaciones: 1
      });
    }
    estado.sesiones = estado.sesiones.filter((s) => s.equipo !== equipo);
    guardar();
    renderDespuesDeCambio();
    App.toast(`${equipo} liberado.`, 'ok', 'Estación libre');
    logEvento(`Liberó ${equipo} de ${sesion.cliente}${total > 0 ? ' cobrando ' + money(total) : ''}.`, 'ok');
  }

  /* ── CHECKOUT ───────────────────────────────────────────── */
  function abrirCheckout() {
    const pend = pendientes();
    if (!pend.lineas.length) {
      App.toast('No hay estaciones ni consumos pendientes por cobrar.', 'info', 'Cuenta al día');
      return;
    }
    const resumen = $('#pwaCheckoutResumen');
    if (resumen) {
      resumen.innerHTML = pend.lineas.map((l) => `
        <div class="check-row">
          <div class="check-name">${esc(l.nombre)}${l.qty > 1 ? ' ×' + l.qty : ''}<small>${esc(l.detalle)}</small></div>
          <strong>${esc(money(l.monto))}</strong>
        </div>`).join('');
    }
    const total = $('#pwaCheckoutTotal');
    if (total) total.textContent = money(pend.total);
    const cliente = $('#pwaCheckoutCliente');
    if (cliente) {
      if (!cliente.value) {
        const primera = estado.sesiones[0];
        cliente.value = estado.gamertag || (primera ? primera.cliente : '');
      }
      cliente.classList.remove('invalid');
    }
    const error = $('#pwaCheckoutError');
    if (error) error.textContent = '';
    App.openModal('pwaCheckoutModal');
    logEvento(`Abrió el checkout con ${pend.items} ítem/s (${money(pend.total)}).`, 'info');
  }

  function pagar() {
    const pend = pendientes();
    if (!pend.lineas.length) {
      App.toast('La cuenta ya está pagada.', 'info');
      App.closeModal('pwaCheckoutModal');
      return;
    }
    const input = $('#pwaCheckoutCliente');
    const error = $('#pwaCheckoutError');
    const cliente = (input.value || '').trim();
    input.classList.remove('invalid');
    if (cliente.length < 2) {
      input.classList.add('invalid');
      if (error) error.textContent = 'Escribe el nombre del cliente para el ticket.';
      input.focus();
      return;
    }
    if (error) error.textContent = '';

    const items = pend.lineas.map((l) => ({
      nombre: l.tipo === 'estacion' ? `${l.nombre} (${l.detalle.split(' · ')[1] || ''})` : l.nombre,
      qty: l.qty,
      precio: Math.round(l.monto / l.qty),
      subtotal: l.monto
    }));
    logVenta({
      cliente: cliente,
      items: items,
      total: pend.total,
      estaciones: estado.sesiones.length,
      motivo: 'Checkout general'
    });
    estado.sesiones.forEach((s) => {
      s.estacionPagada = true;
      s.consumos.forEach((c) => { c.pagado = true; });
    });
    estado.orden = [];
    guardar();
    renderDespuesDeCambio();
    App.closeModal('pwaCheckoutModal');
    input.value = '';
    App.toast(`Pago registrado: ${money(pend.total)} · ${cliente}`, 'ok', 'Transacción exitosa');
    logEvento(`Cobró ${money(pend.total)} a ${cliente} (${pend.items} ítem/s).`, 'ok');
  }

  /* ── KARAOKE ────────────────────────────────────────────── */
  function leerKaraoke() {
    const data = App.store.get(KEYS.karaoke, []);
    return Array.isArray(data) ? data.filter((k) => k && k.cancion) : [];
  }

  function renderKaraoke() {
    const host = $('#pwaKaraokeLista');
    if (!host) return;
    const lista = leerKaraoke();
    const count = $('#pwaKaraokeCount');
    if (count) count.textContent = String(lista.length);
    host.innerHTML = lista.length
      ? lista.map((k, idx) => `
          <li class="karaoke-item">
            <span class="karaoke-num">${idx + 1}</span>
            <span class="karaoke-text">
              <strong>${esc(k.cancion)}</strong>
              <small>${esc(k.alias || 'Invitado')} · ${esc(App.dateTime(k.t))}</small>
            </span>
            <button type="button" class="karaoke-del" data-karaoke-del="${esc(k.id)}" aria-label="Quitar canción">✕</button>
          </li>`).join('')
      : '<li class="karaoke-empty">La pista está libre. ¡Pide la primera canción! 🎶</li>';
  }

  function pedirKaraoke(event) {
    event.preventDefault();
    const input = $('#pwaKaraokeInput');
    const cancion = (input.value || '').trim().slice(0, 60);
    if (cancion.length < 3) {
      App.toast('Escribe el nombre de una canción o artista.', 'warn');
      input.focus();
      return;
    }
    const lista = leerKaraoke();
    lista.push({ id: App.uid('karaoke'), cancion: cancion, alias: aliasActual(), t: Date.now() });
    App.store.set(KEYS.karaoke, lista.slice(-40));
    renderKaraoke();
    input.value = '';
    App.toast(`“${cancion}” agregada a la cola.`, 'ok', 'Karaoke');
    logEvento(`Pidió la canción “${cancion}” en karaoke.`, 'info');
  }

  function borrarKaraoke(id) {
    const lista = leerKaraoke();
    const cancion = lista.find((k) => k.id === id);
    App.store.set(KEYS.karaoke, lista.filter((k) => k.id !== id));
    renderKaraoke();
    App.toast('Canción eliminada de la cola.', 'warn');
    if (cancion) logEvento(`Quitó “${cancion.cancion}” de la cola de karaoke.`, 'warn');
  }

  /* ── ALIAS / ADMIN ──────────────────────────────────────── */
  function actualizarAliasUI() {
    renderHUD();
    const tag = $('#pwaGamertagInput');
    if (tag && estado.gamertag) tag.value = estado.gamertag;
    const clienteTag = $('#pwaClientGamertag');
    if (clienteTag && estado.gamertag) clienteTag.value = estado.gamertag;
    const reserva = $('#pwaReservaNombre');
    if (reserva && estado.gamertag && !reserva.value) reserva.value = estado.gamertag;
    const checkout = $('#pwaCheckoutCliente');
    if (checkout && estado.gamertag && !checkout.value) checkout.value = estado.gamertag;
  }

  function guardarGamertag(valor, desdeModal) {
    const alias = String(valor || '').trim().slice(0, 32);
    if (!alias) {
      App.toast('Escribe un gamertag válido.', 'warn');
      return;
    }
    estado.gamertag = alias;
    App.store.set(KEYS.gamertag, alias);
    actualizarAliasUI();
    if (desdeModal) App.closeModal('pwaCuentaModal');
    App.toast(`¡Bienvenido(a), ${alias}! 🎮`, 'ok', 'Gamertag guardado');
    logEvento(`Guardó su gamertag como “${alias}”.`, 'ok');
  }

  function aplicarAdminUI() {
    document.body.classList.toggle('is-admin', estado.admin);
    const logout = $('#pwaAdminLogout');
    if (logout) logout.classList.toggle('hidden', !estado.admin);
    const drawerLogout = $('#pwaDrawerLogout');
    if (drawerLogout) drawerLogout.classList.toggle('hidden', !estado.admin);
    const form = $('#pwaAdminForm');
    if (form) form.classList.toggle('hidden', estado.admin);
    if (estado.admin) renderLogs();
  }

  function loginAdmin(event) {
    event.preventDefault();
    const usuario = ($('#pwaAdminUser').value || '').trim().toLowerCase();
    const clave = ($('#pwaAdminPass').value || '').trim();
    const error = $('#pwaAdminError');
    const valido = CLAVE_ADMIN[usuario] && CLAVE_ADMIN[usuario] === clave;

    $$('#pwaAdminForm .input').forEach((i) => i.classList.remove('invalid'));
    if (!valido) {
      if (error) error.textContent = 'Usuario o contraseña incorrectos. Usa admin / ciber123.';
      $('#pwaAdminUser').classList.add('invalid');
      $('#pwaAdminPass').classList.add('invalid');
      logEvento(`Intento de acceso admin fallido (usuario “${usuario || 'vacío'}”).`, 'error');
      return;
    }

    if (error) error.textContent = '';
    estado.admin = true;
    setAdmin(true);
    aplicarAdminUI();
    App.closeModal('pwaCuentaModal');
    $('#pwaAdminForm').reset();
    actualizarAliasUI();
    App.toast('Modo administrador activo. Bitácoras desbloqueadas.', 'ok', 'Sesión admin');
    logEvento(`El administrador “${usuario}” inició sesión en la PWA.`, 'ok');
  }

  function logoutAdmin() {
    estado.admin = false;
    setAdmin(false);
    aplicarAdminUI();
    App.closeModal('pwaCuentaModal');
    actualizarAliasUI();
    if ($('#vista-bitacoras-pwa').classList.contains('active')) mostrarVista('vista-lobby-pwa');
    App.toast('Sesión de administrador cerrada.', 'info');
    logEvento('El administrador cerró sesión en la PWA.', 'info');
  }

  /* ── CUENTA ─────────────────────────────────────────────── */
  function cuentaCardHTML(s) {
    const consumosPend = s.consumos.filter((c) => !c.pagado);
    const totalConsumos = consumosPend.reduce((sum, c) => sum + c.precio * c.qty, 0);
    const pendiente = (s.estacionPagada ? 0 : s.cargoEstacion) + totalConsumos;
    return `
      <div class="cuenta-card">
        <div class="row-between">
          <strong>${esc(s.equipo)} · ${esc(s.cliente)}</strong>
          <span class="badge ${pendiente > 0 ? 'warn' : 'ok'}">${pendiente > 0 ? 'Pendiente' : 'Pagado'}</span>
        </div>
        <div class="cuenta-rows">
          <div class="row-between"><span>Zona</span><strong>${esc(s.zonaNombre)}</strong></div>
          <div class="row-between"><span>Inicio</span><strong>${esc(App.dateTime(s.inicio))}</strong></div>
          <div class="row-between"><span>Tiempo</span><strong><span class="timer" data-inicio="${esc(s.inicio)}">${esc(duracion(s.inicio))}</span> / ${s.horas}h</strong></div>
          <div class="row-between"><span>Estación</span><strong>${esc(money(s.cargoEstacion))} ${s.estacionPagada ? '· pagado' : ''}</strong></div>
          <div class="row-between"><span>Consumos</span><strong>${consumosPend.length ? esc(money(totalConsumos)) : 'Sin consumos'}</strong></div>
        </div>
        <div class="order-total"><span>Pendiente</span><strong>${esc(money(pendiente))}</strong></div>
      </div>`;
  }

  function buscarCuenta(termino) {
    const host = $('#pwaCuentaResultado');
    if (!host) return;
    const q = String(termino || '').trim().toLowerCase();
    if (!q) {
      host.innerHTML = '<div class="log-empty">Escribe un nombre o código de estación.</div>';
      return;
    }
    const encontradas = estado.sesiones.filter((s) =>
      s.cliente.toLowerCase().includes(q) || s.equipo.toLowerCase().includes(q)
    );
    host.innerHTML = encontradas.length
      ? encontradas.map(cuentaCardHTML).join('')
      : '<div class="log-empty">No hay sesiones activas que coincidan con “' + esc(termino) + '”.</div>';
    logEvento(`Consultó la cuenta de “${termino}” desde la PWA.`, 'info');
  }

  /* ── NAVEGACIÓN ─────────────────────────────────────────── */
  function cerrarDrawer() {
    const drawer = $('#pwaNav');
    if (!drawer) return;
    drawer.classList.remove('open');
    $$('[data-nav-toggle]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  }

  function mostrarVista(id) {
    const destino = document.getElementById(id);
    if (!destino) return;
    if (id === 'vista-bitacoras-pwa' && !estado.admin) {
      App.toast('Inicia sesión como administrador para ver las bitácoras.', 'warn', 'Acceso restringido');
      App.openModal('pwaCuentaModal');
      return;
    }
    $$('.pwa-view').forEach((v) => v.classList.toggle('active', v.id === id));
    $$('.pwa-dock-btn').forEach((b) => {
      const activo = b.dataset.view === id;
      b.classList.toggle('active', activo);
      b.setAttribute('aria-current', activo ? 'page' : 'false');
    });
    $$('.drawer-link').forEach((b) => b.classList.toggle('active', b.dataset.view === id));
    const zona = $('#pwaZona');
    if (zona) zona.textContent = destino.dataset.title || 'Cyber Arena';
    if (id === 'vista-bitacoras-pwa') renderLogs();
    cerrarDrawer();
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── EVENTOS ────────────────────────────────────────────── */
  function enlazarEventos() {
    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-view]');
      if (nav) {
        event.preventDefault();
        mostrarVista(nav.dataset.view);
        return;
      }
      const quitar = event.target.closest('[data-quitar]');
      if (quitar) {
        event.preventDefault();
        quitarLinea(quitar);
        return;
      }
      const cargar = event.target.closest('[data-cargar]');
      if (cargar) {
        event.preventDefault();
        mostrarVista('vista-cafeteria-pwa');
        const sel = $('#pwaMenuEstacion');
        if (sel) sel.value = cargar.dataset.cargar;
        App.toast(`Elige productos para cargar a ${cargar.dataset.cargar}.`, 'info', 'Consumo');
        return;
      }
      const karaokeDel = event.target.closest('[data-karaoke-del]');
      if (karaokeDel) {
        event.preventDefault();
        borrarKaraoke(karaokeDel.dataset.karaokeDel);
      }
    });

    const navClose = $('#pwaNavClose');
    if (navClose) navClose.addEventListener('click', cerrarDrawer);
    const scrim = $('#pwaScrim');
    if (scrim) scrim.addEventListener('click', cerrarDrawer);

    const gamertagForm = $('#pwaGamertagForm');
    if (gamertagForm) {
      gamertagForm.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarGamertag($('#pwaGamertagInput').value, false);
      });
    }

    const zonasGrid = $('#pwaZonasGrid');
    if (zonasGrid) {
      zonasGrid.addEventListener('click', (event) => {
        const card = event.target.closest('[data-zona]');
        if (!card) return;
        seleccionarZona(card.dataset.zona);
        const form = $('#pwaReservaForm');
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    const reservaZona = $('#pwaReservaZona');
    if (reservaZona) reservaZona.addEventListener('change', () => seleccionarZona(reservaZona.value));

    const reservaForm = $('#pwaReservaForm');
    if (reservaForm) reservaForm.addEventListener('submit', reservar);

    const reservaNombre = $('#pwaReservaNombre');
    if (reservaNombre) {
      reservaNombre.addEventListener('input', () => {
        reservaNombre.classList.remove('invalid');
        const error = $('#pwaReservaError');
        if (error) error.textContent = '';
      });
    }

    const mapa = $('#pwaMapa');
    if (mapa) {
      mapa.addEventListener('click', (event) => {
        const est = event.target.closest('[data-station]');
        if (!est) return;
        const codigo = est.dataset.station;
        const sesion = estado.sesiones.find((s) => s.equipo === codigo);
        if (sesion) {
          mostrarVista('vista-cuenta-pwa');
          const input = $('#pwaCuentaBusqueda');
          if (input) input.value = codigo;
          buscarCuenta(codigo);
        } else {
          seleccionarZona(est.dataset.zona);
          mostrarVista('vista-reservas-pwa');
          App.toast(`${codigo} está libre. Completa el formulario.`, 'info');
          if (reservaNombre) reservaNombre.focus();
        }
      });
    }

    const busqueda = $('#pwaMenuBusqueda');
    if (busqueda) {
      busqueda.addEventListener('input', () => {
        estado.qMenu = busqueda.value;
        renderMenu();
      });
    }

    const filtros = $('#pwaMenuFiltros');
    if (filtros) {
      filtros.addEventListener('click', (event) => {
        const chip = event.target.closest('[data-menu-cat]');
        if (!chip) return;
        estado.filtroMenu = chip.dataset.menuCat;
        renderMenu();
        logEvento(`Filtró el menú por “${estado.filtroMenu}”.`, 'info');
      });
    }

    const grid = $('#pwaMenuGrid');
    if (grid) {
      grid.addEventListener('click', (event) => {
        const add = event.target.closest('[data-add-menu]');
        if (add) {
          event.stopPropagation();
          agregarMenu(add.dataset.addMenu);
          return;
        }
        const detail = event.target.closest('[data-detail-menu]');
        if (detail) {
          event.stopPropagation();
          abrirDetalleMenu(detail.dataset.detailMenu);
          return;
        }
        const reset = event.target.closest('[data-reset-menu]');
        if (reset) {
          estado.filtroMenu = 'todos';
          estado.qMenu = '';
          const input = $('#pwaMenuBusqueda');
          if (input) input.value = '';
          renderMenu();
          return;
        }
        const card = event.target.closest('[data-menu-card]');
        if (card) abrirDetalleMenu(card.dataset.menuCard);
      });
    }

    const detailAction = $('#pwaDetailAction');
    if (detailAction) {
      detailAction.addEventListener('click', () => {
        if (detalleActual && detalleActual.tipo === 'menu') agregarMenu(detalleActual.id);
        App.closeModal('pwaDetailModal');
      });
    }

    const buscarBtn = $('#pwaCuentaBuscar');
    if (buscarBtn) buscarBtn.addEventListener('click', () => buscarCuenta($('#pwaCuentaBusqueda').value));
    const cuentaInput = $('#pwaCuentaBusqueda');
    if (cuentaInput) {
      cuentaInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          buscarCuenta(cuentaInput.value);
        }
      });
    }

    const liberar = $('#pwaLiberarBtn');
    if (liberar) {
      liberar.addEventListener('click', () => {
        const sel = $('#pwaLiberarSelect');
        if (!sel || !sel.value) {
          App.toast('No hay sesiones activas para liberar.', 'info');
          return;
        }
        liberarSesion(sel.value);
      });
    }

    const miniCheckout = $('#pwaMiniCheckout');
    if (miniCheckout) miniCheckout.addEventListener('click', abrirCheckout);
    const btnCheckout = $('#pwaBtnCheckout');
    if (btnCheckout) btnCheckout.addEventListener('click', abrirCheckout);
    const pagarBtn = $('#pwaCheckoutPagar');
    if (pagarBtn) pagarBtn.addEventListener('click', pagar);

    const clientForm = $('#pwaClientForm');
    if (clientForm) {
      clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarGamertag($('#pwaClientGamertag').value, true);
      });
    }

    const adminForm = $('#pwaAdminForm');
    if (adminForm) adminForm.addEventListener('submit', loginAdmin);

    ['#pwaAdminLogout', '#pwaDrawerLogout', '#pwaCuentaLogout'].forEach((sel) => {
      const btn = $(sel);
      if (btn) btn.addEventListener('click', logoutAdmin);
    });

    const karaokeForm = $('#pwaKaraokeForm');
    if (karaokeForm) karaokeForm.addEventListener('submit', pedirKaraoke);

    const karaokeClear = $('#pwaKaraokeClear');
    if (karaokeClear) {
      karaokeClear.addEventListener('click', () => {
        if (!estado.admin) return;
        if (!window.confirm('¿Vaciar toda la cola de karaoke?')) return;
        App.store.remove(KEYS.karaoke);
        renderKaraoke();
        App.toast('Cola de karaoke vaciada.', 'warn');
        logEvento('El administrador vació la cola de karaoke.', 'warn');
      });
    }

    const refresh = $('#pwaRefreshLogs');
    if (refresh) {
      refresh.addEventListener('click', () => {
        renderLogs();
        App.toast('Bitácoras actualizadas.', 'info');
      });
    }

    const clear = $('#pwaClearLogs');
    if (clear) {
      clear.addEventListener('click', () => {
        if (!estado.admin) return;
        if (!window.confirm('¿Limpiar todas las bitácoras de eventos y ventas?')) return;
        App.store.remove(KEYS.eventos);
        App.store.remove(KEYS.ventas);
        renderLogs();
        logEvento('Bitácoras reiniciadas por el administrador desde la PWA.', 'warn');
        App.toast('Bitácoras liberadas.', 'warn');
      });
    }
  }

  function actualizarReloj() {
    $$('.timer[data-inicio]').forEach((el) => {
      el.textContent = duracion(el.dataset.inicio);
    });
  }

  /* ── ARRANQUE ───────────────────────────────────────────── */
  App.ready(() => {
    if (!ZONAS.length || !MENU.length) {
      App.toast('No se pudieron cargar los datos de Cyber Arena.', 'error');
      return;
    }

    enlazarEventos();
    aplicarAdminUI();
    actualizarAliasUI();
    renderMenu();
    renderKaraoke();
    renderDespuesDeCambio();
    actualizarReloj();
    window.setInterval(actualizarReloj, 1000);

    if (!leerLog(KEYS.eventos).length) {
      logEvento(`App móvil iniciada con ${MENU.length} productos y ${ZONAS.length} zonas.`, 'ok');
    }

    if (location.hash && document.getElementById(location.hash.slice(1))) {
      mostrarVista(location.hash.slice(1));
    }

    App.registerSW('sw.js');
    App.toast('Cyber Arena móvil listo. 🎮', 'ok', 'Bienvenido');
  });
})();
