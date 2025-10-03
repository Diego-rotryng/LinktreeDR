# BioExpress modular (subdominios)
- Un JSON por cliente dentro de `/clients/` (ej: `clarisa.json`).
- `index.html` detecta el *slug* desde el subdominio (`clarisa.einstech.com.ar`) o desde el parámetro `?c=clarisa`.
- Para probar local: abre `index.html?c=clarisa`.
- Para Vercel + wildcard: agrega `*.einstech.com.ar` al proyecto y apunta los NS en NIC a Vercel DNS.
