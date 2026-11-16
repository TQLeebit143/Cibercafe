// CIBER ARENA — SEMANA 1 - 03: MENÚ HAMBURGUESA
function initMenuHamburguesa() {
  const btn = $('#btn-hamb-ciber');
  const menu = $('#nav-mobile-ciber');

  btn.on('click', function(e) {
    e.stopPropagation();
    menu.toggleClass('abierto');
  });

  $('#nav-mobile-ciber a, #nav-mobile-ciber button').on('click', function() {
    menu.removeClass('abierto');
  });

  $(document).on('click', function(e) {
    if (!$(e.target).closest('#nav-mobile-ciber, #btn-hamb-ciber').length) {
      menu.removeClass('abierto');
    }
  });
}
