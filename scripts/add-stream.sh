#!/bin/bash
# Uso: bash scripts/add-stream.sh "https://url-del-canal" "Nombre Canal" "🎯" "Categoria"

URL="${1}"
NAME="${2:-Canal}"
LOGO="${3:-📺}"
CATEGORY="${4:-General}"
COUNTRY="${5:-España}"

if [ -z "$URL" ]; then
  echo "Uso: bash scripts/add-stream.sh <url> <nombre> <emoji> <categoria>"
  exit 1
fi

echo "🔍 Extrayendo stream de: $URL"

# Intentar con streamlink primero
M3U8=$(streamlink "$URL" best --stream-url 2>/dev/null)

# Si no funciona intentar con yt-dlp
if [ -z "$M3U8" ]; then
  echo "⚠️  streamlink sin resultado, probando yt-dlp..."
  M3U8=$(yt-dlp -g "$URL" 2>/dev/null | head -1)
fi

if [ -z "$M3U8" ]; then
  echo "❌ No se pudo extraer la URL del stream."
  echo "   Prueba abriendo el canal en el navegador → DevTools (F12) → Network → filtra m3u8"
  exit 1
fi

echo ""
echo "✅ Stream encontrado:"
echo "$M3U8"
echo ""

# Generar el ID siguiente
CHANNELS_FILE="$(dirname "$0")/../src/channels.js"
NEXT_ID=$(grep -oP '(?<=id: )\d+' "$CHANNELS_FILE" | sort -n | tail -1)
NEXT_ID=$((NEXT_ID + 1))

# Insertar nuevo canal antes del cierre del array
NEW_ENTRY="  {
    id: ${NEXT_ID},
    name: '${NAME}',
    logo: '${LOGO}',
    country: '${COUNTRY}',
    category: '${CATEGORY}',
    url: '${M3U8}',
    type: 'hls',
    live: true,
  },"

# Añadir antes del ]; final
python3 - <<PYEOF
content = open('${CHANNELS_FILE}').read()
entry = """${NEW_ENTRY}"""
# Insertar antes del cierre del array
idx = content.rfind('];')
new_content = content[:idx] + entry + '\n' + content[idx:]
open('${CHANNELS_FILE}', 'w').write(new_content)
print("✅ Canal '${NAME}' añadido a channels.js (id: ${NEXT_ID})")
PYEOF
