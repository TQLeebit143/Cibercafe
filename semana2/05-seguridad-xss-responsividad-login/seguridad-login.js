// CIBER ARENA — SEMANA 2 - 05: LOGIN ADMIN VS CLIENTE
const usuariosCiber = [
  { user: "admin", pass: "ciber123", rol: "ADMIN", nombre: "Administrador de Turno" },
  { user: "cajero", pass: "arena2026", rol: "CAJA", nombre: "Cajero Lobby" }
];

let usuarioCiberActual = null;

function initSeguridadYLogin() {
  const ses = sessionStorage.getItem('ciber_sesion');
  if (ses) {
    try {
      usuarioCiberActual = JSON.parse(ses);
      aplicarRolCiber();
    } catch(e) {
      usuarioCiberActual = null;
    }
  } else {
    aplicarRolCiber();
  }

  $('#btn-login-ciber, #btn-login-ciber-mob').on('click', function(e) {
    e.preventDefault();
    if (usuarioCiberActual) {
      cerrarSesionCiber();
    } else {
      $('#modal-login-ciber').fadeIn(200).css('display', 'flex');
      $('#ciber-user-inp').focus();
    }
  });

  $('#form-login-ciber').on('submit', function(e) {
    e.preventDefault();
    const u = $('<div>').text($('#ciber-user-inp').val().trim()).html();
    const p = $('#ciber-pass-inp').val();

    const ok = usuariosCiber.find(usr => usr.user.toLowerCase() === u.toLowerCase() && usr.pass === p);
    if (ok) {
      usuarioCiberActual = ok;
      sessionStorage.setItem('ciber_sesion', JSON.stringify(ok));
      $('#modal-login-ciber').fadeOut(150);
      $('#form-login-ciber')[0].reset();
      aplicarRolCiber();
      if (typeof registrarBitacoraEvento === 'function') {
        registrarBitacoraEvento('LOGIN_OK', `Ingresó: ${ok.nombre} [${ok.rol}]`);
      }
    } else {
      $('#login-ciber-err').text('Credenciales incorrectas').show();
      if (typeof registrarBitacoraEvento === 'function') {
        registrarBitacoraEvento('LOGIN_FAIL', `Usuario no reconocido: "${u}"`);
      }
    }
  });

  $('#btn-logout-banner-ciber').on('click', function() {
    cerrarSesionCiber();
  });
}

function cerrarSesionCiber() {
  if (confirm("¿Cerrar sesión de administración del Cibercafé?")) {
    usuarioCiberActual = null;
    sessionStorage.removeItem('ciber_sesion');
    aplicarRolCiber();
    if (typeof registrarBitacoraEvento === 'function') {
      registrarBitacoraEvento('LOGOUT', 'Sesión administrativa cerrada.');
    }
  }
}

function aplicarRolCiber() {
  const panelAdmin = $('#seccion-admin-ciber');
  const bannerAdmin = $('#banner-ciber-admin');
  const btn = $('#btn-login-ciber, #btn-login-ciber-mob');

  if (usuarioCiberActual) {
    panelAdmin.slideDown(250);
    bannerAdmin.css('display', 'flex');
    $('#ciber-admin-tag').text(`${usuarioCiberActual.nombre} [${usuarioCiberActual.rol}]`);
    btn.html(`🔓 Salir (${usuarioCiberActual.user})`);
  } else {
    panelAdmin.slideUp(200);
    bannerAdmin.hide();
    btn.html('🔒 Acceso Admin');
  }
}
