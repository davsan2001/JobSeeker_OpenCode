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
| ⏳ Fase 3: Pagos (Lemon Squeezy) | POR HACER | ALTA |
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

## 💳 FASE 3: Pagos — Lemon Squeezy (POR HACER ⏳)

**Objetivo:** Sistema de suscripciones con gating por tiers.

### Modelo de negocio:

| Tier | Precio | Features |
|------|--------|----------|
| **Free** | $0 | N apps manuales/mes, BYO API key |
| **Pro** | $10/mes | Apps ilimitadas, Discover |
| **Elite** | $20/mes | Auto-apply diario, resumen diario |

### Lo que falta implementar:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Webhook handler** | `app/api/webhooks/lemon-squeezy/route.ts` | ❌ |
| **Checkout flow** | UI de upgrade | ❌ |
| **Tier gating middleware** | Verificar tier en acciones | ❌ |
| **Update profile on webhook** | Actualizar `profiles.tier` | ❌ |
| Lemon Squeezy SDK | `npm install` | ❌ |

### Pendiente de hacer:
1. Crear webhook route handler
2. Implementar checkout UI (pricing page)
3. Agregar tier check en API routes relevantes
4. Configurar webhook en Lemon Squeezy dashboard

### Regla:
> FREE es BYO (trae tu propia API key). PRO y ELITE usan la nuestra por defecto pero pueden cambiar a BYO.

---

## 🔍 FASE 4: Job Search (POR HACER ⏳)

**Objetivo:** Encontrar empleos automáticamente de fuentes externas.

### Lo que falta implementar:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Adzuna adapter** | `lib/adzuna.ts` | ❌ |
| **Remotive adapter** | `lib/remotive.ts` | ❌ |
| **RemoteOK adapter** | `lib/remoteok.ts` | ❌ |
| **WeWorkRemotely adapter** | `lib/weworkremotely.ts` | ❌ |
| Job normalization + dedupe | — | ❌ |
| **Job matching (IA)** | Score contra CV | ❌ |
| **Discover UI** | `app/app/discover/page.tsx` | ❌ |
| Schema (job_matches) | `supabase/migrations/0001_init.sql` | ✅ Schema LISTO |

### Pendiente de hacer:
1. Implementar adapters de fuentes
2. Job scoring logic (match % contra CV)
3. UI de descubrimiento (lista de jobs, filtros)
4. Descuentos según tier (Pro =-assisted,Elite =auto)

---

## 📧 FASE 5: Auto-apply (POR HACER ⏳)

**Objetivo:** Generación automática de aplicaciones y envío.

### Lo que falta implementar:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Apply generation** | `app/api/applications/[id]/create` | ✅ existe, usar para auto |
| **Email send (SMTP)** | `app/api/applications/[id]/send-email/route.ts` | ✅ existe |
| **Email discovery** | Extract recruiter email | ❌ |
| Auto-apply flow | — | ❌ |
| Application tracking | `email_sends` table | ✅ Schema |

### Pendiente de hacer:
1. Email discovery (regex + heuristics para encontrar recruiter)
2. Auto-create application pipeline
3. Batch send (limit según tier)
4. Dashboard de aplicaciones enviadas

---

## ⚙️ FASE 6: Automatización (Elite) (POR HACER ⏳)

**Objetivo:** Cron diario para usuarios Elite.

### Lo que falta implementar:

| Componente | Archivo(s) | Estado |
|-----------|-----------|-------|
| **Daily cron job** | `app/api/cron/daily/route.ts` | ❌ |
| Pipeline automático | Buscar → Score → Crear → Enviar | ❌ |
| Daily summary email | `lib/resend.ts` + templating | ❌ |
| Daily runs table | `daily_runs` table | ✅ Schema LISTO |

### Pendiente de hacer:
1. Cron route con Vercel cron
2. Pipeline end-to-end para Elite
3. Daily summary template (Resend)
4. Tracking de daily runs

---

## ✨ FASE 7: Polish (POR HACER ⏳)

**Objetivo:** Producto listo paralaunch.

### Lo que falta implementar:

| Componente | Estado |
|-----------|--------|
| **Legal (ToS, Privacy Policy)** | ❌ |
| Landing page pública | ❌ - Existe pero básica |
| Pricing page | ❌ |
| Onboarding flow | ❌ |
| Métricas y analytics | ❌ |
| Error boundaries | ❌ |
| Loading states | ❌ |
| **Soft launch** (≤100 usuarios, Google Testing) | ❌ |

### Pendiente de hacer:
1. ToS y Privacy Policy
2. Pricing page con checkout
3. Improved onboarding
4. Basic analytics (apps sent, responses)
5. Soft launch (<=100 users)

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