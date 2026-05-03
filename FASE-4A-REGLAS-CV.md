# FASE 4A: REGLAS DE CREACIÓN DE CV
## Job Pursuit Framework — David Sanchez

> **Documento:** Protocolo operativo para la construcción de CVs dirigidos  
> **Input requerido:** `applications/[Nombre-Empresa]/03-decisión-go-nogo.md` con decisión GO  
> **Fuente de datos:** `master-resume-source.md` (SIEMPRE)  
> **Output:** `applications/[Nombre-Empresa]/04-deliverables/DavidSanchez-Resume-[Empresa].md`  
> **Versión:** 1.0  
> **Fecha:** 2026-04-13  
> **Tiempo estimado:** 30-45 minutos por CV (GO FUERTE) / 15-25 minutos (GO CONDICIONAL)

---

## PROPÓSITO

Un CV genérico es invisible. Un CV dirigido es una conversación con el hiring manager antes de que la conversación real ocurra.

El CV de David no es un resumen de su vida — es un argumento de venta. Cada línea debe responder una pregunta que el hiring manager ya tiene en la cabeza: "¿Esta persona puede hacer lo que necesito?" Si una línea no responde eso, sobra.

Este documento contiene las 10 reglas que gobiernan la creación de cada CV dirigido, con protocolos específicos, ejemplos y checklists para el perfil de David.

---

## LAS 10 REGLAS

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUJO DE CONSTRUCCIÓN                      │
│                                                             │
│  master-resume-source.md                                    │
│         │                                                   │
│         ▼                                                   │
│  REGLA 1: Abrir fuente ──────────────────────────┐          │
│  REGLA 2: Verificar honestidad                   │          │
│         │                                        │          │
│         ▼                                        │          │
│  REGLA 3: Seleccionar identidad ─────┐           │          │
│  REGLA 4: Elegir competencias        │           │          │
│  REGLA 5: Seleccionar logros         │  CONTENT  │  SOURCE  │
│         │                            │  SELECT   │  LOCK    │
│         ▼                            │           │          │
│  REGLA 6: Insertar keywords ─────────┘           │          │
│  REGLA 7: Nombrar archivo                        │          │
│         │                                        │          │
│         ▼                                        │          │
│  REGLA 8: Aplicar límite de páginas              │          │
│  REGLA 9: Escribir resumen profesional           │          │
│  REGLA 10: Verificar bullets medibles ───────────┘          │
│         │                                                   │
│         ▼                                                   │
│  DavidSanchez-Resume-[Empresa].md                           │
└─────────────────────────────────────────────────────────────┘
```

---

# REGLA 1: SIEMPRE CONSTRUIR DESDE master-resume-source.md

## La regla

Todo CV dirigido se construye exclusivamente desde `master-resume-source.md`. Este archivo es la cantera. Cada CV es una escultura tallada de esa cantera — nunca se agrega material que no esté en la piedra original.

## Protocolo

```
ANTES DE ESCRIBIR CUALQUIER LÍNEA DEL CV:

1. Abrir master-resume-source.md
2. Verificar que está actualizado (¿último update > fecha del CV?)
3. Si David tiene experiencia nueva que no está en el master:
   → PRIMERO actualizar master-resume-source.md
   → DESPUÉS construir el CV dirigido
   → NUNCA agregar experiencia nueva directamente al CV dirigido

EL MASTER CONTIENE:
✅ Datos de contacto completos
✅ Toda la experiencia profesional (CIPP)
✅ Todos los proyectos (ECHO-EMOTION, Tactical MP Cover System)
✅ Educación completa
✅ Skills completo (sin filtrar)
✅ Todas las certificaciones

EL CV DIRIGIDO CONTIENE:
✅ Un subconjunto seleccionado del master
✅ Los mismos datos, posiblemente reordenados
✅ Los mismos bullets, posiblemente re-enfocados
❌ NUNCA experiencia que no esté en el master
❌ NUNCA skills que David no tenga
❌ NUNCA métricas inventadas
```

## Cuándo actualizar el master

```
TRIGGERS PARA ACTUALIZAR master-resume-source.md:
[ ] David cambió de trabajo o rol
[ ] David completó un nuevo proyecto significativo
[ ] David obtuvo una nueva certificación
[ ] David aprendió una nueva tecnología y tiene evidencia de uso
[ ] David tiene un nuevo logro medible en su trabajo actual
[ ] Han pasado >3 meses desde la última actualización

ACTUALIZACIÓN = agregar al master, nunca borrar.
El master es acumulativo. Lo que se filtra es el CV dirigido.
```

---

# REGLA 2: NUNCA INVENTAR, FABRICAR O EXAGERAR

## La regla

La integridad del CV es absoluta. No hay zona gris. Seleccionar, adaptar el framing y enfatizar lo relevante es legítimo. Inventar, fabricar números o reclamar experiencia inexistente es inaceptable.

## La línea entre adaptar y mentir

```
✅ LEGÍTIMO (adaptar framing):

MASTER DICE:
"Designed and implemented interactive systems using both Unity and 
Unreal Engine, enabling users to explore and engage with virtual sections."

ADAPTACIÓN PARA ROL DE GAMEPLAY PROGRAMMER UE5:
"Designed and implemented interactive gameplay systems in Unreal Engine, 
enabling real-time user exploration and engagement with virtual environments."

¿Por qué es legítimo?
→ David SÍ hizo esto. Solo enfoca el aspecto de UE5 y usa "gameplay systems"
  en lugar de "interactive systems" porque el concepto es equivalente y 
  resuena mejor con el job posting.
```

```
✅ LEGÍTIMO (enfatizar un aspecto):

MASTER DICE:
"Developed animation systems directly in C++ using Unreal Engine, 
implementing State Machines, Blend Spaces, and custom logic to ensure 
responsive and immersive character behaviors."

ADAPTACIÓN PARA ROL ENFOCADO EN ANIMATION:
"Engineered C++ animation systems in Unreal Engine — State Machines, 
Blend Spaces, and custom procedural logic — delivering responsive 
character behaviors for a multiplayer tactical shooter."

¿Por qué es legítimo?
→ Mismo contenido. Agrega contexto del proyecto (multiplayer tactical shooter)
  que es real y viene del Tactical MP Cover System.
```

```
❌ ILEGÍTIMO (inventar):

"Optimized animation system reducing frame time by 40%"
→ David NO tiene esta métrica. No se midió. Inventarla es fabricar.

"Led a team of 5 programmers in developing..."
→ David no lideró un equipo de programadores en CIPP. Lideró planning.

"Published VR horror game on Steam"
→ ECHO-EMOTION fue un thesis project, no un juego publicado comercialmente.
```

```
⚠️ ZONA GRIS (evaluar caso por caso):

"Shipped a VR horror experience with user testing and psychophysiological analysis"
→ Técnicamente verdadero — ECHO fue completado y testeado con usuarios.
→ Pero "shipped" en gamedev implica publicación comercial.
→ MEJOR ALTERNATIVA: "Delivered a VR horror experience..." o 
  "Completed and user-tested a VR horror experience..."
→ Mismo impacto, sin ambigüedad.
```

## Test de honestidad de 3 preguntas

Antes de incluir cualquier bullet en el CV, pasar este test:

```
PREGUNTA 1: "¿Puedo explicar esto en una entrevista con detalle técnico?"
→ Si David no puede hablar 2 minutos sobre este bullet con preguntas 
  de follow-up, no debería estar en el CV.

PREGUNTA 2: "Si verifican esto con mi jefe/profesor/colega, ¿confirmarían?"
→ Si la respuesta es "bueno, más o menos" — reescribir hasta que 
  la respuesta sea "sí, exactamente."

PREGUNTA 3: "¿Estoy reclamando un resultado que fue del equipo como mío?"
→ Si David contribuyó pero no lideró, usar "Contributed to..." 
  en lugar de "Led..." o "Built..."
```

---

# REGLA 3: SELECCIONAR LA DECLARACIÓN DE IDENTIDAD MÁS CERCANA AL ROL

## La regla

El título profesional y el summary del CV deben reflejar el rol objetivo, no el rol actual. David es "Multimedia Engineer" en su educación, pero para una oferta de Gameplay Programmer, su CV debe presentarlo como eso — siempre que sea verdad.

## Banco de identidades de David

Basado en su experiencia real, David puede legítimamente usar cualquiera de estos títulos:

```
IDENTIDAD                    CUÁNDO USARLA                          JUSTIFICACIÓN
─────────────────────────────────────────────────────────────────────────────────────
Gameplay Programmer          Rol pide gameplay programming           Tactical MP + CIPP 
                             enfocado en UE5/C++                     interactive systems

Game Developer               Rol es generalista de game dev          Toda su experiencia 
                             (no solo programación)                   combinada

Unreal Engine Developer      Rol es específicamente de UE5           CIPP (migración + 
                                                                      desarrollo), Tactical MP,
                                                                      ECHO-EMOTION

Software Engineer            Rol en empresa tech que hace             CIPP (título oficial),
(Game Development)           juegos pero busca "software eng"        experiencia cross-platform

VR Developer                 Rol enfocado en VR/AR/XR                ECHO-EMOTION + 
                                                                      certificaciones IxDF

Multimedia Engineer          Rol valora perfil híbrido                Título universitario, 
                             (código + diseño + UX)                   experiencia CIPP
```

## Protocolo de selección

```
1. Leer el TÍTULO EXACTO de la oferta de trabajo
2. Buscar en el banco de identidades cuál es el match más cercano
3. Si hay match directo → Usar esa identidad
4. Si no hay match directo → Usar la más cercana + ajustar el summary
5. NUNCA usar una identidad que David no pueda defender en entrevista

EJEMPLO:
Oferta dice: "Gameplay Programmer (Unreal Engine)"
→ Identidad: "Gameplay Programmer"
→ NO usar: "Senior Gameplay Programmer" (no es senior)
→ NO usar: "Multimedia Engineer" (no resuena con el rol)

Oferta dice: "Junior Game Developer"
→ Identidad: "Game Developer"
→ Omitir "Junior" en el título del CV (dejar que la experiencia hable)
```

---

# REGLA 4: ELEGIR 10-12 COMPETENCIAS, REORDENAR POR RELEVANCIA

## La regla

La sección de Technical Skills no es un volcado de todo lo que David sabe. Es una selección curada de 10-12 competencias, ordenadas de mayor a menor relevancia para ESTE rol específico.

## Pool completo de competencias de David (del master)

```
CATEGORÍA A — LENGUAJES Y SCRIPTING:
A1. C++ (fuerte)
A2. C# (competente)
A3. Python (competente)
A4. Blueprints / UE Visual Scripting (fuerte)
A5. C básico

CATEGORÍA B — MOTORES Y FRAMEWORKS:
B1. Unreal Engine 5 (principal)
B2. Unity (competente)
B3. Godot (básico)

CATEGORÍA C — GAMEPLAY SYSTEMS:
C1. Gameplay Programming
C2. 3D Math & Physics
C3. Animation Systems (State Machines, Blend Spaces)
C4. AI Programming (Behavior Trees)
C5. Multiplayer / Netcode
C6. UI/UX Implementation (UMG Widgets)
C7. Spatial Audio Systems

CATEGORÍA D — HERRAMIENTAS Y PIPELINES:
D1. GitHub / Git
D2. Helix Core (Perforce)
D3. Diversion
D4. Kubernetes
D5. AWS
D6. GCP
D7. Ray (distributed training)

CATEGORÍA E — ESPECIALIZACIÓN:
E1. VR Development
E2. Niagara VFX (en curso)
E3. Localization Systems
E4. UX Design
E5. SCRUM / Agile

CATEGORÍA F — SOFT SKILLS (incluir solo si la oferta las menciona):
F1. Leadership
F2. Team Communication
F3. Problem Solving
F4. Continuous Learning
```

## Protocolo de selección y orden

```
PASO 1: Listar las keywords técnicas de la oferta de trabajo
________  ________  ________  ________  ________
________  ________  ________  ________  ________

PASO 2: Para cada keyword, encontrar la competencia del pool que matchea
| Keyword de la oferta | Competencia de David | Código |
|----------------------|---------------------|--------|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

PASO 3: Ordenar las competencias seleccionadas
TIER 1 (primero) — Mencionadas explícitamente en la oferta como requirements:
  1. ___
  2. ___
  3. ___
  4. ___

TIER 2 (segundo) — Mencionadas como nice-to-have o implícitas:
  5. ___
  6. ___
  7. ___
  8. ___

TIER 3 (tercero) — No mencionadas pero que añaden valor diferencial:
  9. ___
  10. ___
  11. ___
  12. ___

PASO 4: Verificar el total
- ¿Son 10-12 competencias? [sí / ajustar]
- ¿Las top 4 coinciden con los requirements duros? [sí / reordenar]
- ¿Hay alguna competencia que no puedo defender en entrevista? [quitar]
```

## Ejemplo aplicado: Oferta de Gameplay Programmer UE5

```
La oferta pide: "Strong C++, UE5, gameplay systems, animation, 
AI/Behavior Trees, multiplayer experience, version control (Perforce)"

SELECCIÓN Y ORDEN:
 1. C++ (A1)                          ← Requirement directo
 2. Unreal Engine 5 (B1)              ← Requirement directo
 3. Gameplay Programming (C1)          ← Requirement directo
 4. Animation Systems (C3)             ← Requirement directo
 5. AI / Behavior Trees (C4)           ← Requirement directo
 6. Multiplayer / Netcode (C5)         ← Requirement directo
 7. Helix Core / Perforce (D2)         ← Requirement directo
 8. 3D Math & Physics (C2)            ← Nice-to-have implícito
 9. Blueprints (A4)                    ← Nice-to-have para UE5
10. VR Development (E1)                ← Diferenciador
11. Git / GitHub (D1)                  ← Version control adicional
12. SCRUM / Agile (E5)                 ← Proceso de trabajo

EXCLUIDOS DE ESTA VERSIÓN:
- Python, C#, Unity, Godot (no relevantes para esta oferta)
- Kubernetes, AWS, GCP (no relevante para gameplay)
- C básico (no aporta)
```

---

# REGLA 5: SELECCIONAR 2-3 LOGROS QUE DEMUESTREN FIT

## La regla

Un CV no es una lista de responsabilidades — es una colección de logros. De todos los logros del master, seleccionar los 2-3 que mejor demuestran que David puede hacer lo que este rol necesita.

## Catálogo de logros demostrables de David

```
LOGRO                                          DEMUESTRA                   MEJOR PARA
────────────────────────────────────────────────────────────────────────────────────────

L1: Migración completa Unity → UE5             Adaptabilidad, UE5          Roles que valoran
    manteniendo feature parity (CIPP)          profundo, problem solving   flexibilidad técnica

L2: Sistema de animación en C++ con            C++ avanzado, animation     Gameplay Programmer,
    State Machines y Blend Spaces              programming real            Animation Programmer
    (Tactical MP)

L3: Enemy AI con Behavior Trees                AI programming,             Roles con componente
    para comportamiento estratégico            sistemas complejos          de AI/NPC
    (Tactical MP)

L4: Experiencia VR completa con user           Capacidad de entregar       VR Developer,
    testing y análisis psicofisiológico        end-to-end, UX research     roles de immersive
    (ECHO-EMOTION)                                                         experience

L5: Sistema multiplayer funcional con          Networking, replication,    Roles de multiplayer
    mecánicas de cover táctico                 gameplay mechanics          o game systems
    (Tactical MP)

L6: Virtualización interactiva de isla         Liderazgo técnico,          Roles de tech lead
    completa — planificación, diseño           planificación de proyecto,  junior, o puestos
    y entrega (CIPP)                           entrega                     que valoran ownership

L7: UI responsivo con localización             Frontend gameplay,          Roles de UI
    bilingüe ES/EN (CIPP)                     i18n, UMG/Slate             programmer

L8: Tour virtual de acuario con                Storytelling interactivo,   Roles de experience
    navegación interactiva y contenido         entrega de producto         dev, educational
    educativo (CIPP)                           completo                    games

L9: Sistemas de audio espacial 3D con         Audio programming,          Roles de audio
    oclusión, atenuación y reverberación       técnicas avanzadas de       programmer o
    (ECHO-EMOTION)                             audio en UE5                sound design tech
```

## Protocolo de selección de logros

```
PASO 1: Identificar las 3 cosas más importantes que el rol necesita
  Necesidad 1: ___
  Necesidad 2: ___
  Necesidad 3: ___

PASO 2: Matchear cada necesidad con el logro más fuerte
  Necesidad 1 → Logro L__: ___
  Necesidad 2 → Logro L__: ___
  Necesidad 3 → Logro L__: ___

PASO 3: Verificar diversidad
  ¿Los 3 logros vienen de proyectos diferentes?      [sí / no — diversificar]
  ¿Al menos 1 es de experiencia profesional (CIPP)?  [sí / no — incluir CIPP]
  ¿Al menos 1 demuestra entrega end-to-end?          [sí / no — considerar]

PASO 4: Convertir en bullets de CV (ver Regla 10 para formato)
```

## Ejemplo aplicado: Oferta de Gameplay Programmer UE5

```
Necesidad 1: C++ gameplay programming en UE5
→ Logro L2: Animation systems en C++ (Tactical MP)

Necesidad 2: AI / NPC programming
→ Logro L3: Behavior Trees para enemy AI (Tactical MP)

Necesidad 3: Capacidad de entrega en entorno profesional
→ Logro L1: Migración Unity → UE5 manteniendo feature parity (CIPP)
```

---

# REGLA 6: INSERTAR KEYWORDS DEL POSTING NATURALMENTE

## La regla

El CV debe contener las keywords del job posting para pasar el ATS, pero insertadas de forma natural — no keyword stuffing. Cada keyword debe aparecer en un contexto que demuestre uso real.

## Protocolo de inserción

```
PASO 1: Extraer keywords del posting
Copiar todas las tecnologías, skills y términos técnicos mencionados.

PASO 2: Clasificar por tipo
| Keyword | Tipo | ¿David la tiene? | ¿Ya está en el master? |
|---------|------|------------------|------------------------|
| ___ | Tech/Lenguaje | ✅/❌ | ✅/❌ |
| ___ | Skill/Concepto | ✅/❌ | ✅/❌ |
| ___ | Herramienta | ✅/❌ | ✅/❌ |
| ___ | Metodología | ✅/❌ | ✅/❌ |

PASO 3: Planificar inserción para las que David SÍ tiene
| Keyword | Dónde insertarla | Cómo (contexto natural) |
|---------|-----------------|------------------------|
| ___ | [Summary / Bullet X / Skills] | ___ |
| ___ | [Summary / Bullet X / Skills] | ___ |

PASO 4: Para keywords que David NO tiene → NO INSERTAR
No inventar experiencia para cubrir una keyword.
Mejor dejar una keyword fuera que mentir.
```

## Técnicas de inserción natural

```
TÉCNICA 1: INCORPORAR EN BULLET EXISTENTE
Antes: "Developed animation systems in C++"
Keyword a insertar: "Unreal Engine 5"
Después: "Developed animation systems in C++ using Unreal Engine 5"
→ Natural, agrega contexto real.

TÉCNICA 2: EXPANDIR CON DETALLE TÉCNICO
Antes: "Designed enemy AI using Behavior Trees"
Keywords a insertar: "NPC behavior", "EQS"
Después: "Designed NPC behavior systems using Behavior Trees for 
strategic enemy AI"
→ Solo agregar "EQS" si David realmente usó Environmental Query System.
   Si no, NO agregar.

TÉCNICA 3: MOVER A SKILLS SECTION
Si la keyword no encaja naturalmente en ningún bullet pero David la tiene:
→ Incluirla en la sección de Technical Skills.
Ejemplo: "Perforce" no aparece en bullets pero David sabe usarlo 
→ Incluir "Helix Core (Perforce)" en skills.

TÉCNICA 4: SUMMARY HOOK
Si una keyword es prominente en el posting:
→ Incluirla en el Professional Summary.
Ejemplo: La oferta abre con "gameplay programmer with multiplayer experience"
→ Summary incluye "gameplay programmer with hands-on multiplayer experience"
```

## Anti-patterns (NO hacer)

```
❌ KEYWORD STUFFING:
"Experienced in C++, Unreal Engine, gameplay, AI, animation, multiplayer, 
 networking, Perforce, Git, Blueprints, State Machines, and Behavior Trees"
→ Esto es una lista de compras, no un CV. Ningún humano habla así.

❌ KEYWORD SIN CONTEXTO:
"Used EQS and GAS in project"
→ Si David nunca usó EQS o Gameplay Ability System, no puede incluirlo.

❌ KEYWORD FORZADA:
"Leveraged agile-driven synergies in cloud-native gameplay pipelines"
→ Esto no significa nada. No usar buzzwords vacíos.
```

---

# REGLA 7: FORMATO DE NOMBRE DE ARCHIVO

## La regla

Cada CV dirigido tiene un nombre de archivo estandarizado que identifica inmediatamente a quién pertenece y para qué empresa fue creado.

## Formato

```
NOMBRE DEL ARCHIVO:
DavidSanchez-Resume-[Empresa].md

REGLAS:
- Nombre sin espacios, PascalCase
- Empresa sin espacios ni caracteres especiales
- Si la empresa tiene nombre muy largo, usar abreviatura reconocible
- El archivo siempre es .md (markdown) para fácil edición y versioning
- Si se necesita exportar a PDF para enviar, hacer la conversión después

EJEMPLOS:
DavidSanchez-Resume-EpicGames.md
DavidSanchez-Resume-Ubisoft.md
DavidSanchez-Resume-BehaviorInteractive.md
DavidSanchez-Resume-TeamCherry.md
DavidSanchez-Resume-DigitalExtremes.md

NO:
david_sanchez_resume_epic.md          ← No es el formato
Resume - David Sanchez (Epic).md      ← Espacios, paréntesis
DavidSanchez-CV-EpicGames.md          ← "CV" no, usar "Resume" (estándar US/intl)
```

## Ubicación

```
applications/
└── [Nombre-Empresa]/
    └── 04-deliverables/
        └── DavidSanchez-Resume-[Empresa].md    ← AQUÍ
```

---

# REGLA 8: LÍMITE DE PÁGINAS

## La regla

Para roles de Individual Contributor (IC) — que es donde David está: máximo 1 página. Para roles de Director en adelante: máximo 2 páginas.

## Aplicación para David

```
NIVEL ACTUAL DE DAVID: Junior-Mid IC
LÍMITE: 1 PÁGINA. SIN EXCEPCIONES.

¿Por qué 1 página?
- David tiene ~1 año de experiencia profesional + proyectos
- Con esta experiencia, 2 páginas = relleno visible
- Los recruiters de gamedev escanean en 30 segundos (Regla del test de 30s, Fase 2)
- Una página densa y relevante > dos páginas diluidas

¿QUÉ ENTRA EN 1 PÁGINA?
- Header (nombre, contacto, links): 3-4 líneas
- Professional Summary: 3 líneas (Regla 9)
- Experience (CIPP): 4-5 bullets seleccionados
- Projects (2 max, 3-4 bullets cada uno): 6-8 bullets
- Technical Skills: 3-4 líneas organizadas
- Education: 2 líneas
- Certifications: 1-2 líneas (solo las más relevantes)

¿QUÉ SE SACRIFICA?
- Certificaciones genéricas (ESL, UX básico) → Solo si la oferta valora UX
- Segundo proyecto si no aporta → Mejor 1 proyecto con 4 bullets fuertes
- Soft skills como sección separada → Se demuestran en bullets, no se listan
- Segundo empleo/educación secundaria → Solo la universidad
```

## Test de 1 página

```
DESPUÉS DE ESCRIBIR EL CV, VERIFICAR:

Si se exportara a PDF con formato estándar (11pt, márgenes 0.7"):
[ ] ¿Cabe en 1 página sin trucos? (sin reducir fuente a <10pt, sin quitar márgenes)
[ ] Si no cabe → ¿Qué puedo cortar sin perder valor?
    → Eliminar el bullet más débil de cada sección
    → Combinar dos bullets relacionados en uno más potente
    → Reducir certificaciones a las 2 más relevantes
    → Quitar "High School Diploma" (no aporta para international)

NUNCA HACER PARA QUE QUEPA:
❌ Reducir la fuente por debajo de 10.5pt
❌ Reducir márgenes por debajo de 0.5"
❌ Eliminar spacing entre secciones hasta que parezca un bloque de texto
❌ Usar 2 columnas ultra-comprimidas (rompe ATS)
```

---

# REGLA 9: RESUMEN PROFESIONAL — 3 LÍNEAS, DIRIGIDO AL ROL

## La regla

El Professional Summary son las primeras 3 líneas que el recruiter lee. Deben decir: quién eres, qué haces mejor, y por qué eres relevante para ESTE rol. Máximo 3 líneas. Cero relleno.

## Estructura de las 3 líneas

```
LÍNEA 1: [Identidad + calificador de experiencia]
LÍNEA 2: [Competencia principal + evidencia]
LÍNEA 3: [Diferenciador + conexión con el rol]
```

## Banco de componentes para David

```
LÍNEA 1 — IDENTIDAD (elegir una):
a) "Gameplay Programmer specializing in Unreal Engine 5 and C++"
b) "Game Developer with hands-on experience in UE5, C++, and multiplayer systems"
c) "Unreal Engine Developer with expertise in gameplay programming and animation systems"
d) "Software Engineer focused on game development, with cross-engine experience (Unity, UE5)"

LÍNEA 2 — COMPETENCIA PRINCIPAL (elegir una, adaptar):
a) "Experienced in building animation systems (State Machines, Blend Spaces), 
    AI behaviors (Behavior Trees), and multiplayer mechanics in C++."
b) "Delivered interactive systems across UE5 and Unity, including a complete 
    engine migration maintaining feature parity."
c) "Built and shipped a VR horror experience with spatial audio systems and 
    data-driven user testing."
d) "Proven ability to implement gameplay mechanics, debug complex systems, and 
    deliver within agile workflows."

LÍNEA 3 — DIFERENCIADOR (elegir uno, adaptar):
a) "Multimedia Engineering background provides a unique lens combining 
    technical depth with UX-driven design thinking."
b) "Cross-engine experience (Unity to UE5 migration) with a track record of 
    adapting quickly to new codebases and pipelines."
c) "Passionate about immersive experiences, with thesis research in emotional 
    design and psychophysiological response in VR."
d) "Bilingual (Spanish/English C1), remote-ready, and comfortable working 
    across time zones in distributed teams."
```

## Ejemplos completos ensamblados

```
PARA ROL: "Gameplay Programmer — UE5" en estudio AAA

Gameplay Programmer specializing in Unreal Engine 5 and C++, with 
professional experience building interactive systems and real-time 
environments. Experienced in animation programming (State Machines, 
Blend Spaces), AI systems (Behavior Trees), and multiplayer mechanics. 
Cross-engine background (Unity → UE5 migration) with a strong foundation 
in 3D math, physics, and performance-conscious development.
```

```
PARA ROL: "Game Developer" en estudio indie remoto

Game Developer with hands-on experience in UE5, Unity, and C++, focused 
on gameplay programming and interactive experiences. Delivered a VR horror 
experience with spatial audio and user testing, and a tactical multiplayer 
cover system with AI-driven enemies. Bilingual (Spanish/English C1), 
remote-ready, and experienced in agile development workflows.
```

```
PARA ROL: "VR Developer" en empresa de experiencias immersivas

Unreal Engine Developer with specialized experience in VR development 
and spatial audio design, backed by a thesis on emotional immersion 
through psychophysiological analysis. Built end-to-end interactive 
experiences including a VR horror environment and a virtual aquarium 
tour with multilingual navigation. Multimedia Engineering background 
combining technical implementation with UX-driven design thinking.
```

## Anti-patterns del Summary

```
❌ "I am a passionate and hardworking game developer who loves 
    learning new things and working in teams"
→ Dice nada. Todo el mundo dice esto.

❌ "Multimedia Engineer with experience in various technologies 
    and a strong work ethic"
→ Genérico. No conecta con ningún rol específico.

❌ "Results-oriented professional seeking to leverage my skills 
    in a dynamic environment"
→ Buzzword soup. Recruiter lo ignora automáticamente.

❌ Un párrafo de 6+ líneas describiendo toda la vida de David
→ El summary NO es una biografía. Son 3 líneas.
```

---

# REGLA 10: CADA BULLET CON RESULTADO MEDIBLE

## La regla

Cada bullet point del CV debe demostrar un resultado, no describir una responsabilidad. Si un bullet describe lo que David "hacía" en lugar de lo que David "logró," necesita reescritura.

## Fórmula de bullet

```
[VERBO DE ACCIÓN] + [QUÉ HIZO] + [CON QUÉ/CÓMO] + [RESULTADO MEDIBLE O CONCRETO]
```

## Transformación de bullets del master

```
ANTES (responsabilidad):
"Designed and implemented interactive systems using both Unity and 
Unreal Engine, enabling users to explore and engage with virtual sections."

DESPUÉS (logro con resultado):
"Designed and implemented interactive exploration systems across Unity 
and Unreal Engine, delivering 4+ navigable virtual sections with 
real-time user engagement for an island digitalization project."
```

```
ANTES (responsabilidad):
"Conducted technical migration from Unity to Unreal Engine, adapting 
workflows, rebuilding systems, and ensuring feature parity."

DESPUÉS (logro con resultado):
"Led technical migration from Unity to Unreal Engine 5 — adapted 
asset workflows, rebuilt core interaction systems, and achieved full 
feature parity across both platforms within the project timeline."
```

```
ANTES (responsabilidad):
"Developed animation systems directly in C++ using Unreal Engine, 
implementing State Machines, Blend Spaces, and custom logic."

DESPUÉS (logro con resultado):
"Engineered C++ animation system in UE5 — State Machines, Blend Spaces, 
and custom procedural logic — powering responsive character behaviors 
in a tactical multiplayer cover shooter."
```

```
ANTES (responsabilidad):
"Designed and implemented enemy AI using Behavior Trees to create 
strategic behaviors."

DESPUÉS (logro con resultado):
"Built enemy AI using Behavior Trees in C++, implementing strategic 
patrol, chase, and combat behaviors that adapt to player positioning 
and cover usage."
```

## Qué hacer cuando no tienes métricas numéricas

David no siempre tiene números (FPS mejorados, revenue generado, etc.). Eso es normal para alguien junior. Alternativas legítimas:

```
TIPO DE RESULTADO           EJEMPLO                                  CUÁNDO USAR
────────────────────────────────────────────────────────────────────────────────
Entregable concreto         "...delivering a fully functional         Cuando completaste 
                            virtual tour"                             un producto/feature

Scope del trabajo           "...across 4+ virtual sections"          Cuando hay volumen
                            "...supporting 2 languages (ES/EN)"      que mostrar

Impacto en usuario          "...enabling real-time exploration        Cuando el impacto
                            and interactive engagement"               es experiencial

Complejidad técnica         "...implementing occlusion,               Cuando la sofisticación
                            attenuation, and reverberation"           técnica es el logro

Validación                  "...validated through user testing         Cuando testeaste
                            with psychophysiological analysis"         con datos reales

Comparación antes/después   "...migrated from Unity to UE5            Cuando hay un estado
                            achieving full feature parity"             anterior y posterior
```

## Verbos de acción por categoría

```
CONSTRUCCIÓN:    Engineered, Built, Developed, Implemented, Created, Designed
LIDERAZGO:       Led, Directed, Planned, Coordinated, Managed
OPTIMIZACIÓN:    Optimized, Improved, Streamlined, Refined, Enhanced
ENTREGA:         Delivered, Shipped, Launched, Released, Completed
INVESTIGACIÓN:   Conducted, Analyzed, Evaluated, Validated, Tested
MIGRACIÓN:       Migrated, Adapted, Rebuilt, Transitioned, Ported

EVITAR:
❌ "Responsible for..." (pasivo, describe responsabilidad, no logro)
❌ "Helped with..." (minimiza contribución)
❌ "Worked on..." (vago, no dice qué hizo)
❌ "Assisted in..." (suena a pasante)
❌ "Utilized..." (relleno corporativo)
```

---

# ESTRUCTURA COMPLETA DEL CV DIRIGIDO

## Template final

```markdown
# David Sanchez
## [IDENTIDAD SELECCIONADA — Regla 3]

Santiago de Cali, Colombia | dav.sanchez2001@gmail.com
Portfolio: [URL] | LinkedIn: [URL] | GitHub: [URL si aplica]

---

## Professional Summary
[3 líneas dirigidas al rol — Regla 9]

---

## Experience

### [Título adaptado], [Empresa] — [Ubicación]
[Fecha inicio] – Present
- [Bullet con resultado — Regla 10] 
- [Bullet con resultado — Regla 10]
- [Bullet con resultado — Regla 10]
- [Bullet con resultado — Regla 10]

---

## Projects

### [Proyecto 1 — el más relevante para el rol] — [Fecha]
[Descripción de 1 línea del proyecto]
- [Bullet con resultado — Regla 10]
- [Bullet con resultado — Regla 10]
- [Bullet con resultado — Regla 10]

### [Proyecto 2 — si cabe y aporta] — [Fecha]
[Descripción de 1 línea]
- [Bullet con resultado — Regla 10]
- [Bullet con resultado — Regla 10]

---

## Technical Skills
[10-12 competencias ordenadas por relevancia — Regla 4]

---

## Education
[Universidad], [Grado] — [Fecha]
Thesis: [Si es relevante]

---

## Certifications
[Solo las 1-3 más relevantes para el rol — Regla 8]
```

---

# CHECKLIST DE CALIDAD PRE-ENVÍO

Antes de dar por terminado un CV dirigido, pasar todos estos checks:

```
FUENTE Y HONESTIDAD:
[ ] ¿Todo el contenido viene de master-resume-source.md?          (Regla 1)
[ ] ¿Puedo defender cada bullet en una entrevista?                 (Regla 2)
[ ] ¿Apliqué el test de honestidad de 3 preguntas?                (Regla 2)

IDENTIDAD Y TARGETING:
[ ] ¿La identidad (título) matchea con el rol objetivo?           (Regla 3)
[ ] ¿Las competencias están ordenadas por relevancia?              (Regla 4)
[ ] ¿Los 2-3 logros principales demuestran fit con el rol?        (Regla 5)

KEYWORDS Y ATS:
[ ] ¿Las keywords del posting aparecen naturalmente?               (Regla 6)
[ ] ¿El archivo se llama DavidSanchez-Resume-[Empresa].md?        (Regla 7)
[ ] ¿No hay keyword stuffing ni keywords sin contexto?             (Regla 6)

FORMATO Y CONCISIÓN:
[ ] ¿Cabe en 1 página si se exporta a PDF?                        (Regla 8)
[ ] ¿El summary son exactamente 3 líneas dirigidas?               (Regla 9)
[ ] ¿Cada bullet tiene un resultado medible o concreto?            (Regla 10)
[ ] ¿No hay bullets que empiezan con "Responsible for"?            (Regla 10)
[ ] ¿Los verbos de acción son variados (no repetir "Developed")?  (Regla 10)

CONTROL FINAL:
[ ] ¿Leí el CV completo como si fuera el hiring manager?
[ ] ¿En 30 segundos entiendo que David puede hacer el trabajo?
[ ] ¿Hay algo que reste más que sume? → Eliminar
[ ] ¿El idioma coincide con el de la oferta?
```

---

*Protocolo de la Fase 4A — Reglas de CV. Parte del Job Pursuit Framework de David Sanchez.*  
*Creado: 2026-04-13*
