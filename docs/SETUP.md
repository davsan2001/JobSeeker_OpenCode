# JobSeeker — Setup (Fase 0)

Esta guía deja el proyecto listo para desarrollo local y para el despliegue inicial en Vercel. Asume que ya tienes el repo clonado y Node 20+ instalado.

> Las credenciales y secretos van en `.env.local` (local) o en **Vercel → Project Settings → Environment Variables** (prod). Copia `.env.example` como base.

---

## 0) Clona el repo y dependencias

```bash
npm install
```

> **No ejecutes `npm audit fix --force`.** El warning de `1 high severity vulnerability` lista 5 CVEs de Next.js; las graves (`GHSA-9g9p-9gw9-jx7f`, `GHSA-3x4c-7xq6-9pq8`) son de Next.js **self-hosted** con `next/image` — no aplican en Vercel. Las otras están parcheadas en nuestra versión (`14.2.35`) o no nos afectan (no usamos rewrites). `audit fix --force` saltaría a Next 16, que es un major con breaking changes (API asíncrona en `cookies()`, `params`, `headers()`) y rompería toda la app. La migración a Next 15+ está en el backlog como tarea separada.

Genera la master key de cifrado (AES-256-GCM). Elige **una** de las opciones según tu entorno:

```bash
# Node (cross-platform, lo tienes instalado si estás aquí)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# PowerShell (Windows, sin dependencias extra)
powershell -Command "$b=New-Object byte[] 32;[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b);[Convert]::ToBase64String($b)"

# Bash / macOS / Linux / Git Bash (si tienes openssl)
openssl rand -base64 32
```

Pega el resultado en `APP_ENCRYPTION_KEY` en `.env.local`. Guárdala también en un password manager — si la pierdes, ningún secreto cifrado (API keys, SMTP passwords) podrá recuperarse.

---

## 1) Supabase — base de datos + auth + storage

### 1.1 Crear proyecto

1. [database.new](https://database.new) → nuevo proyecto.
2. Región: la más cercana a tus usuarios (EU-West para empezar funciona bien con clientes globales).
3. Guarda la **Database password** (no la necesitas para la app, pero sí para la consola `psql`).

### 1.2 Variables de entorno

**Project Settings → API**:

| Campo UI | Variable |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **`service_role`** bypasa RLS. Úsala sólo server-side; nunca la expongas al cliente.

### 1.3 Aplicar el schema

**Opción A — SQL Editor del dashboard (rápido para MVP):**

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Pega el contenido completo de `supabase/migrations/0001_init.sql`.
3. Run. Deberías ver `Success. No rows returned`.

**Opción B — Supabase CLI (recomendado cuando haya CI):**

```bash
npm i -g supabase
supabase link --project-ref <tu-project-ref>
supabase db push
```

### 1.4 Verificar RLS

Dashboard → **Authentication → Policies**. Cada tabla debe mostrar `RLS enabled` y al menos una política (excepto `webhook_events`, que es service-role only).

### 1.5 Configurar Google OAuth en Supabase

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) → **Create Project** → "JobSeeker".
2. **APIs & Services → OAuth consent screen**:
   - User Type: **External**.
   - App name: `JobSeeker`.
   - User support email, developer contact email: tu email.
   - Scopes: añade sólo `openid`, `email`, `profile` (básicos, **no requieren verificación de Google**).
   - Test users: añade tu email mientras sigues en Testing mode (hasta 100 cuentas).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Type: **Web application**.
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://<tu-dominio>` (cuando lo tengas)
   - Authorized redirect URIs — **copia el que te dé Supabase** en el paso siguiente.
4. Supabase dashboard → **Authentication → Providers → Google**:
   - Enable.
   - Pega el **Client ID** y **Client Secret** de Google.
   - Copia el **Callback URL (for OAuth)** que muestra Supabase (algo como `https://<project>.supabase.co/auth/v1/callback`) y pégalo en Google Cloud → Credentials → Authorized redirect URIs → Save.
5. Supabase dashboard → **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) o `https://<dominio>` (prod).
   - Additional redirect URLs: añade ambos (dev + prod).

> No necesitas activar otros scopes ni pasar por verificación de Google. Los emails a reclutadores los enviamos vía SMTP del usuario, no Gmail API.

### 1.6 Storage (para CVs, futuros documentos)

Dashboard → **Storage → Create bucket**:

- Name: `cv-files`
- Public: **off**
- File size limit: `5 MB`

La política de acceso se añadirá en Fase 2 junto con el flujo de subida.

---

## 2) Gemini (modelo por defecto de los tiers pagos)

1. [Google AI Studio](https://aistudio.google.com/apikey) → **Create API key**.
2. Cópiala a `GEMINI_API_KEY`.
3. Deja `GEMINI_MODEL=gemini-1.5-flash` (o `gemini-2.0-flash-exp` cuando salga a GA).

> Los usuarios Free siguen trayendo su propia key. Los Pro/Elite usan la nuestra por defecto, pero pueden cambiar a BYO desde Settings.

---

## 3) Lemon Squeezy — pagos

Lemon Squeezy es **Merchant of Record**, así que se encargan de IVA/sales-tax y aceptan vendedores de Colombia. No necesitas LLC en USA.

### 3.1 Crear cuenta + store

1. [app.lemonsqueezy.com](https://app.lemonsqueezy.com) → registrarse.
2. Completa KYC (ID + payout bank). Puede tardar 1-3 días.
3. Crea un **Store**.

### 3.2 Crear productos

Crea dos productos tipo **Subscription**:

| Producto | Precio | Interval | Variable de variant |
|---|---|---|---|
| JobSeeker Pro | $10 | Monthly | `LEMON_SQUEEZY_VARIANT_PRO` |
| JobSeeker Elite | $20 | Monthly | `LEMON_SQUEEZY_VARIANT_ELITE` |

Cada producto tiene 1 variant por defecto. Abre el variant → copia el número del URL (`/products/12345/variants/67890` → `67890` es el variant id).

### 3.3 API key + webhook

1. **Settings → API** → **Create API key** → cópiala a `LEMON_SQUEEZY_API_KEY`.
2. **Settings → Webhooks → + Create endpoint**:
   - URL: `https://<dominio>/api/webhooks/lemon-squeezy` (para local usa [ngrok](https://ngrok.com) o Vercel preview).
   - Events: marca `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_unpaused`.
   - Signing secret: cópialo a `LEMON_SQUEEZY_WEBHOOK_SECRET`.
3. **Settings → Stores** → copia el `Store ID` numérico a `LEMON_SQUEEZY_STORE_ID`.

El handler del webhook se crea en Fase 3.

---

## 4) Resend — emails del sistema

Los emails al reclutador salen por el SMTP del propio usuario (nodemailer). Pero los emails que envía **nuestra app** (resumen diario, bienvenida, avisos) salen desde nuestro dominio vía Resend.

### 4.1 Dominio

Necesitas un dominio propio (ej. `jobseeker.app`). Si aún no lo tienes, cómpralo (Namecheap/Cloudflare Registrar).

### 4.2 Setup en Resend

1. [resend.com](https://resend.com) → signup.
2. **Domains → Add Domain** → `jobseeker.app`.
3. Añade los registros **SPF, DKIM y DMARC** que te muestra Resend en tu DNS (Cloudflare, Namecheap, lo que uses).
4. Espera a que verifique (~5 min). Estado `Verified` = listo.
5. **API Keys → Create** → cópiala a `RESEND_API_KEY`.
6. Define `RESEND_FROM=JobSeeker <noreply@jobseeker.app>` (o la dirección que prefieras sobre tu dominio).

> Mientras testeas sin dominio, Resend te deja enviar a tu email de cuenta desde `onboarding@resend.dev`. Útil para probar el código sin DNS.

---

## 5) Adzuna — búsqueda de empleos

1. [developer.adzuna.com](https://developer.adzuna.com) → **Register**.
2. Crea una aplicación (purpose: "personal / small project").
3. Copia **App ID** → `ADZUNA_APP_ID`, **App Key** → `ADZUNA_APP_KEY`.

Remotive, RemoteOK y WeWorkRemotely no requieren key — sus feeds son JSON públicos. Los añadiremos como adapters en Fase 4.

---

## 6) Cron secret

Vercel Cron llamará a nuestras rutas `/api/cron/*` con un header `Authorization: Bearer $CRON_SECRET`.

```bash
openssl rand -hex 32
```

Pega el resultado en `CRON_SECRET` tanto en `.env.local` como en Vercel.

---

## 7) Verificar en local

```bash
npm run dev
```

Arranca en `http://localhost:3000`. En esta fase todavía no hay UI nueva — los siguientes commits (Fase 1) reemplazan el login-less storage por el flujo auth con Supabase.

**Smoke test manual del crypto** — en una consola Node:

```bash
node --input-type=module -e "
import('./lib/crypto.ts').then(m => {
  const enc = m.encryptSecret('hola');
  console.log('enc:', enc);
  console.log('dec:', m.decryptSecret(enc));
});
"
```

(o simplemente espera a que Fase 1 añada una ruta `/api/health` con `selfTestEncryption()`.)

---

## Checklist de variables de entorno

Antes de desplegar a Vercel, confirma que todas las siguientes están definidas:

- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `APP_ENCRYPTION_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GEMINI_API_KEY`
- [ ] `GEMINI_MODEL`
- [ ] `LEMON_SQUEEZY_API_KEY`
- [ ] `LEMON_SQUEEZY_WEBHOOK_SECRET`
- [ ] `LEMON_SQUEEZY_STORE_ID`
- [ ] `LEMON_SQUEEZY_VARIANT_PRO`
- [ ] `LEMON_SQUEEZY_VARIANT_ELITE`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM`
- [ ] `ADZUNA_APP_ID`
- [ ] `ADZUNA_APP_KEY`
- [ ] `CRON_SECRET`

---

## Siguiente paso

Una vez todo esto esté verde:

- **Fase 1** — Auth + multi-tenancy: reemplazar `lib/storage.ts` por implementación Supabase, middleware de sesión, landing/login page, migración del flujo actual a `user_id`.
