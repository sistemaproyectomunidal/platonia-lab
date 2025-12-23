# 🔐 Configuración de Secrets en GitHub

## Secrets Necesarios

Ve a: https://github.com/sistemaproyectomunidal/platonia-lab/settings/secrets/actions

### 1. Para Supabase Functions (Backend)

**OPENAI_API_KEY** ⭐ **REQUERIDO**

```
sk-...tu-openai-api-key-aqui...
```

**SUPABASE_ACCESS_TOKEN** (Opcional - para deploy automático)

```
sbp_...tu-supabase-access-token-aqui...
```

> ⚠️ **Nota:** Este token actual no tiene permisos suficientes. Necesitas generar uno nuevo con permisos completos desde: https://supabase.com/dashboard/account/tokens

### 2. Para Frontend (Opcional - ya están en .env)

**VITE_SUPABASE_URL**

```
https://rrqukpxrrwhmfhaetaed.supabase.co
```

**VITE_SUPABASE_PUBLISHABLE_KEY**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycXVrcHhycndobWZoYWV0YWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTI2MzMsImV4cCI6MjA4MTc4ODYzM30.AY1l9RY5sG69QSNXdX9Fzbx7lVjRqWIN05PyLU5oYM4
```

---

## 🚀 Workflows Configurados

### 1. **Deploy Frontend a GitHub Pages**

- **Archivo:** `.github/workflows/deploy.yml`
- **Trigger:** Push a `main` o manual
- **Función:** Construye y despliega el frontend

### 2. **Deploy Supabase Functions** ⭐ **NUEVO**

- **Archivo:** `.github/workflows/deploy-supabase.yml`
- **Trigger:** Push a `main` que modifique `supabase/functions/**` o manual
- **Función:** Despliega automáticamente las Edge Functions a Supabase
- **Requiere:** Secrets `SUPABASE_ACCESS_TOKEN` y `OPENAI_API_KEY`

---

## 📋 Pasos para Configurar

### Opción A: Deploy Automático (Recomendado)

1. **Generar nuevo token de Supabase con permisos completos:**

   - Ve a: https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Nombre: `GitHub Actions Deploy`
   - Selecciona todos los permisos necesarios
   - Copia el token

2. **Agregar secrets en GitHub:**

   - Ve a: https://github.com/sistemaproyectomunidal/platonia-lab/settings/secrets/actions
   - Agrega `OPENAI_API_KEY`
   - Agrega `SUPABASE_ACCESS_TOKEN` (con el nuevo token)

3. **Commit y push:**

   ```bash
   git add .
   git commit -m "feat: add automated Supabase deployment"
   git push origin main
   ```

4. **Las functions se desplegarán automáticamente** 🎉

### Opción B: Deploy Manual desde Dashboard

1. **Agregar solo `OPENAI_API_KEY` en GitHub secrets**

2. **Configurar en Supabase manualmente:**
   - Vault: https://supabase.com/dashboard/project/rrqukpxrrwhmfhaetaed/settings/vault
   - Agregar secret `OPENAI_API_KEY`
3. **Deploy la función:**
   - Functions: https://supabase.com/dashboard/project/rrqukpxrrwhmfhaetaed/functions
   - Deploy `openai-chat` con el código de `supabase/functions/openai-chat/index.ts`

---

## 🧪 Testing

Una vez configurado, prueba la función:

```bash
./scripts/test-openai-function.sh
```

O manualmente:

```bash
curl -i --location --request POST \
  'https://rrqukpxrrwhmfhaetaed.supabase.co/functions/v1/openai-chat' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycXVrcHhycndobWZoYWV0YWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTI2MzMsImV4cCI6MjA4MTc4ODYzM30.AY1l9RY5sG69QSNXdX9Fzbx7lVjRqWIN05PyLU5oYM4' \
  --header 'Content-Type: application/json' \
  --data '{"prompt":"¿Qué es la filosofía?"}'
```

---

## 🔄 Para Migración a Nuevo Repositorio

Cuando migres el proyecto:

1. **Copia los workflows** (`.github/workflows/`)
2. **Configura los secrets** en el nuevo repo
3. **Actualiza `PROJECT_REF`** en los workflows si cambias de proyecto Supabase
4. **Ejecuta** el workflow manualmente la primera vez

---

## ✅ Estado Actual

- ✅ Workflows creados y optimizados
- ✅ Script de deploy automatizado creado
- ✅ Script de testing creado
- ⏳ Pendiente: Agregar secrets en GitHub
- ⏳ Pendiente: Deploy de la función (manual o automático)
