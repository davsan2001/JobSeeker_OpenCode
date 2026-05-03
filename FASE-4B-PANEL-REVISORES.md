# FASE 4B: PANEL DE 7 REVISORES SIMULADOS
## Job Pursuit Framework — David Sanchez

> **Documento:** Protocolo de quality assurance para CVs dirigidos antes del envío  
> **Input requerido:** CV dirigido completado según FASE-4A-REGLAS-CV.md  
> **Output:** `applications/[Nombre-Empresa]/04-deliverables/review-panel-[Empresa].md`  
> **Versión:** 1.0  
> **Fecha:** 2026-04-13  
> **Tiempo estimado:** 10-15 minutos por CV (Claude ejecuta las 7 revisiones)

---

## PROPÓSITO

Un CV nunca se envía sin revisión. El problema es que David no tiene 7 personas disponibles para revisar cada versión antes de aplicar. Este protocolo simula esas 7 personas.

Cada revisor tiene un rol distinto, un criterio distinto y un nivel de exigencia distinto. Si el CV sobrevive a los 7, está listo. Si no, se itera antes de enviar.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   DavidSanchez-Resume-[Empresa].md                               │
│                    │                                             │
│                    ▼                                             │
│   ┌──────────────────────────────────┐                           │
│   │     PANEL DE 7 REVISORES         │                           │
│   │                                  │                           │
│   │  R1 Hiring Manager    (6 seg)    │                           │
│   │  R2 Recruiter         (ATS)      │                           │
│   │  R3 RRHH              (flags)    │                           │
│   │  R4 Peers             (cred.)    │                           │
│   │  R5 VP/Director       (revenue)  │                           │
│   │  R6 David             (yo)       │                           │
│   │  R7 Experto en CV     (craft)    │                           │
│   │                                  │                           │
│   └──────────────┬───────────────────┘                           │
│                  │                                               │
│         ┌────────┼────────┐                                      │
│         ▼        ▼        ▼                                      │
│     7 PASAN   BANDERAS   FALLAS                                  │
│         │        │        │                                      │
│         ▼        ▼        ▼                                      │
│      ENVIAR   ITERAR    ITERAR                                   │
│               (menor)   (mayor)                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## SISTEMA DE CALIFICACIÓN

Cada revisor evalúa cada sección del CV con uno de tres veredictos:

```
✅ PASA    — La sección cumple con las expectativas de este revisor.
             No requiere cambios.

⚠️ BANDERA — La sección es aceptable pero tiene un problema menor que 
             podría mejorarse. No es dealbreaker pero debilita el CV.
             → Incluir nota específica de qué mejorar.

❌ FALLA   — La sección tiene un problema serio desde la perspectiva 
             de este revisor. Si no se corrige, reduce significativamente 
             las probabilidades de éxito.
             → Incluir instrucción concreta de corrección.
```

**Reglas del panel:**

```
PARA ENVIAR EL CV:
- 0 FALLAS en cualquier revisor (todas las FALLAS deben corregirse)
- Máximo 3 BANDERAS totales (si hay más, corregir las más críticas)
- R1 (Hiring Manager) y R2 (Recruiter) no pueden tener FALLAS ni BANDERAS
  en las secciones de Summary y Experience (son las que más importan)

PARA ITERAR:
- Corregir todas las FALLAS
- Corregir las BANDERAS de R1 y R2 obligatoriamente
- Corregir las demás BANDERAS si el tiempo lo permite
- Re-pasar por el panel después de correcciones

MÁXIMO DE ITERACIONES: 2
- Si después de 2 rondas todavía hay FALLAS, hay un problema 
  estructural que no se resuelve con edición — revisar la Fase 4A.
```

---

## SECCIONES QUE EVALÚA CADA REVISOR

Cada revisor evalúa el CV completo pero se enfoca en las secciones que le competen:

```
SECCIÓN DEL CV           R1   R2   R3   R4   R5   R6   R7
                         HM   REC  RRHH PEER VP   DAV  EXP
─────────────────────────────────────────────────────────────
Header / Contacto         ·    ✓    ✓    ·    ·    ✓    ✓
Professional Summary      ✓    ✓    ·    ·    ✓    ✓    ✓
Experience                ✓    ✓    ✓    ✓    ✓    ✓    ✓
Projects                  ✓    ·    ·    ✓    ·    ✓    ✓
Technical Skills          ✓    ✓    ·    ✓    ·    ✓    ✓
Education                 ·    ·    ✓    ·    ·    ✓    ✓
Certifications            ·    ·    ·    ·    ·    ✓    ✓
Impresión General         ✓    ✓    ✓    ✓    ✓    ✓    ✓

✓ = Evalúa activamente    · = Observa pero no bloquea
```

---

# REVISOR 1: HIRING MANAGER — "Prueba de 6 Segundos"

## Perfil del revisor

Este es el lead programmer, tech director o engineering manager que va a supervisar a David día a día. Lee CVs entre reuniones. No tiene tiempo. Necesita saber en 6 segundos si este candidato merece una segunda mirada.

## Qué evalúa

### Test de 6 segundos (Impresión General)

```
INSTRUCCIÓN PARA CLAUDE:
Simular leer el CV como si lo vieras por primera vez durante 
exactamente 6 segundos. Evaluar SOLO lo que un ojo humano 
captaría en ese barrido ultra-rápido:

SEGUNDO 1-2: ¿El nombre y título son claros?
- ¿Veo inmediatamente que es un [rol relevante]?              [sí/no]
- ¿El título del CV matchea con la posición?                   [sí/no]

SEGUNDO 3-4: ¿El summary me engancha?
- ¿Puedo leer las 3 líneas y entender qué ofrece?             [sí/no]
- ¿Hay al menos 1 keyword que coincide con lo que busco?       [sí/no]
- ¿Algo me hace querer seguir leyendo?                         [sí/no]

SEGUNDO 5-6: ¿La experiencia se ve relevante?
- ¿El primer bullet de Experience resuena con mis necesidades? [sí/no]
- ¿Los nombres de proyectos suenan a gamedev real?             [sí/no]

VEREDICTO DE 6 SEGUNDOS:
[ ] "Sigo leyendo" → El CV pasa al stack de "revisar con calma"
[ ] "Tal vez" → El CV va al stack de "si no encuentro algo mejor"
[ ] "Paso" → El CV va a la pila de rechazos
```

### Professional Summary

```
CRITERIOS DEL HIRING MANAGER:
- ¿En 3 líneas entiendo qué tipo de programador es David?
- ¿Menciona las tecnologías que mi equipo usa?
- ¿Hay una señal de que puede contribuir al proyecto actual?
- ¿El tono es de alguien que sabe de lo que habla, no de alguien 
  que copió buzzwords?

PASA:  Summary comunica identidad + stack + valor en 3 líneas claras
BAND:  Summary es correcto pero genérico, podría ser de cualquiera
FALLA: Summary no conecta con el rol, usa buzzwords vacíos, o sobra
```

### Experience

```
CRITERIOS DEL HIRING MANAGER:
- ¿Los bullets describen trabajo real con resultados visibles?
- ¿Puedo imaginar a David haciendo este trabajo en mi equipo?
- ¿Hay profundidad técnica suficiente o es todo superficial?
- ¿Cuánto tiempo de ramp-up necesitaría basándome en lo que leo?

PASA:  Los bullets demuestran competencia aplicada al dominio que necesito
BAND:  Los bullets son correctos pero no demuestran impacto concreto
FALLA: Los bullets son genéricos, irrelevantes para el rol, o no creíbles
```

### Projects

```
CRITERIOS DEL HIRING MANAGER:
- ¿Los proyectos son relevantes para lo que hace mi equipo?
- ¿Puedo ver la complejidad técnica del trabajo?
- ¿Hay algo que me haga querer ver el portfolio/código?

PASA:  Al menos 1 proyecto demuestra competencia directa en lo que necesito
BAND:  Los proyectos son interesantes pero tangenciales al rol
FALLA: Los proyectos no demuestran ninguna competencia relevante
```

### Technical Skills

```
CRITERIOS DEL HIRING MANAGER:
- ¿Las primeras 3-4 skills son exactamente lo que busco?
- ¿Hay profundidad en mi stack o es una lista superficial?
- ¿Falta alguna skill crítica que mi equipo necesita?

PASA:  Las skills principales del rol están listadas y en los primeros puestos
BAND:  Las skills están pero desordenadas o diluidas con cosas irrelevantes
FALLA: Faltan skills críticas para el rol o las primeras no son relevantes
```

### Ficha de evaluación R1

```
R1 — HIRING MANAGER
──────────────────────────────────────────────────────────────
Test de 6 segundos:        [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Professional Summary:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Experience:                [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Projects:                  [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Technical Skills:          [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿ESTE HM PEDIRÍA ENTREVISTA?   [SÍ / PROBABLEMENTE / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 2: RECRUITER — "Pasabilidad ATS"

## Perfil del revisor

El recruiter filtra con ATS primero y con sus ojos después. No entiende la diferencia entre "Behavior Trees" y "Finite State Machines" — pero sabe si las keywords del job posting aparecen en el CV. Su trabajo es presentar candidatos que no lo hagan quedar mal.

## Qué evalúa

### Test ATS (Header + Formato)

```
CRITERIOS TÉCNICOS DE ATS:
- ¿El formato es parseable por un ATS?
  [ ] Sin columnas complejas que rompan el parsing
  [ ] Sin headers como imágenes (solo texto)
  [ ] Sin tablas complejas (tablas simples OK en algunos ATS)
  [ ] Secciones con headers claros y estándar 
      (Summary, Experience, Education, Skills)
  [ ] Fechas en formato consistente (MMM YYYY o MM/YYYY)

- ¿El header tiene la información correcta?
  [ ] Nombre completo visible
  [ ] Email profesional (no "gamer_tag_420@...")
  [ ] LinkedIn URL
  [ ] Portfolio URL
  [ ] Ubicación (ciudad, país — sin dirección completa)
  [ ] Teléfono (con código de país para international)

PASA:  Formato limpio, parseable, toda la info de contacto presente
BAND:  Formato OK pero falta algún dato (ej: portfolio sin URL)
FALLA: Formato rompe ATS (columnas, tablas complejas, imágenes)
```

### Test de Keywords

```
INSTRUCCIÓN PARA CLAUDE:
Extraer TODAS las keywords técnicas del job posting original.
Verificar una por una si aparecen en el CV.

| Keyword del posting | ¿Aparece en CV? | ¿Dónde? | Match exacto o sinónimo |
|---------------------|-----------------|---------|------------------------|
| ___ | ✅/❌ | [sección] | [exacto / sinónimo: ___] |
| ___ | ✅/❌ | [sección] | [exacto / sinónimo: ___] |
| ___ | ✅/❌ | [sección] | [exacto / sinónimo: ___] |
| ___ | ✅/❌ | [sección] | [exacto / sinónimo: ___] |
| ___ | ✅/❌ | [sección] | [exacto / sinónimo: ___] |

TASA DE MATCH: ___/___ = ___%

PASA:  ≥80% de keywords del posting presentes en el CV
BAND:  60-79% de keywords presentes
FALLA: <60% de keywords presentes — el ATS probablemente filtra
```

### Claridad y presentabilidad

```
CRITERIOS DEL RECRUITER:
- ¿Puedo escanear el CV en 30 segundos y saber de qué va?
- ¿Las secciones son fáciles de encontrar?
- ¿La experiencia se lee de forma lógica (cronológica o por relevancia)?
- ¿Puedo "vender" este candidato al hiring manager en 1 línea?
  → Pitch de 1 línea que el recruiter haría: "___"

PASA:  Claro, bien estructurado, el pitch es fácil de construir
BAND:  Legible pero alguna sección confusa o pitch difícil de armar
FALLA: Desordenado, difícil de escanear, no puedo vender este CV
```

### Ficha de evaluación R2

```
R2 — RECRUITER
──────────────────────────────────────────────────────────────
Formato ATS:               [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Keywords (___% match):     [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Keywords faltantes: ___

Claridad / Presentabilidad:[✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Pitch de 1 línea: "___"

Header / Contacto:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Professional Summary:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Experience:                [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Technical Skills:          [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿EL RECRUITER PASARÍA ESTE CV AL HM?   [SÍ / CON RESERVAS / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 3: RRHH — "Escaneo de Banderas Rojas"

## Perfil del revisor

RRHH busca riesgos. No evalúa si David sabe programar — evalúa si contratarlo va a generar problemas. Su checklist es binario: pasa o no pasa el screening de riesgo.

## Qué evalúa

### Gaps de empleo

```
TIMELINE DE DAVID:
- Dic 2018: Graduación bachillerato + técnico en electrónica
- [2019-2024]: Periodo universitario (5+ años, normal para ingeniería)
- Dic 2024: Graduación Universidad (Multimedia Engineering)
- [Dic 2024 - May 2025]: ~5 meses sin empleo formal
- May 2025 - Presente: CIPP / Fundación Universidad del Valle

ANÁLISIS DE GAPS:
Gap 1: Dic 2024 - May 2025 (~5 meses)
  → ¿Explicable? SÍ — período normal post-graduación
  → ¿Red flag para RRHH? NO — si se presenta como "período de
     desarrollo de proyectos propios" (Tactical MP fue Feb-Mar 2025)
  → Mitigación en CV: La fecha de Tactical MP (Feb-Mar 2025) 
     cubre parte del gap visualmente

¿Hay otros gaps?             [verificar según fechas actuales]

PASA:  No hay gaps inexplicables >6 meses
BAND:  Hay un gap que es explicable pero visible (5 meses post-grad)
FALLA: Hay gaps >6 meses sin ninguna cobertura o explicación
```

### Job hopping

```
HISTORIAL:
- 1 empleo profesional: CIPP (May 2025 - presente = ~11 meses)
- 0 cambios de empleo previos

EVALUACIÓN:
- ¿Hay patrón de job hopping? NO — primer empleo
- ¿RRHH podría preocuparse por algo? 
  → Riesgo menor: Al ser su primer empleo, no hay track record de 
    retención. RRHH podría preguntarse si se quedará >1 año.
  → Mitigación: Es normal para perfiles junior. No es un flag real.

PASA:  Sin patrón de job hopping, historial limpio
BAND:  Primer empleo sin track record de retención (riesgo teórico)
FALLA: Patrón evidente de salir de empleos en <6 meses (NO aplica)
```

### Visado y logística

```
EVALUACIÓN PARA ESTE ROL ESPECÍFICO:

¿El CV menciona ubicación claramente?           [sí/no]
¿El rol acepta remoto internacional?             [sí/no/desconocido]
¿Hay alguna mención de visa requirement?         [sí/no]
¿David necesitaría visa para este rol?           [sí/no]
¿El CV está adaptado a la realidad logística?    [sí/no]

COSAS QUE NO DEBEN ESTAR EN EL CV:
❌ "Willing to relocate" (si no están pidiendo reubicación)
❌ Estado de visa o detalles de inmigración
❌ Número de pasaporte o datos personales sensibles
❌ Fecha de nacimiento (no requerido en US/EU, puede generar bias)
❌ Foto (no requerido en US, puede generar bias; OK en algunos 
   mercados europeos y LATAM)

PASA:  Sin red flags logísticas visibles, información apropiada
BAND:  Incluye información innecesaria que podría generar bias
FALLA: El CV revela un blocker logístico que debería omitirse
```

### Consistencia

```
CROSS-CHECK:
- ¿Las fechas del CV son internamente consistentes?    [sí/no]
- ¿Los títulos de trabajo son consistentes con la 
  descripción del trabajo?                              [sí/no]
- ¿Las skills listadas son consistentes con la 
  experiencia descrita?                                 [sí/no]
- ¿Hay algo que suene "demasiado bueno" para el 
  nivel de experiencia?                                 [sí/no]

PASA:  Todo es consistente y creíble para el nivel
BAND:  Hay una inconsistencia menor (ej: skill listada sin evidencia)
FALLA: Inconsistencia grave que generaría desconfianza
```

### Ficha de evaluación R3

```
R3 — RRHH
──────────────────────────────────────────────────────────────
Gaps de empleo:            [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Job hopping:               [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Visado / Logística:        [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Consistencia:              [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Header / Contacto:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Education:                 [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿RRHH DARÍA LUZ VERDE?   [SÍ / CON VERIFICACIÓN / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 4: PEERS — "Chequeo de Credibilidad"

## Perfil del revisor

Un gameplay programmer mid-senior del equipo. Sabe de lo que habla. Cuando lee un CV, detecta en segundos si alguien realmente hizo lo que dice o si está inflando. No le impresionan las palabras bonitas — le impresiona la precisión técnica.

## Qué evalúa

### Credibilidad técnica por bullet

```
INSTRUCCIÓN PARA CLAUDE:
Leer CADA bullet del CV como si fueras un senior gameplay programmer.
Para cada uno preguntar: "¿Esto suena a alguien que lo hizo de verdad?"

POR CADA BULLET DE EXPERIENCE Y PROJECTS:

Bullet: "[texto del bullet]"
  ¿Específico o vago?          [específico / vago]
  ¿Usa terminología correcta?  [sí / parcialmente / no]
  ¿El scope es creíble para 
   el nivel de David?          [sí — creíble / no — inflado / no — subestimado]
  ¿Podría hacer follow-up 
   en entrevista?              [sí, David podría responder / 
                                no, se quedaría sin palabras]
  Veredicto:                   [✅ / ⚠️ / ❌]
  Nota: ___
```

### Test de terminología

```
¿EL CV USA TÉRMINOS TÉCNICOS CORRECTAMENTE?

Revisar cada término técnico mencionado:
| Término usado | ¿Es correcto en contexto? | ¿Un senior lo cuestionaría? |
|---------------|--------------------------|----------------------------|
| ___ | [sí/no] | [no / tal vez / sí — por qué] |
| ___ | [sí/no] | [no / tal vez / sí — por qué] |

ERRORES COMUNES A VERIFICAR EN CVS DE GAMEDEV:
- ¿Dice "AI" cuando en realidad es scripted behavior?
  → David usa Behavior Trees → Legítimo decir AI
- ¿Dice "multiplayer" pero era solo local co-op?
  → David implementó netcode real → Legítimo decir multiplayer
- ¿Dice "optimized" sin especificar qué o cuánto?
  → Verificar que cada "optimized" tenga contexto
- ¿Dice "system" pero era solo un script suelto?
  → Verificar que lo que llama "system" tenga scope de sistema

PASA:  Terminología precisa, un senior no cuestionaría nada
BAND:  1-2 términos imprecisos que podrían generar preguntas
FALLA: Terminología incorrecta o inflada que destruiría credibilidad
```

### Nivel percibido vs. nivel real

```
DESPUÉS DE LEER TODO EL CV, EL PEER PENSARÍA:

"Este candidato parece un _____ developer"
[ ] Junior (0-2 años, necesita guía constante)
[ ] Junior avanzado (1-2 años, puede ejecutar tareas definidas)
[ ] Mid-entry (2-3 años, puede tomar ownership de features)
[ ] Mid (3-5 años, puede diseñar e implementar sistemas)
[ ] Senior (5+ años, puede mentorear y tomar decisiones técnicas)

¿ESE NIVEL COINCIDE CON LO QUE EL ROL PIDE?
- Nivel que transmite el CV: ___
- Nivel que pide el rol: ___
- ¿Match? [sí / CV subestima a David / CV infla a David]

PASA:  El nivel percibido coincide con lo que el rol pide (±1 nivel)
BAND:  El CV subestima a David (podría proyectar más confianza)
FALLA: El CV infla a David más allá de lo que la experiencia respalda
```

### Ficha de evaluación R4

```
R4 — PEERS
──────────────────────────────────────────────────────────────
Credibilidad de bullets:   [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Bullets problemáticos: ___

Terminología técnica:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Términos a corregir: ___

Nivel percibido vs. real:  [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nivel percibido: ___
  Nivel esperado por el rol: ___

Experience:                [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Projects:                  [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Technical Skills:          [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿EL PEER RESPALDARÍA CONTRATARLO?  [SÍ / CON RESERVAS / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 5: VP/DIRECTOR — "Productor de Revenue"

## Perfil del revisor

El VP o Director que aprueba headcount piensa en dinero, timelines y ROI. No lee CVs por diversión — lee buscando la respuesta a: "¿Esta persona va a hacer que mi equipo entregue más rápido o mejor?"

## Qué evalúa

### Señal de impacto en negocio

```
INSTRUCCIÓN PARA CLAUDE:
Leer el CV buscando CUALQUIER señal de que David puede impactar 
el output comercial del estudio. Esto es difícil para un junior 
— pero no imposible.

SEÑALES DE IMPACTO QUE BUSCA UN VP:

¿Hay evidencia de entrega end-to-end?
→ Entregar cosas completas = contribución predecible al pipeline
  [ ] Sí: [citar bullet específico]
  [ ] No

¿Hay evidencia de velocidad/productividad?
→ Entregar rápido = más features por sprint = mejor velocity
  [ ] Sí: [citar bullet específico]
  [ ] No

¿Hay evidencia de autonomía?
→ Trabajar sin supervisión constante = menos overhead para el lead
  [ ] Sí: [citar bullet específico]
  [ ] No

¿Hay evidencia de versatilidad?
→ Cubrir más de un área = menos contrataciones necesarias
  [ ] Sí: [citar bullet específico, ej: "gameplay + animation + AI"]
  [ ] No

¿Hay mención de costo-eficiencia? (NO poner esto en el CV, pero
el VP lo infiere por la ubicación de David)
→ Ubicación Colombia + C1 inglés = talento competitivo en costo

PASA:  Al menos 2 señales de impacto claras en el CV
BAND:  1 señal débil o ninguna explícita (pero inferible)
FALLA: El CV no comunica ningún tipo de impacto — solo actividades
```

### ROI implícito

```
EL VP CALCULA MENTALMENTE:

Costo de David: ~$18,000/año (en el rango alto)
Costo de un hire local equivalente: ~$___/año (del research de Fase 1)

¿El CV justifica el costo?
- Si David es más barato que un local → El CV solo necesita demostrar 
  competencia básica para justificar el ROI
- Si David es similar en costo → El CV necesita demostrar algo extra 
  que un candidato local no tenga
- Si David es más caro → El CV necesita demostrar impacto excepcional

Para esta oferta específica:
Escenario de costo: [más barato / similar / más caro]
¿El CV justifica? [sí / parcialmente / no]
```

### Ficha de evaluación R5

```
R5 — VP/DIRECTOR
──────────────────────────────────────────────────────────────
Señal de impacto en negocio:[✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Señales encontradas: ___

ROI implícito:             [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Professional Summary:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿Comunica valor, no solo skills? ___

Experience:                [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿Hay entrega demostrable? ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿EL VP APROBARÍA AVANZAR?   [SÍ / CON DATOS ADICIONALES / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 6: DAVID — "¿Mejor Versión de Mí?"

## Perfil del revisor

Eres tú. Nadie conoce tu experiencia mejor que tú. Esta revisión verifica que el CV te representa fielmente y que te sentirías cómodo defendiendo cada línea en una entrevista.

## Qué evalúa

### Test de precisión

```
INSTRUCCIÓN PARA CLAUDE:
Comparar CADA afirmación del CV con la información del 
master-resume-source.md. Verificar que nada se haya distorsionado 
en el proceso de adaptación.

POR CADA BULLET:
Bullet del CV:     "[texto]"
Fuente en master:  "[texto original]"
¿Es fiel al original?  [sí / reframing legítimo / distorsionado]
```

### Test de orgullo

```
PREGUNTAS QUE DAVID SE HARÍA:

"¿Me siento orgulloso de enviar este CV?"
[ ] Sí — Me representa bien
[ ] Parcialmente — Hay partes que me incomodan
[ ] No — No me reconozco en este documento

"¿Hay algo en este CV que me daría vergüenza si me preguntan?"
[ ] No — Puedo defender todo
[ ] Sí — [qué bullet/sección y por qué]

"¿Falta algo que considero importante de mí?"
[ ] No — Todo lo relevante está
[ ] Sí — Falta: ___

"¿Hay algo que exagera lo que realmente hice?"
[ ] No — Todo es preciso
[ ] Sí — [qué bullet y en qué se exagera]

"Si un ex-compañero de la universidad o CIPP leyera esto, 
¿confirmaría todo?"
[ ] Sí
[ ] La mayoría, excepto: ___
```

### Test del reflejo

```
"¿ESTE CV MUESTRA LA MEJOR VERSIÓN REAL DE MÍ PARA ESTE ROL?"

No la versión inventada. No la versión modesta.
La versión que toma todo lo real y lo presenta con el mejor ángulo 
posible para ESTE rol específico.

[ ] Sí — Es exactamente la mejor versión real de mí para este rol
[ ] Casi — Podría ser más fuerte si [ajuste específico]
[ ] No — Siento que me subestima porque [razón]
[ ] No — Siento que me infla porque [razón]
```

### Ficha de evaluación R6

```
R6 — DAVID
──────────────────────────────────────────────────────────────
Precisión vs. master:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Distorsiones: ___

Test de orgullo:           [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Incomodidades: ___

Test del reflejo:          [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿Mejor versión real? ___

Header / Contacto:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿Info actualizada y correcta? ___

Todos los sections:        [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿Algo falta o sobra? ___

Impresión General:         [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿DAVID ESTÁ CÓMODO ENVIANDO ESTO?   [SÍ / CON AJUSTES / NO]
──────────────────────────────────────────────────────────────
```

---

# REVISOR 7: EXPERTO EN CV — "Calidad Técnica del Documento"

## Perfil del revisor

Un profesional de career coaching que ha revisado miles de CVs. No evalúa el contenido de la carrera de David — evalúa la calidad del documento como pieza de comunicación profesional. Gramática, estructura, verbos, cuantificación, formato, longitud.

## Qué evalúa

### Verbos de acción

```
INSTRUCCIÓN PARA CLAUDE:
Listar el primer verbo de CADA bullet del CV.

| # | Verbo | ¿Es verbo de acción fuerte? | ¿Se repite? |
|---|-------|----------------------------|-------------|
| 1 | ___ | [sí/no] | [no / sí — bullet #___] |
| 2 | ___ | [sí/no] | [no / sí — bullet #___] |
| 3 | ___ | [sí/no] | [no / sí — bullet #___] |
| ... | | | |

VERIFICAR:
- ¿Algún bullet empieza con "Responsible for"?    [sí → FALLA / no]
- ¿Algún bullet empieza con "Helped" o "Assisted"? [sí → BANDERA / no]
- ¿Algún bullet empieza con "Worked on"?           [sí → BANDERA / no]
- ¿Hay verbos repetidos >2 veces?                  [sí → BANDERA / no]
- ¿Los verbos son específicos al dominio (gamedev)? [sí / parcialmente / no]

PASA:  Todos los verbos son de acción, variados, sin "Responsible for"
BAND:  1-2 verbos débiles o 1 repetición
FALLA: Múltiples "Responsible for", verbos pasivos, o mucha repetición
```

### Cuantificación y resultados

```
INSTRUCCIÓN PARA CLAUDE:
Por cada bullet, verificar si tiene un resultado concreto.

| # | Bullet (resumen) | ¿Tiene resultado? | Tipo de resultado |
|---|------------------|-------------------|-------------------|
| 1 | ___ | [sí/no] | [número / entregable / scope / impacto / ninguno] |
| 2 | ___ | [sí/no] | [número / entregable / scope / impacto / ninguno] |
| ... | | | |

TASA DE CUANTIFICACIÓN: ___/___ bullets tienen resultado = ___%

PASA:  ≥80% de bullets tienen algún tipo de resultado concreto
BAND:  50-79% de bullets con resultado
FALLA: <50% — el CV lee como lista de responsabilidades, no logros
```

### Gramática y lenguaje

```
VERIFICAR:
- ¿Hay errores gramaticales?                       [sí — listar / no]
- ¿Hay errores de spelling?                        [sí — listar / no]
- ¿El idioma es consistente? (todo EN o todo ES)   [sí / no — dónde mezcla]
- ¿El tono es profesional sin ser robótico?         [sí / demasiado formal / 
                                                     demasiado casual]
- ¿Hay jerga innecesaria o buzzwords vacíos?        [sí — cuáles / no]
- ¿Los bullets son paralelos en estructura?         [sí / no]
  (todos empiezan con verbo, misma estructura gramatical)

PASA:  Sin errores, tono correcto, estructura paralela
BAND:  1-2 errores menores o inconsistencia de tono
FALLA: Errores gramaticales evidentes o mezcla de idiomas
```

### Formato y longitud

```
VERIFICAR:
- ¿El CV cabe en 1 página? (Regla 8)               [sí / no]
- ¿El spacing es consistente entre secciones?       [sí / no]
- ¿Los bullets tienen longitud similar? (no uno 
  de 3 líneas y otro de 5 palabras)                 [sí / no]
- ¿Las fechas están alineadas y en formato 
  consistente?                                       [sí / no]
- ¿Los headers de sección siguen el mismo estilo?   [sí / no]
- ¿Hay secciones vacías o con solo 1 item?          [sí — cuáles / no]
- ¿El summary es exactamente 3 líneas? (Regla 9)   [sí / no]
- ¿La fuente y tamaño serían legibles en PDF?       [sí / no]

PASA:  Formato limpio, consistente, 1 página, bien espaciado
BAND:  1-2 inconsistencias menores de formato
FALLA: Formato inconsistente, >1 página, o ilegible
```

### Evaluación integral como documento

```
EL EXPERTO EN CV EVALÚA LA PIEZA COMO UN TODO:

¿Este documento podría haber sido escrito por un profesional de 
career coaching?
[ ] Sí — Calidad profesional
[ ] Casi — 1-2 ajustes lo llevarían ahí
[ ] No — Se nota que es amateur

¿Cuál es la debilidad más grande del documento como pieza?
___

¿Cuál es la fortaleza más grande?
___
```

### Ficha de evaluación R7

```
R7 — EXPERTO EN CV
──────────────────────────────────────────────────────────────
Verbos de acción:          [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Verbos problemáticos: ___

Cuantificación (___%):     [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Bullets sin resultado: ___

Gramática / Idioma:        [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Errores: ___

Formato / Longitud:        [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Issues: ___

Estructura paralela:       [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

Professional Summary:      [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  ¿3 líneas dirigidas? ___

Calidad general:           [✅ PASA / ⚠️ BANDERA / ❌ FALLA]
  Nota: ___

¿CALIDAD PROFESIONAL?   [SÍ / CASI / NO]
──────────────────────────────────────────────────────────────
```

---

# RESUMEN DEL PANEL — Template de Presentación

Después de ejecutar las 7 revisiones, Claude consolida y presenta el resultado a David con este formato:

```markdown
## PANEL DE 7 REVISORES — [Empresa] — [Rol]

### Dashboard rápido

| # | Revisor | Veredicto | Pide entrevista | Issues |
|---|---------|-----------|-----------------|--------|
| R1 | Hiring Manager | ✅/⚠️/❌ | [Sí/Prob./No] | ___ |
| R2 | Recruiter | ✅/⚠️/❌ | [Sí/Reserv./No] | ___ |
| R3 | RRHH | ✅/⚠️/❌ | [Sí/Verif./No] | ___ |
| R4 | Peers | ✅/⚠️/❌ | [Sí/Reserv./No] | ___ |
| R5 | VP/Director | ✅/⚠️/❌ | [Sí/Datos/No] | ___ |
| R6 | David | ✅/⚠️/❌ | [Sí/Ajustes/No] | ___ |
| R7 | Experto CV | ✅/⚠️/❌ | [Sí/Casi/No] | ___ |

### Conteo

```
Total PASA:     ___/7 revisores con luz verde completa
Total BANDERA:  ___ banderas en total (máximo permitido: 3)
Total FALLA:    ___ fallas en total (máximo permitido: 0)
```

### FALLAS (corregir obligatoriamente)

| Revisor | Sección | Problema | Corrección requerida |
|---------|---------|----------|---------------------|
| R_ | ___ | ___ | ___ |

### BANDERAS (corregir si es posible)

| Revisor | Sección | Problema | Mejora sugerida | Prioridad |
|---------|---------|----------|-----------------|-----------|
| R_ | ___ | ___ | ___ | [Alta/Media/Baja] |

### Fortaleza principal del CV
___

### Debilidad principal del CV
___

### Veredicto del panel

[ ] ✅ LISTO PARA ENVÍO — 0 fallas, ≤3 banderas, R1 y R2 limpios
[ ] ⚠️ NECESITA ITERACIÓN MENOR — 0 fallas pero >3 banderas o bandera en R1/R2
[ ] ❌ NECESITA ITERACIÓN MAYOR — 1+ fallas, requiere reescritura parcial
[ ] 🔄 VOLVER A FASE 4A — Problemas estructurales que no se resuelven con edición
```

---

## FLUJO POST-PANEL

```
SI EL VEREDICTO ES "LISTO PARA ENVÍO":
→ David revisa el dashboard
→ David confirma o pide ajustes menores
→ CV se mueve a la carpeta de deliverables final
→ Continuar con Cover Letter y Dossier

SI EL VEREDICTO ES "ITERACIÓN MENOR":
→ Claude aplica las correcciones de banderas
→ RE-PASAR solo los revisores afectados (no los 7)
→ Máximo 1 ronda adicional

SI EL VEREDICTO ES "ITERACIÓN MAYOR":
→ Claude aplica las correcciones de fallas
→ RE-PASAR los 7 revisores completos
→ Máximo 1 ronda adicional
→ Si después de 2 rondas sigue fallando → Revisar premisas de Fase 4A

SI EL VEREDICTO ES "VOLVER A FASE 4A":
→ El problema no es de edición sino de selección de contenido
→ Revisar: ¿Se eligieron los logros correctos? ¿La identidad es la adecuada?
→ Reconstruir el CV desde cero con diferente selección
```

---

## CHECKLIST DE COMPLETITUD

```
EJECUCIÓN DEL PANEL:
[ ] R1 — Hiring Manager ejecutado (test de 6 seg + 5 secciones)
[ ] R2 — Recruiter ejecutado (ATS + keywords + claridad + 4 secciones)
[ ] R3 — RRHH ejecutado (gaps + hopping + visa + consistencia + 3 secciones)
[ ] R4 — Peers ejecutado (credibilidad + terminología + nivel + 4 secciones)
[ ] R5 — VP/Director ejecutado (impacto + ROI + 3 secciones)
[ ] R6 — David ejecutado (precisión + orgullo + reflejo + 3 secciones)
[ ] R7 — Experto ejecutado (verbos + cuantificación + gramática + formato + 3 secciones)

CONSOLIDACIÓN:
[ ] Dashboard rápido completado
[ ] Conteo de PASA/BANDERA/FALLA verificado
[ ] Fallas listadas con correcciones requeridas
[ ] Banderas priorizadas
[ ] Veredicto del panel asignado
[ ] Resumen presentado a David

POST-PANEL:
[ ] Correcciones aplicadas (si aplica)
[ ] Re-revisión ejecutada (si aplica)
[ ] CV final aprobado
[ ] review-panel-[Empresa].md guardado en 04-deliverables/
```

---

*Protocolo de la Fase 4B — Panel de 7 Revisores. Parte del Job Pursuit Framework de David Sanchez.*  
*Creado: 2026-04-13*
