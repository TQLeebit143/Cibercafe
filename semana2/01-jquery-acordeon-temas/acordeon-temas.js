// CIBER ARENA — SEMANA 2 - 01: ACORDEÓN JQUERY
function initAcordeonYTemas() {
  $('.accordion-btn').on('click', function(e) {
    e.stopPropagation();
    $(this).next('.accordion-panel').stop(true, true).slideToggle(200);
    if (typeof registrarBitacoraEvento === 'function') {
      registrarBitacoraEvento('ACORDEÓN', `Panel consultado: ${$(this).text().trim()}`);
    }
  });
}
