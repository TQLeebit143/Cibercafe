/* ============================================================
   CYBER ARENA — data/catalogo.js
   Datos locales del menú y las zonas (funciona en file:// y offline).
   ============================================================ */
window.CIBER_CATEGORIAS = [
  { id: 'cafes', label: 'Cafés', emoji: '☕' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { id: 'snacks', label: 'Snacks & comida', emoji: '🥪' },
  { id: 'postres', label: 'Postres', emoji: '🍰' }
];

window.CIBER_ZONAS = [
  {
    id: 'pc',
    nombre: 'Cabinas PC Gamer Pro',
    prefijo: 'PC',
    capacidad: 4,
    precio: 10,
    detalle: 'RTX 4060 · Monitor 180 Hz · Silla ergonómica',
    emoji: '🖥️',
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80'
  },
  {
    id: 'vip',
    nombre: 'Salas VIP Consolas (PS5)',
    prefijo: 'PS5',
    capacidad: 2,
    precio: 18,
    detalle: 'Pantalla 4K de 65" · DualSense · Sillones reclinables',
    emoji: '🎮',
    imagen: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&q=80'
  },
  {
    id: 'consola',
    nombre: 'Salas Consolas (PS4/PS3)',
    prefijo: 'PS4',
    capacidad: 3,
    precio: 12,
    detalle: 'LED 43" · Catálogo clásico · Dos mandos',
    emoji: '🕹️',
    imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=80'
  },
  {
    id: 'mesa',
    nombre: 'Mesas Co-Working & Café',
    prefijo: 'MESA',
    capacidad: 2,
    precio: 12,
    detalle: 'Wi-Fi 6 · Enchufes individuales · Zona silenciosa',
    emoji: '💻',
    imagen: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80'
  }
];

window.CIBER_MENU = [
  /* CAFÉS */
  { id: 1, nombre: 'Espresso Doble', categoria: 'cafes', detalle: 'Grano de altura recién molido', precio: 10, emoji: '☕', imagen: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80' },
  { id: 2, nombre: 'Café Americano', categoria: 'cafes', detalle: 'Taza de 12 oz · Caliente', precio: 12, emoji: '☕', imagen: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  { id: 3, nombre: 'Cappuccino Artesanal', categoria: 'cafes', detalle: 'Espuma cremosa y cacao', precio: 15, emoji: '🍮', imagen: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80' },
  { id: 4, nombre: 'Latte / Macchiato', categoria: 'cafes', detalle: 'Leche vaporizada suave', precio: 15, emoji: '🥛', imagen: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80' },
  { id: 5, nombre: 'Café Helado / Frappé', categoria: 'cafes', detalle: 'Crema batida y caramelo', precio: 16, emoji: '🧋', imagen: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80' },

  /* BEBIDAS */
  { id: 6, nombre: 'Bebida Energética Monster', categoria: 'bebidas', detalle: 'Lata de 473 ml · Ultra fría', precio: 15, emoji: '🥤', imagen: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&q=80' },

  /* SNACKS */
  { id: 7, nombre: 'Pan con Chicharrón', categoria: 'snacks', detalle: 'Crocante con salsa criolla', precio: 22, emoji: '🥪', imagen: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80' },
  { id: 8, nombre: 'Sándwich Club Gamer', categoria: 'snacks', detalle: 'Triple piso con papas', precio: 28, emoji: '🥙', imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80' },
  { id: 9, nombre: 'Salchipapa Gamer', categoria: 'snacks', detalle: 'Porción XL + 4 salsas', precio: 18, emoji: '🍟', imagen: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80' },
  { id: 10, nombre: 'Wrap de Pollo', categoria: 'snacks', detalle: 'Tortilla integral · vegetales frescos', precio: 20, emoji: '🌯', imagen: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80' },
  { id: 11, nombre: 'Mini Pizzeta Pepperoni', categoria: 'snacks', detalle: 'Masa artesanal · mozzarella fundida', precio: 18, emoji: '🍕', imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },

  /* POSTRES */
  { id: 12, nombre: 'Brownie con Helado', categoria: 'postres', detalle: 'Chocolate tibio + bola de vainilla', precio: 16, emoji: '🍫', imagen: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80' },
  { id: 13, nombre: 'Cheesecake Frutos Rojos', categoria: 'postres', detalle: 'Porción artesanal fría', precio: 18, emoji: '🍰', imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80' },
  { id: 14, nombre: 'Pie de Limón', categoria: 'postres', detalle: 'Relleno cítrico y merengue tostado', precio: 17, emoji: '🥧', imagen: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80' },
  { id: 15, nombre: 'Croissant / Muffin', categoria: 'postres', detalle: 'Horneado del día · mantequilla', precio: 12, emoji: '🥐', imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80' }
];

window.CIBER_MENU.forEach((item) => {
  const cat = window.CIBER_CATEGORIAS.find((c) => c.id === item.categoria);
  item.catLabel = cat ? `${cat.emoji} ${cat.label}` : item.categoria;
});
