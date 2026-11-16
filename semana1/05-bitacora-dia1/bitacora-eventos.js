// CIBER ARENA — SEMANA 1 - 05: BITÁCORA DÍA 1 (EVENTOS EN TIEMPO REAL)
function registrarBitacoraEvento(tipo, msg) {
  const h = new Date().toLocaleTimeString();
  const c = $('#logOutputEventos');
  if (c.length) {
    c.prepend(`<div>[${h}] <strong style="color:var(--accent,#00f0ff);">${tipo}:</strong> ${msg}</div>`);
  }
}
function limpiarBitacoraEventos() {
  $('#logOutputEventos').html('<div>[SISTEMA] Registro de eventos limpiado.</div>');
}
