// CIBER ARENA — SEMANA 2 - 04: PWA Y MODO OFFLINE
function initArquitecturaPWA() {
  window.addEventListener('online', () => {
    $('#ciber-status-red').removeClass('offline').addClass('online').text('🟢 En Línea');
    if (typeof registrarBitacoraEvento === 'function') registrarBitacoraEvento('RED', 'ONLINE');
  });

  window.addEventListener('offline', () => {
    $('#ciber-status-red').removeClass('online').addClass('offline').text('🟠 Offline');
    if (typeof registrarBitacoraEvento === 'function') registrarBitacoraEvento('RED', 'OFFLINE');
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch(e => console.log('SW ciber:', e.message));
  }
}
