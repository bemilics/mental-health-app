# Configuración de Variables de Entorno en Vercel

Este documento explica cómo configurar correctamente las variables de entorno en Vercel para que el sistema de feature flags funcione correctamente.

## Problema

Por defecto, la app detecta el ambiente (local/preview/production) basándose en el hostname. Sin embargo, Vercel a veces usa el mismo patrón de dominio (`xxx.vercel.app`) tanto para production como para preview, lo que puede causar confusión.

## Solución

Configura la variable de entorno `REACT_APP_VERCEL_ENV` en Vercel para indicar explícitamente el ambiente.

## Pasos para Configurar

### 1. Ve a tu Dashboard de Vercel

1. Abre https://vercel.com
2. Selecciona tu proyecto (mental-health-app)
3. Ve a **Settings** → **Environment Variables**

### 2. Agrega la Variable para Production

1. Click en **Add New**
2. Configura:
   - **Name**: `REACT_APP_VERCEL_ENV`
   - **Value**: `production`
   - **Environment**: ✅ Solo marca **Production**
3. Click en **Save**

### 3. Agrega la Variable para Preview

1. Click en **Add New** nuevamente
2. Configura:
   - **Name**: `REACT_APP_VERCEL_ENV`
   - **Value**: `preview`
   - **Environment**: ✅ Solo marca **Preview**
3. Click en **Save**

### 4. Re-deploy

Después de agregar las variables:
1. Ve a **Deployments**
2. Click en los tres puntos (`...`) del último deployment
3. Click en **Redeploy**
4. Selecciona **Use existing Build Cache**
5. Click en **Redeploy**

## Comportamiento Esperado

Después de configurar correctamente:

### Production
- ✅ Sin botón de toggle visible
- ✅ Siempre usa API real de Claude
- ✅ Sin indicadores de ambiente

### Preview
- ✅ Botón de toggle visible en esquina superior derecha
- ✅ Puede cambiar entre Mock Data y API Real
- ✅ Indicador "Preview Mode" visible

### Local
- ✅ Sin botón de toggle
- ✅ Siempre usa Mock Data
- ✅ Indicador "Ambiente: local (siempre mock)"

## Verificación

Para verificar que está funcionando:

1. **En Production**: Abre DevTools Console y ejecuta:
   ```javascript
   console.log(process.env.REACT_APP_VERCEL_ENV)
   // Debería mostrar: "production"
   ```

2. **En Preview**: Abre DevTools Console y ejecuta:
   ```javascript
   console.log(process.env.REACT_APP_VERCEL_ENV)
   // Debería mostrar: "preview"
   ```

## Detección Automática (Fallback)

Si no configuras las variables de entorno, la app intentará detectar el ambiente automáticamente:

- `localhost` → local
- `xxx-git-branchname.vercel.app` → preview
- Hostname con 3+ guiones → preview
- Hostname con 2 o menos guiones → production
- Dominio custom → production

**Nota**: La detección automática puede no ser 100% precisa, por eso se recomienda configurar las variables de entorno.

## Variables de Entorno Existentes

Recuerda que también debes tener configurada:
- `ANTHROPIC_API_KEY`: Tu API key de Claude (en Production y Preview)

---

**Última actualización**: 2026-01-13
