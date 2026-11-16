// CIBER ARENA — SEMANA 2 - 03: FETCH DINÁMICO Y LAZY LOADING
async function cargarCatalogoCiberAsync() {
  try {
    const res = await fetch('data/catalogo.json');
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Usando catalogoCiber local en memoria:", err);
    return (typeof catalogoCiber !== 'undefined') ? catalogoCiber : [];
  }
}
