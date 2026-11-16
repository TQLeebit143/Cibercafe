// CIBER ARENA — SEMANA 1 - 04: VALIDACIÓN FORMULARIO DE RESERVA
function initValidacionFormulario() {
  $('#form-reserva-ciber').on('submit', function(e) {
    e.preventDefault();

    const nick = $('#res-nick').val().trim();
    const celular = $('#res-celular').val().trim();
    const area = $('#res-area').val();
    const horas = parseFloat($('#res-horas').val()) || 1;

    if (!nick || nick.length < 2) {
      alert("Por favor ingresa tu Gamertag / Nombre válido.");
      $('#res-nick').focus();
      return;
    }

    if (!celular || !/^[67][0-9]{7}$/.test(celular)) {
      alert("Ingresa un número de celular boliviano válido (8 dígitos, inicia en 6 o 7).");
      $('#res-celular').focus();
      return;
    }

    // Calcular tarifa
    let tarifa = (area === 'Cabina PC Gamer Pro') ? 10 : (area.includes('VIP') ? 18 : 12);
    let total = tarifa * horas;

    if (typeof registrarBitacoraEvento === 'function') {
      registrarBitacoraEvento('RESERVA_SUBMIT', `Jugador: ${nick} | Estación: ${area} (${horas}h) | Total: ${total} BOB`);
    }

    const msg = `🎮 *Reserva Cyber Arena*\nGamertag: *${nick}*\nCelular: *${celular}*\nEstación: *${area}*\nTiempo: *${horas} hora(s)*\nTotal estimado: *${total} BOB*`;
    window.open(`https://wa.me/59167301341?text=${encodeURIComponent(msg)}`, '_blank');
    this.reset();
  });
}
