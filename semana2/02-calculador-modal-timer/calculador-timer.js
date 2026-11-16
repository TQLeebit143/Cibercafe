// CIBER ARENA — SEMANA 2 - 02: CALCULADOR, MODALES, TIMER Y ZOOM DE IMÁGENES
function initCalculadorModalTimer() {
  // Timer de sesión de juego en lobby
  let segs = 0;
  setInterval(() => {
    segs++;
    const m = String(Math.floor(segs / 60)).padStart(2, '0');
    const s = String(segs % 60).padStart(2, '0');
    $('#ciber-timer-span').text(`${m}:${s}`);
  }, 1000);

  // Escuchar cierre de modales
  $(document).on('click', '.modal-overlay, .modal-close', function(e) {
    if (e.target === this) {
      $('.modal-overlay').fadeOut(150);
    }
  });
}

function abrirZoomCiber(src, titulo, desc, precio) {
  $('#zoom-ciber-img').attr('src', src).attr('alt', titulo);
  $('#zoom-ciber-titulo').text(titulo);
  $('#zoom-ciber-desc').text(desc || '');
  $('#zoom-ciber-precio').text(precio ? `${precio} BOB` : '');
  $('#modal-zoom-ciber').fadeIn(200).css('display', 'flex');

  if (typeof registrarBitacoraEvento === 'function') {
    registrarBitacoraEvento('ZOOM', `Estación/Item ampliado: "${titulo}"`);
  }
}

function cerrarZoomCiber() {
  $('#modal-zoom-ciber').fadeOut(150);
}
