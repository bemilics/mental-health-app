# 🧪 GUÍA DE TESTING - Mental Health Check-In

## 🎯 Sistema de Feature Flags

Este proyecto implementa un sistema de **feature flags** que controla cuándo se usa la API real de Claude vs. datos de ejemplo (mock data).

---

## 🌍 Ambientes de Testing

### 1. **Local** (`localhost:3000`)
- 🏠 **Estado:** Mock data SIEMPRE
- 💰 **Costo:** $0 (no gasta tokens de Claude API)
- 🎯 **Uso:** Desarrollo diario, testing de UI, cambios rápidos
- ⚙️ **Comportamiento:**
  - No llama a `/api/analyze`
  - Usa conversación de ejemplo instantánea
  - Simula 1.5 segundos de delay para realismo
  - Indicador visible: `🔧 Ambiente: local (siempre mock)`

**Cómo usarlo:**
```bash
npm start
# Abre http://localhost:3000
# Agrega medicamentos y genera conversación → Siempre mock data
```

---

### 2. **Preview** (Vercel Preview Deployments)
- 🔧 **Estado:** Toggle entre API real y mock data
- 💰 **Costo:** Variable (solo si activas API real)
- 🎯 **Uso:** Testing antes de producción, QA, demos
- ⚙️ **Comportamiento:**
  - Botón **⚡ API Real** / **ZapOff Mock** en esquina superior derecha
  - Preferencia guardada en localStorage
  - Por defecto: Mock data (OFF)
  - Indicador visible: `Preview Mode`

**Cómo usarlo:**
1. Haz push a branch `develop`
2. Vercel crea preview deployment automáticamente
3. Abre URL de preview (ej: `mental-health-app-git-develop-bemilics.vercel.app`)
4. Verás el botón de toggle en esquina superior derecha
5. Click en botón para alternar:
   - **⚡ API Real** (verde) → Usa Claude API (gasta tokens)
   - **ZapOff Mock** (gris) → Usa mock data (gratis)

**Preview URLs:**
- Cada branch tiene su propia URL
- Cada commit en develop genera nuevo preview
- Encuentra tus previews en: [Vercel Dashboard](https://vercel.com) → Tu proyecto → Deployments

---

### 3. **Production** (Vercel Production)
- 🌐 **Estado:** API real SIEMPRE
- 💰 **Costo:** Gasta tokens de Claude API
- 🎯 **Uso:** App en vivo para usuarios reales
- ⚙️ **Comportamiento:**
  - Siempre llama a `/api/analyze` con Claude API
  - Sin botones de debug visibles
  - Fallback a mock solo si hay error de servidor
  - Sin indicadores de ambiente

**Cómo usarlo:**
1. Merge de `develop` → `master`
2. Push a `master`
3. Vercel auto-deploys
4. Producción actualizada en ~2 minutos

**Production URL:**
- URL principal de tu app
- Se configura en Vercel Dashboard

---

## 🎨 UI del Sistema

### Botón de Toggle (Solo Preview)

```
┌────────────────────────────┐
│  Mental Health Check-In    │ ⚡ API Real
│  Una conversación honesta  │ Preview Mode
│  sobre tu medicación       │
└────────────────────────────┘
```

**Estados visuales:**
- **⚡ API Real** - Botón verde: API activada
- **⚠️ Mock** - Botón gris: Mock data activada

### Indicadores de Ambiente

Solo visible en local y preview:

```
🔧 Ambiente: local (siempre mock)
🔧 Ambiente: preview
```

---

## 📊 Flujo de Testing Recomendado

### Durante Desarrollo

1. **Local** - Cambios en código:
   ```bash
   npm start
   # Testing rápido sin gastar tokens
   ```

2. **Preview con Mock** - Verificar cambios en servidor:
   ```bash
   git push origin develop
   # Abrir preview URL
   # Testing en ambiente similar a producción (pero sin gastar tokens)
   ```

3. **Preview con API Real** - Testing final:
   ```bash
   # En preview URL
   # Click en botón ⚡ para activar API real
   # Testear con medicamentos reales
   # Verificar respuestas de Claude
   ```

4. **Production** - Deploy final:
   ```bash
   git checkout master
   git merge develop
   git push origin master
   # Vercel auto-deploys
   # Testing post-deploy en producción
   ```

---

## 🔧 Configuración Técnica

### Variables de Entorno

**Vercel (Production & Preview):**
```
ANTHROPIC_API_KEY=tu_api_key_aqui
```

Configurado en: Vercel Dashboard → Settings → Environment Variables

### LocalStorage (Preview)

El toggle guarda su estado en:
```javascript
localStorage.getItem('mental-health-use-real-api')
// 'true' = API Real ON
// 'false' o null = Mock Data ON
```

### Detección de Ambiente

```javascript
hostname === 'localhost' → local
hostname.includes('vercel.app') → preview
else → production
```

---

## 🐛 Debugging

### Ver Logs en Consola

Cada generación de conversación muestra:

**Local:**
```
🏠 Ambiente LOCAL: usando mock data
```

**Preview (Mock):**
```
🔧 Preview con MOCK DATA activado
```

**Preview/Production (API Real):**
```
🌐 Usando API REAL en preview
```

**Error:**
```
❌ Error al generar reporte: [detalle del error]
```

### Verificar Estado de API

1. Abre DevTools (F12)
2. Ve a Console
3. Genera conversación
4. Observa los logs

---

## 💡 Tips

### Ahorra Tokens
- Usa **local** para desarrollo diario
- Usa **preview con mock** para demos sin costo
- Usa **preview con API real** solo para testing final

### Testing de Errores
- En preview con API real, puedes simular errores
- Si backend falla, app muestra fallback automáticamente

### Resetear Estado
Si el toggle no responde:
```javascript
// En DevTools Console
localStorage.removeItem('mental-health-use-real-api')
location.reload()
```

---

## 📝 Checklist de Testing Pre-Deploy

Antes de hacer merge a master:

- [ ] Testing local: UI funciona correctamente
- [ ] Testing preview (mock): Flujo completo sin errores
- [ ] Testing preview (API real): Claude responde correctamente
- [ ] Verificar que fallback funciona si API falla
- [ ] Testing en mobile (responsive)
- [ ] Logs de consola limpios (sin errores)

---

## 🚨 Troubleshooting

### "Backend no disponible" en producción
- ✅ **Solucionado con feature flags**
- Si persiste: Verificar que `ANTHROPIC_API_KEY` está configurada en Vercel

### Toggle no aparece
- Verificar que estás en preview URL (debe tener `vercel.app`)
- Refrescar la página

### API no responde en preview con toggle ON
- Verificar Vercel Logs
- Verificar que preview tiene `ANTHROPIC_API_KEY` configurada
- Ver Console en browser para mensajes de error

---

**Última actualización:** 2026-01-12
