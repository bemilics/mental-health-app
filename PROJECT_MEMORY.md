# 🧠 MEMORIA DEL PROYECTO - MENTAL HEALTH CHECK-IN

> **Documento de seguimiento sesión a sesión**
> Última actualización: 2026-01-12

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
│   └── analyze.js      # Serverless function (332 líneas) - análisis dinámico
├── public/
├── src/
│   ├── App.js          # Componente principal (499 líneas) - Instagram DM UI
│   ├── index.css       # Estilos base + Tailwind
│   └── index.js        # Entry point
├── .gitignore
├── package.json
├── vercel.json         # Configuración de Vercel
├── tailwind.config.js  # Configuración de Tailwind
├── postcss.config.js   # Configuración de PostCSS
├── README.md
└── PROJECT_MEMORY.md   # Este archivo
```

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
- ✅ **Vista de conversación Instagram DM** (nueva Sesión 2)
- ✅ **Generación dinámica de personajes según medicamentos** (nueva)
- ✅ **Análisis automático de tipos de medicamentos** (nueva)
- ✅ Fallback cuando falla la API con conversación de ejemplo
- ✅ Estados de carga con animación
- ✅ Manejo de errores mejorado
- ✅ UI responsive mobile-first
- ✅ Animaciones fade-in para mensajes
- ✅ Dark theme con gradientes

### Lógica de Backend (api/analyze.js)
**Función `analyzeSymptoms()`** (líneas 29-117):
- Detecta automáticamente tipo de medicamento (SSRIs, benzodiacepinas, etc.)
- Genera personajes relevantes según condiciones que tratan
- Agrega cada medicamento como personaje educativo
- Fallback a personajes genéricos si no detecta medicamento

**Función `generatePrompt()`** (líneas 122-230):
- Crea prompt personalizado con personajes dinámicos
- Solicita español chileno casual
- Especifica formato Instagram DM con 15-25 mensajes
- Incluye horarios (mañana, mediodía, noche)
- Pide explicaciones específicas de mecanismos farmacológicos

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

---

## 🚀 ROADMAP Y PRÓXIMOS PASOS

### Prioridad Alta
- [ ] Merge de `develop` a `master` y deploy a producción
- [ ] Probar app con medicamentos reales (verificar personajes generados)
- [ ] Agregar disclaimer médico explícito visible en UI
- [ ] Revisar prompts con profesional de salud mental
- [✅] Configurar deployment (Vercel u otra plataforma) - **COMPLETADO Sesión 1**
- [✅] Iterar tono narrativo - **COMPLETADO Sesión 2 (Instagram DM)**
- [✅] Generación dinámica de personajes - **COMPLETADO Sesión 2**

### Prioridad Media
- [✅] Mover API key a backend seguro - **COMPLETADO Sesión 1**
- [✅] Mejorar manejo de errores - **COMPLETADO Sesión 1**
- [✅] Agregar contexto educativo sobre medicamentos - **COMPLETADO Sesión 2**
- [ ] Agregar más tipos de medicamentos a detección
- [ ] Testing de accesibilidad
- [ ] Testing con usuarios reales

### Prioridad Baja
- [✅] Animaciones de transición - **COMPLETADO Sesión 2 (fade-in)**
- [ ] Exportar/importar data
- [ ] Temas de color personalizables (actualmente dark theme fijo)
- [ ] PWA features
- [ ] Modo offline

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
- Settings → Environment Variables
- Key: `ANTHROPIC_API_KEY`
- Value: [tu API key]
- Environments: Production, Preview, Development

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
**Branch de desarrollo:** `develop` (features nuevas)
**Comunicación:** Este documento se actualiza al final de cada sesión

### Protocolo de Actualización
1. Branko da la orden: "Actualiza la memoria"
2. Claude actualiza este documento con el progreso de la sesión
3. Branko hace commit en Git desde Sublime Merge

### Workflow de Git
1. Desarrollo en branch `develop`
2. Commits frecuentes con mensajes descriptivos
3. Cuando feature está lista: merge `develop` → `master`
4. Vercel auto-deploys cuando detecta cambios en `master`

---

## 📌 NOTAS IMPORTANTES

### Para recordar cada sesión
1. Este proyecto trata datos sensibles de salud mental
2. Priorizar privacidad y ética por encima de features
3. El tono debe ser honesto, cercano (español chileno), nunca condescendiente
4. NO somos profesionales médicos - nunca diagnosticar
5. Branko maneja Git con Sublime Merge, Claude escribe código
6. Personajes se generan dinámicamente según medicamentos
7. Contenido debe ser educativo sobre mecanismos farmacológicos

### Aprendizajes Clave
- localStorage es suficiente para MVP (no necesita DB aún)
- El fallback cuando falla la API es buena UX
- Los usuarios valoran la honestidad sobre el paternalismo
- Instagram DM es formato familiar y accesible
- Español chileno normaliza conversación sobre salud mental
- Personalización basada en medicamentos mejora relevancia
- Generación dinámica de personajes es más útil que personajes fijos

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

---

**FIN DEL DOCUMENTO DE MEMORIA**

_Este documento es un ser vivo. Crece con cada sesión._
