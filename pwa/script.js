const catalogoGlobal = [
  { id: 5, nombre: "Espresso Doble", categoria: "cafeteria", detalle: "Grano de altura recién molido", precio: 10, imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=80" },
  { id: 6, nombre: "Café Americano", categoria: "cafeteria", detalle: "Taza 12oz • Caliente", precio: 12, imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80" },
  { id: 7, nombre: "Cappuccino Artesanal", categoria: "cafeteria", detalle: "Espuma cremosa y cacao", precio: 15, imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=80" },
  { id: 8, nombre: "Latte / Macchiato", categoria: "cafeteria", detalle: "Leche vaporizada suave", precio: 15, imagen: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=200&q=80" },
  { id: 9, nombre: "Café Helado / Frappé", categoria: "cafeteria", detalle: "Crema batida y caramelo", precio: 16, imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80" },
  { id: 10, nombre: "Bebida Energética Monster", categoria: "cafeteria", detalle: "Lata 473ml • Ultra fría", precio: 15, imagen: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=200&q=80" },
  { id: 11, nombre: "Pan con Chicharrón", categoria: "snacks", detalle: "Crocante con salsa criolla", precio: 22, imagen: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80" },
  { id: 12, nombre: "Sándwich Club Gamer", categoria: "snacks", detalle: "Triple piso con papas", precio: 28, imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80" },
  { id: 13, nombre: "Salchipapa Gamer", categoria: "snacks", detalle: "Porción XL + 4 salsas", precio: 18, imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&q=80" },
  { id: 14, nombre: "Brownie con Helado", categoria: "snacks", detalle: "Chocolate tibio + bola vainilla", precio: 16, imagen: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&q=80" },
  { id: 15, nombre: "Cheesecake Frutos Rojos", categoria: "snacks", detalle: "Porción artesanal fría", precio: 18, imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&q=80" }
];

let ordenPwa = [];

function logPwa(mensaje) {
  const hora = new Date().toLocaleTimeString();
  $('#log-pwa').prepend(`<div>[${hora}] ${mensaje}</div>`);
}

function toastPwa(texto) {
  $('#toast-pwa').text(texto).stop(true, true).fadeIn(150).delay(2000).fadeOut(300);
}

function renderizarCatalogoPwa(lista) {
  const contenedor = $('#contenedor-catalogo-pwa');
  contenedor.empty();

  if (!lista || lista.length === 0) {
    contenedor.html('<p style="padding:10px; color:#94a3b8; font-size:0.8rem;">No se encontraron elementos.</p>');
    return;
  }

  let html = '';
  lista.forEach(item => {
  
    html += `
      <article class="tarjeta-item-pwa" data-id="${item.id}">
        <img src="${item.imagen}" alt="${item.nombre}" class="img-catalogo-clic" loading="lazy" width="56" height="56">
        <div class="info-item-pwa">
          <h4>${item.nombre}</h4>
          <p>${item.detalle}</p>
          <span class="precio-tag">${item.precio} BOB</span>
        </div>
        <button class="btn-agregar-pwa">+ Orden</button>
      </article>
    `;
  });
  contenedor.html(html);
}

function actualizarOrdenPwa() {
  const listaEl = $('#lista-orden-pwa');
  const listaLobbyEl = $('#lista-carrito-lobby-pwa');
  listaEl.empty();
  listaLobbyEl.empty();
  let total = 0;

  if (ordenPwa.length === 0) {
    listaEl.html('<li class="vacio" style="padding:8px; color:#94a3b8; font-size:0.78rem;">Sin ítems en la orden.</li>');
    listaLobbyEl.html('<li class="vacio" style="padding:8px; color:#94a3b8; font-size:0.78rem;">Sin reservas ni snacks activos.</li>');
  } else {
    ordenPwa.forEach((item, index) => {
      total += item.precio;
      let liHtml = `
        <li>
          <span><strong>${item.nombre}</strong> (${item.precio} BOB)</span>
          <button class="btn-quitar" onclick="quitarItemPwa(${index})">✕</button>
        </li>
      `;
      listaEl.append(liHtml);
      listaLobbyEl.append(liHtml);
    });
  }

  $('#pwa-total').text(total);
  $('#orden-subtotal-pwa').text(total + ' BOB');
}

function quitarItemPwa(index) {
  const eliminado = ordenPwa.splice(index, 1)[0];
  actualizarOrdenPwa();
  toastPwa(`Eliminado: ${eliminado.nombre}`);
  logPwa(`Eliminado de orden: ${eliminado.nombre}`);
}

function cambiarVistaPwa(idVista) {
  $('.vista-pwa').hide();
  $('#' + idVista).fadeIn(150);
  logPwa(`Navegación móvil a sección: ${idVista}`);
}

function cerrarHamb() {
  $('#menuDesplegablePwa').hide();
}

function consultarCuentaPwa() {
  const q = $('#inputBusquedaCuentaPwa').val().trim();
  const box = $('#resultadoCuentaPwa');
  if(!q) {
    box.html('<div>Escribe un nombre o código válido.</div>');
    return;
  }
  box.html(`<div>Cuenta activa para "${q}". Sin deudas pendientes.</div>`);
  logPwa(`Consulta de cuenta para: ${q}`);
}

$(document).ready(function() {
  renderizarCatalogoPwa(catalogoGlobal);
  logPwa('Menú de cafetería cargado con éxito.');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => logPwa('Service Worker registrado.'))
      .catch(err => logPwa('Error SW: ' + err));
  }

  $('#contenedor-catalogo-pwa').off('click', '.btn-agregar-pwa').on('click', '.btn-agregar-pwa', function() {
    const id = $(this).closest('.tarjeta-item-pwa').data('id');
    const producto = catalogoGlobal.find(p => p.id === id);
    if (producto) {
      ordenPwa.push(producto);
      actualizarOrdenPwa();
      toastPwa(`Añadido: ${producto.nombre}`);
      logPwa(`Agregado a orden: ${producto.nombre} (${producto.precio} BOB)`);
    }
  });

  $('#btnHambPwa').on('click', function(e) {
    e.stopPropagation();
    $('#menuDesplegablePwa').toggle();
  });

  $(document).on('click', function() {
    $('#menuDesplegablePwa').hide();
  });

  $('.chip-filtro').on('click', function() {
    $('.chip-filtro').removeClass('activo');
    $(this).addClass('activo');
    const cat = $(this).data('cat');
    const filtrados = cat === 'todos' ? catalogoGlobal : catalogoGlobal.filter(i => i.categoria === cat);
    renderizarCatalogoPwa(filtrados);
    logPwa(`Filtro aplicado: ${cat}`);
  });

  $('#buscar-pwa').on('keyup', function() {
    const q = $(this).val().toLowerCase();
    const filtrados = catalogoGlobal.filter(i => i.nombre.toLowerCase().includes(q) || i.detalle.toLowerCase().includes(q));
    renderizarCatalogoPwa(filtrados);
  });

  $('#btn-tema-pwa').on('click', function() {
    $('body').toggleClass('light-mode');
    const claro = $('body').hasClass('light-mode');
    $(this).text(claro ? '☀️' : '🌙');
    logPwa(`Tema cambiado a ${claro ? 'Claro' : 'Oscuro'}`);
  });

  $('#form-reserva-pwa').on('submit', function(e) {
    e.preventDefault();
    const cliente = $('#nombreClientePwa').val();
    const area = $('#areaReservaPwa').val();
    const horas = $('#horasReservaPwa').val();
    
    let precioEstacion = area.includes('PC') ? 10 : (area.includes('VIP') ? 18 : 12);
    let totalEstacion = precioEstacion * horas;

    ordenPwa.push({ nombre: `Reserva ${area} (${horas}h)`, precio: totalEstacion });
    actualizarOrdenPwa();
    toastPwa(`Estación asignada a ${cliente}`);
    logPwa(`Reserva creada para ${cliente} en ${area} (${totalEstacion} BOB)`);
    cambiarVistaPwa('vista-lobby-pwa');
    this.reset();
  });

  $('#btn-confirmar-pwa').on('click', function() {
    if (ordenPwa.length === 0) {
      toastPwa('La orden está vacía');
      return;
    }
    const total = ordenPwa.reduce((acc, el) => acc + el.precio, 0);
    logPwa(`VENTA MÓVIL CONFIRMADA: Total ${total} BOB pagados.`);
    toastPwa(`¡Orden procesada por ${total} BOB!`);
    ordenPwa = [];
    actualizarOrdenPwa();
    cambiarVistaPwa('vista-lobby-pwa');
  });

  $(document).on('click', '.img-catalogo-clic', function() {
    const srcOriginal = $(this).attr('src');
    const titulo = $(this).closest('.tarjeta-item-pwa').find('h4').text();
    const srcAlta = srcOriginal.replace('w=200', 'w=1200');

    $('#img-modal-zoom').attr('src', srcAlta);
    $('#titulo-modal-zoom').text(titulo);
    $('#modal-imagen').fadeIn('fast');
    logPwa(`Abriendo zoom de imagen: ${titulo}`);
  });
});