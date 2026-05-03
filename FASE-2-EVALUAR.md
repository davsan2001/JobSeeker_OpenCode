# FASE 2: EVALUAR — Sistema de 6 Perspectivas
## Job Pursuit Framework — David Sanchez

> **Documento:** Expansión operativa de la Fase 2 del JOB-PURSUIT-FRAMEWORK.md  
> **Input requerido:** `applications/[Nombre-Empresa]/01-informe-inteligencia.md` (completado en Fase 1)  
> **Output:** `applications/[Nombre-Empresa]/02-análisis-perspectivas.md`  
> **Versión:** 1.0  
> **Fecha:** 2026-04-13  
> **Tiempo estimado:** 20-30 minutos por empresa

---

## PROPÓSITO DE ESTA FASE

La Fase 1 te dio datos. La Fase 2 te da perspectiva.

El peligro más grande en una búsqueda de empleo no es aplicar a un mal trabajo — es aplicar a uno mediocre creyendo que es bueno porque quieres que lo sea. El sesgo de confirmación es el enemigo. Cuando llevas semanas buscando y aparece una oferta que "más o menos encaja," tu cerebro empieza a racionalizar: "bueno, no piden exactamente UE5 pero seguro usan algo similar," "el salario está un poco bajo pero lo compensaré con experiencia."

El sistema de 6 perspectivas elimina eso. Te obliga a evaluar la misma oportunidad desde seis pares de ojos distintos, cada uno con motivaciones, preocupaciones y estándares diferentes. Si la oportunidad es buena, sobrevivirá a las seis. Si no lo es, al menos una perspectiva lo expondrá.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LAS 6 PERSPECTIVAS                               │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │ P1       │ │ P2       │ │ P3       │                            │
│  │ HIRING   │ │ RECRUITER│ │ RRHH     │                            │
│  │ MANAGER  │ │          │ │          │                            │
│  │ "¿Lo     │ │ "¿Lo     │ │ "¿Es     │                            │
│  │ contrato │ │ presento │ │ seguro   │                            │
│  │ para MI  │ │ con      │ │ contra-  │                            │
│  │ equipo?" │ │ confian- │ │ tarlo?"  │                            │
│  │          │ │ za?"     │ │          │                            │
│  └──────────┘ └──────────┘ └──────────┘                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │ P4       │ │ P5       │ │ P6       │                            │
│  │ PEERS    │ │ VP/      │ │ DAVID    │                            │
│  │          │ │ DIRECTOR │ │          │                            │
│  │ "¿Quiero │ │ "¿Mueve  │ │ "¿Esto   │                            │
│  │ trabajar │ │ mis      │ │ es       │                            │
│  │ junto a  │ │ números?"│ │ correcto │                            │
│  │ David?"  │ │          │ │ para     │                            │
│  │          │ │          │ │ MÍ?"     │                            │
│  └──────────┘ └──────────┘ └──────────┘                            │
│                                                                     │
│  Score final = Promedio ponderado de las 6 perspectivas             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ANTES DE EMPEZAR

Abre el `01-informe-inteligencia.md` de esta empresa. Todo lo que necesitas para evaluar debería estar ahí. Si durante la evaluación descubres que te falta un dato crítico, regresa a la Fase 1 y complétalo — no evalúes con huecos.

Necesitas tener claro:
- Los requirements duros del rol y el match técnico de David
- Quién es el hiring manager y su background
- La salud y cultura del estudio
- La compensación estimada
- Los peers del equipo

---

# PERSPECTIVA 1: HIRING MANAGER

## "¿Contrato a David Sanchez para MI equipo?"

**Ponte en los zapatos de:** La persona identificada en Protocolo B.1 — el lead, tech director o engineering manager que va a trabajar día a día con quien contrate. Esta persona tiene un proyecto que entregar, un equipo con gaps, y un deadline que se acerca.

---

### 1A — ¿Su experiencia coincide con mis necesidades?

**Mapeo directo requirement → evidencia:**

| Requirement del rol | Lo que David puede demostrar | Fuerza de la evidencia |
|---------------------|------------------------------|------------------------|
| ___ | ___ | [Fuerte / Moderada / Débil / Inexistente] |
| ___ | ___ | [Fuerte / Moderada / Débil / Inexistente] |
| ___ | ___ | [Fuerte / Moderada / Débil / Inexistente] |
| ___ | ___ | [Fuerte / Moderada / Débil / Inexistente] |
| ___ | ___ | [Fuerte / Moderada / Débil / Inexistente] |

**Criterio de fuerza de evidencia:**
```
FUERTE    = Experiencia profesional directa con resultados demostrables
MODERADA  = Proyecto propio/académico que demuestra la competencia, o experiencia 
            profesional adyacente
DÉBIL     = Ha estudiado/certificado el tema pero sin aplicación real significativa
INEXISTENTE = No hay evidencia de esta competencia
```

**Para David específicamente, considerar estas equivalencias:**
- "Experiencia profesional en UE5" → CIPP (migración Unity→UE5, sistemas interactivos) + Tactical MP Cover System
- "Shipped title" → ECHO-EMOTION fue completado y testeado con usuarios reales (no es un título comercial, pero es un producto terminado)
- "Multiplayer experience" → Tactical MP Cover System (funcional, con netcode)
- "AI programming" → Behavior Trees implementados en C++ (Tactical MP)
- "Animation programming" → State Machines, Blend Spaces en C++ (Tactical MP)

### 1B — ¿Puede demostrar resultados medibles?

Un hiring manager no quiere escuchar "soy bueno en UE5." Quiere evidencia. Evaluar qué puede demostrar David:

```
RESULTADOS CUANTIFICABLES QUE DAVID TIENE:
[ ] Migración Unity → UE5 completada manteniendo feature parity (CIPP)
[ ] Sistema de virtualización de isla diseñado y planificado de inicio a fin (CIPP)
[ ] Tour virtual de acuario funcional entregado (CIPP)
[ ] Experiencia VR completa con user testing y datos de respuesta emocional (ECHO)
[ ] Sistema de cover + multiplayer funcional con AI enemiga (Tactical MP)
[ ] Sistemas de animación en C++ (State Machines, Blend Spaces) funcionando (Tactical MP)
[ ] Localización ES/EN implementada con UI responsivo (CIPP)

RESULTADOS QUE DAVID NO TIENE (y debe ser honesto):
[ ] Métricas de performance (FPS mejorados, memory optimizations con números)
[ ] Revenue impact o métricas de negocio
[ ] Escala (usuarios concurrentes, tamaño de mundo, etc.)
[ ] Título publicado en stores (Steam, consolas, etc.)
```

### 1C — ¿Qué me preocuparía como Hiring Manager?

Ser brutalmente honesto. Estas son las preguntas que el HM se haría:

```
PREOCUPACIÓN                              MITIGACIÓN QUE DAVID PUEDE OFRECER
────────────────────────────────────────────────────────────────────────────────
"No tiene shipped titles comerciales"     Tiene proyectos terminados y testeados 
                                          con usuarios reales. Código disponible 
                                          en portfolio.

"Solo ~1 año de experiencia profesional"  Ritmo acelerado de aprendizaje: thesis 
                                          en VR, proyecto MP propio, certificaciones 
                                          continuas. Puede ejecutar from day one.

"Está en Colombia, ¿timezone?"            C1 de inglés, disponible para ajustar 
                                          horario a timezone del estudio, experiencia 
                                          trabajando en equipo distribuido (CIPP).

"¿Puede trabajar con código legacy o      Demostró adaptabilidad al hacer la migración
 un codebase grande?"                     Unity→UE5 — no solo nuevo código sino 
                                          adaptar sistemas existentes.

"¿Necesitará mucha supervisión?"          Lideró la planificación conceptual del 
                                          proyecto de isla en CIPP. Gestionó proyectos 
                                          propios con metodología SCRUM.

[PREOCUPACIÓN ESPECÍFICA DEL ROL]        [MITIGACIÓN ESPECÍFICA]
```

### 1D — ¿Qué preguntas me haría en la entrevista?

Anticipar las preguntas que este HM haría basándose en su background:

```
SI EL HM ES TÉCNICO (viene de programación):
1. "Walk me through your C++ animation system implementation" 
   → David debe poder explicar State Machines y Blend Spaces en detalle
2. "How did you handle multiplayer replication in your cover system?"
   → David debe conocer su propia implementación de netcode
3. "What's the most complex performance issue you've debugged in UE5?"
   → David debe tener un ejemplo concreto preparado

SI EL HM ES DE PRODUCCIÓN/MANAGEMENT:
1. "How do you estimate and track your work?"
   → David puede hablar de su experiencia con SCRUM
2. "Tell me about a time you had to adapt to a major change mid-project"
   → La migración Unity→UE5 es la respuesta perfecta
3. "How do you handle feedback on your work?"
   → David puede referirse a la iteración basada en user testing (ECHO)

PREGUNTAS PROBABLES PARA ESTE ROL ESPECÍFICO:
1. ___
2. ___
3. ___
```

### 1E — Score del Hiring Manager

```
EVALUACIÓN FINAL — PERSPECTIVA HIRING MANAGER

¿La experiencia cubre los requirements principales?      ___/10
¿Puede demostrar resultados concretos?                   ___/10
¿Las preocupaciones tienen mitigación creíble?            ___/10
¿Sobreviviría una entrevista técnica/behavioral?          ___/10
                                                         ────────
PROMEDIO PERSPECTIVA 1:                                  ___/10

NOTA CLAVE: ________________________________________________
(Una línea con la conclusión más importante de esta perspectiva)
```

---

# PERSPECTIVA 2: RECRUITER

## "¿Puedo presentar a David Sanchez con confianza?"

**Ponte en los zapatos de:** Un recruiter que tiene 200 aplicaciones para filtrar y necesita presentar 5-8 candidatos al hiring manager. Tiene ~30 segundos por CV en el primer pass y un ATS que pre-filtra por keywords.

---

### 2A — ¿Su CV pasa el screening ATS?

El ATS (Applicant Tracking System) busca keywords exactas. Si el CV de David no las tiene, el recruiter nunca lo verá.

**Test de keywords del ATS:**

| Keyword de la oferta | ¿Aparece en el CV de David? | ¿Aparecería en el CV dirigido? |
|----------------------|-----------------------------|-------------------------------|
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |
| ___ | [sí/no] | [sí — naturalmente / sí — hay que agregar / no — no aplica] |

**Tasa de match de keywords:** ___% de keywords presentes → ___% tras adaptar CV

```
REGLA ATS:
> 80% keywords match  → Alta probabilidad de pasar el filtro automático
60-80% keywords match → Depende de cuántos aplicaron — puede pasar
< 60% keywords match  → Probablemente filtrado antes de que un humano lo vea
```

### 2B — ¿Pasa el test de los 30 segundos?

Un recruiter humano mira el CV en este orden y toma una decisión en medio minuto:

```
SEGUNDO 1-5: HEADER
¿El título del CV comunica el rol correctamente?
- Título actual de David: "Multimedia Engineer"
- ¿Debería adaptarse para esta oferta a algo como 
  "Gameplay Programmer" o "Game Developer"?                    [sí/no]
- Título sugerido para esta oferta: ___

SEGUNDO 5-10: EXPERIENCIA MÁS RECIENTE
¿El primer bullet de la experiencia más reciente es relevante para el rol?
- Primer bullet actual: "Led conceptual design and planning..."
- ¿Es relevante para esta oferta?                              [sí/no]
- ¿Debería reordenarse para mostrar algo más técnico primero?  [sí/no]
- Bullet sugerido como primero: ___

SEGUNDO 10-20: SKILLS SCAN
¿El recruiter ve inmediatamente las tecnologías que busca?
- ¿UE5/Unreal Engine es visible en los primeros 3 items?      [sí/no]
- ¿C++ es visible de inmediato?                                [sí/no]
- ¿Las skills específicas del rol aparecen arriba?             [sí/no]

SEGUNDO 20-30: RED FLAG SCAN
¿Algo levanta una alarma rápida?
- ¿Hay gaps de empleo visibles?                                [sí/no]
- ¿Los títulos de trabajo hacen sentido progresivo?            [sí/no]
- ¿La ubicación (Colombia) podría ser un dealbreaker?          [sí/no — investigar 
                                                                si aceptan remoto LATAM]
```

### 2C — ¿El recruiter puede "venderlo" al Hiring Manager?

Cuando un recruiter pasa un CV al HM, necesita un "pitch" de una línea. Evaluar:

```
PITCH QUE EL RECRUITER PODRÍA HACER:
"David es un _______________________________________________
 _________________________________________________________"

¿Es un pitch fuerte?
[ ] Sí — Hay un gancho claro que diferencia a David
[ ] Parcial — Tiene lo básico pero nada que destaque
[ ] No — Suena genérico, indistinguible de otros candidatos

GANCHOS QUE EL RECRUITER PODRÍA USAR:
[ ] "Tiene experiencia cruzada Unity-UE5, hizo una migración completa"
[ ] "Hizo una VR horror experience como thesis con user testing real"
[ ] "Tiene multiplayer + AI + animation systems en C++ en un solo proyecto"
[ ] "Es remoto en LATAM, costo competitivo, inglés C1"
[ ] [Gancho específico para este rol]: ___
```

### 2D — Score del Recruiter

```
EVALUACIÓN FINAL — PERSPECTIVA RECRUITER

¿El CV pasa el filtro ATS? (keywords)                    ___/10
¿Pasa el test de los 30 segundos?                        ___/10
¿El recruiter tiene un "pitch" claro para el HM?         ___/10
¿El perfil de LinkedIn respalda el CV?                    ___/10
                                                         ────────
PROMEDIO PERSPECTIVA 2:                                  ___/10

NOTA CLAVE: ________________________________________________
ACCIÓN REQUERIDA PARA CV: __________________________________
```

---

# PERSPECTIVA 3: RRHH (Recursos Humanos)

## "¿Es David Sanchez una contratación segura?"

**Ponte en los zapatos de:** El departamento de RRHH que evalúa riesgo, compliance, logística de contratación y red flags legales. No les importa si David sabe C++ — les importa si contratarlo creará problemas.

---

### 3A — Análisis de Red Flags de RRHH

```
REVISIÓN DE HISTORIAL LABORAL:

¿Hay gaps de empleo?
- Dic 2024 (graduación) → May 2025 (inicio CIPP) = ~5 meses
  → Interpretación: Período normal post-graduación, no es red flag
- ¿Otros gaps?: ___
- ¿Algún gap >6 meses sin explicación?: [sí/no]

¿Hay job-hopping? (múltiples empleos <1 año)
- David tiene 1 empleo profesional (CIPP, ~11 meses al momento)
  → No hay patrón de job-hopping
  → Nota: Al ser su primer empleo profesional, RRHH podría 
    cuestionar compromiso a largo plazo

¿Hay inconsistencias visibles?
- ¿Fechas del CV coinciden con LinkedIn?                    [verificar]
- ¿Los títulos en CV coinciden con LinkedIn?                [verificar]
- ¿La educación es verificable?                             [sí — UAO es universidad 
                                                             reconocida en Colombia]
```

### 3B — Viabilidad Logística de Contratación

Esta es la evaluación más crítica para David dado que aplica desde Colombia:

```
MODALIDAD DE CONTRATACIÓN:

¿El estudio contrata remotos internacionales?              [sí / no / desconocido]
¿Tienen entidad legal en Colombia?                         [sí / no / probablemente no]
¿Usan EOR (Employer of Record) como Deel, Remote, etc.?   [sí / no / desconocido]
¿Aceptan contractors/freelancers?                          [sí / no / desconocido]

ESCENARIO MÁS PROBABLE:
[ ] Contratación directa (el estudio tiene entidad en Colombia)
[ ] A través de EOR (Deel, Remote, Oyster, etc.)
[ ] Como contractor independiente (factura mensual)
[ ] Requiere visa/reubicación (David tiene pasaporte, evaluable)
[ ] No viable — el estudio solo contrata localmente

IMPLICACIONES PARA DAVID:
- Si es contractor: David necesita estar al día con su situación 
  fiscal en Colombia (RUT, facturación electrónica)
- Si requiere reubicación: David tiene pasaporte pero necesitaría 
  visa de trabajo (proceso varía por país)
- Si es EOR: Generalmente seamless, el EOR maneja todo

RIESGO PARA RRHH:          [bajo / medio / alto]
COMPLEJIDAD LOGÍSTICA:      [baja / media / alta]
```

### 3C — Background Check y Verificación

```
¿QUÉ PODRÍA VERIFICAR RRHH?

Educación:
- Universidad Autónoma de Occidente — Verificable          ✅
- IETI Antonio José Camacho — Verificable                 ✅
- Certificaciones Udemy/IxDF/Platzi — Verificable online   ✅

Empleo anterior:
- CIPP / Fundación Universidad del Valle — Verificable     ✅
- ¿David tiene carta laboral o contacto de referencia?     [sí/no — obtener]

Referencias:
- ¿Tiene al menos 2 referencias profesionales preparadas?  [sí/no]
- ¿Tiene al menos 1 referencia académica?                  [sí/no]

Presencia online:
- Portfolio: davidrapiidz.wixsite.com                      [activo / desactualizado]
- LinkedIn: linkedin.com/in/daeevys                        [completo / necesita update]
- GitHub: ¿tiene repos públicos de sus proyectos?          [sí/no — CRÍTICO para gamedev]

¿HAY ALGO QUE PODRÍA SALIR MAL EN UN BACKGROUND CHECK?    [sí — qué / no]
```

### 3D — Score de RRHH

```
EVALUACIÓN FINAL — PERSPECTIVA RRHH

¿El historial laboral es limpio y consistente?              ___/10
¿La contratación es logísticamente viable?                  ___/10
¿Pasa un background check sin problemas?                    ___/10
¿Las referencias y educación son verificables?               ___/10
                                                            ────────
PROMEDIO PERSPECTIVA 3:                                     ___/10

NOTA CLAVE: ________________________________________________
BLOCKER LOGÍSTICO (si existe): _____________________________
```

---

# PERSPECTIVA 4: PEERS (Compañeros de Equipo)

## "¿Querría trabajar junto a David Sanchez?"

**Ponte en los zapatos de:** Los programadores del equipo identificados en el Protocolo B.3. Son quienes van a revisar el código de David, pair-programar con él, y depender de su output día a día. No les importan los títulos — les importa si sabe lo que dice saber.

---

### 4A — ¿Su experiencia es creíble para un peer técnico?

```
UN PEER DE ESTE EQUIPO EVALUARÍA:

¿Su portfolio demuestra competencia real en el motor?
- ¿Hay código visible (GitHub repos)?                     [sí/no]
- ¿Los proyectos del portfolio son funcionales o solo mockups? [funcionales / mockups]
- ¿Hay video demos de los proyectos?                      [sí/no]
- ¿El código que se ve (si es público) tiene calidad aceptable? [sí/no/no visible]

¿La profundidad técnica resiste escrutinio?
- Si David dice "Animation systems en C++ con State Machines y Blend Spaces"
  → ¿Un senior de UE5 le haría follow-up questions que David pueda responder?
  → ¿David puede hablar de los tradeoffs de su implementación?
  → ¿Conoce alternativas a lo que implementó y por qué eligió su approach?

¿Tiene el "lenguaje" de un game programmer real?
- ¿Usa terminología correcta de UE5? (ActorComponents, GameplayAbilities, 
  Subsystems, Enhanced Input, etc.)
- ¿Puede hablar de performance (tick budgets, profiling, GC pressure)?
- ¿Entiende pipelines de assets y collaboration workflows (Perforce, etc.)?
```

### 4B — ¿Sería un buen compañero de equipo?

```
SEÑALES DE COLABORACIÓN EN EL PERFIL DE DAVID:

Positivas:
[ ] Trabajó en equipo en CIPP (no fue solo developer)
[ ] Experiencia con SCRUM/Agile (sabe trabajar con proceso)
[ ] Inglés C1 (puede comunicarse efectivamente)
[ ] Soft skills declaradas: Leadership, Problem Solving, Communication
[ ] Experiencia con Version Control compartido (GitHub, Helix Core)

A evaluar:
[ ] ¿Ha contribuido a proyectos open source? (señal fuerte de colaboración)
[ ] ¿Tiene actividad en comunidades de desarrollo? (Discord, foros, etc.)
[ ] ¿Ha hecho code reviews o mentorado a alguien?
[ ] ¿Sus proyectos tienen commits limpios con buenos mensajes?
```

### 4C — ¿Cómo compara con el nivel del equipo?

```
CALIBRACIÓN DE SENIORITY:

Nivel del equipo (del Protocolo B.3):
- Seniority promedio del equipo: [Junior / Mid / Senior / Mixed]
- Años de experiencia promedio estimados: ___

Nivel de David:
- Experiencia profesional: ~1 año
- Experiencia total (incluyendo proyectos): ~2-3 años
- Seniority real estimado: Junior con tendencia a Mid

¿ENCAJA?
[ ] David sería el más junior del equipo → Necesita ambiente de mentoring
[ ] David estaría al nivel promedio → Encaja naturalmente
[ ] David sería de los más senior → Raro para su experiencia, verificar el equipo
[ ] El equipo es demasiado senior para David → Podría sentirse overwhelmed
[ ] El equipo necesita justamente un junior/mid → David llena el gap
```

### 4D — Score de Peers

```
EVALUACIÓN FINAL — PERSPECTIVA PEERS

¿La experiencia técnica es creíble y verificable?           ___/10
¿Sería un buen compañero de equipo?                         ___/10
¿Su nivel encaja con la composición del equipo?             ___/10
¿Trae algo al equipo que no tienen actualmente?             ___/10
                                                            ────────
PROMEDIO PERSPECTIVA 4:                                     ___/10

NOTA CLAVE: ________________________________________________
DEBILIDAD TÉCNICA A PREPARAR: ______________________________
```

---

# PERSPECTIVA 5: VP/DIRECTOR

## "¿Contratar a David Sanchez mueve mis números?"

**Ponte en los zapatos de:** El VP de Development, Studio Director o Director de Ingeniería que aprueba headcount. Esta persona piensa en presupuesto, velocity del equipo, ROI de cada contratación, y cumplimiento de milestones.

---

### 5A — ¿Impacto en el proyecto/producto?

```
PREGUNTA CENTRAL: ¿Cómo acelera David la entrega del producto actual?

CONTRIBUCIÓN DIRECTA AL PROYECTO:
- ¿David puede contribuir al juego/proyecto en desarrollo?     [sí/no/parcialmente]
- ¿En qué área específica? (gameplay, AI, animation, UI, etc.) ___
- ¿Cuánto tiempo de ramp-up estimado antes de ser productivo?  [2 semanas / 1 mes / 
                                                                 2 meses / 3+ meses]
- ¿Puede asumir tareas desde el día 1 o necesita onboarding extenso? ___

COSTO VS. VALOR:
- Salario estimado de David: $1,300-$1,500 USD/mes = $15,600-$18,000/año
- ¿Cuánto cuesta un developer comparable en la ubicación del estudio?
  → Si estudio está en USA: $60,000-$90,000/año para junior-mid
  → Si estudio está en Europa: $35,000-$55,000/año para junior-mid
  → Si estudio está en LATAM: $18,000-$25,000/año para junior-mid
- Ratio de ahorro: ___x más barato que un local (si aplica)
- ¿Este ahorro es un factor en la decisión? [sí — significativo / sí — menor / no]
```

### 5B — ¿Impacto en velocity del equipo?

```
SI EL EQUIPO TIENE UN BOTTLENECK, ¿DAVID LO RESUELVE?

Bottlenecks comunes en equipos de gamedev:
[ ] Falta de manos para gameplay features → David puede ejecutar
[ ] Nadie que haga animation programming en C++ → David tiene esta skill
[ ] Necesitan alguien que maneje AI/Behavior Trees → David tiene experiencia
[ ] Necesitan cubrir un turno en timezone de las Américas → David está en GMT-5
[ ] El equipo está en crunch por falta de headcount → David alivia la carga

¿DAVID GENERA OVERHEAD?
- ¿Necesita un senior que lo supervise?           [sí — parcial / sí — significativo / no]
- ¿Cuánto tiempo de senior se consume en mentoring? [bajo / medio / alto]
- ¿El net output (contribución - overhead) es positivo? [sí / borderline / no]
```

### 5C — ¿Riesgo para el Director?

```
EVALUACIÓN DE RIESGO:

Riesgo de retención:
- David está buscando su primera oportunidad internacional
- ¿Se quedará >1 año o usará esto como trampolín?             [probablemente se queda / 
                                                                riesgo de salir pronto]
- Costo de reemplazar si se va en <6 meses: [alto / medio / bajo]

Riesgo de performance:
- Sin track record en un estudio comercial                     [riesgo medio]
- Pero tiene proyectos terminados y testeados                  [mitigante]
- ¿Hay un período de prueba que reduzca el riesgo?             [sí/no/desconocido]

Riesgo operativo:
- Diferencia horaria con el equipo: ___ horas
- ¿Overlap de horas de trabajo suficiente? (mínimo 4h)        [sí/no]
- ¿Internet en Cali es confiable para trabajo remoto?          [sí — Colombia tiene 
                                                                buena infraestructura 
                                                                en ciudades principales]
```

### 5D — Score del VP/Director

```
EVALUACIÓN FINAL — PERSPECTIVA VP/DIRECTOR

¿David acelera la entrega del producto?                     ___/10
¿El costo-valor es atractivo?                               ___/10
¿El riesgo de la contratación es manejable?                 ___/10
¿La contratación cumple una necesidad estratégica del equipo? ___/10
                                                            ────────
PROMEDIO PERSPECTIVA 5:                                     ___/10

NOTA CLAVE: ________________________________________________
ARGUMENTO DE ROI EN 1 LÍNEA: _______________________________
```

---

# PERSPECTIVA 6: DAVID SANCHEZ

## "¿Esto es realmente correcto para MÍ?"

**Ponte en TUS propios zapatos.** Esta es la perspectiva más importante y la que más se ignora cuando uno tiene urgencia de encontrar trabajo. No todas las oportunidades que te quieren son oportunidades que te convienen.

---

### 6A — ¿Este rol avanza mis metas de carrera?

```
METAS DE DAVID A 3 AÑOS (definir o confirmar):
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

¿ESTE ROL MUEVE LA AGUJA?
                                                    CONTRIBUCIÓN (1-5)
Meta 1: ___                                         ___
Meta 2: ___                                         ___
Meta 3: ___                                         ___

SKILLS QUE VOY A DESARROLLAR AQUÍ:
[ ] Trabajar en un codebase grande y profesional
[ ] Shipped title para mi CV
[ ] Experiencia con pipelines de producción AAA/AA
[ ] Networking en la industria internacional
[ ] [Skill técnica específica]: ___
[ ] [Skill técnica específica]: ___

SKILLS QUE NO VOY A DESARROLLAR AQUÍ:
[ ] ___
[ ] ___

¿EN 2 AÑOS, ESTE ROL ME HACE MÁS CONTRATRABLE PARA MI SIGUIENTE PASO?
[ ] Significativamente — Abre puertas a estudios y roles mejores
[ ] Moderadamente — Suma experiencia pero no transforma mi perfil
[ ] Poco — Es más de lo mismo que ya tengo
[ ] Negativamente — Podría encasillarme en un nicho que no quiero
```

### 6B — ¿El día a día me va a satisfacer?

```
REALIDAD DIARIA DEL ROL (inferir del job posting + research):

¿Qué haré la mayor parte del tiempo?
- ___% gameplay programming
- ___% debugging/fixing
- ___% meetings/communication
- ___% tooling/infrastructure
- ___% otros: ___

¿ESO ME EMOCIONA?
Las cosas que más disfruto hacer:
1. ___
2. ___
3. ___

Las cosas que tolero pero no disfruto:
1. ___
2. ___

Las cosas que odiaría hacer todo el día:
1. ___
2. ___

MATCH DE SATISFACCIÓN DIARIA: ___/10
```

### 6C — ¿La compensación y condiciones cubren mis necesidades?

```
EVALUACIÓN FINANCIERA:

Compensación estimada:                              $___/mes
Gastos mensuales de David (estimación):             $___/mes
Diferencia (ahorro potencial):                      $___/mes
¿Es sostenible sin estrés financiero?               [sí / justo / no]

COMPENSACIÓN NO MONETARIA:
- ¿Ofrece equity/stock options?                     [sí/no]
- ¿Tiene bonus anual?                               [sí/no/desconocido]
- ¿Cubre salud/seguros?                             [sí/no/parcial]
- ¿Learning budget / conferencias?                   [sí/no]
- ¿Hardware/setup remoto?                            [sí/no]
- ¿Vacaciones? ¿Cuántos días?                       [___ días]

COMPARACIÓN CON SITUACIÓN ACTUAL (CIPP):
- ¿Paga más que mi trabajo actual?                   [sí/no]
- ¿Mejor balance vida-trabajo?                       [sí/no/igual]
- ¿Mejor proyección profesional?                     [sí/no/igual]
- ¿Vale la pena el cambio considerando el riesgo?   [definitivamente / probablemente / 
                                                      dudoso / no]
```

### 6D — Test del Domingo por la Noche

```
IMAGINA: Es domingo a las 10pm. Mañana empiezas tu semana en este trabajo.

¿Cómo me siento?
[ ] Emocionado — Quiero que sea lunes ya
[ ] Tranquilo — Es un buen trabajo, estoy contento
[ ] Neutral — Es un trabajo, no más
[ ] Ansioso — No estoy seguro de que sea lo correcto
[ ] Con dread — No quiero que llegue el lunes

¿Por qué me siento así?
_______________________________________________________________
_______________________________________________________________
```

### 6E — Score de David

```
EVALUACIÓN FINAL — PERSPECTIVA DAVID

¿Este rol avanza mis metas de carrera a 3 años?            ___/10
¿El día a día me va a satisfacer?                           ___/10
¿La compensación cubre mis necesidades sin estrés?          ___/10
¿El "test del domingo por la noche" es positivo?            ___/10
                                                            ────────
PROMEDIO PERSPECTIVA 6:                                     ___/10

NOTA CLAVE: ________________________________________________
DEAL-BREAKER PERSONAL (si existe): _________________________
```

---

# CONSOLIDACIÓN: SCORECARD DE 6 PERSPECTIVAS

## Tabla de puntuación final

```
┌────────────────────────────────────────────────────────────────────┐
│              SCORECARD DE 6 PERSPECTIVAS                           │
│              Empresa: [Nombre]                                     │
│              Rol: [Título]                                         │
│              Fecha: YYYY-MM-DD                                     │
├──────┬───────────────────────┬───────┬────────┬────────────────────┤
│  #   │ PERSPECTIVA           │ PESO  │ SCORE  │ PONDERADO          │
├──────┼───────────────────────┼───────┼────────┼────────────────────┤
│  P1  │ Hiring Manager        │  25%  │ __/10  │ ___                │
│  P2  │ Recruiter             │  15%  │ __/10  │ ___                │
│  P3  │ RRHH                  │  10%  │ __/10  │ ___                │
│  P4  │ Peers                 │  20%  │ __/10  │ ___                │
│  P5  │ VP/Director           │  15%  │ __/10  │ ___                │
│  P6  │ David                 │  15%  │ __/10  │ ___                │
├──────┼───────────────────────┼───────┼────────┼────────────────────┤
│      │ SCORE TOTAL           │ 100%  │        │ ___/10             │
└──────┴───────────────────────┴───────┴────────┴────────────────────┘
```

**Justificación de pesos:**
- **Hiring Manager (25%):** Es la decisión de mayor peso — si el HM no quiere a David, nada más importa.
- **Peers (20%):** En gamedev, la evaluación técnica de los pares es crucial. Si el equipo no lo respalda, el HM duda.
- **Recruiter (15%):** Si el CV no pasa el filtro del recruiter, las demás perspectivas son irrelevantes.
- **VP/Director (15%):** Aprueba headcount y presupuesto — puede vetar incluso si el HM quiere a David.
- **David (15%):** La satisfacción propia es igualmente importante — un trabajo que no te conviene no dura.
- **RRHH (10%):** Peso menor porque es más binario (viable o no) que gradual, pero un blocker logístico mata todo.

---

## Reglas de interpretación

```
SCORE TOTAL    INTERPRETACIÓN                          ACCIÓN
──────────────────────────────────────────────────────────────────
8.0 - 10.0     MATCH EXCEPCIONAL                       → FASE 3 inmediata como 
                                                          GO FUERTE probable
6.5 - 7.9      MATCH SÓLIDO                            → FASE 3 como GO 
                                                          CONDICIONAL probable
5.0 - 6.4      MATCH PARCIAL                           → Evaluar si vale la 
                                                          pena la inversión
3.5 - 4.9      MATCH DÉBIL                             → Probablemente HOLD, 
                                                          solo si no hay mejores
0.0 - 3.4      NO HAY MATCH                            → NO-GO, no invertir 
                                                          más tiempo
```

## Alertas por perspectiva individual

Independientemente del score total, presta atención a:

```
VETOS AUTOMÁTICOS (cualquier perspectiva ≤ 3/10):
- Si P1 (HM) ≤ 3 → El hiring manager no te querría. No apliques.
- Si P2 (Recruiter) ≤ 3 → Tu CV no pasará el filtro. Reescribir o no aplicar.
- Si P3 (RRHH) ≤ 3 → Hay un blocker logístico. Resolver antes de continuar.
- Si P6 (David) ≤ 3 → TÚ no quieres esto. No te fuerces.

ALERTAS AMARILLAS (cualquier perspectiva ≤ 5/10):
- Si P4 (Peers) ≤ 5 → Tu nivel técnico podría no encajar. Prepara extra.
- Si P5 (VP) ≤ 5 → La empresa podría no ver ROI. Necesitas un pitch fuerte.
```

## Diagnóstico de gaps

```
PERSPECTIVA MÁS ALTA: P___ (___/10)
→ Tu mayor fortaleza para esta aplicación: ___

PERSPECTIVA MÁS BAJA: P___ (___/10)
→ Tu mayor debilidad para esta aplicación: ___

GAP ENTRE MÁS ALTA Y MÁS BAJA: ___ puntos
→ Si gap > 4 puntos: Hay una desconexión seria. La fortaleza en un área 
  no compensa la debilidad en otra. Investigar más.

¿SE PUEDE CERRAR EL GAP?
[ ] Sí — Con ajuste de CV y preparación específica
[ ] Parcialmente — Es un gap real pero no un dealbreaker
[ ] No — Es un gap estructural (experiencia, ubicación, requirements duros)
```

---

# OUTPUT: TEMPLATE DE 02-análisis-perspectivas.md

Copiar la siguiente estructura a `applications/[Nombre-Empresa]/02-análisis-perspectivas.md`:

```markdown
# ANÁLISIS DE 6 PERSPECTIVAS: [Nombre del Estudio]
## Posición: [Título exacto del rol]
## Fecha de evaluación: YYYY-MM-DD
## Basado en: 01-informe-inteligencia.md (Fecha: YYYY-MM-DD)

---

## RESUMEN EJECUTIVO
[3-5 líneas: Score total, perspectiva más fuerte, perspectiva más débil, 
 recomendación preliminar de Go/No-Go, y la razón principal]

---

## P1 — HIRING MANAGER (Peso: 25%)
**Score: ___/10**

Fortalezas que vería:
- ___
- ___

Preocupaciones que tendría:
- ___
- ___

Preguntas probables en entrevista:
1. ___
2. ___
3. ___

---

## P2 — RECRUITER (Peso: 15%)
**Score: ___/10**

Keywords ATS match: ___%
Test de 30 segundos: [pasa / no pasa / borderline]
Pitch de una línea: "___"
Acciones requeridas para CV: ___

---

## P3 — RRHH (Peso: 10%)
**Score: ___/10**

Red flags identificadas: [ninguna / listar]
Viabilidad de contratación remota: [viable / compleja / no viable]
Modalidad probable: [contractor / EOR / directo / reubicación]
Blocker logístico: [ninguno / describir]

---

## P4 — PEERS (Peso: 20%)
**Score: ___/10**

¿Experiencia creíble para un senior del equipo?: [sí / parcial / no]
Nivel de David vs. equipo: [por debajo / al nivel / por encima]
Valor único que aporta al equipo: ___
Debilidad técnica a preparar: ___

---

## P5 — VP/DIRECTOR (Peso: 15%)
**Score: ___/10**

Ahorro de costo vs. local: ___x
Tiempo estimado de ramp-up: ___
Impacto en velocity del equipo: [positivo / neutral / negativo neto]
Argumento de ROI: "___"

---

## P6 — DAVID (Peso: 15%)
**Score: ___/10**

¿Avanza metas a 3 años?: [significativamente / moderadamente / poco]
Satisfacción diaria estimada: ___/10
Test del domingo por la noche: [emocionado / tranquilo / neutral / ansioso]
Deal-breaker personal: [ninguno / describir]

---

## SCORECARD CONSOLIDADO

| # | Perspectiva | Peso | Score | Ponderado |
|---|-------------|------|-------|-----------|
| P1 | Hiring Manager | 25% | __/10 | ___ |
| P2 | Recruiter | 15% | __/10 | ___ |
| P3 | RRHH | 10% | __/10 | ___ |
| P4 | Peers | 20% | __/10 | ___ |
| P5 | VP/Director | 15% | __/10 | ___ |
| P6 | David | 15% | __/10 | ___ |
| **TOTAL** | | **100%** | | **___/10** |

## VETOS: [ninguno / P_ con score ≤3]
## ALERTAS: [ninguna / P_ con score ≤5]

---

## VEREDICTO DE FASE 2

**Score total: ___/10**
**Interpretación: [MATCH EXCEPCIONAL / SÓLIDO / PARCIAL / DÉBIL / NO HAY MATCH]**
**Recomendación: [Continuar a Fase 3 / HOLD / NO-GO]**

**Si continúa, el ángulo más fuerte de David es:**
___

**Si continúa, el gap más crítico a compensar es:**
___
```

---

## CHECKLIST DE COMPLETITUD

```
PERSPECTIVAS:
[ ] P1 — Hiring Manager evaluado y scored
[ ] P2 — Recruiter evaluado y scored (incluyendo test ATS)
[ ] P3 — RRHH evaluado y scored (incluyendo viabilidad logística)
[ ] P4 — Peers evaluado y scored (incluyendo calibración de nivel)
[ ] P5 — VP/Director evaluado y scored (incluyendo análisis de costo)
[ ] P6 — David evaluado y scored (incluyendo test del domingo)

CONSOLIDACIÓN:
[ ] Scorecard completo con pesos y ponderados
[ ] Vetos revisados (ninguna perspectiva ≤ 3 sin justificación)
[ ] Alertas documentadas (perspectivas ≤ 5)
[ ] Diagnóstico de gaps completado
[ ] Veredicto de Fase 2 registrado
[ ] 02-análisis-perspectivas.md guardado en la carpeta de la empresa
```

---

*Protocolo de la Fase 2 — EVALUAR. Parte del Job Pursuit Framework de David Sanchez.*  
*Creado: 2026-04-13*
