// CIBER ARENA — SEMANA 1 - 06: BITÁCORA DÍA 2 (VENTAS Y CONSUMOS)
let totalCajaBOB = 0;
function registrarBitacoraVenta(detalle, monto, cliente) {
  const h = new Date().toLocaleTimeString();
  totalCajaBOB += monto;
  const c = $('#logOutputVentas');
  if (c.length) {
    c.prepend(`<div style="color:#86efac; border-bottom:1px solid rgba(255,255,255,0.05); padding:4px 0;">[${h}] Cliente: <strong>${cliente}</strong> | ${detalle} | <strong style="color:#fde047;">${monto} BOB</strong></div>`);
  }
  $('#totalCajaMonto').text(totalCajaBOB + ' BOB');
}
