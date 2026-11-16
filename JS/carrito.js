// CIBER ARENA — JS/carrito.js (Lobby y Cotizador)
let ordenCiber = [];

function agregarCarritoCiber(id) {
  const item = catalogoCiber.find(i => i.id === id);
  if (!item) return;

  const ex = ordenCiber.find(o => o.id === id);
  if (ex) {
    ex.cant = (ex.cant || 1) + 1;
  } else {
    ordenCiber.push({ ...item, cant: 1 });
  }

  actualizarLobbyOrden();
  if (typeof registrarBitacoraEvento === 'function') {
    registrarBitacoraEvento('ORDEN', `+ ${item.nombre} (${item.precio} BOB)`);
  }
}

function cambiarCantCiber(idx, delta) {
  if (!ordenCiber[idx]) return;
  ordenCiber[idx].cant += delta;
  if (ordenCiber[idx].cant <= 0) {
    ordenCiber.splice(idx, 1);
  }
  actualizarLobbyOrden();
}

function vaciarLobbyCiber() {
  ordenCiber = [];
  actualizarLobbyOrden();
}

function actualizarLobbyOrden() {
  const ul = $('#lista-lobby-ciber').empty();
  let total = 0;
  let count = 0;

  if (!ordenCiber.length) {
    ul.html('<li style="color:var(--text-sub); text-align:center; padding:15px 0;">Tu orden de juego o snacks está vacía.</li>');
  } else {
    ordenCiber.forEach((item, idx) => {
      const sub = item.precio * item.cant;
      total += sub;
      count += item.cant;
      ul.append(`
        <li class="ciber-cart-item">
          <div>
            <strong>${item.nombre}</strong>
            <div style="font-size:0.75rem; color:var(--text-sub);">${item.precio} BOB c/u</div>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="btn-cant" onclick="cambiarCantCiber(${idx}, -1)">-</button>
            <span style="font-weight:bold;">${item.cant}</span>
            <button class="btn-cant" onclick="cambiarCantCiber(${idx}, 1)">+</button>
          </div>
          <span style="color:var(--accent,#00f0ff); font-weight:bold;">${sub} BOB</span>
          <button class="btn-cant" style="color:#ef4444;" onclick="ordenCiber.splice(${idx},1); actualizarLobbyOrden();">✕</button>
        </li>
      `);
    });
  }

  $('#totalLobbyBOB').text(total + ' BOB');
  $('#navCountCiber').text(count);
  $('#navTotalCiber').text(total);
}

function enviarOrdenWhatsApp() {
  if (!ordenCiber.length) {
    alert("Agrega estaciones o consumos antes de enviar.");
    return;
  }
  const cliente = $('#nickLobby').val().trim() || 'Jugador Gamer';
  const total = ordenCiber.reduce((sum, i) => sum + (i.precio * i.cant), 0);
  
  let msg = `🎮 *Orden / Reserva Cyber Arena*\nGamertag: *${cliente}*\n\n*Detalle:*\n`;
  ordenCiber.forEach(i => {
    msg += `• ${i.cant}x ${i.nombre} — ${i.precio * i.cant} BOB\n`;
  });
  msg += `\n💰 *Total: ${total} BOB*`;

  if (typeof registrarBitacoraVenta === 'function') {
    registrarBitacoraVenta(ordenCiber.map(i => `${i.cant}x ${i.nombre}`).join(', '), total, cliente);
  }

  window.open(`https://wa.me/59167301341?text=${encodeURIComponent(msg)}`, '_blank');
}
