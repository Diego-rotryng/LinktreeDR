# Einstech · BioExpress PRO (demo modular)
- Subdominio `cliente.einstech.com.ar` → carga `clientes/cliente.json`.
- Local: usar `?c=cliente` (ej: `index.html?c=clarisa`).

## Estructura
- `index.html` · layout + estilos
- `script.js` · lee JSON y renderiza
- `clientes/*.json` · 1 archivo por cliente
- `clientes/_list.json` · catálogo para selector local

## Campos del JSON
{
  "nombre": "Clarisa Rozenbaum",
  "profesion": "Psicóloga & Coach · Sesiones online",
  "tags": ["Psicología","Coaching"],
  "avatar": "data:image/svg+xml;base64,...",
  "wa_numero": "54911...",
  "wa_mensaje": "Hola, quiero reservar...",
  "instagram": "https://instagram.com/...",
  "reservar_url": "https://cal.com/...",
  "pagar_url": "https://mpago.la/...",
  "destacados": [
    {"titulo":"Sesión 45'","precio":"18000","mensaje":"Quiero reservar sesión 45"}
  ],
  "links": [
    {"label":"Sitio Web","url":"https://...","icon":"web"}
  ],
  "footer": "Texto al pie opcional"
}

## Agregar un cliente nuevo
1. Crear `clientes/<subdominio>.json` con el formato de arriba.
2. Añadir el nombre del archivo a `clientes/_list.json` (para el selector local).
3. Deploy y listo: `subdominio.einstech.com.ar` mostrará la ficha.
