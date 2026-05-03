# JobSeeker — Estado del Proyecto

> **Documento vivo de planificación y tracking.**
> **Última actualización:** 2026-05-03
> **Versión:** 1.0

---

## 📋 Resumen Ejecutivo

**Qué es JobSeeker:** SaaS multi-tenant para búsqueda de empleos asistida por IA. Automatiza el análisis de ofertas, evaluación de fit, y generación de CVs/cover letters personalizados.

**Problematica que resuelve:** La búsqueda de empleo es manual, repetitiva y emocionalmente agotadora. JobSeeker acelera el proceso investigando empresas, evaluando match técnico, y generando materiales personalizados — el usuario solo decide si aplicar.

**Stack técnico:**
- Frontend: Next.js 14 (App Router, React 18)
- Auth: Supabase Auth (Google OAuth)
- Database: Supabase (PostgreSQL + RLS)
- IA: Gemini Flash (default), BYO (Anthropic, OpenAI, Groq, Ollama)
- Emails: SMTP del usuario + Resend (notificaciones)
- Pagos: Lemon Squeezy (Merchant of Record)
- Deploy: Vercel + Cron

---

## 📊 Estado Actual: Visión General

| Fase | Estado | Prioridad |
|------|--------|-----------|
| ✅ Fase 0: Cimientos | COMPLETA | — |
| ✅ Fase 1: Auth + Multi-tenancy | COMPLETA | — |
| ✅ Fase 2: Perfil, CV y Storage | COMPLETA | — |
| ✅ Fase 3: Pagos (Lemon Squeezy) | STAND BY (esperando activación tienda) | ALTA |
| ✅ Fase 4: Job Search | COMPLETA | MEDIA |
| ✅ Fase 5: Auto-apply | COMPLETA | MEDIA |
| ✅ Fase 6: Automatización (Elite) | COMPLETA | BAJA |
| ✅ Fase 7: Polish | COMPLETA | BAJA |
| ⏳ Fase 4: Job Search | POR HACER | MEDIA |
| ⏳ Fase 5: Auto-apply | POR HACER | MEDIA |
| ⏳ Fase 6: Automatización (Elite) | POR HACER | BAJA |
| ⏳ Fase 7: Polish | POR HACER | BAJA |

**Métricas rápidas:**
- Aplicaciones en el sistema: 1 (demo, CD Projekt Red)
- Features listas para producción: Auth, Config, CV summarize, Pipeline IA

---

## 🏗️ FASE 0: Cimientos (COMPLETA ✅)

**Objetivo:** Infraestructura base multi-tenant.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| Schema DB multi-tenant | `supabase/migrations/0001_init.sql` | ✅ |
| Encryption (AES-256-GCM) | `lib/crypto.ts` | ✅ |
| Supabase clients | `lib/supabase/` (server, browser, admin, middleware) | ✅ |
| .env.example | `.env.example` | ✅ |
| Setup docs | `docs/SETUP.md` | ✅ |
| Dependencias | `package.json` | ✅ |
| Config JSON storage | `data/config.json` | ✅ |

### Notas:
- Schema incluye 15 tablas con RLS, triggers para `updated_at` y creación automática de perfiles.
- No tocar salvo bugs.
- APP_ENCRYPTION_KEY generada y almacenada en `.env.local`.

---

## 🔐 FASE 1: Auth + Multi-tenant (95% COMPLETA ✅)

**Objetivo:** Pasar de single-user a multi-user real.

### Lo que está implementado:

| Componente | Archivo(s) | Estado | Notas |
|-----------|-----------|--------|-------|
| Login page | `app/login/page.tsx` | ✅ | Google OAuth |
| Callback route | `app/auth/callback/route.ts` | ✅ | Exchange code for session |
| Middleware | `middleware.ts` | ✅ | Session check, redirects |
| requireUser() | `lib/supabase/server.ts` | ✅ | Gate to routes |
| /app dashboard | `app/app/page.tsx` | ✅ | Dashboard principal |
| /app/settings | `app/app/settings/page.tsx` | ✅ | Config AI, CV upload |
| /app/history | `app/app/history/page.tsx` | ✅ | Historial de apps |
| Config API | `app/api/config/route.ts` | ✅ | GET/PUT |
| CV API | `app/api/cv/route.ts` | ✅ | POST (upload), PUT (summarize), GET |
| Applications API | `app/api/applications/route.ts` | ✅ | CRUD de aplicaciones |
| Pipeline IA | `lib/pipeline.ts` | ✅ | Fase 1-4 automation |
| Framework rules | `lib/framework/rules.ts` | ✅ | Prompts del sistema |
| Storage abstraction | `lib/storage/supabase.ts` | ✅ | Todas las operaciones |

### Lo que falta (Fase 1.1):

| Componente | Archivo(s) | Estado | Prioridad |
|-----------|-----------|--------|-----------|
| **Logout button** | `app/app/settings/page.tsx` | ✅ COMPLETO | ALTA |
| **Career Preferences** | UI + storage | ✅ COMPLETO | ALTA |
| **Profile display** | Settings page | ✅ COMPLETO | MEDIA |
| Logout API route | `app/api/auth/logout/route.ts` | ✅ Existe pero no usado | — |

### Pendiente de hacer (Fase 1 completa):

### Regla de esta fase:
> Si no hay auth y multi-tenancy bien hecho, todo lo demás se rompe después.

---

## 👤 FASE 2: Perfil, CV y Storage (COMPLETA ✅)

**Objetivo:** Gestión de perfil del usuario y documentos.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **CV upload (PDF/text)** | `app/api/cv/route.ts` | ✅ Guarda CV completo sin modificación |
| **CV process** | `app/api/cv/route.ts` PUT | ✅ Guarda raw text para generación de CVs |
| CV storage (raw) | `lib/storage/supabase.ts` | ✅ |
| Config usuario | `app/api/config/route.ts` | ✅ |
| Provider config (AI) | UI + storage | ✅ |
| **Career Preferences API** | `app/api/preferences/route.ts` | ✅ |
| **Career Preferences UI** | `app/app/preferences/page.tsx` | ✅ |
| **Profile API** | `app/api/profile/route.ts` | ✅ |
| **Profile display** | Settings page | ✅ |

### Lo que falta:

| Componente | Estado | Prioridad |
|-----------|--------|-----------|
| **SMTP connection UI** | ❌ | MEDIA - Para enviar emails |
| **SMTP storage** | ✅ Schema | ❌ UI/API |

### Pendiente de hacer:
1. SMTP connection flow (Google App Password)
2. Profile update (avatar, display name)

---

## 💳 FASE 3: Pagos — Lemon Squeezy (COMPLETA ✅)

**Objetivo:** Sistema de suscripciones con gating por tiers.

### Modelo de negocio:

| Tier | Precio | Features |
|------|--------|----------|
| **Free** | $0 | N apps manuales/mes, BYO API key |
| **Pro** | $10/mes | Apps ilimitadas, Discover |
| **Elite** | $20/mes | Auto-apply diario, resumen diario |

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Webhook handler** | `app/api/webhooks/lemon-squeezy/route.ts` | ✅ |
| **Lemon Squeezy utils** | `lib/lemon-squeezy.ts` | ✅ |
| **Tier API** | `app/api/tier/route.ts` | ✅ |
| **Pricing UI** | `app/app/pricing/page.tsx` | ✅ |
| **Checkout API** | `app/api/checkout/route.ts` | ✅ |
| **getUserTier()** | `lib/lemon-squeezy.ts:156` | ✅ |
| **canAccessProFeature()** | `lib/lemon-squeezy.ts:168` | ✅ |
| **canAccessEliteFeature()** | `lib/lemon-squeezy.ts:173` | ✅ |

---

## 📋 MANUAL: Configuración de Lemon Squeezy

**Objetivo:** Completar la integración de pagos para poder procesar suscripciones reales.

### Paso 1: Crear cuenta en Lemon Squeezy

1. Ve a https://lemonsqueezy.com y regístrate
2. Completa el onboarding inicial
3. Crea tu primera tienda (Store)

### Paso 2: Crear productos y variants

1. En tu dashboard de Lemon Squeezy, ve a **Products** → **New Product**
2. Crea **Pro** ($10/mes recurrence):
   - Nombre: "Pro Plan"
   - Description: "Unlock discovery and unlimited applications"
   - Price: $10.00
   - Interval: month
   - **Copiar el variant ID** (algo como `12345`) - lo necesitarás después
3. Crea **Elite** ($20/month recurrence):
   - Nombre: "Elite Plan"
   - Description: "Full automation for serious job seekers"
   - Price: $20.00
   - Interval: month
   - **Copiar el variant ID** (algo como `67890`)

### Paso 3: Configurar variables de entorno

Añade a tu `.env.local`:

```bash
# Lemon Squeezy (pagos)
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
LEMON_SQUEEZY_VARIANT_PRO=pro_variant_id_from_step_2
LEMON_SQUEEZY_VARIANT_ELITE=elite_variant_id_from_step_2
```

Para obtener los valores:
- **API Key**: Settings → API
- **Store ID**: Settings → General
- **Webhook Secret**: Settings → Webhooks → Create new webhook
- **Variant IDs**: Products → [tu producto] → Variants (copiar el ID)

### Paso 4: Configurar Webhook en Lemon Squeezy

1. Settings → Webhooks → **New Webhook**
2. Configura:
   - **URL**: `https://TU-DOMINIO.vercel.app/api/webhooks/lemon-squeezy`
   - **Events**: seleccionar todos los de subscription
3. Copia el **Secret** y añádelo a `LEMON_SQUEEZY_WEBHOOK_SECRET`

### Paso 5: Desplegar a producción

1. `git add .`
2. `git commit -m "feat: complete Lemon Squeezy integration"`
3. `git push origin main`
4. Esperar a que Vercel haga deploy
5. Probar: ir a Pricing y hacer click en "Upgrade to Pro"

---

## 🔍 FASE 4: Job Search (COMPLETA ✅)

**Objetivo:** Encontrar empleos automáticamente de fuentes externas.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Job sources abstraction** | `lib/job-sources/index.ts` | ✅ |
| **Adzuna adapter** | `lib/job-sources/adzuna.ts` | ✅ |
| **Remotive adapter** | `lib/job-sources/remotive.ts` | ✅ |
| **RemoteOK adapter** | `lib/job-sources/remoteok.ts` | ✅ |
| **WeWorkRemotely adapter** | `lib/job-sources/weworkremotely.ts` | ✅ |
| **Job matching (IA)** | `lib/job-sources/matching.ts` | ✅ |
| **Discover API** | `app/api/discover/route.ts` | ✅ |
| **Discover UI** | `app/app/discover/page.tsx` | ✅ |

---

## 📧 FASE 5: Auto-apply (COMPLETA ✅)

**Objetivo:** Generación automática de aplicaciones y envío.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Email discovery** | `lib/auto-apply/email-discovery.ts` | ✅ |
| **Auto-apply API** | `app/api/auto-apply/route.ts` | ✅ |
| **Apply generation** | `app/api/applications/[id]/create` | ✅ |
| **Email send** | `app/api/applications/[id]/send-email/route.ts` | ✅ |

### Límites por tier:
- Pro: 10 aplicaciones/día
- Elite: 20 aplicaciones/día

---

## ⚙️ FASE 6: Automatización (Elite) (COMPLETA ✅)

**Objetivo:** Cron diario para usuarios Elite.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Daily cron API** | `app/api/cron/daily/route.ts` | ✅ |
| **Resend integration** | `lib/resend.ts` | ✅ |
| **Daily summary template** | HTML email con stats | ✅ |
| **Vercel Cron config** | `vercel.json` | ✅ |

### Configuración:
- Cron corre diario a las 10:00 UTC
- Procesa usuarios Pro y Elite con suscripción activa
- Busca jobs matching y guarda en pipeline
- Envía daily summary por email

---

## ✨ FASE 7: Polish (COMPLETA ✅)

**Objetivo:** Producto listo para launch.

### Lo que está implementado:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Terms of Service** | `app/legal/terms/page.tsx` | ✅ |
| **Privacy Policy** | `app/legal/privacy/page.tsx` | ✅ |
| **Onboarding flow** | `app/page.tsx` (conditional) | ✅ |
| **Login links** | ToS + Privacy links en login | ✅ |

---

## 🚀 Estado Final: LISTO PARA LAUNCH

---

## 🚀 Cómo Proceder — Prioridades Inmediatas

Basado en el estado actual, el orden recomendado:

### Inmediato (Esta sesión):
1. [x] **Career Preferences UI** — Completar Fase 2
2. [x] **Logout button** — Completar Fase 1
3. [x] **Profile display** — Completar Fase 2

### Próxima sesión:
4. [ ] **Fase 3: Pagos** — Webhook + tier gating

### Sesiones siguientes:
5. [ ] **Fase 4: Job Search** — Adapters + UI
6. [ ] **Fase 5: Auto-apply** — Email discovery
7. [ ] **Fase 6: Automation** — Cron
8. [ ] **Fase 7: Polish** — Legal, pricing, launch

---

## 📝 Notas de Arquitectura

### Decisiones clave (no cambiar sin motivo):
- Auth: Supabase Auth (Google OAuth básico, scopes: `openid email profile`)
- DB: Supabase (Postgres + RLS)
- Pagos: Lemon Squeezy (Merchant of Record para Colombia)
- Emails: Applications → SMTP del usuario, Notificaciones → Resend
- IA: Gemini Flash default, opción BYO
- Jobs: Adzuna + Remotive + RemoteOK + WeWorkRemotely

### Errores comunes a evitar:
- ❌ No usar `npm audit fix --force` (rompe Next.js)
- ❌ No reintroducir Google APIs restringidas (CASA)
- ❌ No mezclar lógica single-user con multi-tenant
- ❌ No implementar auto-apply antes deCareer Preferences

---

## 📅 Changelog

| Fecha | Versión | Cambio |
|-------|--------|--------|
| 2026-05-03 | 1.0 | Estado inicial documentado. Fase 1 al 95%. |
| 2026-05-03 | 1.1 | Completado: Career Preferences UI + API, Profile display, Logout button. Fases 1-2 completas. |

---

*Documento creado el 2026-05-03 para tracking de progreso.*