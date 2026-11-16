// CIBER ARENA — SEMANA 1 - 02: FILTRO Y BÚSQUEDA
let catCiberActiva = 'todos';
let qCiber = '';

function initFiltrosYBusqueda() {
  $('.chip-ciber').on('click', function() {
    $('.chip-ciber').removeClass('active');
    $(this).addClass('active');
    catCiberActiva = $(this).data('cat') || 'todos';
    aplicarFiltrosCiber();
    if (typeof registrarBitacoraEvento === 'function') {
      registrarBitacoraEvento('FILTRO', `Categoría: ${catCiberActiva.toUpperCase()}`);
    }
  });

  $('#inputRadar').on('keyup input', function() {
    qCiber = $(this).val().toLowerCase().trim();
    aplicarFiltrosCiber();
    if (typeof registrarBitacoraEvento === 'function' && qCiber.length > 2) {
      registrarBitacoraEvento('RADAR', `Búsqueda: "${qCiber}"`);
    }
  });
}

function aplicarFiltrosCiber() {
  if (typeof catalogoCiber === 'undefined') return;
  const res = catalogoCiber.filter(item => {
    const okCat = (catCiberActiva === 'todos') || (item.categoria === catCiberActiva);
    const okQ = !qCiber || item.nombre.toLowerCase().includes(qCiber) || item.detalle.toLowerCase().includes(qCiber);
    return okCat && okQ;
  });
  if (typeof renderizarCiber === 'function') renderizarCiber(res);
}
