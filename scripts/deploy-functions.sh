#!/bin/bash
# Deploy script para Supabase Functions
# Uso: ./scripts/deploy-functions.sh

set -e

echo "🚀 Deploying Platonia Lab Functions to Supabase"
echo ""

# Verificar que existe el token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Error: SUPABASE_ACCESS_TOKEN no está configurado"
    echo "Por favor ejecuta: export SUPABASE_ACCESS_TOKEN=tu-token"
    exit 1
fi

# Verificar que existe la API key de OpenAI
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY no está configurado"
    read -p "Ingresa tu OpenAI API Key: " OPENAI_API_KEY
fi

# Project ID
PROJECT_REF="rrqukpxrrwhmfhaetaed"

echo "📦 Enlazando proyecto: $PROJECT_REF"
npx supabase link --project-ref $PROJECT_REF

echo ""
echo "🔐 Configurando secrets..."
npx supabase secrets set OPENAI_API_KEY=$OPENAI_API_KEY

echo ""
echo "📤 Deploying openai-chat function..."
npx supabase functions deploy openai-chat

echo ""
echo "✅ Deploy completado!"
echo ""
echo "🧪 Para probar la función:"
echo "curl -i --location --request POST \\"
echo "  'https://$PROJECT_REF.supabase.co/functions/v1/openai-chat' \\"
echo "  --header 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "  --header 'Content-Type: application/json' \\"
echo "  --data '{\"prompt\":\"¿Qué es la filosofía?\"}'"
