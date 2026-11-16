// CIBER ARENA — JS/main.js (Orquestador)
$(document).ready(function () {
  console.log("Iniciando Cyber Arena Desktop...");

  if (typeof renderizarCiber === 'function' && typeof catalogoCiber !== 'undefined') {
    renderizarCiber(catalogoCiber);
  }

  if (typeof initModoOscuro === 'function') initModoOscuro();
  if (typeof initFiltrosYBusqueda === 'function') initFiltrosYBusqueda();
  if (typeof initMenuHamburguesa === 'function') initMenuHamburguesa();
  if (typeof initValidacionFormulario === 'function') initValidacionFormulario();
  if (typeof initAcordeonYTemas === 'function') initAcordeonYTemas();
  if (typeof initCalculadorModalTimer === 'function') initCalculadorModalTimer();
  if (typeof initArquitecturaPWA === 'function') initArquitecturaPWA();
  if (typeof initSeguridadYLogin === 'function') initSeguridadYLogin();

  if (typeof registrarBitacoraEvento === 'function') {
    registrarBitacoraEvento('SISTEMA', 'Cyber Arena Desktop iniciado correctamente.');
  }
});
