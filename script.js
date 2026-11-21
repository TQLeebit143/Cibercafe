$(function () {
  'use strict';

  const STORE_KEY = 'cyber_arena_v4';

  const CATALOGO_RESPALDO = {
    zonas: [
      { id: 'pc', nombre: 'Cabinas PC Gamer Pro', prefijo: 'PC', capacidad: 10, precio: 10, tema: 'tema-pc', emoji: '🖥️', silla: '🪑', detalle: 'RTX 4060 · Monitor 180 Hz · Silla ergonómica', specs: 'Intel Core i7 13700F · 32GB DDR5 · NVIDIA RTX 4060 8GB · Monitor IPS 27" 180Hz' },
      { id: 'vip', nombre: 'Salas VIP Consolas (PS5)', prefijo: 'PS5', capacidad: 3, precio: 18, tema: 'tema-vip', emoji: '🎮', silla: '🛋️', detalle: 'Pantalla 4K 65" · DualSense · Sillones reclinables', specs: 'PlayStation 5 · TV OLED 4K 65" · 2 Mandos DualSense · EA FC 26, Tekken 8' },
      { id: 'consola', nombre: 'Salas Consolas (PS4/PS3)', prefijo: 'PS4', capacidad: 4, precio: 12, tema: 'tema-consola', emoji: '🕹️', silla: '🛋️', detalle: 'LED 43" · Catálogo clásico · Dos mandos', specs: 'PlayStation 4 Pro · Pantalla Full HD 43" · 2 DualShock 4 · GTA V, MK11' },
      { id: 'wii', nombre: 'Zona Nintendo Wii', prefijo: 'WII', capacidad: 3, precio: 10, tema: 'tema-wii', emoji: '🎯', silla: '🪑', detalle: 'Wii Sports / Mario Kart · 4 Wii Remotes + Nunchuk', specs: 'Nintendo Wii · 4 Controles Wii Remote Plus + Nunchuk · Mario Kart, Just Dance' },
      { id: 'mesa', nombre: 'Mesas Co-Working & Café', prefijo: 'MESA', capacidad: 4, precio: 12, tema: 'tema-mesa', emoji: '💻', silla: '🪑', detalle: 'Wi-Fi 6 · Enchufes individuales · Zona silenciosa', specs: 'Fibra Óptica 600 Mbps · Tomas AC + USB-C carga rápida · Zona de estudio' }
    ],
    catalogo: [
      { id: 101, nombre: 'Cabina PC Gamer RTX 4060', categoria: 'equipos', catLabel: '🖥️ PC Gamer', precio: 10, emoji: '🖥️', detalle: 'Monitor 180 Hz · Periféricos HyperX', specs: 'Core i7 · 32GB RAM · RTX 4060 · Ping < 25ms en Valorant, LoL, Dota 2 y CS2.', imagen: './img/zona-pc.jpg.jpg', disponible: true },
      { id: 102, nombre: 'Sala VIP PlayStation 5 4K', categoria: 'equipos', catLabel: '🎮 Consolas', precio: 18, emoji: '🎮', detalle: 'Pantalla 65" 4K · Sofá gamer privado', specs: 'Incluye 2 controles DualSense, aire acondicionado y catálogo digital completo.', imagen: './img/zona-ps5.jpg.jpg', disponible: true },
      { id: 103, nombre: 'Sala Consolas PS4 Pro Dúo', categoria: 'equipos', catLabel: '🕹️ Consolas', precio: 12, emoji: '🕹️', detalle: 'Ideal para torneos 1v1 o cooperativo', specs: 'Pantalla 43" · 2 mandos DualShock 4 · Audio envolvente.', imagen: './img/zona-ps4.jpg', disponible: true },
      { id: 104, nombre: 'Estación Nintendo Wii Party', categoria: 'equipos', catLabel: '🎯 Nintendo Wii', precio: 10, emoji: '🎯', detalle: 'Hasta 4 jugadores simultáneos', specs: 'Incluye 4 Wii Remotes, volantes Mario Kart y Wii Sports Resort.', imagen: './img/zona-wii.jpg', disponible: true },
      { id: 105, nombre: 'Mesa Co-Working Fibra 600Mb', categoria: 'equipos', catLabel: '💻 Co-Working', precio: 12, emoji: '💻', detalle: 'Espacio amplio para laptop y estudio', specs: 'Enchufes múltiples, soporte ergonómico y acceso prioritario a cafetería.', imagen: './img/zona-mesa.jpg', disponible: true },
      { id: 1, nombre: 'Espresso Doble', categoria: 'cafes', catLabel: '☕ Cafés', precio: 10, emoji: '☕', detalle: 'Grano de altura recién molido', specs: 'Extracción doble 60ml de café arábica boliviano tostado medio.', imagen: './img/espresso.jpg', disponible: true },
      { id: 2, nombre: 'Café Americano', categoria: 'cafes', catLabel: '☕ Cafés', precio: 12, emoji: '☕', detalle: 'Taza de 12 oz · Caliente', specs: 'Shot doble de espresso suavizado en agua filtrada a 92°C.', imagen: './img/americano.jpg', disponible: true },
      { id: 3, nombre: 'Cappuccino Artesanal', categoria: 'cafes', catLabel: '☕ Cafés', precio: 15, emoji: '🍮', detalle: 'Espuma cremosa y cacao', specs: 'Espresso, leche texturizada cremosa y espolvoreado de cacao puro.', imagen: './img/cappuccino.jpg', disponible: true },
      { id: 4, nombre: 'Latte / Macchiato', categoria: 'cafes', catLabel: '☕ Cafés', precio: 15, emoji: '🥛', detalle: 'Leche vaporizada suave', specs: 'Disponible con leche entera o deslactosada sin costo adicional.', imagen: './img/latte.jpg', disponible: true },
      { id: 5, nombre: 'Café Helado / Frappé', categoria: 'cafes', catLabel: '☕ Cafés', precio: 16, emoji: '🧋', detalle: 'Crema batida y caramelo', specs: 'Vaso de 16 oz batido con hielo, espresso frío y topping de caramelo.', imagen: './img/frappe.jpg', disponible: true },
      { id: 6, nombre: 'Bebida Energética Monster', categoria: 'bebidas', catLabel: '🥤 Bebidas', precio: 15, emoji: '🥤', detalle: 'Lata de 473 ml · Ultra fría', specs: 'Sabores disponibles: Original Green, Ultra White y Mango Loco a 3°C.', imagen: './img/monster.jpg', disponible: true },
      { id: 7, nombre: 'Pan con Chicharrón', categoria: 'snacks', catLabel: '🥪 Snacks', precio: 22, emoji: '🥪', detalle: 'Crocante con salsa criolla', specs: 'Pan marraqueta crocante, chicharrón de cerdo dorado y zarza de cebolla.', imagen: './img/chicharron.jpg', disponible: true },
      { id: 8, nombre: 'Sándwich Club Gamer', categoria: 'snacks', catLabel: '🥪 Snacks', precio: 28, emoji: '🥙', detalle: 'Triple piso con papas', specs: 'Pollo a la plancha, tocino, queso cheddar, huevo, vegetales y papas fritas.', imagen: './img/sandwich.jpg', disponible: true },
      { id: 9, nombre: 'Salchipapa Gamer XL', categoria: 'snacks', catLabel: '🥪 Snacks', precio: 18, emoji: '🍟', detalle: 'Porción XL + 4 salsas', specs: 'Papas nativas crocantes, salchicha viena y salsero completo al puesto.', imagen: './img/salchipapa.jpg', disponible: true },
      { id: 10, nombre: 'Wrap de Pollo Crispy', categoria: 'snacks', catLabel: '🥪 Snacks', precio: 20, emoji: '🌯', detalle: 'Tortilla integral · Fácil de comer', specs: 'Diseñado para comer con una mano sin ensuciar teclado ni mando.', imagen: './img/wrap.jpg', disponible: true },
      { id: 11, nombre: 'Mini Pizzeta Pepperoni', categoria: 'snacks', catLabel: '🥪 Snacks', precio: 18, emoji: '🍕', detalle: 'Masa artesanal · Mozzarella', specs: '22 cm de diámetro, salsa pomodoro casera, queso mozzarella y pepperoni.', imagen: './img/pizzeta.jpg', disponible: true },
      { id: 12, nombre: 'Brownie con Helado', categoria: 'postres', catLabel: '🍰 Postres', precio: 16, emoji: '🍫', detalle: 'Chocolate tibio + vainilla', specs: 'Brownie húmedo de cacao al 70% servido tibio con bola de helado.', imagen: './img/brownie.jpg.jpg', disponible: true },
      { id: 13, nombre: 'Cheesecake Frutos Rojos', categoria: 'postres', catLabel: '🍰 Postres', precio: 18, emoji: '🍰', detalle: 'Porción artesanal fría', specs: 'Base crocante de galleta, crema de queso suave y coulis de frutilla y mora.', imagen: './img/cheesecake.jpg', disponible: true },
      { id: 14, nombre: 'Pie de Limón', categoria: 'postres', catLabel: '🍰 Postres', precio: 17, emoji: '🥧', detalle: 'Relleno cítrico y merengue', specs: 'Crema ácida de limón fresco coronada con merengue suizo flameado.', imagen: './img/pie-limon.jpg', disponible: true },
      { id: 15, nombre: 'Croissant / Muffin', categoria: 'postres', catLabel: '🍰 Postres', precio: 12, emoji: '🥐', detalle: 'Horneado del día · Mantequilla', specs: 'Hojaldre francés tibio o muffin de chispas de chocolate.', imagen: './img/croissant.jpg', disponible: true }
    ]
  };

  const CATEGORIAS = [
    { id: 'equipos', label: 'Equipos & Consolas', emoji: '🖥️' },
    { id: 'cafes', label: 'Cafés', emoji: '☕' },
    { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
    { id: 'snacks', label: 'Snacks', emoji: '🥪' },
    { id: 'postres', label: 'Postres', emoji: '🍰' }
  ];

  const estado = {
    zonas: [],
    catalogoBase: [],
    vista: 'lobby',
    zonaActiva: 'pc',
    filtrarMapaPorZona: false,
    equipoPreseleccionado: '',
    catActiva: 'todas',
    busquedaMenu: '',
    nick: '',
    usuarioActual: null,
    usuarios: [],
    esAdmin: false,
    horarioModo: 'auto',
    reparacion: {},
    menuExtra: [],
    menuAgotados: {},
    orden: [],
    sesiones: [],
    recibos: [],
    eventos: [],
    ventas: [],
    stream: [],
    checkoutTarget: null,
    timerCheckout: null,
    segundosRestantes: 30,
    toastTimer: null,
    deferredPrompt: null
  };

  const money = (n) => `${Math.round(Number(n) || 0)} BOB`;
  const horaActual = () => new Date().toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  function enviarASupabase(tabla, datos) {
    if (!window.SupabaseDW2 || typeof window.SupabaseDW2.guardar !== 'function') return;
    window.SupabaseDW2.guardar(tabla, datos).catch(function () {});
  }

  function limpiarTexto(valor) {
    const limpio = window.DOMPurify
      ? window.DOMPurify.sanitize(String(valor ?? ''), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
      : String(valor ?? '').replace(/[<>]/g, '');
    return limpio.trim();
  }

  function svgFallback(emoji, titulo) {
    const t = limpiarTexto(titulo || 'Cyber Arena');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0b1624"/><stop offset="100%" stop-color="#141028"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/><text x="200" y="102" text-anchor="middle" font-size="56">${emoji || '🎮'}</text><text x="200" y="156" text-anchor="middle" fill="#94a8bd" font-family="Segoe UI,sans-serif" font-size="15" font-weight="700">${t}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function arreglarLogoRoto() {
    const logoSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 40"><rect width="112" height="40" rx="8" fill="#0b1624"/><text x="56" y="25" text-anchor="middle" fill="#00f0ff" font-family="Segoe UI,sans-serif" font-size="13" font-weight="900">⚡ ARENA</text></svg>')}`;
    $('.arena-header__logo').each(function () {
      if (!this.complete || this.naturalWidth === 0) this.src = logoSvg;
      $(this).one('error', function () {
        this.src = logoSvg;
      });
    });
  }

  function mostrarToast(msg, tipo = 'info') {
    const $toast = $('#arenaToast');
    if (!$toast.length) return;
    if (estado.toastTimer) clearTimeout(estado.toastTimer);
    const borde = tipo === 'err' ? '#ef4444' : tipo === 'ok' ? '#39ff14' : '#00f0ff';
    $toast
      .stop(true, true)
      .css('border-color', borde)
      .text(limpiarTexto(msg))
      .slideDown(250);
    estado.toastTimer = setTimeout(() => {
      $toast.fadeOut(350);
    }, 3000);
  }

  function logStream(msg) {
    estado.stream.unshift(`[${horaActual()}] ${limpiarTexto(msg)}`);
    if (estado.stream.length > 100) estado.stream.length = 100;
    $('#logOutput').text(estado.stream.join('\n') || 'Sin actividad registrada aún.');
  }

  function logEvento(tipo, msg) {
    estado.eventos.unshift(`[${horaActual()}] [${tipo}] ${limpiarTexto(msg)}`);
    if (estado.eventos.length > 150) estado.eventos.length = 150;
    logStream(`[${tipo}] ${msg}`);
    renderBitacoras();
  }

  function logVenta(ticketId, cliente, detalle, total, metodo) {
    estado.ventas.unshift(`[${horaActual()}] #${ticketId} · ${limpiarTexto(cliente)} · ${limpiarTexto(detalle)} · ${money(total)} (${metodo})`);
    if (estado.ventas.length > 150) estado.ventas.length = 150;
    renderBitacoras();
  }

  function cargarEstado() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== 'object') return;
      estado.nick = s.nick || '';
      estado.usuarioActual = s.usuarioActual || null;
      estado.usuarios = Array.isArray(s.usuarios) ? s.usuarios : [];
      estado.esAdmin = Boolean(s.esAdmin);
      estado.horarioModo = s.horarioModo || 'auto';
      estado.reparacion = s.reparacion && typeof s.reparacion === 'object' ? s.reparacion : {};
      estado.menuExtra = Array.isArray(s.menuExtra) ? s.menuExtra : [];
      estado.menuAgotados = s.menuAgotados && typeof s.menuAgotados === 'object' ? s.menuAgotados : {};
      estado.orden = Array.isArray(s.orden) ? s.orden : [];
      estado.sesiones = Array.isArray(s.sesiones) ? s.sesiones : [];
      estado.recibos = Array.isArray(s.recibos) ? s.recibos : [];
      estado.eventos = Array.isArray(s.eventos) ? s.eventos : [];
      estado.ventas = Array.isArray(s.ventas) ? s.ventas : [];
    } catch (_) {}
  }

  function guardarEstado() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        nick: estado.nick,
        usuarioActual: estado.usuarioActual,
        usuarios: estado.usuarios,
        esAdmin: estado.esAdmin,
        horarioModo: estado.horarioModo,
        reparacion: estado.reparacion,
        menuExtra: estado.menuExtra,
        menuAgotados: estado.menuAgotados,
        orden: estado.orden,
        sesiones: estado.sesiones,
        recibos: estado.recibos,
        eventos: estado.eventos,
        ventas: estado.ventas
      }));
    } catch (_) {}
  }

  function obtenerMenuCompleto() {
    const todos = [...estado.catalogoBase, ...estado.menuExtra];
    return todos.map((item) => {
      const cat = CATEGORIAS.find((c) => c.id === item.categoria);
      return {
        ...item,
        catLabel: item.catLabel || (cat ? `${cat.emoji} ${cat.label}` : item.categoria),
        disponible: estado.menuAgotados[item.id] === undefined ? (item.disponible !== false) : !estado.menuAgotados[item.id]
      };
    });
  }

  function generarEstaciones() {
    const lista = [];
    estado.zonas.forEach((z) => {
      for (let i = 1; i <= z.capacidad; i++) {
        const codigo = `${z.prefijo}-${String(i).padStart(2, '0')}`;
        const sesion = estado.sesiones.find((s) => s.equipo === codigo);
        const enReparacion = Boolean(estado.reparacion[codigo]);
        lista.push({
          codigo,
          zonaId: z.id,
          zonaNombre: z.nombre,
          emoji: z.emoji,
          silla: z.silla || '🪑',
          precio: z.precio,
          ocupada: Boolean(sesion),
          reparacion: enReparacion,
          motivoRep: estado.reparacion[codigo] || '',
          sesion: sesion || null
        });
      }
    });
    return lista;
  }

  function aplicarTemaZona(zonaId) {
    const zona = estado.zonas.find((z) => z.id === zonaId);
    $('body').removeClass('tema-pc tema-vip tema-consola tema-wii tema-mesa');
    $('body').addClass(zona?.tema || 'tema-pc');
  }

  function verificarHorarioLocal() {
    const $banner = $('#horarioBanner');
    const $title = $('#horarioEstado');
    const $sub = $('#horarioTexto');
    $('#adminHorarioModo').val(estado.horarioModo);
    if (!$banner.length) return true;

    let abierto = true;
    let etiqueta = '● ABIERTO AHORA';
    const ahora = new Date();
    const dia = ahora.getDay();
    const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60;
    const esFinDeSemana = dia === 0 || dia === 6;

    if (estado.horarioModo === 'abierto') {
      abierto = true;
      etiqueta = '● ABIERTO AHORA (Manual Admin)';
    } else if (estado.horarioModo === 'cerrado') {
      abierto = false;
      etiqueta = '● CERRADO / MANTENIMIENTO';
    } else {
      const apertura = esFinDeSemana ? 13 : 9;
      const cierre = 21;
      abierto = horaDecimal >= apertura && horaDecimal < cierre;
      etiqueta = abierto
        ? '● ABIERTO AHORA (Cierra 21:00)'
        : `● CERRADO AHORA (Abre ${esFinDeSemana ? '13:00' : '09:00'})`;
    }

    $banner.toggleClass('status-banner--cerrado', !abierto);
    $title.text(etiqueta);
    $sub.text('Lun–Vie 09:00–21:00 · Sáb–Dom 13:00–21:00');
    return abierto;
  }

  function actualizarEstadoRed() {
    const online = navigator.onLine;
    $('#networkStatus')
      .toggleClass('arena-net-badge--offline', !online)
      .text(online ? '● En Línea' : '● Modo Offline Activo (Datos Locales)');
  }

  function aplicarRolUI() {
    $('body').toggleClass('is-admin', estado.esAdmin);
    if (estado.esAdmin) {
      $('#playerRolLabel').text('Administrador');
      $('#btnLogin').text('⚙️ Admin Activo');
    } else if (estado.usuarioActual) {
      $('#playerRolLabel').text('Cliente Registrado');
      $('#btnLogin').text('👤 Mi Cuenta');
    } else {
      $('#playerRolLabel').text('Cliente Invitado');
      $('#btnLogin').text('🔐 Cuenta / Admin');
    }
  }

  function actualizarIdentidad() {
    const base = limpiarTexto(estado.usuarioActual?.nick || estado.nick || 'Jugador Invitado');
    const iniciales = base.split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() || 'JG';
    $('#playerNombre').text(base);
    $('#playerAvatar').text(iniciales);
    if (!$('#nickLobby').is(':focus')) {
      $('#nickLobby').val(estado.nick || estado.usuarioActual?.nick || '');
    }
    if (!$('#resCliente').val().trim() && base !== 'Jugador Invitado') {
      $('#resCliente').val(base);
    }
    aplicarRolUI();
  }

  function cambiarVista(vista) {
    if ((vista === 'admin' || vista === 'bitacoras') && !estado.esAdmin) {
      mostrarToast('Sección exclusiva para Administradores.', 'err');
      return;
    }
    estado.vista = vista;
    $('.arena-view').removeClass('arena-view--active');
    $(`#vista-${vista}`).addClass('arena-view--active');
    $('.arena-dock__btn').removeClass('arena-dock__btn--active');
    $(`.arena-dock__btn[data-vista="${vista}"]`).addClass('arena-dock__btn--active');
    $('#mobileDrawer').slideUp(200);
    $('#btnBurger').attr('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderZonas() {
    const $cont = $('#zonasGrid').empty();
    const estaciones = generarEstaciones();

    estado.zonas.forEach((z) => {
      const delTipo = estaciones.filter((e) => e.zonaId === z.id);
      const libres = delTipo.filter((e) => !e.ocupada && !e.reparacion).length;
      const activa = estado.zonaActiva === z.id;

      const $btn = $('<button>', {
        type: 'button',
        class: `zona-card ${activa ? 'zona-card--active' : ''}`,
        'data-zona': z.id,
        role: 'radio',
        'aria-checked': String(activa)
      });

      const $ico = $('<div>', { class: 'zona-card__ico' }).text(`${z.emoji}${z.silla || ''}`);
      const $info = $('<div>', { class: 'zona-card__info' }).append(
        $('<strong>').text(z.nombre),
        $('<small>').text(z.detalle),
        $('<span>', { class: 'zona-card__free' }).text(libres > 0 ? `● ${libres} de ${z.capacidad} libres` : '● Sin libres')
      );
      const $price = $('<div>', { class: 'zona-card__price' }).text(`${money(z.precio)}/h`);

      $btn.append($ico, $info, $price);
      $cont.append($btn);
    });
  }

  function actualizarSelectEquipos() {
    const $sel = $('#resEquipo').empty();
    const disponibles = generarEstaciones().filter((e) => e.zonaId === estado.zonaActiva && !e.ocupada && !e.reparacion);
    $sel.append($('<option>', { value: '' }).text(`Asignación automática (${disponibles.length} disponibles)`));
    disponibles.forEach((e) => {
      $sel.append($('<option>', { value: e.codigo }).text(`${e.codigo} · Disponible`));
    });
    if (estado.equipoPreseleccionado && disponibles.some((e) => e.codigo === estado.equipoPreseleccionado)) {
      $sel.val(estado.equipoPreseleccionado);
    }
  }

  function actualizarSubtotalReserva() {
    const z = estado.zonas.find((item) => item.id === estado.zonaActiva) || estado.zonas[0];
    const horas = Math.max(1, Number($('#hrs').val()) || 1);
    const total = (z ? z.precio : 10) * horas;
    $('#resSubtotal').text(money(total)).stop(true, true).animate({ opacity: 0.45 }, 110).animate({ opacity: 1 }, 160);
  }

  function renderMapaEstaciones() {
    const $grid = $('#mapaEstaciones').empty();
    const todas = generarEstaciones();
    const zonaObj = estado.zonas.find((z) => z.id === estado.zonaActiva);
    const visibles = estado.filtrarMapaPorZona ? todas.filter((e) => e.zonaId === estado.zonaActiva) : todas;
    const libresVisibles = visibles.filter((e) => !e.ocupada && !e.reparacion).length;

    $('#mapaStats').text(
      estado.filtrarMapaPorZona && zonaObj
        ? `Filtro ${zonaObj.nombre}: ${libresVisibles} libres de ${visibles.length}`
        : `Vista completa (todas las divisiones): ${libresVisibles} libres de ${visibles.length}`
    );

    if (estado.filtrarMapaPorZona) $('#btnVerTodasEstaciones').removeAttr('hidden');
    else $('#btnVerTodasEstaciones').attr('hidden', true);

    visibles.forEach((e) => {
      const selected = !e.ocupada && !e.reparacion && estado.equipoPreseleccionado === e.codigo;
      let cls = 'station-btn';
      if (e.reparacion) cls += ' station-btn--reparacion';
      else if (e.ocupada) cls += ' station-btn--ocupada';
      if (selected) cls += ' station-btn--selected';

      const iconoVisual = e.reparacion ? '🔧' : `${e.emoji}${e.silla}`;
      const $st = $('<button>', {
        type: 'button',
        class: cls,
        'data-code': e.codigo,
        title: `${e.codigo} · ${e.zonaNombre} (${e.reparacion ? 'En reparación' : e.ocupada ? `Ocupada por ${e.sesion.cliente}` : 'Disponible'})`
      }).append(
        $('<span>').text(iconoVisual),
        $('<span>', { class: 'station-btn__code' }).text(e.codigo),
        $('<span>', { class: 'station-btn__client' }).text(e.reparacion ? 'Inactivo' : e.ocupada ? e.sesion.cliente : 'Libre')
      );
      $grid.append($st);
    });

    const totalLibres = todas.filter((e) => !e.ocupada && !e.reparacion).length;
    $('#kpiLibres').text(`${totalLibres} / ${todas.length}`);
    $('#kpiSesiones').text(String(estado.sesiones.length));
    $('#admEnUso').text(`${estado.recibos.length} tickets · ${estado.sesiones.length}/${todas.length} eq.`);
  }

  function calcularTotalSesion(s) {
    const base = (Number(s.tarifa) || 0) * (Number(s.horas) || 1);
    const extras = (s.consumos || []).reduce((acc, c) => acc + (c.precio * c.cant), 0);
    return base + extras;
  }

  function formatoDuracion(seg) {
    const s = Math.max(0, Math.floor(seg));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function renderSesiones() {
    const $targets = $('#lobbySesiones, #listaSesiones').empty();
    $('#sesionesCount').text(String(estado.sesiones.length));

    if (!estado.sesiones.length) {
      $targets.append($('<p>', { class: 'arena-hint' }).text('Aún no reservaste una estación. Entra a Reservas para elegir la tuya.'));
    } else {
      estado.sesiones.forEach((s) => {
        const total = calcularTotalSesion(s);
        const trans = Math.floor((Date.now() - s.inicio) / 1000);
        const cumplido = trans >= (Number(s.horas) || 1) * 3600;

        const $card = $('<article>', {
          class: `session-item ${cumplido ? 'session-item--cumplida' : ''}`,
          'data-sesion-like': s.id,
          title: 'Doble clic para enviar un Like en la bitácora'
        });

        const $head = $('<div>', { class: 'arena-row arena-row--between' }).append(
          $('<strong>').text(`${s.equipo} · ${s.cliente}`),
          $('<span>', { class: 'timer', 'data-inicio': s.inicio, 'data-horas': s.horas })
            .text(cumplido ? '⏰ ¡Hora cumplida!' : `⏱️ ${formatoDuracion(trans)} / ${s.horas}h`)
        );

        const $meta = $('<small>', { class: 'arena-hint' })
          .text(`${s.zonaNombre} · Plan ${s.horas}h (${money(s.tarifa * s.horas)})${s.extra ? ` · Nota: ${s.extra}` : ''}`);

        const $foot = $('<div>', { class: 'arena-row arena-row--between' }).append(
          $('<strong>').text(`Cuenta: ${money(total)}`),
          $('<div>', { class: 'arena-row' }).append(
            $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm', 'data-pedir-sesion': s.id }).text('🍔 Pedir'),
            $('<button>', { type: 'button', class: 'arena-btn arena-btn--primary arena-btn--sm', 'data-cerrar-sesion': s.id }).text('💳 Cerrar y pagar')
          )
        );

        $card.append($head, $meta, $foot);
        $targets.append($card);
      });
    }

    actualizarDestinosPedido();
    renderCuenta();
    renderBitacoras();
  }

  function actualizarDestinosPedido() {
    const $sel = $('#destinoPedido');
    const prev = $sel.val();
    $sel.empty().append($('<option>', { value: '' }).text('Retiro en barra (mostrador)'));
    estado.sesiones.forEach((s) => {
      $sel.append($('<option>', { value: s.id }).text(`${s.equipo} · ${s.cliente} (cargar a cuenta)`));
    });
    if (estado.sesiones.some((s) => s.id === prev)) $sel.val(prev);
    else if (estado.sesiones.length === 1) $sel.val(estado.sesiones[0].id);
  }

  function renderChipsMenu() {
    const $cont = $('#menuChips').empty();
    const todas = [{ id: 'todas', label: 'Todo el catálogo', emoji: '✨' }, ...CATEGORIAS];
    todas.forEach((c) => {
      const activo = estado.catActiva === c.id;
      $cont.append(
        $('<button>', {
          type: 'button',
          class: `menu-chip btn-console ${activo ? 'menu-chip--active' : ''}`,
          'data-cat': c.id,
          role: 'tab',
          'aria-selected': String(activo)
        }).text(`${c.emoji} ${c.label}`)
      );
    });
  }

  function renderMenu() {
    const $grid = $('#menuGrid').empty();
    const menuCompleto = obtenerMenuCompleto().filter((m) => m.disponible);
    const q = estado.busquedaMenu.trim().toLowerCase();

    menuCompleto.forEach((item) => {
      const coincideCat = estado.catActiva === 'todas' || item.categoria === estado.catActiva;
      const coincideTexto = !q || item.nombre.toLowerCase().includes(q) || item.detalle.toLowerCase().includes(q);
      const fallback = svgFallback(item.emoji, item.nombre);
      const srcPrincipal = item.imagen || fallback;

      const $card = $('<article>', {
        class: 'arena-card card-item',
        'data-cat': item.categoria,
        'data-search': `${item.nombre} ${item.detalle}`.toLowerCase()
      });

      const $img = $('<img>', {
        src: srcPrincipal,
        alt: `${item.nombre} - ${item.detalle}`,
        width: 400,
        height: 225,
        loading: 'lazy',
        class: 'arena-card__img'
      }).on('error', function () {
        if (!this.dataset.triedAlt && srcPrincipal.endsWith('.jpg.jpg')) {
          this.dataset.triedAlt = '1';
          this.src = srcPrincipal.replace(/\.jpg\.jpg$/, '.jpg');
        } else if (!this.dataset.triedDouble && srcPrincipal.endsWith('.jpg') && !srcPrincipal.endsWith('.jpg.jpg')) {
          this.dataset.triedDouble = '1';
          this.src = `${srcPrincipal}.jpg`;
        } else if (this.src !== fallback) {
          this.src = fallback;
        }
      });

      const $media = $('<div>', { class: 'arena-card__media' }).append(
        $img,
        $('<span>', { class: 'arena-card__badge' }).text(item.catLabel)
      );

      const $specs = $('<div>', { class: 'arena-card__specs' }).text(item.specs || item.detalle);
      const $simState = $('<div>', { class: 'arena-card__sim-status' }).text('Estado: Normal');

      const $acciones = $('<div>', { class: 'arena-row' }).append(
        $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm btn-detalles' }).text('Ver Detalles'),
        $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm btn-simular' }).text('Simular Estado'),
        $('<button>', { type: 'button', class: 'arena-btn arena-btn--primary arena-btn--sm', 'data-add-menu': item.id }).text('+ Agregar')
      );

      const $footer = $('<div>', { class: 'arena-card__footer' }).append(
        $('<span>', { class: 'arena-card__price' }).text(money(item.precio)),
        $acciones
      );

      const $body = $('<div>', { class: 'arena-card__body' }).append(
        $('<h4>', { class: 'arena-card__title' }).text(item.nombre),
        $('<p>', { class: 'arena-card__desc' }).text(item.detalle),
        $specs,
        $simState,
        $footer
      );

      $card.append($media, $body);
      if (!coincideCat || !coincideTexto) $card.hide();
      $grid.append($card);
    });

    const visibles = $grid.children(':visible').length;
    $('#menuResultInfo').text(`Mostrando ${visibles} de ${menuCompleto.length} ítems disponibles`);
  }

  function agregarAOrden(id) {
    const item = obtenerMenuCompleto().find((m) => m.id === id && m.disponible);
    if (!item) return;
    const ex = estado.orden.find((o) => o.id === id);
    if (ex) ex.cant += 1;
    else estado.orden.push({ id: item.id, nombre: item.nombre, precio: item.precio, cant: 1 });
    guardarEstado();
    renderOrden();
    logStream(`Agregado a orden: ${item.nombre} (${money(item.precio)})`);
    mostrarToast(`+ ${item.nombre} agregado a la orden.`, 'ok');
  }

  function renderOrden() {
    const total = estado.orden.reduce((sum, i) => sum + (i.precio * i.cant), 0);
    const count = estado.orden.reduce((sum, i) => sum + i.cant, 0);

    $('#navCount').text(String(count));
    $('#navTotal').text(money(total));
    $('#ordenTotal, #ordenTotal2').text(money(total)).stop(true, true).animate({ opacity: 0.45 }, 110).animate({ opacity: 1 }, 160);

    const $listas = $('#ordenLista, #ordenLista2').empty();
    if (!estado.orden.length) {
      $listas.append($('<p>', { class: 'arena-hint' }).text('Tu orden está vacía. Agrega ítems del catálogo o cafetería.'));
    } else {
      estado.orden.forEach((item, idx) => {
        const $line = $('<div>', { class: 'order-line' }).append(
          $('<span>').text(`${item.cant}× ${item.nombre}`),
          $('<div>', { class: 'arena-row' }).append(
            $('<strong>').text(money(item.precio * item.cant)),
            $('<button>', {
              type: 'button',
              class: 'arena-btn arena-btn--ghost arena-btn--sm btn-quitar',
              'data-del-orden': idx,
              'aria-label': `Quitar ${item.nombre}`
            }).text('✕')
          )
        );
        $listas.append($line);
      });
    }
    renderCuenta();
  }

  function sumarOrdenACuentaSesion() {
    if (!estado.orden.length) {
      mostrarToast('Agrega primero productos del menú.', 'err');
      return;
    }
    const sesionId = $('#destinoPedido').val();
    const sesion = estado.sesiones.find((s) => s.id === sesionId) || estado.sesiones[0];
    if (!sesion) {
      mostrarToast('No tienes estación activa. Reserva una primero o usa "Pagar ahora".', 'err');
      return;
    }

    sesion.consumos = sesion.consumos || [];
    estado.orden.forEach((item) => {
      const ex = sesion.consumos.find((c) => c.id === item.id);
      if (ex) ex.cant += item.cant;
      else sesion.consumos.push({ ...item });
    });

    const resumen = estado.orden.map((i) => `${i.cant}× ${i.nombre}`).join(', ');
    estado.orden = [];
    guardarEstado();
    renderOrden();
    renderSesiones();
    logEvento('CONSUMO', `Cargado a ${sesion.equipo} (${sesion.cliente}): ${resumen}`);
    mostrarToast(`¡Pedido cargado a ${sesion.equipo}!`, 'ok');
  }

  function generarQrSvg(texto) {
    let hash = 2166136261;
    for (let i = 0; i < texto.length; i++) {
      hash ^= texto.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const size = 21;
    let rects = '';
    const finder = (ox, oy) => {
      rects += `<rect x="${ox}" y="${oy}" width="7" height="7" fill="#050811"/>`;
      rects += `<rect x="${ox + 1}" y="${oy + 1}" width="5" height="5" fill="#ffffff"/>`;
      rects += `<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3" fill="#050811"/>`;
    };
    finder(0, 0);
    finder(14, 0);
    finder(0, 14);
    let seed = Math.abs(hash) || 13579;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        if (inFinder) continue;
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        if ((seed & 3) === 0) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#050811"/>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${rects}</svg>`;
  }

  function actualizarVistaQrCheckout() {
    const metodo = $('#metodoPago').val() || 'Efectivo';
    if (!estado.checkoutTarget) return;
    if (metodo.includes('QR')) {
      const ref = `CYBER-${Date.now().toString().slice(-5)}`;
      $('#qrPagoBox').removeAttr('hidden');
      $('#qrSvgContainer').html(generarQrSvg(`${ref}|${estado.checkoutTarget.total}|${estado.checkoutTarget.cliente}`));
      $('#qrMontoLabel').text(money(estado.checkoutTarget.total));
      $('#qrRefLabel').text(ref);
    } else {
      $('#qrPagoBox').attr('hidden', true);
    }
  }

  function detenerTimerCheckout() {
    if (estado.timerCheckout) {
      clearInterval(estado.timerCheckout);
      estado.timerCheckout = null;
    }
  }

  function iniciarTimerCheckout() {
    detenerTimerCheckout();
    estado.segundosRestantes = 30;
    $('#checkoutCountdown').text('⏳ 00:30');
    estado.timerCheckout = setInterval(() => {
      estado.segundosRestantes -= 1;
      const seg = Math.max(0, estado.segundosRestantes);
      $('#checkoutCountdown').text(`⏳ 00:${String(seg).padStart(2, '0')}`);
      if (seg <= 0) {
        detenerTimerCheckout();
        $('#modalCheckout').fadeOut(250, function () {
          $(this).removeClass('arena-modal--open');
        });
        estado.checkoutTarget = null;
        logEvento('EXPIRADO', 'Tarifa Flash Expirada en modal de confirmación.');
        mostrarToast('⏰ Tarifa Flash Expirada (00:00). Vuelve a confirmar tu orden.', 'err');
      }
    }, 1000);
  }

  function abrirModal($modal) {
    $modal.addClass('arena-modal--open').fadeIn(200);
  }

  function cerrarModal($modal) {
    if ($modal.attr('id') === 'modalCheckout') detenerTimerCheckout();
    $modal.fadeOut(180, function () {
      $(this).removeClass('arena-modal--open');
    });
  }

  function abrirCheckoutOrden() {
    if (!estado.orden.length) {
      mostrarToast('Tu orden está vacía.', 'err');
      return;
    }
    const cliente = limpiarTexto(estado.usuarioActual?.nick || estado.nick || 'Cliente Mostrador');
    const items = estado.orden.map((i) => ({
      nombre: `${i.cant}× ${i.nombre}`,
      detalle: 'Consumo directo',
      subtotal: i.precio * i.cant
    }));
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    estado.checkoutTarget = { tipo: 'orden', cliente, equipo: null, items, total };
    mostrarModalCheckout();
  }

  function abrirCheckoutSesion(sesionId) {
    const s = estado.sesiones.find((x) => x.id === sesionId);
    if (!s) return;
    const items = [
      {
        nombre: `${s.equipo} · ${s.zonaNombre} (${s.horas}h)`,
        detalle: `Cliente: ${s.cliente} · ${money(s.tarifa)}/h`,
        subtotal: s.tarifa * s.horas
      },
      ...(s.consumos || []).map((c) => ({
        nombre: `${c.cant}× ${c.nombre}`,
        detalle: `Cargado a ${s.equipo}`,
        subtotal: c.precio * c.cant
      }))
    ];
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    estado.checkoutTarget = { tipo: 'sesion', sesionId: s.id, cliente: s.cliente, equipo: s.equipo, items, total };
    mostrarModalCheckout();
  }

  function mostrarModalCheckout() {
    const t = estado.checkoutTarget;
    if (!t) return;
    $('#checkoutTitle').text(
      t.tipo === 'sesion' ? `Cerrar cuenta · ${t.equipo} (${t.cliente})` : `Confirmar orden · ${t.cliente}`
    );
    const $res = $('#checkoutResumen').empty();
    t.items.forEach((i) => {
      $res.append(
        $('<div>', { class: 'order-line' }).append(
          $('<span>').text(`${i.nombre} (${i.detalle})`),
          $('<strong>').text(money(i.subtotal))
        )
      );
    });
    $('#checkoutTotal').text(money(t.total));
    actualizarVistaQrCheckout();
    abrirModal($('#modalCheckout'));
    iniciarTimerCheckout();
  }

  function finalizarCheckout() {
    const t = estado.checkoutTarget;
    if (!t) return;
    detenerTimerCheckout();
    const metodo = $('#metodoPago').val() || 'Efectivo';
    const ticketId = `TK-${Date.now().toString().slice(-6)}`;

    estado.recibos.unshift({
      ticketId,
      fecha: new Date().toLocaleString('es-BO'),
      cliente: t.cliente,
      equipo: t.equipo,
      metodo,
      items: t.items,
      total: t.total
    });
    if (estado.recibos.length > 40) estado.recibos.length = 40;

    if (t.tipo === 'orden') estado.orden = [];
    else if (t.tipo === 'sesion') estado.sesiones = estado.sesiones.filter((s) => s.id !== t.sesionId);

    const resumenTxt = t.items.map((i) => i.nombre).join(' + ');
    logVenta(ticketId, t.cliente, resumenTxt, t.total, metodo);
    logEvento('CAJA', `Cobro ${ticketId} por ${money(t.total)} (${metodo})${t.equipo ? ` · Liberada ${t.equipo}` : ''}`);
    enviarASupabase('pedidos_cibercafe', {
      estacion: String(t.equipo || 'MOSTRADOR').slice(0, 20),
      alias: String(t.cliente || 'Cliente').slice(0, 40),
      items: t.items,
      total: Number(t.total) || 0
    });

    estado.checkoutTarget = null;
    guardarEstado();
    renderZonas();
    actualizarSelectEquipos();
    renderMapaEstaciones();
    renderSesiones();
    renderOrden();
    cerrarModal($('#modalCheckout'));
    mostrarToast(`✅ Pago confirmado (${metodo}) · Ticket #${ticketId}`, 'ok');
  }

  function renderCuenta() {
    const $contSes = $('#cuentaSesiones').empty();
    if (!estado.sesiones.length) {
      $contSes.append($('<p>', { class: 'arena-hint' }).text('No tienes sesiones activas en sala.'));
    } else {
      estado.sesiones.forEach((s) => {
        const total = calcularTotalSesion(s);
        const $card = $('<div>', { class: 'session-item' }).append(
          $('<strong>').text(`${s.equipo} · ${s.cliente} (${s.zonaNombre})`),
          $('<small>', { class: 'arena-hint' }).text(`Tiempo: ${s.horas}h × ${money(s.tarifa)} = ${money(s.horas * s.tarifa)}`),
          $('<strong>').text(`Total acumulado: ${money(total)}`),
          $('<button>', { type: 'button', class: 'arena-btn arena-btn--primary arena-btn--sm', 'data-cerrar-sesion': s.id }).text('💳 Cerrar y pagar cuenta')
        );
        $contSes.append($card);
      });
    }

    const $contPen = $('#cuentaPendiente').empty();
    if (!estado.orden.length) {
      $contPen.append($('<p>', { class: 'arena-hint' }).text('No tienes pedidos de cafetería sin confirmar.'));
    } else {
      const totalOrden = estado.orden.reduce((s, i) => s + i.precio * i.cant, 0);
      const $card = $('<div>', { class: 'session-item' }).append(
        $('<strong>').text(`Ítems pendientes: ${estado.orden.length} · Subtotal: ${money(totalOrden)}`),
        $('<div>', { class: 'arena-row' }).append(
          $('<button>', { type: 'button', class: 'arena-btn arena-btn--primary arena-btn--sm', id: 'btnCuentaSumar' }).text('➕ Sumar a mi estación'),
          $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm', id: 'btnCuentaPagarOrden' }).text('💳 Pagar ahora')
        )
      );
      $contPen.append($card);
    }

    $('#cuentaResultado').text(
      estado.recibos.length
        ? estado.recibos.map((r) => [
          '========================================',
          `RECIBO #${r.ticketId}  |  ${r.fecha}`,
          `Cliente: ${r.cliente}${r.equipo ? `  |  Estación: ${r.equipo}` : ''}`,
          `Método de pago: ${r.metodo}`,
          ...r.items.map((i) => `  • ${i.nombre} -> ${money(i.subtotal)}`),
          `TOTAL PAGADO: ${money(r.total)}`
        ].join('\n')).join('\n\n')
        : 'Aún no se emitieron recibos en esta sesión.'
    );
  }

  function renderPanelAdmin() {
    const $listaEst = $('#adminEstacionesLista').empty();
    generarEstaciones().forEach((e) => {
      const $row = $('<div>', { class: 'admin-row' }).append(
        $('<div>').append(
          $('<strong>').text(`${e.emoji}${e.silla} ${e.codigo} · ${e.zonaNombre}`),
          $('<br>'),
          $('<small>').text(e.reparacion ? '🔧 En reparación / inactivo' : e.ocupada ? `🎮 En uso por ${e.sesion.cliente}` : '✅ Operativo y activo')
        ),
        $('<button>', {
          type: 'button',
          class: `arena-btn arena-btn--sm ${e.reparacion ? 'arena-btn--primary' : 'arena-btn--ghost'}`,
          'data-toggle-rep': e.codigo
        }).text(e.reparacion ? '✅ Activar' : '🔧 Inactivar')
      );
      $listaEst.append($row);
    });

    const $listaMenu = $('#adminMenuLista').empty();
    obtenerMenuCompleto().forEach((m) => {
      const $row = $('<div>', { class: 'admin-row' }).append(
        $('<div>').append(
          $('<strong>').text(`${m.emoji || '🍽️'} ${m.nombre} — ${money(m.precio)}`),
          $('<br>'),
          $('<small>').text(`${m.catLabel} · ${m.disponible ? '🟢 Disponible' : '🔴 Agotado'}`)
        ),
        $('<button>', {
          type: 'button',
          class: `arena-btn arena-btn--sm ${m.disponible ? 'arena-btn--ghost' : 'arena-btn--primary'}`,
          'data-toggle-prod': m.id
        }).text(m.disponible ? 'Marcar agotado' : 'Activar')
      );
      $listaMenu.append($row);
    });
  }

  function renderBitacoras() {
    $('#logEventos').text(estado.eventos.join('\n') || 'Sin eventos registrados.');
    $('#logVentas').text(estado.ventas.join('\n') || 'Sin cobros registrados.');
    const totalConfirmado = estado.recibos.reduce((s, r) => s + (Number(r.total) || 0), 0);
    const totalPendiente = estado.sesiones.reduce((s, ses) => s + calcularTotalSesion(ses), 0);
    $('#admRecaudado').text(money(totalConfirmado));
    $('#admPendienteSala').text(money(totalPendiente));
  }

  function actualizarReloj() {
    const ahora = new Date();
    $('#relojHeader').text(ahora.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }));
    verificarHorarioLocal();

    let huboCambio = false;
    $('.session-item .timer').each(function () {
      const inicio = Number($(this).attr('data-inicio'));
      const horas = Number($(this).attr('data-horas')) || 1;
      const trans = Math.floor((Date.now() - inicio) / 1000);
      if (trans >= horas * 3600) {
        $(this).text('⏰ ¡Hora cumplida!');
        $(this).closest('.session-item').addClass('session-item--cumplida');
      } else {
        $(this).text(`⏱️ ${formatoDuracion(trans)} / ${horas}h`);
      }
    });

    estado.sesiones.forEach((s) => {
      const trans = Math.floor((Date.now() - s.inicio) / 1000);
      if (!s.avisadoFin && trans >= (Number(s.horas) || 1) * 3600) {
        s.avisadoFin = true;
        huboCambio = true;
        logEvento('ALERTA', `Tiempo cumplido en ${s.equipo} (${s.cliente}).`);
        mostrarToast(`⏰ Tiempo cumplido en ${s.equipo} (${s.cliente})`, 'info');
      }
    });
    if (huboCambio) guardarEstado();
  }

  function registrarEventosDelegados() {
    $(document)
      .off('click', '[data-vista]')
      .on('click', '[data-vista]', function () {
        cambiarVista($(this).attr('data-vista'));
      })
      .off('click', '[data-ir]')
      .on('click', '[data-ir]', function () {
        cambiarVista($(this).attr('data-ir'));
      })
      .off('click', '[data-close-modal]')
      .on('click', '[data-close-modal]', function () {
        cerrarModal($(`#${$(this).attr('data-close-modal')}`));
      })
      .off('click', '.arena-card__img, .arena-hero__img')
      .on('click', '.arena-card__img, .arena-hero__img', function () {
        const src = $(this).attr('src');
        const alt = $(this).attr('alt') || 'Vista ampliada';
        $('#zoomImg').attr({ src, alt });
        $('#zoomCaption').text(alt);
        abrirModal($('#modalZoom'));
      })
      .off('click', '.arena-modal')
      .on('click', '.arena-modal', function (e) {
        if (e.target === this) cerrarModal($(this));
      })
      .off('click', '#btnBurger')
      .on('click', '#btnBurger', function () {
        const $drawer = $('#mobileDrawer');
        $drawer.slideToggle(300, function () {
          $('#btnBurger').attr('aria-expanded', String($drawer.is(':visible')));
        });
      })
      .off('click', '#btnTheme')
      .on('click', '#btnTheme', function () {
        const nuevo = $('html').attr('data-theme') === 'light' ? 'dark' : 'light';
        $('html').attr('data-theme', nuevo);
        $(this).text(nuevo === 'light' ? '🌙' : '☀️');
        localStorage.setItem('theme', nuevo);
      })
      .off('click', '#btnSimularContraste')
      .on('click', '#btnSimularContraste', function () {
        const activo = $('body').toggleClass('alto-contraste').hasClass('alto-contraste');
        mostrarToast(activo ? '🌗 Alto Contraste WCAG activado' : '🌗 Alto Contraste WCAG desactivado', 'info');
      })
      .off('click', '#btnSimularVista')
      .on('click', '#btnSimularVista', function () {
        const activo = $('body').toggleClass('vista-movil-sim').hasClass('vista-movil-sim');
        mostrarToast(activo ? '📱 Vista Móvil compacta (390px) activada' : '🖥️ Vista Escritorio restaurada', 'info');
      })
      .off('click', '#btnSmokeTest')
      .on('click', '#btnSmokeTest', function () {
        const botones = $('button').length;
        const sinAlt = $('img:not([alt]), img[alt=""]').length;
        const enlacesVacios = $('a[href=""], a[href="#"]').length;
        $('#salidaAudit')
          .removeAttr('hidden')
          .text(`Smoke Test OK | Botones: ${botones} | Imágenes sin alt: ${sinAlt} | Enlaces vacíos: ${enlacesVacios}`);
      })
      .off('click', '#btnAuditarA11Y')
      .on('click', '#btnAuditarA11Y', function () {
        const sem = $('header, nav, main, section, article, footer').length;
        const sinAlt = $('img:not([alt]), img[alt=""]').length;
        $('#reporteA11Y')
          .removeAttr('hidden')
          .text(`Auditoría en vivo: ${sem} etiquetas semánticas HTML5 detectadas | Imágenes sin alt: ${sinAlt}`);
      })
      .off('click', '.btn-simular')
      .on('click', '.btn-simular', function () {
        const $card = $(this).closest('.arena-card');
        const activo = $card.toggleClass('arena-card--activo').hasClass('arena-card--activo');
        $card.find('.arena-card__sim-status').text(
          activo ? 'Estado: Seleccionado (Simulación)' : 'Estado: Normal'
        );
        logStream(`Simulación encapsulada en tarjeta: ${$card.find('.arena-card__title').text()}`);
      })
      .off('click', '.btn-detalles')
      .on('click', '.btn-detalles', function () {
        $(this).closest('.arena-card').find('.arena-card__specs').slideToggle('slow');
      })
      .off('click', '.btn-console')
      .on('click', '.btn-console', function () {
        estado.catActiva = $(this).attr('data-cat');
        renderChipsMenu();
        const q = estado.busquedaMenu.trim().toLowerCase();
        $('#menuGrid .arena-card').each(function () {
          const okCat = estado.catActiva === 'todas' || $(this).attr('data-cat') === estado.catActiva;
          const okQ = !q || ($(this).attr('data-search') || '').includes(q);
          if (okCat && okQ) $(this).fadeIn(220);
          else $(this).fadeOut(180);
        });
        setTimeout(() => {
          const visibles = $('#menuGrid .arena-card:visible').length;
          $('#menuResultInfo').text(`Mostrando ${visibles} ítems filtrados`);
        }, 240);
      })
      .off('keyup', '#searchSong')
      .on('keyup', '#searchSong', function () {
        estado.busquedaMenu = $(this).val();
        const q = estado.busquedaMenu.trim().toLowerCase();
        $('#menuGrid .arena-card').each(function () {
          const okCat = estado.catActiva === 'todas' || $(this).attr('data-cat') === estado.catActiva;
          const okQ = !q || ($(this).attr('data-search') || '').includes(q);
          if (okCat && okQ) $(this).show();
          else $(this).hide();
        });
        const visibles = $('#menuGrid .arena-card:visible').length;
        $('#menuResultInfo').text(`Mostrando ${visibles} ítems en vivo`);
        if (q) logStream(`Búsqueda en vivo: "${q}"`);
      })
      .off('click', '.zona-card')
      .on('click', '.zona-card', function () {
        estado.zonaActiva = $(this).attr('data-zona');
        estado.filtrarMapaPorZona = true;
        estado.equipoPreseleccionado = '';
        aplicarTemaZona(estado.zonaActiva);
        renderZonas();
        actualizarSelectEquipos();
        actualizarSubtotalReserva();
        renderMapaEstaciones();
        logStream(`División seleccionada: ${estado.zonaActiva.toUpperCase()}`);
      })
      .off('click', '.station-btn')
      .on('click', '.station-btn', function () {
        const code = $(this).attr('data-code');
        const est = generarEstaciones().find((x) => x.codigo === code);
        if (!est) return;
        if (est.reparacion) {
          mostrarToast(`${est.codigo} está inactivo / en reparación.`, 'err');
          return;
        }
        if (est.ocupada) {
          mostrarToast(`${est.codigo} ocupada por ${est.sesion.cliente}.`, 'info');
          return;
        }
        estado.zonaActiva = est.zonaId;
        estado.equipoPreseleccionado = est.codigo;
        aplicarTemaZona(est.zonaId);
        renderZonas();
        actualizarSelectEquipos();
        actualizarSubtotalReserva();
        renderMapaEstaciones();
        mostrarToast(`Seleccionaste ${est.codigo}. Confirma tu reserva.`, 'ok');
      })
      .off('dblclick', '[data-sesion-like]')
      .on('dblclick', '[data-sesion-like]', function () {
        const id = $(this).attr('data-sesion-like');
        const s = estado.sesiones.find((x) => x.id === id);
        if (s) {
          logEvento('LIKE', `❤️ Like enviado a la partida de ${s.cliente} en ${s.equipo}.`);
          mostrarToast(`❤️ Like enviado a ${s.cliente} (${s.equipo})`, 'ok');
        }
      })
      .off('click', '[data-add-menu]')
      .on('click', '[data-add-menu]', function () {
        agregarAOrden(Number($(this).attr('data-add-menu')));
      })
      .off('click', '.btn-quitar')
      .on('click', '.btn-quitar', function () {
        estado.orden.splice(Number($(this).attr('data-del-orden')), 1);
        guardarEstado();
        renderOrden();
      })
      .off('click', '[data-pedir-sesion]')
      .on('click', '[data-pedir-sesion]', function () {
        cambiarVista('cafeteria');
        $('#destinoPedido').val($(this).attr('data-pedir-sesion'));
      })
      .off('click', '[data-cerrar-sesion]')
      .on('click', '[data-cerrar-sesion]', function () {
        abrirCheckoutSesion($(this).attr('data-cerrar-sesion'));
      })
      .off('click', '#btnLogin')
      .on('click', '#btnLogin', function () {
        abrirModal($('#modalLogin'));
      })
      .off('click', '[data-auth-tab]')
      .on('click', '[data-auth-tab]', function () {
        const t = $(this).attr('data-auth-tab');
        $('[data-auth-tab]').each(function () {
          const activo = $(this).attr('data-auth-tab') === t;
          $(this).toggleClass('arena-btn--primary', activo).toggleClass('arena-btn--ghost', !activo);
        });
        if (t === 'cliente') $('#formLoginCliente').removeAttr('hidden');
        else $('#formLoginCliente').attr('hidden', true);
        if (t === 'registro') $('#formRegistroCliente').removeAttr('hidden');
        else $('#formRegistroCliente').attr('hidden', true);
        if (t === 'admin') $('#formLogin').removeAttr('hidden');
        else $('#formLogin').attr('hidden', true);
      })
      .off('submit', '#formRegistroCliente')
      .on('submit', '#formRegistroCliente', function (e) {
        e.preventDefault();
        const nick = limpiarTexto($('#regNick').val());
        const email = limpiarTexto($('#regEmail').val()).toLowerCase();
        const pass = limpiarTexto($('#regPass').val());
        if (nick.length < 2 || !email || pass.length < 4) {
          mostrarToast('Completa todos los campos (contraseña mín. 4 caracteres).', 'err');
          return;
        }
        if (estado.usuarios.some((u) => u.email === email)) {
          mostrarToast('Ese correo ya está registrado.', 'err');
          return;
        }
        estado.usuarios.push({ id: `USR-${Date.now()}`, nick, email, pass });
        estado.usuarioActual = { nick, email };
        estado.nick = nick;
        estado.esAdmin = false;
        guardarEstado();
        actualizarIdentidad();
        cerrarModal($('#modalLogin'));
        logEvento('CUENTA', `Cliente registrado: ${nick}`);
        mostrarToast(`¡Bienvenido ${nick}! Cuenta creada.`, 'ok');
      })
      .off('submit', '#formLoginCliente')
      .on('submit', '#formLoginCliente', function (e) {
        e.preventDefault();
        const user = limpiarTexto($('#cliLoginUser').val()).toLowerCase();
        const pass = limpiarTexto($('#cliLoginPass').val());
        const ok = estado.usuarios.find((u) => (u.email === user || u.nick.toLowerCase() === user) && u.pass === pass);
        if (!ok) {
          mostrarToast('Usuario o contraseña incorrectos.', 'err');
          return;
        }
        estado.usuarioActual = { nick: ok.nick, email: ok.email };
        estado.nick = ok.nick;
        estado.esAdmin = false;
        guardarEstado();
        actualizarIdentidad();
        cerrarModal($('#modalLogin'));
        mostrarToast(`Sesión iniciada como ${ok.nick}.`, 'ok');
      })
      .off('submit', '#formLogin')
      .on('submit', '#formLogin', function (e) {
        e.preventDefault();
        const u = limpiarTexto($('#loginUser').val()).toLowerCase();
        const p = limpiarTexto($('#loginPass').val());
        if (u === 'admin' && p === '1234') {
          estado.esAdmin = true;
          guardarEstado();
          actualizarIdentidad();
          renderPanelAdmin();
          cerrarModal($('#modalLogin'));
          logEvento('ADMIN', 'Modo Administrador activado.');
          mostrarToast('Modo Administrador activado.', 'ok');
        } else {
          mostrarToast('Credenciales incorrectas (usa admin / 1234).', 'err');
        }
      })
      .off('click', '#btnCerrarAdmin')
      .on('click', '#btnCerrarAdmin', function () {
        estado.esAdmin = false;
        guardarEstado();
        actualizarIdentidad();
        cambiarVista('lobby');
        mostrarToast('Saliste del modo Administrador.', 'info');
      })
      .off('change', '#adminHorarioModo')
      .on('change', '#adminHorarioModo', function () {
        estado.horarioModo = $(this).val();
        guardarEstado();
        verificarHorarioLocal();
        logEvento('ADMIN', `Horario cambiado a ${estado.horarioModo}.`);
      })
      .off('submit', '#formAdminMenu')
      .on('submit', '#formAdminMenu', function (e) {
        e.preventDefault();
        const nombre = limpiarTexto($('#admProdNombre').val());
        const precio = Number($('#admProdPrecio').val());
        const categoria = $('#admProdCat').val() || 'snacks';
        const detalle = limpiarTexto($('#admProdDetalle').val()) || 'Preparado al momento';
        if (!nombre || !(precio > 0)) {
          mostrarToast('Ingresa nombre y precio válido.', 'err');
          return;
        }
        const emojis = { cafes: '☕', bebidas: '🥤', snacks: '🥪', postres: '🍰' };
        estado.menuExtra.push({
          id: Date.now(),
          nombre,
          categoria,
          detalle,
          specs: detalle,
          precio,
          emoji: emojis[categoria] || '🍽️',
          imagen: '',
          disponible: true
        });
        this.reset();
        guardarEstado();
        renderMenu();
        renderPanelAdmin();
        logEvento('ADMIN', `Producto agregado: ${nombre} (${money(precio)})`);
        mostrarToast(`"${nombre}" publicado en el catálogo.`, 'ok');
      })
      .off('click', '[data-toggle-rep]')
      .on('click', '[data-toggle-rep]', function () {
        const code = $(this).attr('data-toggle-rep');
        if (estado.sesiones.some((s) => s.equipo === code)) {
          mostrarToast(`Cierra primero la sesión activa en ${code}.`, 'err');
          return;
        }
        if (estado.reparacion[code]) delete estado.reparacion[code];
        else estado.reparacion[code] = 'Mantenimiento técnico';
        guardarEstado();
        renderZonas();
        actualizarSelectEquipos();
        renderMapaEstaciones();
        renderPanelAdmin();
      })
      .off('click', '[data-toggle-prod]')
      .on('click', '[data-toggle-prod]', function () {
        const id = Number($(this).attr('data-toggle-prod'));
        const actual = obtenerMenuCompleto().find((x) => x.id === id);
        if (!actual) return;
        estado.menuAgotados[id] = actual.disponible;
        guardarEstado();
        renderMenu();
        renderPanelAdmin();
      })
      .off('click', '#btnGuardarNick')
      .on('click', '#btnGuardarNick', function () {
        const val = limpiarTexto($('#nickLobby').val());
        estado.nick = val;
        if (estado.usuarioActual && val) estado.usuarioActual.nick = val;
        guardarEstado();
        actualizarIdentidad();
        mostrarToast('Gamertag guardado.', 'ok');
      })
      .off('input change', '#hrs')
      .on('input change', '#hrs', actualizarSubtotalReserva)
      .off('change', '#resEquipo')
      .on('change', '#resEquipo', function () {
        estado.equipoPreseleccionado = $(this).val();
        renderMapaEstaciones();
      })
      .off('click', '#btnVerTodasEstaciones')
      .on('click', '#btnVerTodasEstaciones', function () {
        estado.filtrarMapaPorZona = false;
        renderMapaEstaciones();
      })
      .off('submit', '#formReserva')
      .on('submit', '#formReserva', function (e) {
        e.preventDefault();
        if (!verificarHorarioLocal() && !estado.esAdmin) {
          mostrarToast('El local está cerrado según el horario de atención.', 'err');
          return;
        }
        const cliente = limpiarTexto($('#resCliente').val());
        if (cliente.length < 2) {
          $('#errResCliente').text('Ingresa tu gamertag o nombre (mín. 2 caracteres).');
          return;
        }
        $('#errResCliente').text('');

        const zona = estado.zonas.find((z) => z.id === estado.zonaActiva) || estado.zonas[0];
        const disponibles = generarEstaciones().filter((st) => st.zonaId === zona.id && !st.ocupada && !st.reparacion);
        if (!disponibles.length) {
          mostrarToast(`No hay estaciones libres en ${zona.nombre}.`, 'err');
          return;
        }
        const elegido = $('#resEquipo').val();
        const estacion = disponibles.find((st) => st.codigo === elegido) || disponibles[0];
        const horas = Math.max(1, Number($('#hrs').val()) || 1);
        const extra = limpiarTexto($('#resExtra').val());

        estado.sesiones.unshift({
          id: `SES-${Date.now()}`,
          equipo: estacion.codigo,
          zonaId: zona.id,
          zonaNombre: zona.nombre,
          cliente,
          horas,
          tarifa: zona.precio,
          extra,
          inicio: Date.now(),
          avisadoFin: false,
          consumos: []
        });
        if (!estado.nick) estado.nick = cliente;
        estado.equipoPreseleccionado = '';
        $('#resExtra').val('');

        guardarEstado();
        actualizarIdentidad();
        renderZonas();
        actualizarSelectEquipos();
        renderMapaEstaciones();
        renderSesiones();
        if (estado.esAdmin) renderPanelAdmin();
        logEvento('RESERVA', `${estacion.codigo} asignada a ${cliente} por ${horas}h.`);
        enviarASupabase('reservas_cibercafe', {
          alias: cliente.slice(0, 40),
          zona: `${estacion.codigo} · ${zona.nombre}`,
          horas: horas,
          total: Number(zona.precio) * horas
        });
        mostrarToast(`✅ ${estacion.codigo} reservada para ${cliente}`, 'ok');
      })
      .off('click', '#btnVaciarOrden, #btnVaciarOrden2')
      .on('click', '#btnVaciarOrden, #btnVaciarOrden2', function () {
        estado.orden = [];
        guardarEstado();
        renderOrden();
      })
      .off('click', '#btnSumarCuenta, #btnCuentaSumar')
      .on('click', '#btnSumarCuenta, #btnCuentaSumar', sumarOrdenACuentaSesion)
      .off('click', '#btnConfirmarOrden, #btnConfirmarOrden2, #btnCuentaPagarOrden')
      .on('click', '#btnConfirmarOrden, #btnConfirmarOrden2, #btnCuentaPagarOrden', abrirCheckoutOrden)
      .off('change', '#metodoPago')
      .on('change', '#metodoPago', actualizarVistaQrCheckout)
      .off('click', '#btnFinalizarCompra')
      .on('click', '#btnFinalizarCompra', finalizarCheckout)
      .off('click', '#btnEnviarWA')
      .on('click', '#btnEnviarWA', function () {
        if (!estado.orden.length && !estado.sesiones.length) {
          mostrarToast('Agrega una reserva o productos antes de enviar.', 'err');
          return;
        }
        const cliente = limpiarTexto(estado.nick || 'Jugador Cyber Arena');
        let msg = `🎮 *Cyber Arena · Solicitud*\nJugador: *${cliente}*\n\n`;
        estado.sesiones.forEach((s) => {
          msg += `🖥️ ${s.equipo} (${s.zonaNombre}) — ${s.horas}h · ${money(calcularTotalSesion(s))}\n`;
        });
        estado.orden.forEach((i) => {
          msg += `☕ ${i.cant}× ${i.nombre} — ${money(i.precio * i.cant)}\n`;
        });
        window.open(`https://wa.me/59167301341?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      })
      .off('click', '#btnLimpiarHistorial')
      .on('click', '#btnLimpiarHistorial', function () {
        estado.recibos = [];
        guardarEstado();
        renderCuenta();
        renderBitacoras();
      })
      .off('click', '#btnSimularOcupacion')
      .on('click', '#btnSimularOcupacion', function () {
        const libres = generarEstaciones().filter((e) => !e.ocupada && !e.reparacion).slice(0, 6);
        const nicks = ['Kuroko_LP', 'ValenGG', 'Targaryen99', 'Dante_BO', 'SoraPlay', 'NekoRush'];
        libres.forEach((est, idx) => {
          estado.sesiones.push({
            id: `SIM-${Date.now()}-${idx}`,
            equipo: est.codigo,
            zonaId: est.zonaId,
            zonaNombre: est.zonaNombre,
            cliente: nicks[idx % nicks.length],
            horas: (idx % 3) + 1,
            tarifa: est.precio,
            extra: '',
            inicio: Date.now() - idx * 600000,
            avisadoFin: false,
            consumos: []
          });
        });
        guardarEstado();
        renderZonas();
        actualizarSelectEquipos();
        renderMapaEstaciones();
        renderSesiones();
        renderPanelAdmin();
        logEvento('SIMULACIÓN', `Ocupadas ${libres.length} estaciones de prueba.`);
      })
      .off('click', '#btnResetTodo')
      .on('click', '#btnResetTodo', function () {
        estado.sesiones = [];
        estado.orden = [];
        estado.recibos = [];
        estado.eventos = [];
        estado.ventas = [];
        guardarEstado();
        renderZonas();
        actualizarSelectEquipos();
        renderMapaEstaciones();
        renderSesiones();
        renderOrden();
        renderPanelAdmin();
        renderBitacoras();
        mostrarToast('Sala reiniciada por completo.', 'info');
      })
      .off('click', '#btnExportarBitacora')
      .on('click', '#btnExportarBitacora', function () {
        const contenido = `=== EVENTOS CYBER ARENA ===\n${estado.eventos.join('\n')}\n\n=== VENTAS CYBER ARENA ===\n${estado.ventas.join('\n')}`;
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bitacora-cyber-arena-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .off('keyup', '#radarInput')
      .on('keyup', '#radarInput', function () {
        const q = limpiarTexto($(this).val()).toLowerCase();
        const $res = $('#radarResults').empty();
        if (!q) return;
        const zMatch = estado.zonas.filter((z) => z.nombre.toLowerCase().includes(q) || z.detalle.toLowerCase().includes(q));
        const mMatch = obtenerMenuCompleto().filter((m) => m.disponible && (m.nombre.toLowerCase().includes(q) || m.detalle.toLowerCase().includes(q)));
        zMatch.slice(0, 3).forEach((z) => {
          $res.append(
            $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm arena-btn--block', 'data-ir': 'reservas' })
              .text(`${z.emoji} ${z.nombre} (${money(z.precio)}/h)`)
          );
        });
        mMatch.slice(0, 3).forEach((m) => {
          $res.append(
            $('<button>', { type: 'button', class: 'arena-btn arena-btn--ghost arena-btn--sm arena-btn--block', 'data-add-menu': m.id })
              .text(`${m.emoji} ${m.nombre} — ${money(m.precio)} (+ Agregar)`)
          );
        });
      });

    $(window)
      .off('online offline')
      .on('online offline', actualizarEstadoRed)
      .off('beforeinstallprompt')
      .on('beforeinstallprompt', function (e) {
        e.preventDefault();
        estado.deferredPrompt = e.originalEvent || e;
        $('#btnInstalarPWA').removeAttr('hidden');
      });

    $(document)
      .off('click', '#btnInstalarPWA')
      .on('click', '#btnInstalarPWA', async function () {
        if (!estado.deferredPrompt) return;
        estado.deferredPrompt.prompt();
        await estado.deferredPrompt.userChoice;
        estado.deferredPrompt = null;
        $(this).attr('hidden', true);
      });
  }

  async function cargarCatalogoJSON() {
    try {
      const response = await fetch('./data/catalogo.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      estado.zonas = Array.isArray(data.zonas) && data.zonas.length ? data.zonas : CATALOGO_RESPALDO.zonas;
      estado.catalogoBase = Array.isArray(data.catalogo) && data.catalogo.length ? data.catalogo : CATALOGO_RESPALDO.catalogo;
    } catch (_) {
      estado.zonas = CATALOGO_RESPALDO.zonas;
      estado.catalogoBase = CATALOGO_RESPALDO.catalogo;
    }
  }

  async function iniciarApp() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      $('html').attr('data-theme', 'light');
      $('#btnTheme').text('🌙');
    }

    arreglarLogoRoto();
    cargarEstado();
    await cargarCatalogoJSON();
    aplicarTemaZona(estado.zonaActiva);
    actualizarIdentidad();
    actualizarEstadoRed();
    verificarHorarioLocal();
    renderZonas();
    actualizarSelectEquipos();
    actualizarSubtotalReserva();
    renderMapaEstaciones();
    renderSesiones();
    renderChipsMenu();
    renderMenu();
    renderOrden();
    renderPanelAdmin();
    renderBitacoras();
    registrarEventosDelegados();
    actualizarReloj();
    setInterval(actualizarReloj, 1000);

    $('body').attr('data-hidratado', 'true');
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    if (!estado.eventos.length) logEvento('SISTEMA', 'Cyber Arena hidratado y operativo.');
  }

  iniciarApp();
});