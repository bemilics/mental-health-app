# 🧠 The Thought Cabinet

> Una aplicación web que normaliza el diálogo sobre medicación psiquiátrica mediante análisis empático y honesto.

---

## 🎯 Sobre el Proyecto

**The Thought Cabinet** es una aplicación web de salud mental que ayuda a las personas a hablar más cotidianamente sobre sus medicamentos psiquiátricos. A través de un análisis NO CLÍNICO, la app genera un "diálogo interno" sobre la medicación del usuario, celebrando el autocuidado de manera honesta y sin condescendencia.

### Características Principales

- 📝 Registro privado de medicamentos (nombre, dosis, horario)
- 🧠 Análisis narrativo generado por IA (Claude de Anthropic)
- 🎭 Múltiples "voces internas" que dialogan sobre la medicación
- 🔐 Almacenamiento 100% local (localStorage)
- 🚫 NO hace diagnósticos ni recomienda medicamentos

### Filosofía de Diseño

El tono de la aplicación se inspira en Disco Elysium: literario, oscuramente humorístico, profundamente humano. Es brutalmente honesto pero empático, reconociendo lo positivo desde una perspectiva tanto racional como emocional.

**Lo que SÍ hacemos:**
- Normalizar el uso de medicación psiquiátrica
- Educar sobre qué hacen los medicamentos
- Celebrar el autocuidado de forma auténtica
- Generar diálogos internos honestos

**Lo que NO hacemos:**
- Diagnósticos clínicos
- Recomendaciones médicas
- Sustituir atención profesional
- Ser condescendientes

---

## 🚀 Inicio Rápido

### Script de Inicio Interactivo

```bash
cd /home/branko/Proyectos/mental-health-app
./start-project.sh
```

Este script te mostrará un menú con todas las opciones disponibles.

### Comandos Manuales

```bash
# Desarrollo
npm start          # Servidor local en http://localhost:3000

# Producción
npm run build      # Crear build optimizado

# Testing
npm test           # Ejecutar tests
```

### Acceso Directo

Encontrarás un acceso directo llamado **"The Thought Cabinet"** en tu escritorio que abre el proyecto directamente.

---

## 🛠️ Configuración

### Prerrequisitos

- Node.js 18+ y npm
- API Key de Anthropic Claude

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
REACT_APP_ANTHROPIC_API_KEY=tu_api_key_aqui
```

⚠️ **Importante:** El archivo `.env` está en `.gitignore` y nunca debe subirse a Git.

---

## 📁 Estructura del Proyecto

```
mental-health-app/
├── api/                 # Backend (Vercel Serverless Functions)
│   └── analyze.js      # Endpoint para análisis de medicamentos
├── public/              # Archivos públicos estáticos
├── src/
│   ├── App.js          # Componente principal
│   ├── index.css       # Estilos (Tailwind CSS)
│   └── index.js        # Entry point
├── .env                # Variables de entorno (NO subir a Git)
├── .env.example        # Plantilla de variables de entorno
├── .gitignore
├── DEPLOYMENT.md       # Guía completa de deployment
├── package.json
├── PROJECT_MEMORY.md   # Documento de memoria del proyecto
├── README.md           # Este archivo
├── start-project.sh    # Script de inicio rápido
└── vercel.json         # Configuración de Vercel
```

---

## 💻 Stack Tecnológico

- **Frontend:** React 19.2.1
- **Backend:** Vercel Serverless Functions (Node.js)
- **Estilos:** Tailwind CSS (utility-first)
- **Iconos:** lucide-react
- **IA:** Anthropic Claude API (Sonnet 4)
- **Almacenamiento:** localStorage (navegador)
- **Deployment:** Vercel (recomendado)

---

## 📖 Documentación del Proyecto

### Documento de Memoria

Lee `PROJECT_MEMORY.md` para:
- Visión completa del proyecto
- Historial de desarrollo sesión a sesión
- Decisiones técnicas y de diseño
- Roadmap de features
- Notas éticas y de seguridad

Este documento se actualiza al final de cada sesión de desarrollo.

### Visualizar el Documento

```bash
less PROJECT_MEMORY.md        # Vista paginada
cat PROJECT_MEMORY.md          # Vista completa
nano PROJECT_MEMORY.md         # Editar
```

---

## 🔐 Privacidad y Seguridad

### Manejo de Datos

- **Almacenamiento:** Todos los datos se guardan en el navegador del usuario (localStorage)
- **No hay servidor:** No existe base de datos externa
- **API Key:** La clave de Anthropic solo se usa en llamadas directas desde el navegador
- **Datos sensibles:** Nunca salen del dispositivo del usuario (excepto para la llamada a la API de análisis)

### Consideraciones Éticas

Este proyecto sigue principios estrictos:
1. **No diagnosticamos** condiciones médicas
2. **No recomendamos** medicamentos
3. **No sustituimos** atención profesional
4. **Priorizamos** privacidad del usuario
5. **Normalizamos** el diálogo sobre salud mental

---

## 🚢 Deploy a Producción

**Instrucciones completas:** Lee `DEPLOYMENT.md` para guía paso a paso detallada.

### Vercel (Recomendado)

1. Crea cuenta en [vercel.com](https://vercel.com) con GitHub
2. Importa tu repositorio
3. Configura variable de entorno: `ANTHROPIC_API_KEY`
4. Deploy!

El proyecto incluye:
- ✅ Backend seguro con Vercel Serverless Functions
- ✅ Configuración automática (`vercel.json`)
- ✅ API key protegida en el servidor

### Otras Plataformas

- **Netlify:** Soportado (requiere mover carpeta `api/` a `netlify/functions/`)
- **Railway:** Soportado
- **GitHub Pages:** ❌ No soportado (no ejecuta serverless functions)

---

## 🤝 Contribución y Desarrollo

### Control de Versiones

- **Git:** Versionado del código
- **GitKraken:** Cliente visual para Git (usado por Branko)
- **GitHub:** Repositorio remoto

### Workflow

1. Desarrollo local con `npm start`
2. Commits en Git (vía GitKraken)
3. Push a GitHub
4. Deploy automático (cuando se configure)

### Actualizar la Memoria del Proyecto

Después de cada sesión de desarrollo, actualiza `PROJECT_MEMORY.md` con:
- Cambios realizados
- Decisiones tomadas
- Nuevas preguntas o TODOs
- Aprendizajes

---

## 📝 Prompt de la IA

El prompt que genera el análisis está en `src/App.js` (líneas 73-103).

**Parámetros actuales:**
- 4-6 voces internas ("skills")
- 5-8 intercambios de diálogo
- Tono de Disco Elysium
- Salida en formato JSON estricto

Estos parámetros pueden ajustarse para cambiar el tono y la narrativa del análisis.

---

## ❓ Preguntas Frecuentes

**¿Es esto una herramienta médica?**
No. Es una herramienta de reflexión personal y normalización del diálogo sobre medicación psiquiátrica.

**¿Mis datos están seguros?**
Sí. Todo se guarda localmente en tu navegador. No hay servidor ni base de datos externa.

**¿Necesito conocimientos médicos para usarla?**
No. La app es para cualquier persona que tome medicación psiquiátrica y quiera reflexionar sobre ello.

**¿Puedo exportar mis datos?**
Actualmente no, pero está en el roadmap de features futuras.

---

## 📞 Contacto y Soporte

**Desarrollador:** Branko
**Repositorio:** [Pendiente: agregar URL de GitHub]
**Issues:** Reportar en GitHub Issues cuando esté público

---

## 📄 Licencia

[Por definir]

---

## 🙏 Agradecimientos

- **Anthropic** por la API de Claude
- **ZA/UM** por Disco Elysium (inspiración narrativa)
- Comunidad de salud mental que normaliza estos diálogos

---

**Última actualización:** 2025-12-04

_"You're doing the work. The chemistry just makes it possible to show up. And showing up is half the battle."_
