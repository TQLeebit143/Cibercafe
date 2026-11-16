// CIBER ARENA — JS/render.js (Renderizado y Zoom)
function renderizarCiber(lista) {
  const c = $('#grid-ciber-items').empty();
  if (!lista.length) {
    c.html('<p style="grid-column:1/-1; text-align:center; color:var(--text-sub);">🎮 No se encontraron estaciones o ítems con ese filtro.</p>');
    return;
  }

  lista.forEach(item => {
    c.append(`
      <article class="ciber-card" onclick="abrirZoomCiber('${item.img}', '${item.nombre}', '${item.detalle}', ${item.precio})">
        <div class="ciber-card-img-wrap">
          <img src="${item.img}" alt="${item.nombre}" loading="lazy">
          <span class="ciber-card-cat">${item.catLabel}</span>
          <button class="btn-zoom-ciber" onclick="event.stopPropagation(); abrirZoomCiber('${item.img}', '${item.nombre}', '${item.detalle}', ${item.precio})">🔍 Zoom</button>
        </div>
        <div class="ciber-card-body">
          <h4>${item.nombre}</h4>
          <p>${item.detalle}</p>
          <div class="ciber-card-footer">
            <span class="ciber-price">${item.precio} BOB</span>
            <button class="btn-add-ciber" onclick="event.stopPropagation(); agregarCarritoCiber(${item.id})">+ Reservar/Pedir</button>
          </div>
        </div>
      </article>
    `);
  });
}
