# FASE 4E: PURSUIT TRACKER — Pipeline de Aplicaciones
## Job Pursuit Framework — David Sanchez

> **Archivo operativo:** `00-pursuit-tracker.md` (en la raíz de la carpeta de trabajo)  
> **Versión:** 1.0  
> **Fecha:** 2026-04-13  
> **Frecuencia de actualización:** Después de cada acción en cualquier aplicación

---

## PROPÓSITO

El tracker es la vista aérea de toda tu búsqueda. Sin él, pierdes noción de cuántas aplicaciones tienes activas, cuáles necesitan follow-up, y dónde estás invirtiendo tu tiempo. Es el dashboard que miras cada mañana para saber qué hacer hoy.

---

## ESTRUCTURA DEL TRACKER

El tracker vive en `00-pursuit-tracker.md` en la raíz de la carpeta de búsqueda de trabajo (al mismo nivel que el framework y los documentos de fase). Es el primer archivo que abres cada día.

### Tabla principal de pipeline

```
| # | Empresa | Rol | Fase | Score | Semáforo | Status | Próxima Acción | Fecha Límite |
|---|---------|-----|------|-------|----------|--------|----------------|--------------|
```

**Columnas explicadas:**

```
#              Número secuencial de oportunidad (nunca se reutiliza)
Empresa        Nombre del estudio
Rol            Título del puesto
Fase           Fase actual en el framework (F1/F2/F3/F4/Aplicado/Entrevista)
Score          Score decisional de Fase 3 (___/10)
Semáforo       🟢 / 🟡 / 🔴
Status         Estado detallado (ver tabla de estados abajo)
Próxima Acción Acción concreta que tomar AHORA
Fecha Límite   Deadline para la próxima acción
```

### Estados posibles

```
ESTADO                 SIGNIFICADO                          FASE
─────────────────────────────────────────────────────────────────
RESEARCHING            Investigando — Fase 1 en progreso    F1
EVALUATING             Evaluando — Fase 2 en progreso       F2
DECIDING               Esperando decisión Go/No-Go          F3
AWAITING-DECISION      Score calculado, esperando OK David   F3
CREATING               Produciendo materiales de Fase 4      F4
READY-TO-SEND          Materiales listos, pendiente enviar   F4
APPLIED                Aplicación enviada                    Post-F4
FOLLOW-UP-1            Primer follow-up enviado              Post-F4
FOLLOW-UP-2            Segundo follow-up enviado             Post-F4
PHONE-SCREEN           Screen con recruiter programado       Entrevista
TECHNICAL-INTERVIEW    Entrevista técnica programada         Entrevista
FINAL-INTERVIEW        Entrevista final/con VP programada    Entrevista
OFFER                  Oferta recibida                       Cierre
NEGOTIATING            Negociando términos                   Cierre
ACCEPTED               Oferta aceptada                       Cierre
REJECTED               Rechazado por el estudio              Cierre
NO-RESPONSE            Sin respuesta después de 30 días      Cierre
WITHDRAWN              Retirado por David                    Cierre
HOLD                   En pausa — reevaluar en [fecha]       Pausa
NO-GO                  Descartado en Fase 3                  Archivo
```

---

## SECCIONES DEL TRACKER

### Panel de resumen semanal

```
## SEMANA DEL [Lunes] AL [Domingo] — RESUMEN

Pipeline activo:    ___ oportunidades en alguna fase
GO FUERTE activos:  ___/3 (máximo 3 simultáneos)
GO CONDICIONAL:     ___/5 (máximo 5 simultáneos)
En HOLD:            ___

Aplicaciones enviadas esta semana:    ___
Respuestas recibidas esta semana:     ___
Entrevistas esta semana:              ___
Rechazos esta semana:                 ___

Tasa de respuesta acumulada:          ___% (respuestas / aplicaciones totales)
Tasa de entrevista acumulada:         ___% (entrevistas / aplicaciones totales)
```

### Pipeline activo (tabla principal)

```
## PIPELINE ACTIVO

| # | Empresa | Rol | Fase | Score | 🚦 | Status | Próxima Acción | Fecha |
|---|---------|-----|------|-------|----|--------|----------------|-------|
| 001 | ___ | ___ | F_ | _/10 | 🟢 | ___ | ___ | YYYY-MM-DD |
| 002 | ___ | ___ | F_ | _/10 | 🟡 | ___ | ___ | YYYY-MM-DD |
```

### HOLDs (reevaluar semanalmente)

```
## EN HOLD

| # | Empresa | Rol | Score | Razón del HOLD | Condición para reactivar | Revisar el |
|---|---------|-----|-------|----------------|--------------------------|------------|
| ___ | ___ | ___ | _/10 | ___ | ___ | YYYY-MM-DD |
```

### Archivo (cerrados)

```
## ARCHIVO

| # | Empresa | Rol | Score | 🚦 | Resultado | Razón | Fecha cierre | Lección |
|---|---------|-----|-------|----|-----------|-------|--------------|---------|
| ___ | ___ | ___ | _/10 | ___ | ___ | ___ | YYYY-MM-DD | ___ |
```

---

## KPIs MENSUALES

```
## MES: [Mes YYYY]

### Volumen
- Empresas investigadas (F1): ___
- Evaluaciones completadas (F2): ___
- Decisiones tomadas (F3): ___
  - GO FUERTE: ___
  - GO CONDICIONAL: ___
  - HOLD: ___
  - NO-GO: ___
- Aplicaciones enviadas (F4+): ___

### Resultados
- Respuestas recibidas: ___ (tasa: ___%)
- Entrevistas: ___ (tasa: ___%)
- Ofertas: ___
- Rechazos explícitos: ___
- Sin respuesta: ___

### Eficiencia
- Tiempo promedio por aplicación GO FUERTE: ~___ horas
- Tiempo promedio F1→F4 completo: ~___ horas
- Oportunidad con mejor score: ___ (#___) — ___/10
- Oportunidad con mejor resultado: ___ (#___) — [resultado]

### Calibración del sistema
- ¿Los VERDES tuvieron mejor resultado que AMARILLOS?: [sí/no]
- ¿Algún NO-GO debió haber sido GO?: [sí — cuál / no]
- ¿Algún GO debió haber sido NO-GO?: [sí — cuál / no]
- Ajustes sugeridos: ___
```

---

## RITUALES DE MANTENIMIENTO

### Diario (2 minutos)

```
CADA MAÑANA AL EMPEZAR:
1. Abrir 00-pursuit-tracker.md
2. ¿Hay alguna fecha límite hoy o mañana?         → Priorizar
3. ¿Hay algún follow-up pendiente?                 → Ejecutar
4. ¿Llegó alguna respuesta nueva?                  → Actualizar status
```

### Semanal — Domingo (10 minutos)

```
CADA DOMINGO POR LA NOCHE:
1. Actualizar panel de resumen semanal
2. Revisar todos los HOLDs:
   - ¿La oferta sigue publicada?                   [sí → mantener / no → archivar]
   - ¿Cambió algo que justifique reactivar?         [sí → promover / no → mantener]
3. Revisar aplicaciones sin respuesta >14 días:
   - ¿Ya hice follow-up?                            [no → hacerlo / sí → esperar]
4. Verificar límites de pipeline:
   - GO FUERTE activos ≤ 3                          [sí / no → priorizar]
   - GO CONDICIONAL activos ≤ 5                     [sí / no → priorizar]
5. Planificar acciones de la semana siguiente
```

### Mensual — Primer lunes (15 minutos)

```
CADA PRIMER LUNES DEL MES:
1. Llenar KPIs mensuales completos
2. Revisar calibración del sistema:
   - ¿Las predicciones del semáforo fueron acertadas?
   - ¿Necesito ajustar umbrales o pesos?
3. Archivar oportunidades cerradas hace >30 días
4. Limpiar HOLDs que llevan >45 días sin cambio → NO-GO
5. Actualizar master-resume-source.md si hay experiencia nueva
```

---

## REGLAS OPERATIVAS DEL TRACKER

```
REGLA 1: ACTUALIZAR INMEDIATAMENTE
No esperar al "ritual semanal" para actualizar.
Cada vez que pase algo → actualizar el tracker en el momento.

REGLA 2: UN STATUS, UNA ACCIÓN
Cada oportunidad en el tracker debe tener UNA próxima acción 
clara y UNA fecha. Si no sabes cuál es la próxima acción, 
la próxima acción es "decidir cuál es la próxima acción."

REGLA 3: RESPETAR LOS LÍMITES
- Máximo 3 GO FUERTE simultáneos
- Máximo 5 GO CONDICIONAL simultáneos
- Si excedes → elegir cuál baja de prioridad

REGLA 4: ARCHIVAR ES DECIDIR
Mover algo al archivo no es fracasar — es liberar espacio 
mental y de pipeline para oportunidades mejores.

REGLA 5: LOS NÚMEROS NO MIENTEN
Si después de 10 aplicaciones GO FUERTE tienes 0 respuestas, 
el problema no es mala suerte — es sistémico. Revisar:
- ¿El CV está pasando el ATS? (R2 del panel)
- ¿Las ofertas a las que aplico son realistas para mi perfil?
- ¿Mi approach de contacto es el correcto?
- ¿Necesito más proyectos en el portfolio?
```

---

*Protocolo de la Fase 4E — Tracker. Parte del Job Pursuit Framework de David Sanchez.*  
*Creado: 2026-04-13*
