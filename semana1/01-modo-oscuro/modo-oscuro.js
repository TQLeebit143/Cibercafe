// CIBER ARENA — SEMANA 1 - 01: MODO OSCURO / CYBER CLARO
function initModoOscuro() {
  const tema = localStorage.getItem('ciber_tema') || 'dark';
  aplicarTemaCiber(tema);

  $('#btn-tema, #btn-tema-mob').on('click', function(e) {
    e.preventDefault();
    const esClaro = $('body').hasClass('light-mode');
    const nuevo = esClaro ? 'dark' : 'light';
    aplicarTemaCiber(nuevo);
    if (typeof registrarBitacoraEvento === 'function') {
      registrarBitacoraEvento('TEMA', `Modo cambiado a: ${nuevo.toUpperCase()}`);
    }
  });
}

function aplicarTemaCiber(tema) {
  if (tema === 'light') {
    $('body').addClass('light-mode');
    $('#btn-tema, #btn-tema-mob').html('☀️ Modo Luz');
  } else {
    $('body').removeClass('light-mode');
    $('#btn-tema, #btn-tema-mob').html('🌙 Modo Cyber');
  }
  localStorage.setItem('ciber_tema', tema);
}
