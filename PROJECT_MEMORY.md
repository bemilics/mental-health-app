# 🧠 MEMORIA DEL PROYECTO - MENTAL HEALTH CHECK-IN

> **Documento de seguimiento sesión a sesión**
> Última actualización: 2026-01-13

---

## 📋 RESUMEN EJECUTIVO

**Nombre del proyecto:** Mental Health Check-In
**Tipo:** Aplicación web de salud mental
**Stack técnico:** React (Create React App), Anthropic Claude API, Tailwind CSS
**Estado:** Desarrollo activo - Formato Instagram DM implementado
**Repositorio Git:** Sí (gestionado con Sublime Merge)
**Branch de desarrollo:** `develop` (sincronizada con GitHub)

---

## 🎯 VISIÓN Y OBJETIVOS DEL PROYECTO

### Propósito Principal
Crear una aplicación web que normaliza el uso de medicamentos psiquiátricos mediante un análisis NO CLÍNICO, cercano, brutalmente honesto y empático sobre el consumo de estos medicamentos.

### Objetivos Específicos
1. **Normalizar** el diálogo sobre medicación psiquiátrica
2. **Educar** sobre qué hacen los medicamentos y por qué son necesarios
3. **Celebrar** el autocuidado de manera honesta, NO condescendiente
4. **Evitar** cualquier diagnóstico clínico o recomendación médica

### Filosofía de Diseño
- ✅ Brutalmente honesto
- ✅ Empático sin ser paternalista
- ✅ Reconocer lo positivo desde perspectiva racional Y emocional
- ❌ NO condescendiente
- ❌ NO clínico
- ❌ NO diagnosticar ni recomendar medicamentos

---

## 🎭 TONO Y NARRATIVA

### Estado Actual (Sesión 2 - Nuevo)
- **Formato:** Conversación de grupo estilo Instagram DM
- **Tono:** Español chileno casual (wn, po, cachai, brigido)
- **Estilo:** Irónico pero wholesome, honesto pero de apoyo
- **Personajes:** Generados dinámicamente según medicamentos del usuario
- **Visual:** Dark theme con gradientes purple/pink/blue

### Evolución del Proyecto
- **Antes (Sesión 1):** Inspirado en Disco Elysium con sistema de "skills" y niveles
- **Ahora (Sesión 2):** Instagram DM con personajes dinámicos y educativos
- **Mejora clave:** Personajes específicos a las condiciones que tratan los medicamentos

### Referencias de Tono
- Instagram DM: Casual, emojis, mensajes cortos, reacciones
- Comunidad chilena online: Lenguaje natural y cercano
- Educación en salud mental: Específico sobre mecanismos de medicamentos

---

## 🏗️ ARQUITECTURA TÉCNICA ACTUAL

### Frontend
- **Framework:** React 19.2.1
- **Estilos:** Tailwind CSS (inline classes)
- **Iconos:** lucide-react
- **Almacenamiento:** localStorage (clave: 'thought-cabinet-meds')

### Backend/API
- **API:** Anthropic Claude (Sonnet 4)
- **Método:** Vercel Serverless Function (`/api/analyze.js`)
- **Autenticación:** Variable de entorno `ANTHROPIC_API_KEY` (protegida en servidor)
- **Análisis dinámico:** Función `analyzeSymptoms()` detecta tipo de medicamentos
- **Generación de personajes:** Basada en condiciones que tratan los medicamentos

### Estructura de Datos

#### Medicamento
```javascript
{
  id: String,          // Timestamp
  name: String,        // Nombre del medicamento
  dosage: Number,      // Dosis en mg
  time: String         // 'morning' | 'afternoon' | 'night'
}
```

#### Respuesta de Análisis (Formato Instagram DM)
```javascript
{
  participants: [
    {
      id: String,      // ID único del participante
      name: String,    // Nombre del aspecto mental o medicamento
      color: String,   // Hex color para UI
      emoji: String    // Emoji representativo
    }
  ],
  messages: [
    {
      time: String,         // Timestamp (ej: "8:47 AM")
      senderId: String,     // ID del participante
      text: String,         // Contenido del mensaje (multiline con \n)
      reactions: [String]   // Array de emojis (opcional)
    }
  ]
}
```

#### Tipos de Personajes Generados Dinámicamente
Según medicamentos detectados:
- **SSRIs** (Sertralina, Fluoxetina) → REGULACIÓN EMOCIONAL, SISTEMA DE ALARMA
- **Benzodiacepinas** (Clonazepam) → SISTEMA DE ALARMA
- **Estimulantes** (Metilfenidato) → FUNCIÓN EJECUTIVA, ENFOQUE
- **Gabapentinoides** (Pregabalina) → SISTEMA DE ALARMA, CUERPO
- **Antipsicóticos** (Quetiapina) → FILTRO DE REALIDAD, REGULACIÓN EMOCIONAL
- **Medicamentos para el sueño** (Trazodona) → CICLO DE SUEÑO
- Cada medicamento también aparece como personaje explicando su mecanismo

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
mental-health-app/
├── api/
│   └── analyze.js           # Serverless function (~770 líneas) - análisis dinámico, repairJSON, retry
├── public/
├── src/
│   ├── App.js               # Componente principal (~590 líneas) - Instagram DM UI + perfil
│   ├── index.css            # Estilos base + Tailwind
│   └── index.js             # Entry point
├── .gitignore
├── package.json
├── vercel.json              # Configuración de Vercel
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── README.md
├── VERCEL_SETUP.md          # Guía de configuración de ambiente (Sesión 3)
├── TESTING.md               # Guía de feature flags
└── PROJECT_MEMORY.md        # Este archivo
```

**Archivos Clave:**
- `api/analyze.js`: Backend con generación dinámica, repairJSON(), fetchWithRetry()
- `src/App.js`: Frontend con selectores de perfil y detección de ambiente
- `VERCEL_SETUP.md`: Configuración de variables de entorno para producción/preview

---

## 🔐 CONSIDERACIONES ÉTICAS Y DE SEGURIDAD

### Privacidad
- ✅ Datos almacenados solo localmente (localStorage)
- ✅ No hay base de datos externa
- ✅ API key protegida en backend (Vercel Serverless Function)
- ✅ Backend nunca expone la API key al navegador

### Ética Médica
- ✅ Disclaimer implícito: "análisis NO CLÍNICO"
- ✅ No diagnósticos
- ✅ No recomendaciones de medicamentos
- ✅ Contenido educativo sobre mecanismos (serotonina, GABA, etc.)
- 🔄 Necesita revisión de prompts con profesional de salud mental

### Áreas de Mejora
- [ ] Agregar disclaimer médico explícito visible en UI
- [ ] Revisar prompts con estándares médicos y profesional
- [ ] Testing con usuarios reales
- [ ] Verificar exactitud de información farmacológica

---

## 💻 ESTADO ACTUAL DEL CÓDIGO

### Funcionalidades Implementadas
- ✅ Agregar medicamentos (nombre, dosis, horario)
- ✅ Eliminar medicamentos
- ✅ Persistencia en localStorage
- ✅ Generación de análisis con Claude API (backend seguro)
- ✅ **Vista de conversación Instagram DM** (Sesión 2)
- ✅ **Generación dinámica de personajes según medicamentos** (Sesión 2)
- ✅ **Análisis automático de tipos de medicamentos** (Sesión 2)
- ✅ **Selectores de perfil de usuario** (Sesión 3) - género, orientación, situación sentimental
- ✅ **Personalización de conversaciones por perfil** (Sesión 3)
- ✅ **Reparación automática de JSON truncados** (Sesión 3) - repairJSON()
- ✅ **Retry automático para errores de red** (Sesión 3) - fetchWithRetry()
- ✅ **Detección mejorada de ambiente** (Sesión 3) - dual-method
- ✅ **Medicamentos como roommates integrados** (Sesión 3) - menos técnico, más práctico
- ✅ **Conversaciones de 45-50 mensajes** (Sesión 3) - aumentado desde 30-35
- ✅ Fallback cuando falla la API con conversación de ejemplo
- ✅ Estados de carga con animación
- ✅ Manejo de errores mejorado
- ✅ UI responsive mobile-first
- ✅ Animaciones fade-in para mensajes
- ✅ Dark theme con gradientes

### Lógica de Backend (api/analyze.js)
**Función `analyzeSymptoms()`** (líneas ~29-117):
- Detecta automáticamente tipo de medicamento (SSRIs, benzodiacepinas, etc.)
- Genera personajes relevantes según condiciones que tratan
- Agrega cada medicamento como personaje educativo
- Fallback a personajes genéricos si no detecta medicamento

**Función `generatePrompt()`** (líneas ~122-590):
- Crea prompt personalizado con personajes dinámicos
- Acepta `userProfile` (género, orientación, situación sentimental) - **Nuevo Sesión 3**
- Personaliza conversaciones según perfil del usuario - **Nuevo Sesión 3**
- Solicita español chileno casual
- Especifica formato Instagram DM con 45-50 mensajes - **Actualizado Sesión 3**
- Incluye horarios (mañana, mediodía, tarde, noche)
- Define medicamentos como "roommates" no "profesores" - **Actualizado Sesión 3**
- 50+ ejemplos de interacciones situacionales - **Nuevo Sesión 3**
- 10 reglas críticas para JSON válido - **Reforzado Sesión 3**

**Función `repairJSON()`** (líneas ~682-751) - **Nueva Sesión 3**:
- Detecta JSONs truncados (count de llaves/corchetes)
- Remueve trailing commas
- Identifica y remueve contenido incompleto
- Cierra strings, arrays y objetos abiertos
- Logging detallado con emojis

**Función `fetchWithRetry()`** (líneas ~626-651) - **Nueva Sesión 3**:
- Retry automático para errores de red (2 intentos)
- Espera 2 segundos entre reintentos
- Solo reintenta errores de socket/fetch failed
- Logging de cada intento

**Configuración de API:**
- max_tokens: 4500 (aumentado desde 3000 en Sesión 3)
- Model: claude-sonnet-4-20250514

---

## 📝 HISTORIAL DE SESIONES

### Sesión 1 - 2025-12-04
**Duración:** ~3-4 horas
**Estado Final:** ✅ Completada exitosamente

#### Objetivos Iniciales:
1. Establecer documento de memoria del proyecto
2. Crear acceso directo a conversación
3. Revisar estado actual del proyecto
4. Crear backend seguro para proteger API key

#### Lo que Logramos:

**1. Infraestructura y Documentación** ✅
- ✅ Creación de `PROJECT_MEMORY.md` (este documento)
- ✅ Creación de `DEPLOYMENT.md` (guía completa de deploy)
- ✅ Creación de `README.md` actualizado
- ✅ Creación de `CHANGELOG-SESSION-1.md`
- ✅ Creación de `start-project.sh` (script de inicio rápido)
- ✅ Creación de acceso directo `ThoughtCabinet.desktop` en escritorio

**2. Backend Seguro** ✅
- ✅ Creación de `/api/analyze.js` (Vercel Serverless Function)
- ✅ Configuración de `vercel.json`
- ✅ Configuración de `postcss.config.js` y `tailwind.config.js`
- ✅ Migración de llamada API de frontend a backend
- ✅ API key ahora protegida en servidor (nunca se expone al navegador)

**3. Frontend - Tailwind CSS** ✅
- ✅ Instalación de Tailwind CSS v3, PostCSS, Autoprefixer
- ✅ Instalación de lucide-react (iconos)
- ✅ Configuración completa de Tailwind
- ✅ Actualización de `src/index.css` con directivas de Tailwind
- ✅ App ahora renderiza correctamente con todos los estilos

**4. Mejoras de Código** ✅
- ✅ Simplificación de `src/App.js` (de ~90 líneas a ~45 en `generateReport`)
- ✅ Mejor manejo de errores en desarrollo local vs producción
- ✅ Mensajes de error más claros para el usuario
- ✅ Fallback funcional cuando backend no está disponible

**5. Deploy a Producción** ✅
- ✅ Proyecto deployado exitosamente en Vercel
- ✅ Auto-deploy configurado desde GitHub (branch master)
- ✅ Variables de entorno configuradas (`ANTHROPIC_API_KEY`)
- ✅ App funcionando en producción con backend real

#### Problemas Encontrados y Soluciones:

**Problema 1: App mostraba página en blanco**
- **Causa:** Tailwind CSS no estaba instalado
- **Solución:** Instalación y configuración completa de Tailwind v3
- **Resultado:** ✅ App renderiza correctamente

**Problema 2: Error JSON en desarrollo local**
- **Causa:** Backend `/api/analyze` no existe en `npm start`
- **Solución:** Mejor manejo de errores, detección de localhost, mensajes más claros
- **Resultado:** ✅ Fallback funciona, mensaje claro al usuario

**Problema 3: Vercel no hacía auto-deploy**
- **Causa:** Proyecto no conectado correctamente
- **Solución:** Reimportar proyecto en Vercel, configurar webhooks
- **Resultado:** ✅ Auto-deploy funcionando

**Problema 4: Deploy fallaba por Secret inexistente**
- **Causa:** `vercel.json` referenciaba `@anthropic-api-key` que no existía
- **Solución:** Eliminar referencia a Secret, usar Environment Variables del dashboard
- **Resultado:** ✅ Deploy exitoso

#### Arquitectura Implementada:

**Antes (Inseguro):**
```
Frontend (navegador) → Anthropic API directamente
                      ↑ API key visible en código
```

**Después (Seguro):**
```
Frontend (navegador) → Backend (/api/analyze) → Anthropic API
                                               ↑ API key protegida
```

#### Archivos Creados:
- `api/analyze.js` - Backend serverless function
- `vercel.json` - Configuración de Vercel
- `postcss.config.js` - Configuración de PostCSS
- `tailwind.config.js` - Configuración de Tailwind
- `.env.example` - Template de variables de entorno
- `PROJECT_MEMORY.md` - Este documento
- `DEPLOYMENT.md` - Guía de deployment
- `CHANGELOG-SESSION-1.md` - Changelog detallado
- `start-project.sh` - Script de inicio
- `ThoughtCabinet.desktop` - Acceso directo

#### Archivos Modificados:
- `src/App.js` - Usa backend, mejor manejo de errores
- `src/index.css` - Directivas de Tailwind agregadas
- `package.json` - Nuevas dependencias
- `package-lock.json` - Lockfile actualizado
- `.env` - Nueva variable sin prefijo REACT_APP_
- `README.md` - Documentación actualizada

#### Decisiones Técnicas:

**¿Por qué Vercel Serverless Functions?**
- Gratis para proyectos personales
- Zero-config (carpeta `api/` detectada automáticamente)
- Deploy integrado con frontend
- Escalable automáticamente

**¿Por qué Tailwind v3 en vez de v4?**
- Mayor compatibilidad con Create React App
- Configuración más simple
- v4 requiere plugins adicionales que causaban errores

**¿Por qué mantener el fallback?**
- Permite desarrollo local sin `vercel dev`
- Mejor UX si hay problemas de red
- No gasta tokens de API en testing

#### Métricas:

**Commits realizados:** 3
1. "Vercel Settings and API Settings"
2. "Improve error handling for local development"
3. "Fix vercel.json - remove invalid secret reference"
4. "trigger vercel deploy" (commit vacío para testing)

**Dependencias agregadas:**
- tailwindcss v3
- postcss
- autoprefixer
- lucide-react

**Líneas de código:**
- Backend: ~170 líneas nuevas (`api/analyze.js`)
- Frontend: -33 líneas (simplificación de `generateReport`)
- Configuración: ~50 líneas (tailwind, postcss, vercel configs)

#### Estado al Final de la Sesión:

**Funcionando en Producción:** ✅
- URL de Vercel: Activa y funcionando
- Backend: Operativo con Claude API
- Frontend: Estilos correctos, UX fluida
- Auto-deploy: Configurado y testeado

**Pendiente para Próximas Sesiones:**
- [ ] Optimizar prompt con estándares éticos médicos
- [ ] Iterar narrativa hacia tono más original
- [ ] Agregar disclaimer médico explícito en UI
- [ ] Agregar contexto educativo sobre medicamentos
- [ ] Testing de accesibilidad

#### Aprendizajes de la Sesión:

1. **Serverless Functions:** Entendimiento de cómo funcionan y cuándo están disponibles
2. **Tailwind CSS:** Configuración completa en Create React App
3. **Vercel Deploy:** Proceso completo desde importar hasta auto-deploy
4. **Environment Variables:** Diferencia entre Secrets y Environment Variables en Vercel
5. **Error Handling:** Importancia de detectar ambiente (local vs producción)

#### Notas Importantes:

- El proyecto pasó de prototipo a aplicación production-ready
- Seguridad mejorada significativamente (API key protegida)
- Infraestructura profesional establecida
- Documentación completa para futuras sesiones
- El usuario maneja Git con GitKraken (no CLI)
- Desarrollo local con `npm start` usa fallback (esperado)

#### Próxima Sesión - Plan Sugerido:

**Prioridad Alta:**
1. Probar app en producción con casos reales
2. Revisar y optimizar prompt de análisis
3. Desarrollar narrativa más original
4. Agregar disclaimer médico visible

**Preparación:**
- Leer este documento al inicio
- Revisar prompt actual en `api/analyze.js` (líneas 40-103)
- Pensar en qué tono/voz quieres para la narrativa

---

### Sesión 2 - 2026-01-12
**Duración:** ~2 horas
**Estado Final:** ✅ Completada exitosamente

#### Objetivos Iniciales:
1. Refactorizar la app a formato Instagram DM
2. Implementar generación dinámica de personajes según medicamentos
3. Actualizar diseño a dark theme moderno
4. Agregar contenido educativo específico sobre medicamentos
5. Configurar branch `develop` en Git/GitHub

#### Lo que Logramos:

**1. Refactorización Completa a Instagram DM** ✅
- ✅ Diseño visual completamente nuevo estilo Instagram DM
- ✅ Dark theme con gradientes (negro a #1a1a2e)
- ✅ Burbujas de mensaje con gradientes purple/blue para usuario
- ✅ Avatares circulares con emoji y colores personalizados
- ✅ Header con indicador "Activo ahora"
- ✅ Footer con lista de participantes
- ✅ Animaciones fade-in progresivas para mensajes

**2. Generación Dinámica de Personajes** ✅
- ✅ Función `analyzeSymptoms()` detecta tipos de medicamentos
- ✅ Personajes generados según condiciones que tratan:
  - SSRIs → REGULACIÓN EMOCIONAL + SISTEMA DE ALARMA
  - Benzodiacepinas → SISTEMA DE ALARMA
  - Estimulantes → FUNCIÓN EJECUTIVA + ENFOQUE
  - Gabapentinoides → SISTEMA DE ALARMA + CUERPO
  - Antipsicóticos → FILTRO DE REALIDAD + REGULACIÓN EMOCIONAL
  - Medicamentos para el sueño → CICLO DE SUEÑO
  - Y más tipos cubiertos
- ✅ Cada medicamento aparece como personaje educativo
- ✅ Fallback a personajes genéricos si no se detecta medicamento

**3. Backend - Análisis Dinámico** ✅
- ✅ `api/analyze.js` completamente refactorizado (332 líneas)
- ✅ Función `analyzeSymptoms()`: 88 líneas de lógica de detección
- ✅ Función `generatePrompt()`: prompt personalizado según medicamentos
- ✅ Detección de 8+ tipos diferentes de medicamentos
- ✅ Prompt actualizado para español chileno casual
- ✅ Solicita 15-25 mensajes en horarios mañana/mediodía/noche
- ✅ Max tokens aumentado a 3000 para conversaciones más largas

**4. Frontend - UI Instagram DM** ✅
- ✅ `src/App.js` completamente refactorizado (499 líneas)
- ✅ Vista de gestión modernizada:
  - Inputs con focus effects (border purple + ring)
  - Botones con gradientes y sombras
  - Cards con rounded-2xl
- ✅ Vista de conversación:
  - Mensajes alineados (usuario derecha, otros izquierda)
  - Nombres de participantes con colores dinámicos
  - Reacciones debajo de mensajes
  - Timestamps en cada mensaje
  - Scroll suave y responsive
- ✅ Fallback actualizado al nuevo formato
- ✅ Todo en español (labels: Mañana, Tarde, Noche)

**5. Git Workflow con Sublime Merge** ✅
- ✅ Verificación de branch actual (`develop`)
- ✅ Commit de refactorización creado localmente
- ✅ Branch `develop` pusheada a GitHub por primera vez
- ✅ `develop` y `master` divergieron (develop 1 commit adelante)
- ✅ Usuario aprendiendo Sublime Merge (anteriormente GitKraken)
- ✅ Acceso directo al proyecto creado en escritorio

#### Archivos Modificados:
- `api/analyze.js` - Refactorización completa (+252 líneas, -158 líneas)
- `src/App.js` - Refactorización completa UI (+266 líneas, -233 líneas)
- `PROJECT_MEMORY.md` - Actualizado con Sesión 2

#### Decisiones Técnicas:

**¿Por qué Instagram DM en vez de Disco Elysium?**
- Más accesible y familiar para usuarios modernos
- Permite tono casual en español chileno
- Formato más dinámico para conversaciones educativas
- Estética moderna que normaliza el uso de medicamentos

**¿Por qué generar personajes dinámicamente?**
- Conversaciones personalizadas a las condiciones del usuario
- Contenido educativo específico sobre los medicamentos que usan
- Evita personajes genéricos irrelevantes
- Mejora la experiencia educativa

**¿Por qué español chileno?**
- Usuario es chileno
- Lenguaje más cercano y auténtico
- Normaliza la conversación sobre salud mental
- Reduce sensación de herramienta "corporativa" o clínica

#### Métricas:

**Commit realizado:** 1
```
411d2ce - Refactorizar app a formato Instagram DM con personajes dinámicos
```

**Líneas de código:**
- Backend: +252 líneas, -158 líneas (net: +94)
- Frontend: +266 líneas, -233 líneas (net: +33)
- Total: +518 líneas, -391 líneas (net: +127)

**Funcionalidades nuevas:** 3
1. Generación dinámica de personajes
2. UI Instagram DM
3. Análisis automático de medicamentos

#### Innovaciones Clave:

**1. Personalización Basada en Medicamentos**
El sistema ahora analiza qué condiciones tratan los medicamentos del usuario y genera personajes relevantes. Por ejemplo:
- Usuario con Sertralina → personajes de depresión/ansiedad
- Usuario con Metilfenidato → personajes de TDAH/concentración
- Usuario con múltiples medicamentos → personajes combinados

**2. Contenido Educativo Integrado**
Los medicamentos son personajes que explican su mecanismo:
- "Bloqueo la recaptación de serotonina..."
- "Modulo los receptores GABA..."
- "Aumento la dopamina disponible..."

**3. Tono Chileno Auténtico**
El prompt solicita específicamente español chileno casual:
- "wn", "po", "cachai", "brigido"
- Normaliza la conversación sobre salud mental
- Reduce estigma con lenguaje cercano

#### Problemas Encontrados y Soluciones:

**Problema 1: Git push fallaba desde terminal**
- **Causa:** Autenticación HTTPS no configurada en terminal
- **Solución:** Usuario hizo push desde Sublime Merge
- **Resultado:** ✅ Branch `develop` creada en GitHub exitosamente

**Problema 2: ESLint warning por función no usada**
- **Causa:** `getMedsByTime()` quedó del código antiguo
- **Solución:** Eliminar función no utilizada
- **Resultado:** ✅ Compilación sin warnings

#### Estado al Final de la Sesión:

**Git:**
- ✅ Branch: `develop`
- ✅ Sincronizada con `origin/develop`
- ✅ 1 commit adelante de `master`
- ✅ Archivo `PROJECT_MEMORY.md` pendiente de commit

**Funcionando:**
- ✅ App corriendo en localhost:3000
- ✅ Nuevo diseño Instagram DM visible
- ✅ Fallback funcional con conversación de ejemplo
- ✅ Backend listo para generar conversaciones dinámicas en producción

**Pendiente:**
- [ ] Deploy a Vercel (auto-deploy cuando se haga merge a master)
- [ ] Probar con API real en producción
- [ ] Commit de PROJECT_MEMORY.md
- [ ] Merge de `develop` a `master` cuando esté listo

#### Aprendizajes de la Sesión:

1. **Generación Dinámica:** Cómo analizar input del usuario para personalizar output
2. **Instagram DM UI:** Patrones de diseño para chat interfaces
3. **Sublime Merge:** Usuario aprendiendo nuevo flujo de trabajo Git
4. **Español Chileno:** Cómo integrar lenguaje regional en prompts
5. **Modularización:** Separar lógica de análisis y generación de prompts

#### Próxima Sesión - Plan Sugerido:

**Prioridad Alta:**
1. Hacer merge de `develop` a `master` y deploy a producción
2. Probar app con medicamentos reales y verificar personajes generados
3. Ajustar prompt si es necesario (más/menos chileno, más educativo, etc.)
4. Agregar más tipos de medicamentos a `analyzeSymptoms()` si falta alguno

**Prioridad Media:**
5. Agregar disclaimer médico visible en UI
6. Mejorar animaciones y transiciones
7. Testing de accesibilidad

**Preparación:**
- Leer este documento al inicio
- Tener lista de medicamentos para probar
- Pensar qué ajustes quieres al tono de las conversaciones

---

### Sesión 3 - 2026-01-13
**Duración:** ~3 horas
**Estado Final:** ✅ Completada exitosamente - Cambios en producción

#### Contexto Inicial:
Esta sesión empezó como continuación de una sesión anterior que llegó al límite de contexto. Se encontraron reverts incompletos y merge conflicts que necesitaban limpieza.

#### Objetivos Iniciales:
1. Resolver merge conflicts y volver a estado estable
2. Arreglar detección de ambiente (toggle visible en producción)
3. Mejorar interacción de medicamentos en chat (menos técnico, más integrado)
4. Aumentar cantidad de mensajes a ~50
5. Integrar selectores de perfil de usuario
6. Robustecer manejo de JSON para evitar errores

#### Lo que Logramos:

**1. Limpieza y Estado Estable** ✅
- ✅ Resuelto merge conflict en `api/analyze.js` (línea de CANTIDAD)
- ✅ Eliminados completamente selectores de perfil incompletos
- ✅ Removidas 192 líneas de código problemático
- ✅ App compila sin errores
- ✅ Commit: `c69ce44` - "fix: resolver merge conflict y eliminar selectores de perfil"

**2. Mejora de Detección de Ambiente** ✅
- ✅ **Problema identificado:** Toggle de API/Mock visible en producción
- ✅ **Causa:** Lógica asumía que todo `vercel.app` era preview
- ✅ **Solución implementada:**
  - Método primario: Variable de entorno `REACT_APP_VERCEL_ENV`
  - Método fallback: Detección inteligente por hostname
    - Preview: `xxx-git-branch.vercel.app` o múltiples guiones
    - Production: dominios simples o custom
- ✅ Creado `VERCEL_SETUP.md` (102 líneas) con guía completa
- ✅ Commit: `7a53fd4` - "fix: mejorar detección de ambiente"

**3. Mejora de Interacción de Medicamentos** ✅
- ✅ **Cambio de personalidad:**
  - **ANTES:** Nerds que explican mecanismos (SERT, 5-HT1A, GABA-A)
  - **AHORA:** Roommates que comentan en tiempo real
- ✅ **Nuevos ejemplos de interacción:**
  - Romántico: "espera 20 mins, estoy recalibrando tus impulsos"
  - Gym: "dale duro, yo me encargo de la dopamina cuando termines"
  - Sueño: "sí, esa es mi culpa, pero en 2 semanas se pasa"
  - Cotidiano: "hey, enfócate, estoy tratando de ayudarte y tú con TikTok"
- ✅ 50+ ejemplos variados por contexto
- ✅ Menos lenguaje técnico, más reacciones situacionales

**4. Aumento de Mensajes** ✅
- ✅ **ANTES:** 30-35 mensajes
- ✅ **AHORA:** 45-50 mensajes
- ✅ Refuerzos de seguridad para JSON:
  - ⚠️ Prohibición explícita de emojis en campo "text"
  - ⚠️ Solo texto, números, \n permitidos
  - ⚠️ Priorizar completar JSON sobre agregar más mensajes
- ✅ Commit: `a70546c` - "feat: mejorar interacción de medicamentos y aumentar mensajes a 45-50"

**5. Selectores de Perfil de Usuario** ✅
- ✅ **Frontend (`src/App.js`):**
  - Género: Hombre, Mujer, No binario, Prefiero no decir
  - Orientación: Hetero, Gay/Lesbiana, Bi, Prefiero no decir
  - Situación sentimental: Multi-select (Pareja, Situationship, Crush, Solterísimo, Recién terminado)
  - Estados guardados en localStorage
  - UI con botones gradient cuando seleccionados
- ✅ **Backend (`api/analyze.js`):**
  - Función `generatePrompt()` acepta `userProfile`
  - Construye contexto personalizado
  - Ajusta pronombres, referencias románticas, situaciones
  - Instrucción explícita: "USA ESTA INFORMACIÓN para personalizar el 35% de social anxiety"

**6. Robustecimiento de JSON** ✅
- ✅ **Función `repairJSON()`:**
  - Detecta JSONs truncados (count de llaves/corchetes)
  - Remueve trailing commas automáticamente
  - Remueve contenido incompleto después de última coma
  - Cierra strings abiertos
  - Cierra arrays y objetos faltantes
  - Logging detallado con emojis (🔧📊✅⚠️)
- ✅ **Limpieza de caracteres:**
  - Remueve caracteres de control problemáticos
  - Convierte comillas tipográficas a normales
  - Mantiene solo \n, \r, \t como especiales
- ✅ **Aumento de max_tokens:**
  - **ANTES:** 3000 tokens
  - **AHORA:** 4500 tokens (50% más)
- ✅ **Instrucciones reforzadas:**
  - 10 reglas críticas para JSON
  - "COMPLETA SIEMPRE EL JSON"
  - "Es mejor 40 mensajes completos que 50 truncados"

**7. Retry Automático para Errores de Red** ✅
- ✅ **Problema:** Error transitorio `UND_ERR_SOCKET` (conexión cerrada)
- ✅ **Solución:** Función `fetchWithRetry()`
  - 2 intentos automáticos
  - 2 segundos de espera entre reintentos
  - Solo reintenta errores de red (no errores de API)
  - Logging detallado de cada intento
- ✅ Usuario ya no necesita reintentar manualmente

**8. Regla de Protocolo sobre Git** ✅
- ✅ **ESTABLECIDO:** Claude solo hace código
- ✅ Usuario maneja todo lo relacionado con Git:
  - Commits
  - Push
  - Checkout
  - Merge
  - Branches
- ✅ Claude solo hace git cuando se le pida específicamente (para arreglar errores)

#### Archivos Creados:
- `VERCEL_SETUP.md` - Guía de configuración de variables de entorno (102 líneas)

#### Archivos Modificados:
- `api/analyze.js` - Múltiples mejoras:
  - Función `generatePrompt()` con soporte de userProfile
  - Personalidad de medicamentos redefinida
  - Instrucciones JSON reforzadas
  - Función `repairJSON()` agregada (70 líneas)
  - Función `fetchWithRetry()` agregada (25 líneas)
  - Limpieza de caracteres problemáticos
  - max_tokens: 3000 → 4500
- `src/App.js` - Selectores de perfil:
  - Estados agregados (gender, orientation, relationshipStatus)
  - Funciones de actualización
  - UI completa con botones
  - Envío al backend

#### Decisiones Técnicas:

**¿Por qué cambiar personalidad de medicamentos?**
- **Antes:** Demasiado técnico, menos útil en situaciones reales
- **Ahora:** Se meten en decisiones del momento, más práctico
- Ejemplo: "no le respondas ahora" vs "estoy modulando GABA-A"

**¿Por qué 45-50 mensajes en vez de 30-35?**
- Conversaciones más ricas y completas
- Suficiente espacio para desarrollar arcos narrativos
- Con max_tokens: 4500, es manejable
- Reparación de JSON como safety net

**¿Por qué retry automático?**
- Errores de red son transitorios y comunes con APIs externas
- Mejor UX: usuario no necesita reintentar
- Solo 2 intentos (no infinito) para evitar loops

**¿Por qué robustecer JSON en vez de acortar?**
- Usuario quería conversaciones más largas, no más cortas
- Reparación permite recuperar JSONs parciales
- max_tokens aumentado da más espacio
- Multi-layer approach: prevención + reparación

#### Métricas:

**Commits realizados:** 3 (todos por el usuario)
```
c69ce44 - fix: resolver merge conflict y eliminar selectores de perfil
7a53fd4 - fix: mejorar detección de ambiente para ocultar toggle en production
a70546c - feat: mejorar interacción de medicamentos y aumentar mensajes a 45-50
```

**Branch de trabajo:** `feature/improve-medication-chat`

**Líneas de código agregadas:**
- `api/analyze.js`: ~150 líneas (repairJSON, fetchWithRetry, mejoras)
- `src/App.js`: ~90 líneas (selectores de perfil)
- `VERCEL_SETUP.md`: 102 líneas nuevas
- **Total:** ~340 líneas nuevas

**Líneas de código removidas:**
- Selectores incompletos: 192 líneas
- Código simplificado: ~30 líneas

**Funcionalidades nuevas:** 5
1. Selectores de perfil de usuario
2. Reparación automática de JSON
3. Retry automático para errores de red
4. Detección mejorada de ambiente
5. Nueva personalidad de medicamentos (integrada)

#### Problemas Encontrados y Soluciones:

**Problema 1: Merge conflict sin resolver**
- **Causa:** Revert incompleto de sesión anterior
- **Solución:** Edición manual del conflicto
- **Resultado:** ✅ Estado estable restaurado

**Problema 2: Toggle visible en producción**
- **Causa:** Lógica de detección simplista
- **Solución:** Dual-method detection (env var + hostname patterns)
- **Resultado:** ✅ Toggle solo en preview

**Problema 3: JSONs truncados (error 500)**
- **Causa:** Conversaciones largas excedían max_tokens
- **Solución:**
  - Aumentar max_tokens: 3000 → 4500
  - Función repairJSON()
  - Instrucciones reforzadas
- **Resultado:** ✅ JSON reparado automáticamente

**Problema 4: Error de red transitorio**
- **Causa:** Timeout/conexión cerrada por Anthropic API
- **Solución:** fetchWithRetry() con 2 intentos
- **Resultado:** ✅ Retry automático exitoso

#### Innovaciones Clave:

**1. Medicamentos como Roommates**
La mayor innovación de esta sesión. Los medicamentos ya no son profesores que explican química, sino amigos que:
- Comentan lo que pasa: "hey, enfócate"
- Dan consejos prácticos: "espera 30 mins"
- Admiten culpas: "sí, esa somnolencia soy yo"
- Se meten en decisiones: "no le respondas ahora"

**2. Reparación Inteligente de JSON**
No solo detectar errores, sino repararlos:
- Analizar estructura (count de llaves/corchetes)
- Identificar último punto válido
- Remover contenido truncado
- Cerrar estructuras abiertas
- Reintentar parse

**3. Personalización por Perfil**
Conversaciones adaptadas a:
- Género → pronombres correctos
- Orientación → referencias románticas apropiadas
- Situación sentimental → temas relevantes (crush, pareja, etc.)

**4. Dual-Method Environment Detection**
- Primary: Variable de entorno (confiable, explícito)
- Fallback: Pattern matching en hostname (automático)
- Funciona incluso sin configuración manual

#### Estado al Final de la Sesión:

**Git:**
- ✅ Branch actual: `feature/improve-medication-chat`
- ✅ Todos los cambios pusheados a producción (por el usuario)
- ✅ App funcionando en producción con mejoras

**Funcionando:**
- ✅ App corriendo en localhost:3000
- ✅ Selectores de perfil operativos
- ✅ Conversaciones de 45-50 mensajes
- ✅ Medicamentos con nueva personalidad
- ✅ Reparación de JSON funcional
- ✅ Retry automático probado

**En Producción:**
- ✅ Toggle oculto en production
- ✅ JSONs robustos con reparación
- ✅ Retry automático para errores de red
- ✅ Personalización por perfil activa

#### Logs de Ejemplo:

**Reparación de JSON exitosa:**
```
🔧 Iniciando reparación de JSON...
📊 Balance: Braces 150/148, Brackets 3/2
⚠️ JSON truncado detectado
✅ Cerrado bracket [1/1]
✅ Cerrada llave {1/2}
✅ Cerrada llave {2/2}
✅ JSON reparado exitosamente
```

**Retry automático exitoso:**
```
🌐 Intentando llamada a API (intento 1/2)...
⚠️ Error de red en intento 1, reintentando en 2 segundos...
🌐 Intentando llamada a API (intento 2/2)...
✅ Llamada exitosa en intento 2
```

#### Aprendizajes de la Sesión:

1. **Robustez sobre Perfección:** Mejor reparar JSONs que restringir longitud
2. **Multi-layer Approach:** Prevención (instrucciones) + Reparación (función)
3. **Retry Pattern:** Errores transitorios son comunes, retry automático mejora UX
4. **Environment Detection:** Dual-method (explicit + implicit) es más robusto
5. **Personalidad de IA:** "Roommate" es más útil que "profesor" para esta app
6. **Git Protocol:** Separación clara de responsabilidades (Claude=código, Usuario=git)

#### Próxima Sesión - Plan Sugerido:

**Prioridad Alta:**
1. Probar selectores de perfil con conversaciones reales
2. Verificar que personalización funciona correctamente
3. Monitorear logs de reparación de JSON (qué tan frecuente)
4. Ajustar cantidad de mensajes si hay muchos JSONs truncados

**Prioridad Media:**
5. Agregar más ejemplos de interacción de medicamentos
6. Considerar agregar más opciones de perfil (edad, contexto laboral, etc.)
7. Testing de accesibilidad con selectores

**Preparación:**
- Leer este documento al inicio
- Probar la app con diferentes perfiles
- Observar si la personalización es notable en las conversaciones

---

---

## 🚀 ROADMAP Y PRÓXIMOS PASOS

### Prioridad Alta
- [✅] Selectores de perfil de usuario - **COMPLETADO Sesión 3**
- [✅] Robustecimiento de JSON - **COMPLETADO Sesión 3**
- [✅] Mejorar interacción de medicamentos - **COMPLETADO Sesión 3**
- [✅] Detección de ambiente mejorada - **COMPLETADO Sesión 3**
- [ ] Probar selectores de perfil con casos reales (verificar personalización)
- [ ] Monitorear frecuencia de reparación de JSON
- [ ] Agregar disclaimer médico explícito visible en UI
- [ ] Revisar prompts con profesional de salud mental
- [✅] Configurar deployment (Vercel u otra plataforma) - **COMPLETADO Sesión 1**
- [✅] Iterar tono narrativo - **COMPLETADO Sesión 2 (Instagram DM)**
- [✅] Generación dinámica de personajes - **COMPLETADO Sesión 2**
- [✅] Conversaciones más largas - **COMPLETADO Sesión 3 (45-50 mensajes)**

### Prioridad Media
- [✅] Mover API key a backend seguro - **COMPLETADO Sesión 1**
- [✅] Mejorar manejo de errores - **COMPLETADO Sesión 1 & 3**
- [✅] Agregar contexto educativo sobre medicamentos - **COMPLETADO Sesión 2 & 3**
- [✅] Retry automático para errores de red - **COMPLETADO Sesión 3**
- [ ] Agregar más tipos de medicamentos a detección
- [ ] Considerar más opciones de perfil (edad, contexto laboral)
- [ ] Testing de accesibilidad
- [ ] Testing con usuarios reales
- [ ] Ajustar cantidad de mensajes según feedback de JSONs

### Prioridad Baja
- [✅] Animaciones de transición - **COMPLETADO Sesión 2 (fade-in)**
- [ ] Exportar/importar data
- [ ] Temas de color personalizables (actualmente dark theme fijo)
- [ ] PWA features
- [ ] Modo offline
- [ ] Gráficos de progreso temporal

---

## 🛠️ CONFIGURACIÓN DE DESARROLLO

### Prerrequisitos
- Node.js (versión no especificada, recomendado 18+)
- npm
- API key de Anthropic

### Variables de Entorno

**Desarrollo Local (`.env`):**
```bash
ANTHROPIC_API_KEY=tu_api_key_aqui
```

**Producción (Vercel Dashboard):**

1. **ANTHROPIC_API_KEY** (Requerida):
   - Settings → Environment Variables
   - Value: [tu API key de Anthropic]
   - Environments: Production, Preview, Development

2. **REACT_APP_VERCEL_ENV** (Recomendada - Sesión 3):
   - Para Production:
     - Value: `production`
     - Environment: ✅ Solo Production
   - Para Preview:
     - Value: `preview`
     - Environment: ✅ Solo Preview
   - Propósito: Mejorar detección de ambiente (toggle solo en preview)
   - Ver: `VERCEL_SETUP.md` para guía completa

### Comandos
```bash
npm start          # Desarrollo local (puerto 3000) - usa fallback
npm run build      # Build para producción
npm test           # Tests
./start-project.sh # Script interactivo con menú
```

### Deploy a Vercel
✅ **Completado** - Ver `DEPLOYMENT.md` para instrucciones detalladas
- Auto-deploy configurado desde GitHub
- Cada push a `master` → deploy automático
- URL: [configurada en Vercel]

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Técnica
- [React 19 Docs](https://react.dev)
- [Anthropic Claude API Docs](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com)

### Referencias Narrativas
- Disco Elysium (videojuego)
- [AGREGAR MÁS REFERENCIAS]

### Estándares Éticos
- [POR INVESTIGAR: Estándares médicos para apps de salud mental]
- [POR INVESTIGAR: HIPAA compliance si aplica]

---

## 🤝 COLABORACIÓN

**Desarrollador:** Branko
**Asistente:** Claude (Anthropic)
**Control de versiones:** Git + Sublime Merge (anteriormente GitKraken)
**Branch principal:** `master` (producción)
**Branch de desarrollo:** `develop` o feature branches
**Comunicación:** Este documento se actualiza al final de cada sesión

### ⚠️ PROTOCOLO DE GIT (IMPORTANTE)
**Claude:**
- ✅ Solo hace código (editar archivos, escribir funciones)
- ❌ NO hace comandos de git (commit, push, checkout, merge, branch)
- ✅ Solo hace git cuando Branko lo pida específicamente (para arreglar errores)

**Branko:**
- ✅ Maneja TODO lo relacionado con Git
- ✅ Commits, push, checkout, merge, branches
- ✅ Decide cuándo y cómo hacer commits
- ✅ Gestiona el flujo de trabajo con Sublime Merge

### Protocolo de Actualización
1. Branko da la orden: "Actualiza la memoria"
2. Claude actualiza este documento con el progreso de la sesión
3. Branko hace commit en Git desde Sublime Merge

### Workflow de Git
1. Desarrollo en branch `develop` o feature branches
2. Commits frecuentes con mensajes descriptivos (por Branko)
3. Cuando feature está lista: merge → `master` (por Branko)
4. Vercel auto-deploys cuando detecta cambios en `master`

---

## 📌 NOTAS IMPORTANTES

### Para recordar cada sesión
1. Este proyecto trata datos sensibles de salud mental
2. Priorizar privacidad y ética por encima de features
3. El tono debe ser honesto, cercano (español chileno), nunca condescendiente
4. NO somos profesionales médicos - nunca diagnosticar
5. **⚠️ PROTOCOLO GIT:** Claude solo hace código. Branko maneja TODO lo de Git (commits, push, checkout, merge, branches). Claude solo hace git cuando se le pida específicamente para arreglar errores.
6. Personajes se generan dinámicamente según medicamentos
7. Contenido debe ser educativo sobre mecanismos farmacológicos
8. Medicamentos son "roommates" que comentan en tiempo real, NO profesores

### Aprendizajes Clave
- localStorage es suficiente para MVP (no necesita DB aún)
- El fallback cuando falla la API es buena UX
- Los usuarios valoran la honestidad sobre el paternalismo
- Instagram DM es formato familiar y accesible
- Español chileno normaliza conversación sobre salud mental
- Personalización basada en medicamentos mejora relevancia
- Generación dinámica de personajes es más útil que personajes fijos
- **Robustez > Perfección:** Reparar JSONs es mejor que restringir longitud
- **Multi-layer approach:** Prevención + Reparación = mejor que solo uno
- **Retry automático** mejora UX significativamente con APIs externas
- **Dual-method detection** (explicit + fallback) es más confiable
- Medicamentos como "roommates" es más útil que como "profesores"
- **Separación de responsabilidades:** Claude código, Usuario git

---

## 🔍 PREGUNTAS ABIERTAS

1. ¿El tono en español chileno es apropiado o muy informal?
2. ¿Qué estándares éticos específicos debemos cumplir?
3. ¿Necesitamos consulta con profesional de salud mental para validar contenido?
4. ¿El modelo de Claude actual (Sonnet 4) es el óptimo para este uso?
5. ¿Falta detectar algún tipo de medicamento común en `analyzeSymptoms()`?
6. ¿Las explicaciones farmacológicas son precisas y comprensibles?
7. ¿Deberíamos agregar modo claro además del dark theme?
8. ¿Cómo medimos si la app efectivamente reduce estigma?
9. **NUEVO (Sesión 3):** ¿La personalización por perfil es notable en las conversaciones?
10. **NUEVO (Sesión 3):** ¿Qué tan frecuente es la reparación de JSON? ¿Necesitamos ajustar max_tokens?
11. **NUEVO (Sesión 3):** ¿Los medicamentos como "roommates" son más útiles que como "profesores"?
12. **NUEVO (Sesión 3):** ¿45-50 mensajes es la longitud óptima o debería ajustarse?

---

**FIN DEL DOCUMENTO DE MEMORIA**

_Este documento es un ser vivo. Crece con cada sesión._
