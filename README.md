# Platonia Lab - Sistema Lagrange

Plataforma de análisis filosófico conceptual con arquitectura fullstack moderna.

## 🎉 Refactorización v2.0.0 Completada

**La aplicación ha sido completamente refactorizada con una arquitectura escalable y mantenible.**

### ✨ Nuevas Características:
- ✅ **6 Servicios API modulares** organizados por dominio
- ✅ **40+ React Query hooks** con caching automático
- ✅ **TypeScript completo** con type safety end-to-end
- ✅ **Backward compatible** - código antiguo sigue funcionando
- ✅ **Documentación exhaustiva** con guías y ejemplos

### 📚 Documentación Nueva:
- 🚀 **[STATUS.md](STATUS.md)** - Estado y quick start
- 📖 **[REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)** - Guía completa
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Diagramas
- 🔧 **[HOW_TO_FIX_TYPESCRIPT.md](HOW_TO_FIX_TYPESCRIPT.md)** - Solución de errores

### 🎯 Uso Inmediato:

```typescript
// Nuevo: Con hooks optimizados
import { useLabDemos } from '@/hooks/queries';

function MyComponent() {
  const { data, isLoading } = useLabDemos({ limit: 10 });
  // ✅ Caching automático, loading states, error handling
}

// Nuevo: Con servicios (para utils/scripts)
import { labService } from '@/services/api';

const response = await labService.fetchDemos({ limit: 10 });
```

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project includes a GitHub Actions workflow that builds the site with Vite and deploys the `dist` output to GitHub Pages automatically when you push to `main`.

How the automated deploy works
- On push to `main` the workflow runs `npm ci` and `npm run build`.
- The built output in `dist/` is uploaded and deployed to GitHub Pages via the official Pages actions.
- The workflow creates a `404.html` copy from `index.html` so client-side routing works for the SPA.

What you need
- No extra secrets are required for the default setup. The workflow uses the repository `GITHUB_TOKEN` to publish to Pages.
- If you want to deploy from a different branch, update `.github/workflows/deploy.yml` accordingly.

Useful local commands
```bash
# install deps
npm ci

# start dev server
npm run dev

# build locally (same command used in CI)
npm run build

# build and preview the production build
npm run build
npm run preview
```

Published site
- After a successful deploy the site will be available at the GitHub Pages URL configured in the repository settings (typically `https://<owner>.github.io/<repo>`). You can verify the Pages URL in the repository `Settings → Pages` panel.

Security notes
- For this workflow the default `GITHUB_TOKEN` is sufficient. If you prefer to use a Personal Access Token, add it as a repository secret and modify the workflow accordingly.

Troubleshooting
- If the Pages deployment fails, check the Actions tab for the workflow run logs. The build step prints Vite output and potential errors.

Supabase backend (optional)
- The project includes a Supabase client in `src/integrations/supabase` and a small helper `src/lib/backend.ts` to persist demo runs.
- To enable persistence create a Supabase project and expose the following repository secrets (or local `.env` variables for development):
	- `VITE_SUPABASE_URL` — your Supabase URL
	- `VITE_SUPABASE_PUBLISHABLE_KEY` — the anon/public key
- Example `.env` (development):
```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Create a table `lab_demos` with at least the columns: `id` (serial pk), `prompt` (text), `summary` (text), `axes` (text[]), `matched_nodes` (text[]), `questions` (text/json).
- When configured, the `LabDemo` component will attempt to save demo runs to that table.

Serverless Gemini (LLM) function
- An example Supabase Edge Function is provided at `supabase/functions/gemini`.
- Deploy it with the Supabase CLI and set the secret `GEMINI_API_KEY` in the Supabase project (or the equivalent secret mechanism for your function host).
- After deploying the function, set the frontend environment variable `VITE_GEMINI_ENDPOINT` to the function URL (for example `https://<project>.functions.supabase.co/gemini`).
- `LabDemo` provides a client button to call this endpoint; the function holds the sensitive `GEMINI_API_KEY` server-side so it never appears in browser code.

Example SQL for `lab_demos` table (Postgres):

```sql
create table if not exists lab_demos (
	id serial primary key,
	prompt text,
	summary text,
	axes text[],
	matched_nodes text[],
	questions jsonb,
	created_at timestamptz default now()
);
```



## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
