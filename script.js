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
    admin: 'ciber_admin_logged'
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
    const cajaEventos = $('#ciberLogEventos');
    const cajaVentas = $('#ciberLogVentas');
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

    const kpiVentas = $('#ciberKpiVentas');
    if (kpiVentas) kpiVentas.textContent = money(totalVentas);
    const kpiEventos = $('#ciberKpiEventos');
    if (kpiEventos) kpiEventos.textContent = String(eventos.length);
    const kpiSesiones = $('#ciberKpiSesiones');
    if (kpiSesiones) kpiSesiones.textContent = String(estado.sesiones.length);
    const kpiTicket = $('#ciberKpiTicket');
    if (kpiTicket) kpiTicket.textContent = money(ticket);
  }

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

  function renderHUD() {
    const pend = pendientes();
    const items = $('#hudItems');
    const total = $('#hudTotal');
    const badge = $('#ordenBadge');
    if (items) items.textContent = String(pend.items);
    if (total) total.textContent = App.money(pend.total);
    if (badge) badge.textContent = pend.items + (pend.items === 1 ? ' ítem' : ' ítems');

    const jugador = $('#hudJugador');
    if (jugador) jugador.textContent = 'Cliente: ' + (estado.gamertag || 'Invitado');
    const avatar = $('#hudAvatar');
    if (avatar) {
      if (estado.admin) avatar.textContent = 'AD';
      else if (estado.gamertag) avatar.textContent = estado.gamertag.slice(0, 2).toUpperCase();
      else avatar.textContent = 'VIP';
    }

    const btn = $('#ciberCuentaBtn');
    if (btn) btn.textContent = estado.admin ? '👑 Admin' : '👤 Mi cuenta';
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

  function renderListaOrden(host, vacio) {
    if (!host) return;
    const pend = pendientes();
    host.innerHTML = pend.lineas.length
      ? pend.lineas.map(lineaOrdenHTML).join('')
      : `<li class="order-empty"><span class="empty-icon">🧾</span><span>${esc(vacio)}</span></li>`;
  }

  function renderOrdenes() {
    const pend = pendientes();
    renderListaOrden($('#lobbyOrden'), 'Sin reservas ni consumos pendientes.');
    renderListaOrden($('#cafeteriaOrden'), 'Aún no agregaste productos. Elige del menú para comenzar.');
    const totalLobby = $('#lobbyTotalOrden');
    if (totalLobby) totalLobby.textContent = money(pend.total);
    const totalCafe = $('#cafeteriaTotal');
    if (totalCafe) totalCafe.textContent = money(pend.total);
    const badgeCafe = $('#cafeteriaBadge');
    if (badgeCafe) badgeCafe.textContent = String(pend.items);
    const btnLobby = $('#btnCheckoutLobby');
    if (btnLobby) btnLobby.disabled = !pend.lineas.length;
    const btnCafe = $('#btnCheckoutCafeteria');
    if (btnCafe) btnCafe.disabled = !pend.lineas.length;
  }

  function renderLobby() {
    const pend = pendientes();
    const sesiones = $('#lobbySesiones');
    const consumos = $('#lobbyConsumos');
    const total = $('#lobbyTotal');
    if (sesiones) sesiones.textContent = String(estado.sesiones.length);
    if (consumos) consumos.textContent = String(pend.consumos);
    if (total) total.textContent = money(pend.total);
  }

  function renderZonas() {
    const host = $('#zonasGrid');
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
          <span class="zona-price">
            <strong>${esc(money(zona.precio))}</strong>
            <small>por hora</small>
          </span>
        </button>`;
    }).join('');
  }

  function renderMapa() {
    const host = $('#mapaEstaciones');
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
    host.innerHTML = piezas.join('') || '<p class="muted small">No hay estaciones configuradas.</p>';
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
          <span class="badge ${s.estacionPagada ? 'ok' : 'warn'}">${s.estacionPagada ? 'Estación pagada' : 'Por cobrar'}</span>
        </div>
        <div class="session-meta">
          <span>👤 <b>${esc(s.cliente)}</b></span>
          <span>🎮 ${esc(s.zonaNombre)}</span>
          <span>⏱ <span class="timer" data-inicio="${esc(s.inicio)}">${esc(duracion(s.inicio))}</span> / ${s.horas}h</span>
        </div>
        <div class="session-charges">${chips}</div>
        <div class="session-total">
          <span>Pendiente de pago</span>
          <strong>${esc(money(pendiente))}</strong>
        </div>
        ${conAccion ? `<button type="button" class="btn btn-ghost btn-xs" data-cargar="${esc(s.equipo)}">🍔 Cargar consumo a esta estación</button>` : ''}
      </div>`;
  }

  function renderSesiones() {
    const host = $('#sesionesActivas');
    if (!host) return;
    host.innerHTML = estado.sesiones.length
      ? estado.sesiones.map((s) => sesionHTML(s, false)).join('')
      : '<div class="empty-slot">No hay sesiones activas. Reserva una estación para comenzar.</div>';
  }

  function renderCuentaSesiones() {
    const host = $('#cuentaSesiones');
    if (!host) return;
    host.innerHTML = estado.sesiones.length
      ? estado.sesiones.map((s) => sesionHTML(s, true)).join('')
      : '<div class="empty-slot">Todas las estaciones están libres en este momento.</div>';
  }

  function renderSelects() {
    const zonaSel = $('#reservaZona');
    if (zonaSel) {
      const anterior = zonaSel.value;
      zonaSel.innerHTML = ZONAS.map((zona) => {
        const libres = estacionesLibres(zona);
        const llena = libres.length === 0;
        return `<option value="${esc(zona.id)}" ${llena && zona.id !== anterior ? 'disabled' : ''}>
          ${esc(zona.emoji || '🎮')} ${esc(zona.nombre)} · ${esc(money(zona.precio))}/h${llena ? ' (llena)' : ' · ' + libres.length + ' libres'}
        </option>`;
      }).join('');
      if (anterior && ZONAS.some((z) => z.id === anterior)) zonaSel.value = anterior;
      else if (estado.zonaSel) zonaSel.value = estado.zonaSel;
    }

    const menuSel = $('#menuEstacion');
    if (menuSel) {
      const anterior = menuSel.value;
      const opciones = ['<option value="">🍽️ Mostrador (orden general)</option>'];
      estado.sesiones.forEach((s) => {
        opciones.push(`<option value="${esc(s.equipo)}">${esc(s.equipo)} · ${esc(s.cliente)}</option>`);
      });
      menuSel.innerHTML = opciones.join('');
      if (anterior && estado.sesiones.some((s) => s.equipo === anterior)) menuSel.value = anterior;
    }

    const liberar = $('#liberarEstacion');
    if (liberar) {
      const anterior = liberar.value;
      liberar.innerHTML = estado.sesiones.length
        ? estado.sesiones.map((s) => `<option value="${esc(s.equipo)}">${esc(s.equipo)} · ${esc(s.cliente)} (${esc(money((s.estacionPagada ? 0 : s.cargoEstacion) + s.consumos.filter((c) => !c.pagado).reduce((sum, c) => sum + c.precio * c.qty, 0)))})</option>`).join('')
        : '<option value="">Sin sesiones activas</option>';
      if (anterior && estado.sesiones.some((s) => s.equipo === anterior)) liberar.value = anterior;
    }
    const btnLiberar = $('#liberarBtn');
    if (btnLiberar) btnLiberar.disabled = !estado.sesiones.length;
  }

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
    const host = $('#menuFiltros');
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
    const grid = $('#menuGrid');
    if (!grid) return;
    const lista = menuCoincidencias();

    if (!lista.length) {
      grid.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <span class="empty-icon">🍽️</span>
          <strong>No encontramos ese antojo</strong>
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
              <button type="button" class="menu-zoom" data-detail-menu="${p.id}">🔍 Ver</button>
            </div>
            <div class="menu-body">
              <h4>${esc(p.nombre)}</h4>
              <p>${esc(p.detalle)}</p>
              <div class="menu-foot">
                <span class="menu-price">${esc(money(p.precio))}<small>${qty ? qty + ' en la cuenta' : 'precio unitario'}</small></span>
                <button type="button" class="btn btn-accent" data-add-menu="${p.id}">＋ Añadir</button>
              </div>
            </div>
          </article>`;
      }).join('');
    }

    renderMenuFiltros();

    const info = $('#menuResultInfo');
    if (info) {
      const cat = estado.filtroMenu === 'todos'
        ? 'todo el menú'
        : (CATS.find((c) => c.id === estado.filtroMenu) || {}).label || estado.filtroMenu;
      info.textContent = `Mostrando ${lista.length} de ${MENU.length} productos · ${cat}${estado.qMenu ? ` · búsqueda: “${estado.qMenu}”` : ''}`;
    }
  }

  function sesionSeleccionada() {
    const sel = $('#menuEstacion');
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
      App.toast(`“${p.nombre}” cargado a ${sesion.equipo} (${sesion.cliente}).`, 'ok', 'Consumo');
      logEvento(`Cargó “${p.nombre}” a ${sesion.equipo} de ${sesion.cliente}.`, 'ok');
      return;
    }

    const linea = estado.orden.find((l) => l.menuId === p.id);
    if (linea) linea.qty = App.clamp(linea.qty + 1, 1, 99);
    else estado.orden.push({ menuId: p.id, qty: 1 });
    guardar();
    renderDespuesDeCambio();
    App.toast(`“${p.nombre}” añadido a la orden general.`, 'ok', 'Mostrador');
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
    renderCuentaSesiones();
    renderSelects();
    if (estado.admin) renderLogs();
  }

  function abrirDetalleMenu(menuId) {
    const p = menuItem(menuId);
    if (!p) return;
    detalleActual = { tipo: 'menu', id: p.id };
    const cat = $('#ciberDetailCat');
    const title = $('#ciberDetailTitle');
    const desc = $('#ciberDetailDesc');
    const price = $('#ciberDetailPrice');
    const img = $('#ciberDetailImg');
    if (cat) cat.textContent = p.catLabel || p.categoria;
    if (title) title.textContent = p.nombre;
    if (desc) desc.textContent = p.detalle + ' · Preparado al momento en nuestra cafetería.';
    if (price) price.textContent = money(p.precio);
    if (img) {
      img.onerror = () => App.imgFallback(img, p.emoji || '🍽️', 'cyber');
      img.src = p.imagen;
      img.alt = p.nombre;
    }
    const accion = $('#ciberDetailAction');
    if (accion) {
      const s = sesionSeleccionada();
      accion.textContent = s ? `Cargar a ${s.equipo}` : 'Añadir a la orden';
    }
    App.openModal('ciberDetailModal');
    logEvento(`Consultó “${p.nombre}” en el menú.`, 'info');
  }

  function seleccionarZona(zonaId) {
    if (!zonaPorId(zonaId)) return;
    estado.zonaSel = zonaId;
    const sel = $('#reservaZona');
    if (sel) sel.value = zonaId;
    renderZonas();
  }

  function reservar(event) {
    event.preventDefault();
    const nombreEl = $('#reservaNombre');
    const zonaEl = $('#reservaZona');
    const horasEl = $('#reservaHoras');
    const error = $('#reservaError');
    const nombre = (nombreEl.value || '').trim();
    const zona = zonaPorId(zonaEl.value);
    const horas = App.clamp(horasEl.value, 1, 5);

    nombreEl.classList.remove('invalid');
    if (error) error.textContent = '';

    if (!nombre) {
      nombreEl.classList.add('invalid');
      if (error) error.textContent = 'Escribe el nombre del jugador para reservar.';
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
      if (error) error.textContent = 'La zona está llena. Libera una estación o elige otra zona.';
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
      const inputTag = $('#gamertagInput');
      if (inputTag) inputTag.value = estado.gamertag;
    }
    guardar();
    renderDespuesDeCambio();

    const menuSel = $('#menuEstacion');
    if (menuSel) menuSel.value = equipo;
    nombreEl.value = '';
    App.toast(`Reserva confirmada: ${equipo} · ${horas}h · ${money(sesion.cargoEstacion)}`, 'ok', '¡Estación asignada!');
    logEvento(`Reservó ${equipo} (${zona.nombre}) por ${horas}h a nombre de ${nombre}.`, 'ok');
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
    App.toast(`${equipo} liberado. Sesión de ${sesion.cliente} finalizada.`, 'ok', 'Estación libre');
    logEvento(`Liberó ${equipo} de ${sesion.cliente}${total > 0 ? ' cobrando ' + money(total) : ''}.`, 'ok');
  }

  function abrirCheckout() {
    const pend = pendientes();
    if (!pend.lineas.length) {
      App.toast('No hay estaciones ni consumos pendientes por cobrar.', 'info', 'Cuenta al día');
      return;
    }
    const resumen = $('#checkoutResumen');
    if (resumen) {
      resumen.innerHTML = pend.lineas.map((l) => `
        <div class="check-row">
          <div class="check-name">${esc(l.nombre)}${l.qty > 1 ? ' ×' + l.qty : ''}<small>${esc(l.detalle)}</small></div>
          <strong>${esc(money(l.monto))}</strong>
        </div>`).join('');
    }
    const total = $('#checkoutTotal');
    if (total) total.textContent = money(pend.total);
    const cliente = $('#checkoutCliente');
    if (cliente) {
      if (!cliente.value) {
        const primera = estado.sesiones[0];
        cliente.value = estado.gamertag || (primera ? primera.cliente : '');
      }
      cliente.classList.remove('invalid');
    }
    const error = $('#checkoutError');
    if (error) error.textContent = '';
    App.openModal('checkoutModal');
    logEvento(`Abrió el checkout con ${pend.items} ítem/s (${money(pend.total)}).`, 'info');
  }

  function pagar() {
    const pend = pendientes();
    if (!pend.lineas.length) {
      App.toast('La cuenta ya está pagada.', 'info');
      App.closeModal('checkoutModal');
      return;
    }
    const input = $('#checkoutCliente');
    const error = $('#checkoutError');
    const cliente = (input.value || '').trim();
    input.classList.remove('invalid');
    if (cliente.length < 2) {
      input.classList.add('invalid');
      if (error) error.textContent = 'Escribe el nombre del cliente para emitir el ticket.';
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
    const ticket = {
      cliente: cliente,
      items: items,
      total: pend.total,
      estaciones: estado.sesiones.length,
      motivo: 'Checkout general'
    };
    logVenta(ticket);
    estado.sesiones.forEach((s) => {
      s.estacionPagada = true;
      s.consumos.forEach((c) => { c.pagado = true; });
    });
    estado.orden = [];
    guardar();
    renderDespuesDeCambio();
    App.closeModal('checkoutModal');
    if (input) input.value = '';
    App.toast(`Pago registrado: ${money(pend.total)} · ${cliente}`, 'ok', 'Transacción exitosa');
    logEvento(`Cobró ${money(pend.total)} a ${cliente} (${pend.items} ítem/s).`, 'ok');
  }

  function actualizarAliasUI() {
    renderHUD();
    const tag = $('#gamertagInput');
    if (tag && estado.gamertag) tag.value = estado.gamertag;
    const clienteTag = $('#ciberClientGamertag');
    if (clienteTag && estado.gamertag) clienteTag.value = estado.gamertag;
    const reserva = $('#reservaNombre');
    if (reserva && estado.gamertag && !reserva.value) reserva.value = estado.gamertag;
    const checkout = $('#checkoutCliente');
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
    if (desdeModal) App.closeModal('ciberCuentaModal');
    App.toast(`¡Bienvenido(a), ${alias}! 🎮`, 'ok', 'Gamertag guardado');
    logEvento(`Guardó su gamertag como “${alias}”.`, 'ok');
  }

  function aplicarAdminUI() {
    document.body.classList.toggle('is-admin', estado.admin);
    const btn = $('#ciberCuentaBtn');
    if (btn) btn.textContent = estado.admin ? '👑 Admin' : '👤 Mi cuenta';
    const logout = $('#ciberAdminLogout');
    if (logout) logout.classList.toggle('hidden', !estado.admin);
    const form = $('#ciberAdminForm');
    if (form) form.classList.toggle('hidden', estado.admin);
    const dock = $('#dockBitacoras');
    if (dock) dock.setAttribute('aria-hidden', estado.admin ? 'false' : 'true');
    if (estado.admin) renderLogs();
  }

  function loginAdmin(event) {
    event.preventDefault();
    const usuario = ($('#ciberAdminUser').value || '').trim().toLowerCase();
    const clave = ($('#ciberAdminPass').value || '').trim();
    const error = $('#ciberAdminError');
    const valido = CLAVE_ADMIN[usuario] && CLAVE_ADMIN[usuario] === clave;

    $$('#ciberAdminForm .input').forEach((i) => i.classList.remove('invalid'));
    if (!valido) {
      if (error) error.textContent = 'Usuario o contraseña incorrectos. Usa admin / ciber123.';
      $('#ciberAdminUser').classList.add('invalid');
      $('#ciberAdminPass').classList.add('invalid');
      logEvento(`Intento de acceso admin fallido (usuario “${usuario || 'vacío'}”).`, 'error');
      return;
    }

    if (error) error.textContent = '';
    estado.admin = true;
    setAdmin(true);
    aplicarAdminUI();
    App.closeModal('ciberCuentaModal');
    $('#ciberAdminForm').reset();
    App.toast('Modo administrador activo. Bitácoras desbloqueadas.', 'ok', 'Sesión admin');
    logEvento(`El administrador “${usuario}” inició sesión.`, 'ok');
  }

  function logoutAdmin() {
    estado.admin = false;
    setAdmin(false);
    aplicarAdminUI();
    App.closeModal('ciberCuentaModal');
    if ($('#vista-bitacoras').classList.contains('active')) mostrarVista('vista-lobby');
    App.toast('Sesión de administrador cerrada.', 'info');
    logEvento('El administrador cerró sesión.', 'info');
  }

  function renderRadar() {
    const host = $('#radarResultados');
    const input = $('#radarBusqueda');
    if (!host || !input) return;
    const q = input.value.trim().toLowerCase();
    if (!q) {
      host.innerHTML = '<p class="radar-empty">Busca un equipo (PC-01), una zona, un cliente o un producto del menú.</p>';
      return;
    }

    const resultados = [];
    MENU.forEach((p) => {
      if ([p.nombre, p.detalle, p.catLabel].join(' ').toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'menu',
          id: p.id,
          icono: p.emoji || '🍽️',
          titulo: p.nombre,
          sub: money(p.precio) + ' · ' + (p.catLabel || p.categoria),
          tag: 'Menú'
        });
      }
    });
    ZONAS.forEach((z) => {
      if ([z.nombre, z.detalle, z.prefijo].join(' ').toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'zona',
          id: z.id,
          icono: z.emoji || '🎮',
          titulo: z.nombre,
          sub: money(z.precio) + '/h · ' + estacionesLibres(z).length + ' libres',
          tag: 'Zona'
        });
      }
      for (let i = 1; i <= z.capacidad; i += 1) {
        const codigo = z.prefijo + '-' + String(i).padStart(2, '0');
        const sesion = estado.sesiones.find((s) => s.equipo === codigo);
        if (codigo.toLowerCase().includes(q) || (sesion && sesion.cliente.toLowerCase().includes(q))) {
          resultados.push({
            tipo: sesion ? 'sesion' : 'estacion',
            id: codigo,
            icono: z.emoji || '🖥️',
            titulo: codigo + (sesion ? ' · ' + sesion.cliente : ' · libre'),
            sub: sesion ? sesion.zonaNombre + ' · ' + sesion.horas + 'h' : z.nombre + ' · disponible',
            tag: sesion ? 'Sesión' : 'Estación'
          });
        }
      }
    });

    if (!resultados.length) {
      host.innerHTML = '<p class="radar-empty">Sin coincidencias. Prueba con “PC”, “café” o el nombre de un cliente.</p>';
      return;
    }

    host.innerHTML = resultados.slice(0, 8).map((r) => `
      <button type="button" class="radar-item" data-radar-tipo="${esc(r.tipo)}" data-radar-id="${esc(r.id)}">
        <span class="radar-ico">${esc(r.icono)}</span>
        <span class="radar-text"><strong>${esc(r.titulo)}</strong><small>${esc(r.sub)}</small></span>
        <span class="radar-tag">${esc(r.tag)}</span>
      </button>`).join('');
  }

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
          <div class="row-between"><span>Cargo de estación</span><strong>${esc(money(s.cargoEstacion))} ${s.estacionPagada ? '· pagado' : ''}</strong></div>
          <div class="row-between"><span>Consumos pendientes</span><strong>${consumosPend.length ? esc(money(totalConsumos)) : 'Sin consumos'}</strong></div>
        </div>
        <div class="order-total"><span>Total pendiente</span><strong>${esc(money(pendiente))}</strong></div>
      </div>`;
  }

  function buscarCuenta(termino) {
    const host = $('#cuentaResultado');
    if (!host) return;
    const q = String(termino || '').trim().toLowerCase();
    if (!q) {
      host.innerHTML = '<div class="log-empty">Escribe un nombre o código de estación para consultar la cuenta.</div>';
      return;
    }
    const encontradas = estado.sesiones.filter((s) =>
      s.cliente.toLowerCase().includes(q) || s.equipo.toLowerCase().includes(q)
    );
    host.innerHTML = encontradas.length
      ? encontradas.map(cuentaCardHTML).join('')
      : '<div class="log-empty">No hay sesiones activas que coincidan con “' + esc(termino) + '”.</div>';
    logEvento(`Consultó la cuenta de “${termino}”.`, 'info');
  }

  function irACuenta(equipo) {
    mostrarVista('vista-cuenta');
    const input = $('#cuentaBusqueda');
    if (input) input.value = equipo;
    buscarCuenta(equipo);
  }

  /* ── NAVEGACIÓN ─────────────────────────────────────────── */
  function mostrarVista(id) {
    const destino = document.getElementById(id);
    if (!destino) return;
    if (id === 'vista-bitacoras' && !estado.admin) {
      App.toast('Inicia sesión como administrador para ver las bitácoras.', 'warn', 'Acceso restringido');
      App.openModal('ciberCuentaModal');
      return;
    }
    $$('.hud-view').forEach((v) => v.classList.toggle('active', v.id === id));
    $$('.dock-btn').forEach((b) => {
      const activo = b.dataset.view === id;
      b.classList.toggle('active', activo);
      b.setAttribute('aria-current', activo ? 'page' : 'false');
    });
    const zona = $('#hudZona');
    if (zona) zona.textContent = destino.dataset.title || 'Cyber Arena';
    if (id === 'vista-bitacoras') renderLogs();
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
        mostrarVista('vista-cafeteria');
        const sel = $('#menuEstacion');
        if (sel) sel.value = cargar.dataset.cargar;
        App.toast(`Selecciona productos para cargar a ${cargar.dataset.cargar}.`, 'info', 'Consumo');
        return;
      }
      const radar = event.target.closest('[data-radar-tipo]');
      if (radar) {
        event.preventDefault();
        const tipo = radar.dataset.radarTipo;
        const id = radar.dataset.radarId;
        if (tipo === 'menu') abrirDetalleMenu(id);
        else if (tipo === 'zona') {
          seleccionarZona(id);
          mostrarVista('vista-reservas');
          const nombre = $('#reservaNombre');
          if (nombre) nombre.focus();
        } else if (tipo === 'sesion') {
          irACuenta(id);
        } else {
          mostrarVista('vista-reservas');
          const sel = $('#reservaZona');
          if (sel) sel.value = id.split('-')[0] === 'PS5' ? 'vip' : id.split('-')[0] === 'PS4' ? 'consola' : id.split('-')[0] === 'MESA' ? 'mesa' : 'pc';
          const nombre = $('#reservaNombre');
          if (nombre) nombre.focus();
          App.toast(`Estación ${id} disponible. Completa el formulario para reservar.`, 'info');
        }
        return;
      }
    });

    const radarInput = $('#radarBusqueda');
    if (radarInput) radarInput.addEventListener('input', renderRadar);

    const gamertagForm = $('#gamertagForm');
    if (gamertagForm) {
      gamertagForm.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarGamertag($('#gamertagInput').value, false);
      });
    }

    const zonasGrid = $('#zonasGrid');
    if (zonasGrid) {
      zonasGrid.addEventListener('click', (event) => {
        const card = event.target.closest('[data-zona]');
        if (!card) return;
        seleccionarZona(card.dataset.zona);
        const form = $('#reservaForm');
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    const reservaZona = $('#reservaZona');
    if (reservaZona) reservaZona.addEventListener('change', () => seleccionarZona(reservaZona.value));

    const reservaForm = $('#reservaForm');
    if (reservaForm) reservaForm.addEventListener('submit', reservar);

    const reservaNombre = $('#reservaNombre');
    if (reservaNombre) {
      reservaNombre.addEventListener('input', () => {
        reservaNombre.classList.remove('invalid');
        const error = $('#reservaError');
        if (error) error.textContent = '';
      });
    }

    const mapa = $('#mapaEstaciones');
    if (mapa) {
      mapa.addEventListener('click', (event) => {
        const est = event.target.closest('[data-station]');
        if (!est) return;
        const codigo = est.dataset.station;
        const sesion = estado.sesiones.find((s) => s.equipo === codigo);
        if (sesion) {
          irACuenta(codigo);
        } else {
          seleccionarZona(est.dataset.zona);
          mostrarVista('vista-reservas');
          App.toast(`${codigo} está libre. Ya seleccionamos su zona.`, 'info');
          const nombre = $('#reservaNombre');
          if (nombre) nombre.focus();
        }
      });
    }

    const busqueda = $('#menuBusqueda');
    if (busqueda) {
      busqueda.addEventListener('input', () => {
        estado.qMenu = busqueda.value;
        renderMenu();
      });
    }

    const filtros = $('#menuFiltros');
    if (filtros) {
      filtros.addEventListener('click', (event) => {
        const chip = event.target.closest('[data-menu-cat]');
        if (!chip) return;
        estado.filtroMenu = chip.dataset.menuCat;
        renderMenu();
        logEvento(`Filtró el menú por “${estado.filtroMenu}”.`, 'info');
      });
    }

    const grid = $('#menuGrid');
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
          const input = $('#menuBusqueda');
          if (input) input.value = '';
          renderMenu();
          return;
        }
        const card = event.target.closest('[data-menu-card]');
        if (card) abrirDetalleMenu(card.dataset.menuCard);
      });

      grid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('[data-menu-card]');
        if (card) {
          event.preventDefault();
          abrirDetalleMenu(card.dataset.menuCard);
        }
      });
    }

    const action = $('#ciberDetailAction');
    if (action) {
      action.addEventListener('click', () => {
        if (detalleActual && detalleActual.tipo === 'menu') agregarMenu(detalleActual.id);
        App.closeModal('ciberDetailModal');
      });
    }

    const buscarBtn = $('#cuentaBuscarBtn');
    if (buscarBtn) buscarBtn.addEventListener('click', () => buscarCuenta($('#cuentaBusqueda').value));

    const cuentaInput = $('#cuentaBusqueda');
    if (cuentaInput) {
      cuentaInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          buscarCuenta(cuentaInput.value);
        }
      });
    }

    const liberar = $('#liberarBtn');
    if (liberar) {
      liberar.addEventListener('click', () => {
        const sel = $('#liberarEstacion');
        if (!sel || !sel.value) {
          App.toast('No hay sesiones activas para liberar.', 'info');
          return;
        }
        liberarSesion(sel.value);
      });
    }

    const btnLobby = $('#btnCheckoutLobby');
    if (btnLobby) btnLobby.addEventListener('click', abrirCheckout);
    const btnCafe = $('#btnCheckoutCafeteria');
    if (btnCafe) btnCafe.addEventListener('click', abrirCheckout);
    const pagarBtn = $('#checkoutPagar');
    if (pagarBtn) pagarBtn.addEventListener('click', pagar);

    const clientForm = $('#ciberClientForm');
    if (clientForm) {
      clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarGamertag($('#ciberClientGamertag').value, true);
      });
    }

    const adminForm = $('#ciberAdminForm');
    if (adminForm) adminForm.addEventListener('submit', loginAdmin);

    const logout = $('#ciberAdminLogout');
    if (logout) logout.addEventListener('click', logoutAdmin);

    const refresh = $('#ciberRefreshLogs');
    if (refresh) {
      refresh.addEventListener('click', () => {
        renderLogs();
        App.toast('Bitácoras actualizadas.', 'info');
      });
    }

    const clear = $('#ciberClearLogs');
    if (clear) {
      clear.addEventListener('click', () => {
        if (!estado.admin) return;
        if (!window.confirm('¿Limpiar todas las bitácoras de eventos y ventas?')) return;
        App.store.remove(KEYS.eventos);
        App.store.remove(KEYS.ventas);
        renderLogs();
        logEvento('Bitácoras reiniciadas por el administrador.', 'warn');
        App.toast('Bitácoras liberadas correctamente.', 'warn');
      });
    }
  }

  function actualizarReloj() {
    const reloj = $('#hudEstado');
    if (reloj) {
      const ahora = new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
      reloj.textContent = '● En línea · ' + ahora;
    }
    $$('.timer[data-inicio]').forEach((el) => {
      el.textContent = duracion(el.dataset.inicio);
    });
  }

  App.ready(() => {
    if (!ZONAS.length || !MENU.length) {
      App.toast('No se pudieron cargar los datos de Cyber Arena.', 'error');
      return;
    }

    enlazarEventos();
    aplicarAdminUI();
    actualizarAliasUI();
    renderMenu();
    renderRadar();
    renderDespuesDeCambio();
    actualizarReloj();
    window.setInterval(actualizarReloj, 1000);

    if (!leerLog(KEYS.eventos).length) {
      logEvento(`Sistema iniciado con ${MENU.length} productos y ${ZONAS.length} zonas cargadas.`, 'ok');
    }

    if (location.hash && document.getElementById(location.hash.slice(1))) {
      mostrarVista(location.hash.slice(1));
    }

    App.registerSW('sw.js');
    App.toast('Cyber Arena listo. ¡A jugar! 🎮', 'ok', 'Bienvenido');
  });
})();
