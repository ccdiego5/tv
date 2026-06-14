# 📺 TV Local — React + Vite + Tailwind + Plyr/HLS.js

Reproductor multi-canal de streaming HLS para red local, construido con React, Vite, Tailwind CSS v4 y hls.js.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Acceder en:
- `http://localhost:5173` — desde el mismo PC
- `http://<tu-ip-local>:5173` — desde cualquier dispositivo en la red WiFi

---

## Agregar canales

Edita `src/channels.js`:

```js
{
  id: 3,
  name: 'Mi Canal',
  logo: '📡',
  country: 'España',
  category: 'Generalista',
  url: 'https://...url-del-stream.m3u8',
  type: 'hls',   // 'hls' para streams HLS, cualquier otro para mp4/directo
  live: true,
}
```

---

## Renovar URLs de Telemadrid / La Otra

Las URLs HLS de Telemadrid usan JWT que caducan cada pocas horas.
Para obtener URLs frescas ejecuta este script:

```bash
bash scripts/get-streams.sh
```

O manualmente para cada canal:

```bash
ACCOUNT_ID="6416060453001"
PLAYER_ID="2rfYSrHC79"
VIDEO_ID="ref:Live_Telemadrid"   # o ref:Live_LaOtra / ref:Live_INT

POLICY_KEY=$(curl -sL --compressed \
  "https://players.brightcove.net/${ACCOUNT_ID}/${PLAYER_ID}_default/index.html?videoId=${VIDEO_ID}" \
  -A "Mozilla/5.0" \
  | python3 -c "
import sys, re
html = sys.stdin.read()
m = re.search(r'policyKey[^:]*:[^A-Z]*([A-Za-z0-9_-]{60,})', html)
print(m.group(1) if m else '')
")

curl -sL \
  "https://edge.api.brightcove.com/playback/v1/accounts/${ACCOUNT_ID}/videos/${VIDEO_ID}" \
  -H "Accept: application/json;pk=${POLICY_KEY}" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
for s in data.get('sources', []):
    src = s.get('src','')
    if 'm3u8' in src:
        print(src)
        break
"
```

---

## Deploy — Opciones

### Opción A — Vercel (recomendado, gratis)

```bash
npm install -g vercel
vercel
```

O conecta el repo en [vercel.com](https://vercel.com) → Import Git Repository → despliega automático en cada push.

Build settings:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### Opción B — Netlify (gratis)

```bash
npm run build
# Arrastra la carpeta dist/ a netlify.com/drop
```

O conecta el repo en [netlify.com](https://netlify.com) con las mismas build settings.

### Opción C — GitHub Pages

```bash
npm install -D gh-pages
```

Añade en `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

Añade en `vite.config.js`:
```js
base: '/tv/',   // nombre del repo
```

```bash
npm run deploy
```

### Opción D — Servidor propio (Nginx)

```bash
npm run build

# Copiar dist/ al servidor
scp -r dist/ usuario@tu-servidor:/var/www/html/tv/

# Nginx config
server {
    listen 80;
    root /var/www/html/tv;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Opción E — Exposición local con Cloudflare Tunnel (sin dominio, gratis)

```bash
# Instalar cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x ./cloudflared

# Levantar la app primero
npm run dev

# En otra terminal — túnel temporal
./cloudflared tunnel --url http://localhost:5173
```

Obtienes una URL pública tipo `https://xxxx.trycloudflare.com` accesible desde cualquier lugar.

---

## Tech stack

| Herramienta | Uso |
|---|---|
| Vite + React | Framework frontend |
| Tailwind CSS v4 | Estilos |
| hls.js | Reproducción de streams HLS |
| Plyr | (opcional) UI del reproductor |
| Brightcove API | Extracción de URLs de Telemadrid |
