#!/bin/bash
# Test OpenAI Function

echo "🧪 Testing OpenAI Function..."
echo ""

curl -i --location --request POST \
  'https://rrqukpxrrwhmfhaetaed.supabase.co/functions/v1/openai-chat' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycXVrcHhycndobWZoYWV0YWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTI2MzMsImV4cCI6MjA4MTc4ODYzM30.AY1l9RY5sG69QSNXdX9Fzbx7lVjRqWIN05PyLU5oYM4' \
  --header 'Content-Type: application/json' \
  --data '{"prompt":"¿Qué es la filosofía?"}'

echo ""
echo ""
echo "✅ Si ves una respuesta JSON con 'ok: true' y 'text', la función funciona correctamente"
