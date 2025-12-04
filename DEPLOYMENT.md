# 🚀 Guía de Deployment - The Thought Cabinet

Esta guía te llevará paso a paso para deployar tu aplicación en Vercel con backend seguro.

---

## 📋 Antes de Empezar

Asegúrate de tener:
- ✅ Cuenta de GitHub con el repositorio subido
- ✅ Tu API key de Anthropic Claude
- ✅ Todos los cambios commiteados en Git

---

## 🌐 Opción 1: Deploy a Vercel (Recomendado)

Vercel es ideal para este proyecto porque:
- **Gratis** para proyectos personales
- **Serverless functions** integradas (nuestro backend)
- **Deploy automático** desde GitHub
- **HTTPS** automático
- **Muy rápido** (CDN global)

### Paso 1: Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"**
3. Elige **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tus repositorios

### Paso 2: Importar tu proyecto

1. En el dashboard de Vercel, click **"Add New"** → **"Project"**
2. Busca tu repositorio `mental-health-app`
3. Click **"Import"**

### Paso 3: Configurar el proyecto

En la pantalla de configuración:

**Framework Preset:**
- Vercel debería detectar automáticamente "Create React App"
- Si no, selecciona **"Create React App"** manualmente

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
build
```

**Install Command:**
```bash
npm install
```

### Paso 4: Configurar Variables de Entorno

Esta es **LA PARTE MÁS IMPORTANTE** 🔑

1. En la sección **"Environment Variables"**, agrega:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Tu API key de Anthropic (cópiala de tu archivo `.env` local)
   - **Environments:** Marca **Production**, **Preview**, y **Development**

2. Click **"Add"**

⚠️ **IMPORTANTE:** Sin esta variable de entorno, el backend no funcionará.

### Paso 5: Deploy!

1. Click **"Deploy"**
2. Espera 2-3 minutos mientras Vercel:
   - Instala dependencias
   - Construye el frontend
   - Configura las serverless functions
   - Despliega todo a su CDN

### Paso 6: Verificar que funciona

1. Vercel te dará una URL como: `https://thought-cabinet-xxx.vercel.app`
2. Abre esa URL en tu navegador
3. Agrega un medicamento de prueba
4. Click en **"CONVENE THE INTERNAL COUNCIL"**
5. Si ves el análisis generado → **¡Éxito! 🎉**

---

## 🔄 Deploys Automáticos

Ahora cada vez que hagas `git push` a tu repositorio en GitHub:
- Vercel detectará el cambio automáticamente
- Creará un nuevo build
- Lo desplegará en segundos
- Te enviará una notificación

---

## 🛠️ Testing Local del Backend

Para probar el backend en tu máquina local **antes** de deployar:

### Opción A: Usar Vercel CLI (Recomendado)

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. En el directorio del proyecto:
```bash
vercel dev
```

3. Abre `http://localhost:3000`
4. El backend funcionará en `http://localhost:3000/api/analyze`

### Opción B: Desarrollo sin backend local

Si no quieres instalar Vercel CLI, puedes:
1. Mantener el código frontend antiguo temporalmente para desarrollo local
2. Usar el fallback (que ya funciona sin API)
3. Solo probar el backend completo en Vercel

---

## ⚙️ Configuración Avanzada

### Variables de Entorno en Vercel

Para agregar o editar variables de entorno después del deploy:

1. Ve a tu proyecto en Vercel
2. Click en **"Settings"**
3. Sidebar: **"Environment Variables"**
4. Agrega/edita/elimina variables
5. **Importante:** Debes hacer un nuevo deploy para que los cambios apliquen

### Custom Domain (Opcional)

Si tienes un dominio propio:

1. En tu proyecto de Vercel → **"Settings"** → **"Domains"**
2. Agrega tu dominio
3. Sigue las instrucciones para configurar DNS
4. Vercel configurará HTTPS automáticamente

### Ver Logs

Para debuggear problemas:

1. En tu proyecto de Vercel → **"Deployments"**
2. Click en el deployment que quieres revisar
3. Pestaña **"Functions"** → Click en `/api/analyze`
4. Verás los logs de ejecución

---

## 🐛 Troubleshooting

### Error: "Configuration del servidor incompleta"

**Problema:** La variable de entorno `ANTHROPIC_API_KEY` no está configurada.

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Asegúrate de que `ANTHROPIC_API_KEY` existe y tiene el valor correcto
3. Redeploy el proyecto

### Error: "API request failed: 401"

**Problema:** La API key es inválida o está mal copiada.

**Solución:**
1. Verifica tu API key en [console.anthropic.com](https://console.anthropic.com/)
2. Actualiza la variable en Vercel
3. Redeploy

### Error: "Failed to compile"

**Problema:** Errores de código en el frontend.

**Solución:**
1. Revisa los logs del build en Vercel
2. Asegúrate de que `npm run build` funciona localmente
3. Verifica que todas las dependencias estén en `package.json`

### El análisis no se genera

**Problema:** El frontend no puede conectarse al backend.

**Solución:**
1. Abre las DevTools del navegador (F12)
2. Pestaña **"Network"**
3. Intenta generar un análisis
4. Busca la request a `/api/analyze`
5. Revisa el status code y la respuesta
6. Si no aparece la request, hay un problema en el frontend
7. Si aparece con error 500, revisa los logs en Vercel

---

## 🌐 Otras Opciones de Deployment

### Netlify

Similar a Vercel, también soporta serverless functions:

1. [netlify.com](https://netlify.com) → Sign up con GitHub
2. New site from Git → Selecciona tu repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Environment variables: `ANTHROPIC_API_KEY`
6. Deploy

**Nota:** En Netlify, las serverless functions van en carpeta `netlify/functions/` en vez de `api/`. Tendrías que mover el archivo.

### Railway

Opción con más control:

1. [railway.app](https://railway.app) → Sign up con GitHub
2. New Project → Deploy from GitHub repo
3. Agrega variable de entorno `ANTHROPIC_API_KEY`
4. Deploy

### GitHub Pages

**⚠️ NO recomendado para este proyecto** porque:
- GitHub Pages solo sirve archivos estáticos
- No puede ejecutar serverless functions
- Necesitarías un backend separado de todas formas

---

## 📊 Monitoreo y Analytics

### Vercel Analytics (Opcional)

Para ver cuánta gente usa tu app:

1. En tu proyecto de Vercel → **"Analytics"**
2. Habilita Vercel Analytics
3. Verás visitantes, páginas vistas, etc.

### Anthropic Usage

Para ver cuánto estás usando de tu API de Claude:

1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Sección **"Usage"**
3. Revisa tus tokens consumidos y costos

---

## 💰 Costos

### Vercel
- **Hobby Plan (gratis):**
  - 100 GB bandwidth/mes
  - 100 GB-hrs serverless function execution
  - Suficiente para uso personal y testing

### Anthropic Claude
- **Pay-as-you-go:**
  - ~$3 por millón de tokens de input
  - ~$15 por millón de tokens de output
  - Para uso personal, probablemente < $5/mes

---

## 🔒 Seguridad

### Buenas Prácticas

✅ **Hacer:**
- Mantener `.env` en `.gitignore`
- Usar variables de entorno en Vercel para secretos
- Revisar logs regularmente
- Limitar rate de API si haces la app pública

❌ **NO hacer:**
- Subir `.env` a Git
- Compartir tu API key públicamente
- Hardcodear secretos en el código
- Exponer endpoints sin validación

---

## 📝 Checklist de Deploy

Antes de hacer deploy, verifica:

- [ ] Todos los cambios están commiteados
- [ ] `npm run build` funciona localmente sin errores
- [ ] `.env` está en `.gitignore`
- [ ] Tienes tu API key de Anthropic lista
- [ ] Has hecho push a GitHub
- [ ] Has creado cuenta en Vercel
- [ ] Has configurado la variable de entorno en Vercel
- [ ] Has probado la app después del deploy

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs** en Vercel
2. **Verifica variables de entorno** en Vercel Settings
3. **Prueba localmente** con `vercel dev`
4. **Consulta la documentación** de Vercel: [vercel.com/docs](https://vercel.com/docs)
5. **Revisa el PROJECT_MEMORY.md** para contexto del proyecto

---

**Última actualización:** 2025-12-04

¡Buena suerte con tu deploy! 🚀
