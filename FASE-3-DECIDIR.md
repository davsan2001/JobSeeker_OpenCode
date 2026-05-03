# FASE 3: DECIDIR — Puerta Go/No-Go
## Job Pursuit Framework — David Sanchez

> **Documento:** Expansión operativa de la Fase 3 del JOB-PURSUIT-FRAMEWORK.md  
> **Input requerido:** `applications/[Nombre-Empresa]/02-análisis-perspectivas.md` (completado en Fase 2)  
> **Output:** `applications/[Nombre-Empresa]/03-decisión-go-nogo.md`  
> **Versión:** 1.0  
> **Fecha:** 2026-04-13  
> **Tiempo estimado:** 10-15 minutos por empresa

---

## PROPÓSITO DE ESTA FASE

Las Fases 1 y 2 te dieron datos y perspectiva. La Fase 3 te da una decisión.

Este es el momento de máxima disciplina. Tu cerebro quiere aplicar a todo porque cada oferta "podría ser la buena." Pero cada aplicación GO FUERTE consume 2-3 horas de trabajo concentrado. Si aplicas a 5 ofertas mediocres en lugar de a 2 excepcionales, perdiste 9 horas que podías haber invertido en hacer esas 2 aplicaciones imparables.

La puerta Go/No-Go existe para proteger tu recurso más escaso: tiempo.

```
                    ┌──────────────────────┐
                    │   02-análisis-       │
                    │   perspectivas.md    │
                    │   (6 scores)         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  RECALCULAR PESOS    │
                    │  DECISIONALES        │
                    │  (Pesos de Fase 3)   │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
            ┌──────────────┐     ┌──────────────┐
            │ KILL SWITCH  │     │ SCORE        │
            │ CHECK        │     │ PONDERADO    │
            │ (binario)    │     │ (gradual)    │
            └──────┬───────┘     └──────┬───────┘
                   │                    │
                   │    ┌───────────────┘
                   │    │
                   ▼    ▼
            ┌──────────────────────┐
            │   CLASIFICACIÓN      │
            │   🟢 VERDE (7.5+)   │
            │   🟡 AMARILLO (5.5) │
            │   🔴 ROJO (<5.5)    │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   ⛔ STOP            │
            │   HUMAN-IN-THE-LOOP │
            │                     │
            │   Claude presenta   │
            │   David decide      │
            └──────────┬───────────┘
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
          [ GO ]   [ HOLD ]  [ NO-GO ]
            │                    │
            ▼                    ▼
        FASE 4              Archivar +
        CREAR               siguiente
```

---

## ⚠️ REGLA CRÍTICA: HUMAN-IN-THE-LOOP

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Después de calcular la puntuación y clasificar la             ║
║   oportunidad, Claude DEBE DETENERSE.                           ║
║                                                                  ║
║   Claude NO procede a la Fase 4 sin la decisión                 ║
║   explícita de David: "Go".                                     ║
║                                                                  ║
║   LA IA ACONSEJA. EL HUMANO DECIDE.                             ║
║                                                                  ║
║   Esto no es negociable. Ni siquiera si el score es 9.8/10.    ║
║   Ni siquiera si parece "obvio." La decisión de invertir        ║
║   2-3 horas de tu vida en una aplicación es SIEMPRE tuya.       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

**Flujo de la conversación en este punto:**

```
CLAUDE:  "He completado el análisis. El score es X.X/10, clasificado como 
          [VERDE/AMARILLO/ROJO]. Aquí está el desglose: [...]
          Mi recomendación es [GO FUERTE / GO CONDICIONAL / HOLD / NO-GO] 
          porque [...].
          
          ¿Cuál es tu decisión? ¿Procedo a Fase 4?"

DAVID:   "Go" / "Hold" / "No-Go" / "Quiero ajustar X antes de decidir"

CLAUDE:  [Solo si David dice "Go"] → Proceder a Fase 4
         [Si dice Hold] → Registrar y preguntar condiciones de reevaluación
         [Si dice No-Go] → Registrar razón y archivar
         [Si quiere ajustar] → Volver a la perspectiva relevante
```

---

## PASO 1: KILL SWITCH CHECK

Antes de siquiera calcular un score, verificar si alguna condición elimina automáticamente esta oportunidad. Los Kill Switches son binarios — si uno se activa, la respuesta es NO-GO sin importar nada más.

### Kill Switches de David Sanchez

```
KILL SWITCH                                                  ¿ACTIVADO?
─────────────────────────────────────────────────────────────────────────

KS-1: SHIPPED TITLE EXCLUYENTE                               [ ] SÍ  [ ] NO
      El rol requiere un título comercial publicado como 
      requisito excluyente sin indicación de flexibilidad.
      (Si dice "shipped title preferred" → NO es kill switch.
       Si dice "must have shipped at least one AAA title" → SÍ.)

KS-2: PISO SALARIAL                                          [ ] SÍ  [ ] NO
      La compensación confirmada o estimada con alta 
      confianza está por debajo de $1,000 USD/mes.
      (Si no hay dato de salario → NO es kill switch, es riesgo.)

KS-3: CRUNCH DOCUMENTADO                                     [ ] SÍ  [ ] NO
      El estudio tiene reportes múltiples e independientes 
      de crunch culture sistémico (no un incidente aislado).
      (Glassdoor <2.5 con >15 reviews mencionando crunch → SÍ.)

KS-4: FUERA DE SCOPE                                         [ ] SÍ  [ ] NO
      El rol no tiene ningún componente de gameplay 
      programming, game development, o trabajo en motor 
      gráfico. (Ej: un rol puro de backend web disfrazado 
      de "game developer.")

KS-5: VISA IMPOSIBLE                                         [ ] SÍ  [ ] NO
      El rol requiere presencia física en un país donde 
      David no puede obtener visa de trabajo en un plazo 
      razonable (<6 meses), y no hay opción remota.

KS-6: ESTUDIO EN COLAPSO                                     [ ] SÍ  [ ] NO
      El estudio tuvo layoffs >30% en los últimos 6 meses,
      está en proceso de cierre, o tiene demandas laborales 
      activas que indican insolvencia.
```

### Resultado del Kill Switch Check

```
¿ALGÚN KILL SWITCH ACTIVADO?

[ ] NO — Ninguno activado. Continuar a Paso 2.

[ ] SÍ — Kill Switch KS-___ activado.
    → DECISIÓN AUTOMÁTICA: NO-GO
    → Razón: _______________________________________________
    → NO CALCULAR SCORE. Ir directamente a registro de decisión.
    → Tiempo ahorrado: ~2-3 horas de aplicación que se habrían desperdiciado.
```

---

## PASO 2: SCORE PONDERADO DECISIONAL

### Diferencia entre pesos de Fase 2 y Fase 3

La Fase 2 usó pesos analíticos (para entender la oportunidad desde múltiples ángulos). La Fase 3 usa pesos decisionales (para tomar la decisión de invertir tiempo). Los pesos cambian porque las prioridades de David al decidir son diferentes a las prioridades de análisis.

```
PERSPECTIVA          PESO FASE 2    PESO FASE 3    ¿POR QUÉ CAMBIA?
                     (Análisis)     (Decisión)
──────────────────────────────────────────────────────────────────────
P1 Hiring Manager       25%            25%          Se mantiene: si el HM no te quiere,
                                                    nada más importa.

P5 VP/Director          15%            20%          Sube: al DECIDIR, el impacto en el
                                                    negocio y la viabilidad presupuestaria
                                                    pesan más. Si el VP no aprueba 
                                                    headcount, no hay posición.

P6 David                15%            25%          Sube significativamente: en la 
                                                    DECISIÓN final, lo que tú quieres 
                                                    importa tanto como lo que el HM 
                                                    quiere. No vas a invertir 3 horas 
                                                    en algo que no te conviene.

P2 Recruiter            15%            15%          Se mantiene: el filtro del recruiter
                                                    sigue siendo crítico para pasar.

P4 Peers                20%            10%          Baja: la opinión de peers importa 
                                                    más en el análisis que en la decisión.
                                                    Al decidir, es un factor secundario.

P3 RRHH                 10%             5%          Baja: RRHH es casi binario (viable 
                                                    o no). Si llegaste aquí sin kill 
                                                    switch, el peso decisional es menor.
                                                    
──────────────────────────────────────────────────────────────────────
TOTAL                  100%           100%
```

### Cálculo del Score

Tomar los scores de la Fase 2 y aplicar los nuevos pesos:

```
┌──────────────────────────────────────────────────────────────────────┐
│           SCORECARD DECISIONAL — FASE 3                              │
│           Empresa: _______________                                   │
│           Rol: _______________                                       │
│           Fecha: YYYY-MM-DD                                          │
├──────┬───────────────────────┬────────┬─────────┬────────────────────┤
│  #   │ PERSPECTIVA           │ PESO   │ SCORE   │ PONDERADO          │
│      │                       │ F3     │ (de F2) │ (Score × Peso)     │
├──────┼───────────────────────┼────────┼─────────┼────────────────────┤
│  P1  │ Hiring Manager        │  25%   │ __/10   │ = __ × 0.25 = ___ │
│  P5  │ VP/Director           │  20%   │ __/10   │ = __ × 0.20 = ___ │
│  P6  │ David                 │  25%   │ __/10   │ = __ × 0.25 = ___ │
│  P2  │ Recruiter             │  15%   │ __/10   │ = __ × 0.15 = ___ │
│  P4  │ Peers                 │  10%   │ __/10   │ = __ × 0.10 = ___ │
│  P3  │ RRHH                  │   5%   │ __/10   │ = __ × 0.05 = ___ │
├──────┼───────────────────────┼────────┼─────────┼────────────────────┤
│      │ SCORE DECISIONAL      │ 100%   │         │ TOTAL: ___/10      │
└──────┴───────────────────────┴────────┴─────────┴────────────────────┘

CÁLCULO:
Score = (P1 × 0.25) + (P5 × 0.20) + (P6 × 0.25) + (P2 × 0.15) + (P4 × 0.10) + (P3 × 0.05)
Score = (__ × 0.25) + (__ × 0.20) + (__ × 0.25) + (__ × 0.15) + (__ × 0.10) + (__ × 0.05)
Score = ___ + ___ + ___ + ___ + ___ + ___
Score = ___/10
```

---

## PASO 3: CLASIFICACIÓN POR SEMÁFORO

### Tabla de umbrales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🟢 VERDE — SCORE 7.5 o SUPERIOR                                     │
│   ══════════════════════════════                                        │
│                                                                         │
│   Clasificación: PERSEGUIR FUERTE                                       │
│                                                                         │
│   Significado: Esta oportunidad tiene un match sólido en las            │
│   dimensiones que más importan. El hiring manager probablemente         │
│   querría a David, David quiere estar ahí, y la logística funciona.    │
│                                                                         │
│   Acción si David dice "Go":                                            │
│   → Paquete completo de Fase 4 con máximo esfuerzo                     │
│   → CV dirigido con personalización profunda                            │
│   → Cover letter con investigación visible del estudio                  │
│   → Dossier de persecución con estrategia de follow-up                  │
│   → Intentar warm intro o referral si es posible                        │
│   → Aplicar dentro de 48 horas de la decisión Go                       │
│                                                                         │
│   Inversión de tiempo esperada: 2-3 horas en Fase 4                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🟡 AMARILLO — SCORE 5.5 a 7.4                                       │
│   ══════════════════════════════                                        │
│                                                                         │
│   Clasificación: PERSEGUIR CONDICIONAL                                  │
│                                                                         │
│   Significado: Hay potencial pero también riesgos significativos.       │
│   Algunas perspectivas son fuertes, otras son débiles. La aplicación    │
│   podría funcionar si David tiene un ángulo de diferenciación claro     │
│   que compense las debilidades.                                         │
│                                                                         │
│   Acción si David dice "Go":                                            │
│   → Fase 4 con esfuerzo calibrado (no máximo)                          │
│   → CV dirigido estándar (personalizado pero sin extras)                │
│   → Cover letter enfocada en compensar la debilidad principal           │
│   → Dossier simplificado (sin estrategia elaborada de follow-up)        │
│   → Aplicar por canal oficial, no invertir en warm intros               │
│   → Máximo 1-2 horas en Fase 4                                         │
│                                                                         │
│   CONDICIÓN OBLIGATORIA: Antes de proceder, identificar y              │
│   documentar explícitamente:                                            │
│   1. El riesgo principal que hace esto amarillo y no verde              │
│   2. La razón específica por la que vale la pena a pesar del riesgo    │
│   3. La condición bajo la cual David retiraría su aplicación            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🔴 ROJO — SCORE MENOR A 5.5                                         │
│   ═══════════════════════════                                           │
│                                                                         │
│   Clasificación: SALTAR                                                 │
│                                                                         │
│   Significado: La oportunidad no justifica la inversión de tiempo.      │
│   Las perspectivas clave (HM, David, VP) no son favorables, o hay      │
│   demasiados riesgos acumulados. Aplicar aquí sería diluir el          │
│   esfuerzo que debería ir a oportunidades verdes y amarillas.          │
│                                                                         │
│   Acción recomendada:                                                   │
│   → NO proceder a Fase 4                                               │
│   → Documentar la razón del NO-GO                                      │
│   → Archivar el informe de inteligencia (puede ser útil después)       │
│   → Avanzar a la siguiente oportunidad del pipeline                    │
│                                                                         │
│   EXCEPCIÓN: David puede overridear un ROJO solo si:                   │
│   → Tiene una referral directa que cambia las probabilidades            │
│   → El estudio es un "dream company" y quiere intentar de todos modos  │
│   → Registrar explícitamente por qué overridea y qué espera distinto   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## PASO 4: ANÁLISIS DE RIESGO-RECOMPENSA

Antes de presentar la decisión a David, Claude debe construir un análisis de riesgo-recompensa:

### Matriz de escenarios

```
ESCENARIO MEJOR CASO (si todo sale bien):
- David consigue una entrevista en __ semanas
- Pasa la entrevista técnica gracias a [fortaleza específica]
- Recibe oferta de $___/mes
- Empieza a trabajar en [tipo de proyecto]
- En 1 año tiene: [shipped title / experiencia AAA / networking / skill X]
- Probabilidad estimada: ___%

ESCENARIO BASE (lo más probable):
- David aplica y [recibe respuesta / no recibe respuesta]
- Si hay respuesta: [llega a entrevista / se queda en pipeline]
- Tiempo invertido: ~___ horas
- Lo que David gana incluso sin oferta: [práctica de aplicación / intel del mercado / 
  contacto en la industria / nada]
- Probabilidad estimada: ___%

ESCENARIO PEOR CASO (si todo sale mal):
- David invierte __ horas y no recibe respuesta
- Costo de oportunidad: esas horas podían ir a [alternativa concreta]
- Impacto emocional: [bajo — una aplicación más / medio — era una que quería / 
  alto — invirtió mucho emocionalmente]
- Probabilidad estimada: ___%
```

### Cálculo de valor esperado

```
VALOR ESPERADO DE APLICAR:

Inversión:
- Tiempo: ___ horas × valor de tu hora = $___
- Esfuerzo emocional: [bajo / medio / alto]
- Costo de oportunidad: ___ (otras aplicaciones que no harás)

Retorno potencial:
- Si resulta en oferta: $___/mes × 12 = $___/año + experiencia + crecimiento
- Si resulta en entrevista sin oferta: Práctica + feedback + contacto
- Si resulta en silencio: Intel del mercado (valor mínimo)

¿EL RETORNO POTENCIAL JUSTIFICA LA INVERSIÓN?
[ ] Claramente sí — El upside es enorme comparado con 2-3 horas de trabajo
[ ] Probablemente sí — El retorno esperado es positivo
[ ] Marginal — Podría ser mejor usar el tiempo en otra oportunidad
[ ] No — El costo de oportunidad es mayor que el retorno esperado
```

---

## PASO 5: PRESENTACIÓN AL HUMANO (Template para Claude)

Este es el formato que Claude debe usar para presentar los hallazgos a David y esperar su decisión:

```markdown
---

## 🚦 PUERTA GO/NO-GO: [Nombre del Estudio] — [Título del Rol]

### Kill Switches
[✅ Ninguno activado / ⛔ KS-X activado: razón]

### Score Decisional

| Perspectiva | Peso | Score | Ponderado |
|-------------|------|-------|-----------|
| P1 Hiring Manager | 25% | __/10 | ___ |
| P5 VP/Director | 20% | __/10 | ___ |
| P6 David | 25% | __/10 | ___ |
| P2 Recruiter | 15% | __/10 | ___ |
| P4 Peers | 10% | __/10 | ___ |
| P3 RRHH | 5% | __/10 | ___ |
| **TOTAL** | **100%** | | **___/10** |

### Clasificación: [🟢 VERDE / 🟡 AMARILLO / 🔴 ROJO]

### Lo mejor de esta oportunidad
1. ___
2. ___
3. ___

### Lo más preocupante
1. ___
2. ___
3. ___

### Escenario más probable
___

### Mi recomendación
[GO FUERTE — Invertir 2-3 horas en paquete completo de Fase 4]
[GO CONDICIONAL — Invertir 1-2 horas enfocándose en compensar X]
[HOLD — Guardar y reevaluar cuando Y cambie]
[NO-GO — Archivar y avanzar porque Z]

---

⛔ **ESPERANDO TU DECISIÓN.**

Opciones:
- **"Go"** → Procedo a Fase 4: CV dirigido + Cover Letter + Dossier
- **"Go condicional"** → Procedo a Fase 4 con esfuerzo calibrado
- **"Hold"** → Archivamos por ahora, dime bajo qué condición reevaluamos
- **"No-go"** → Archivamos definitivamente y pasamos a la siguiente
- **"Quiero ajustar [X]"** → Revisamos la perspectiva que quieras antes de decidir

---
```

---

## PASO 6: REGISTRO DE DECISIÓN

Independientemente de la decisión, documentar en `03-decisión-go-nogo.md`:

### Template del registro

```markdown
# DECISIÓN GO/NO-GO: [Nombre del Estudio]
## Posición: [Título exacto del rol]
## Fecha de decisión: YYYY-MM-DD

---

## KILL SWITCH CHECK
| Kill Switch | ¿Activado? | Detalle |
|-------------|------------|---------|
| KS-1: Shipped title excluyente | ✅/❌ | ___ |
| KS-2: Piso salarial <$1,000 | ✅/❌ | ___ |
| KS-3: Crunch documentado | ✅/❌ | ___ |
| KS-4: Fuera de scope | ✅/❌ | ___ |
| KS-5: Visa imposible | ✅/❌ | ___ |
| KS-6: Estudio en colapso | ✅/❌ | ___ |

**Resultado Kill Switch:** [Todos limpios / KS-__ activado → NO-GO automático]

---

## SCORE DECISIONAL

| # | Perspectiva | Peso F3 | Score (de F2) | Ponderado |
|---|-------------|---------|---------------|-----------|
| P1 | Hiring Manager | 25% | __/10 | ___ |
| P5 | VP/Director | 20% | __/10 | ___ |
| P6 | David | 25% | __/10 | ___ |
| P2 | Recruiter | 15% | __/10 | ___ |
| P4 | Peers | 10% | __/10 | ___ |
| P3 | RRHH | 5% | __/10 | ___ |
| **TOTAL** | | **100%** | | **___/10** |

---

## CLASIFICACIÓN: [🟢 VERDE / 🟡 AMARILLO / 🔴 ROJO]

---

## ANÁLISIS DE RIESGO-RECOMPENSA

**Mejor caso:** ___
**Caso base:** ___
**Peor caso:** ___
**¿Retorno justifica inversión?:** [sí / probablemente / marginal / no]

---

## RECOMENDACIÓN DE CLAUDE
[GO FUERTE / GO CONDICIONAL / HOLD / NO-GO]

**Razón principal:** ___

**Si GO — Ángulo de diferenciación para Fase 4:**
___

**Si GO — Debilidad principal a compensar en materiales:**
___

**Si AMARILLO — Condiciones del Go Condicional:**
1. Riesgo principal: ___
2. Por qué vale la pena: ___
3. Condición de retiro: ___

---

## DECISIÓN DE DAVID
**Fecha/hora:** ___
**Decisión:** [Go / Go condicional / Hold / No-go / Override]

**Comentario de David (si aplica):**
___

**Si Hold — Condición de reevaluación:**
___

**Si Override (ROJO → Go) — Justificación:**
___

---

## SIGUIENTE PASO
[ ] → Proceder a FASE 4: CREAR (si Go/Go condicional)
[ ] → Programar reevaluación para [fecha] (si Hold)
[ ] → Archivar y pasar a siguiente oportunidad (si No-go)
[ ] → Volver a Fase 2 perspectiva P__ (si ajuste solicitado)
```

---

## REGLAS OPERATIVAS DE LA FASE 3

### Regla 1: Velocidad de decisión

```
La Fase 3 NO debe tomar más de 15 minutos.

Si después de 15 minutos no puedes decidir, la respuesta 
probablemente es AMARILLO — y eso está bien. El AMARILLO 
existe para cuando no es obvio.

Lo que NO puedes hacer es quedarte en Fase 3 indefinidamente.
Decidir "Hold" es decidir. Decidir "No-go" es decidir.
No decidir no es una opción.
```

### Regla 2: No más de 3 GOes FUERTES simultáneos

```
LÍMITE DE PIPELINE ACTIVO:

GO FUERTE activos (en Fase 4 o aplicados esperando respuesta): Máximo 3
GO CONDICIONAL activos: Máximo 5
HOLD: Sin límite (pero revisar semanalmente)

¿Por qué?
- Cada GO FUERTE consume 2-3 horas de creación + energía mental
- Más de 3 activos simultáneamente diluye la calidad de cada uno
- Si tienes 3 GOes FUERTES y aparece uno mejor, el peor GO FUERTE 
  baja a CONDICIONAL o se archiva

ANTES DE AGREGAR UN NUEVO GO FUERTE, VERIFICAR:
¿Cuántos GO FUERTE tengo activos?: ___
¿Si debo hacer espacio, cuál sacrifico?: ___
```

### Regla 3: Reevaluación de HOLDs

```
CADA DOMINGO, REVISAR:

1. Abrir todos los HOLDs activos
2. Para cada uno preguntar:
   - ¿Cambió algo desde que lo puse en HOLD?
   - ¿La oferta sigue publicada? (si se cerró, archivar)
   - ¿Mi situación cambió? (nuevo proyecto, nueva skill, nueva urgencia)
   - ¿Debería promoverlo a GO CONDICIONAL o archivarlo como NO-GO?

3. Decisión rápida (<2 min por HOLD):
   [ ] Promover a GO CONDICIONAL
   [ ] Mantener en HOLD (con nueva fecha de reevaluación)
   [ ] Archivar como NO-GO
```

### Regla 4: Override Protocol

```
David puede overridear cualquier recomendación de Claude.

SI DAVID QUIERE GO EN UN ROJO:
1. Claude pregunta: "¿Qué ves tú que el análisis no captura?"
2. David responde con su razón
3. Claude registra el override en 03-decisión-go-nogo.md
4. Claude procede a Fase 4 pero marca el dossier como "Override — Riesgo alto"
5. En el follow-up post-aplicación, comparar resultado con la predicción
   → Esto calibra el sistema para futuras decisiones

SI DAVID QUIERE NO-GO EN UN VERDE:
1. Claude pregunta: "¿Hay algo que te incomoda que no exploramos?"
2. David responde
3. Claude registra — a veces la intuición captura lo que los números no
4. Archivar con la nota de David para referencia futura

EL SISTEMA APRENDE DE LOS OVERRIDES.
```

### Regla 5: Recalibración mensual

```
CADA PRIMER LUNES DEL MES, REVISAR:

1. ¿Cuántas aplicaciones GO FUERTE envié el mes pasado?: ___
2. ¿Cuántas generaron respuesta?: ___ (Tasa: ___%)
3. ¿Cuántas llegaron a entrevista?: ___ (Tasa: ___%)
4. ¿Las predicciones del semáforo fueron acertadas?
   - ¿Los VERDES tuvieron mejor resultado que los AMARILLOS?: [sí/no]
   - ¿Algún ROJO overrideado resultó bien?: [sí/no]
   
5. AJUSTES:
   - ¿Necesito ajustar los umbrales? (ej: si 7.5 es muy alto y nada pasa, bajar a 7.0)
   - ¿Necesito ajustar los pesos? (ej: si P2 Recruiter predice mal, revisar)
   - ¿Necesito agregar/quitar Kill Switches?
   - ¿Mi rango salarial necesita ajuste basado en el mercado real?
```

---

## FLUJO RÁPIDO DE REFERENCIA

Para uso diario cuando ya tengas el sistema interiorizado:

```
FASE 3 — QUICK CHECK (5 minutos)

1. ¿Kill Switch?           → SÍ = NO-GO. Fin.
                            → NO = Continuar.

2. Tomar 6 scores de F2, aplicar pesos F3:
   (P1×.25) + (P5×.20) + (P6×.25) + (P2×.15) + (P4×.10) + (P3×.05) = ___

3. ¿Resultado?
   ≥ 7.5  → 🟢 Recomendar GO FUERTE
   5.5-7.4 → 🟡 Recomendar GO CONDICIONAL (+ documentar riesgo)
   < 5.5  → 🔴 Recomendar NO-GO

4. ⛔ STOP. Presentar a David. Esperar decisión.

5. Registrar en 03-decisión-go-nogo.md
```

---

## CHECKLIST DE COMPLETITUD

```
PASO 1:
[ ] Kill Switch Check completado (6 switches verificados)
[ ] Si alguno activado → NO-GO registrado, no continuar

PASO 2:
[ ] Scores de Fase 2 trasladados correctamente
[ ] Pesos de Fase 3 aplicados (25/20/25/15/10/5)
[ ] Cálculo verificado (suma = score total)

PASO 3:
[ ] Clasificación por semáforo asignada
[ ] Acción correspondiente documentada

PASO 4:
[ ] Análisis de riesgo-recompensa con 3 escenarios
[ ] Valor esperado evaluado

PASO 5:
[ ] Presentación formateada para David
[ ] ⛔ STOP ejecutado — esperando decisión humana

PASO 6:
[ ] Decisión de David registrada con fecha/hora
[ ] Siguiente paso definido
[ ] 03-decisión-go-nogo.md guardado en carpeta de la empresa
```

---

*Protocolo de la Fase 3 — DECIDIR. Parte del Job Pursuit Framework de David Sanchez.*  
*Creado: 2026-04-13*
