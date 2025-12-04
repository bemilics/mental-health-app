# 🧠 MEMORIA DEL PROYECTO - THE THOUGHT CABINET

> **Documento de seguimiento sesión a sesión**
> Última actualización: 2025-12-04

---

## 📋 RESUMEN EJECUTIVO

**Nombre del proyecto:** The Thought Cabinet
**Tipo:** Aplicación web de salud mental
**Stack técnico:** React (Create React App), Anthropic Claude API
**Estado:** Desarrollo activo - Prototipo funcional
**Repositorio Git:** Sí (gestionado con GitKraken)

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

### Estado Actual
- Inspirado en **Disco Elysium** (voces internas, diálogo interno)
- Usa sistema de "skills" con niveles (1-6)
- Presenta múltiples voces internas en conflicto/diálogo

### Objetivo de Iteración
- Mantener el tono y lenguaje de Disco Elysium
- Desarrollar narrativa más propia para evitar plagio
- Conservar la honestidad brutal pero empática

### Referencias de Tono
- Disco Elysium: Literario, oscuramente humorístico, profundamente humano
- [ESPACIO PARA NUEVAS REFERENCIAS]

---

## 🏗️ ARQUITECTURA TÉCNICA ACTUAL

### Frontend
- **Framework:** React 19.2.1
- **Estilos:** Tailwind CSS (inline classes)
- **Iconos:** lucide-react
- **Almacenamiento:** localStorage (clave: 'thought-cabinet-meds')

### Backend/API
- **API:** Anthropic Claude (Sonnet 4)
- **Método:** Llamada directa desde frontend
- **Autenticación:** Variable de entorno `REACT_APP_ANTHROPIC_API_KEY`

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

#### Respuesta de Análisis
```javascript
{
  skills: [
    {
      name: String,    // Nombre de la "voz interna"
      level: Number,   // 1-6
      color: String    // Hex color
    }
  ],
  dialogue: [
    {
      speaker: String, // Nombre de la voz
      text: String,    // Contenido del diálogo
      color: String    // Hex color
    }
  ],
  summary: String      // Resumen final 2-3 oraciones
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
mental-health-app/
├── public/
├── src/
│   ├── App.js          # Componente principal (453 líneas)
│   ├── index.css       # Estilos base + Tailwind
│   └── index.js        # Entry point
├── .gitignore
├── package.json
├── README.md
└── PROJECT_MEMORY.md   # Este archivo
```

---

## 🔐 CONSIDERACIONES ÉTICAS Y DE SEGURIDAD

### Privacidad
- ✅ Datos almacenados solo localmente (localStorage)
- ✅ No hay base de datos externa
- ⚠️ API key en variable de entorno (necesita manejo seguro en producción)

### Ética Médica
- ✅ Disclaimer implícito: "análisis NO CLÍNICO"
- ✅ No diagnósticos
- ✅ No recomendaciones de medicamentos
- 🔄 Necesita revisión de prompts para optimización ética

### Áreas de Mejora
- [ ] Agregar disclaimer explícito visible
- [ ] Revisar prompts con estándares médicos
- [ ] Considerar mover API key a backend seguro

---

## 💻 ESTADO ACTUAL DEL CÓDIGO

### Funcionalidades Implementadas
- ✅ Agregar medicamentos (nombre, dosis, horario)
- ✅ Eliminar medicamentos
- ✅ Persistencia en localStorage
- ✅ Generación de análisis con Claude API
- ✅ Vista de "diálogo interno" con skills y diálogo
- ✅ Fallback cuando falla la API
- ✅ Estados de carga ("thinking")
- ✅ Manejo de errores básico

### Prompt Actual (src/App.js líneas 73-103)
El prompt está configurado para:
- Generar respuesta en JSON estricto
- 4-6 voces internas
- 5-8 intercambios de diálogo
- Tono de Disco Elysium
- Normalización de medicación psiquiátrica

---

## 📝 HISTORIAL DE SESIONES

### Sesión 1 - 2025-12-04
**Objetivos:**
- Establecer documento de memoria del proyecto
- Crear acceso directo a conversación
- Revisar estado actual del proyecto

**Acciones:**
- ✅ Lectura completa del código actual
- ✅ Creación de PROJECT_MEMORY.md
- 🔄 Creación de acceso directo al proyecto

**Notas:**
- El proyecto ya tiene un prototipo funcional
- Usa React 19 (versión muy reciente)
- API de Anthropic se llama directamente desde frontend
- El tono Disco Elysium está bien implementado

**Decisiones Pendientes:**
- [ ] ¿Mover API a backend separado?
- [ ] ¿Qué plataforma usar para deploy? (Vercel sugerido)
- [ ] ¿Cómo iterar la narrativa para hacerla más original?

---

## 🚀 ROADMAP Y PRÓXIMOS PASOS

### Prioridad Alta
- [ ] Optimizar prompts con estándares éticos médicos
- [ ] Iterar tono narrativo hacia algo más original
- [ ] Agregar disclaimer médico explícito
- [ ] Configurar deployment (Vercel u otra plataforma)

### Prioridad Media
- [ ] Mover API key a backend seguro
- [ ] Mejorar manejo de errores
- [ ] Agregar más contexto sobre medicamentos comunes
- [ ] Testing de accesibilidad

### Prioridad Baja
- [ ] Animaciones de transición
- [ ] Exportar/importar data
- [ ] Temas de color personalizables
- [ ] PWA features

---

## 🛠️ CONFIGURACIÓN DE DESARROLLO

### Prerrequisitos
- Node.js (versión no especificada, recomendado 18+)
- npm
- API key de Anthropic

### Variables de Entorno
```bash
REACT_APP_ANTHROPIC_API_KEY=tu_api_key_aqui
```

### Comandos
```bash
npm start          # Desarrollo local (puerto 3000)
npm run build      # Build para producción
npm test           # Tests
```

### Deploy a Vercel (Instrucciones pendientes)
[Por completar en próxima sesión]

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
**Control de versiones:** Git + GitKraken
**Comunicación:** Este documento se actualiza al final de cada sesión

### Protocolo de Actualización
1. Branko da la orden: "Actualiza la memoria"
2. Claude actualiza este documento con el progreso de la sesión
3. Branko hace commit en Git

---

## 📌 NOTAS IMPORTANTES

### Para recordar cada sesión
1. Este proyecto trata datos sensibles de salud mental
2. Priorizar privacidad y ética por encima de features
3. El tono debe ser honesto pero nunca condescendiente
4. NO somos profesionales médicos - nunca diagnosticar
5. Branko maneja Git y deployment, Claude escribe código

### Aprendizajes Clave
- localStorage es suficiente para MVP (no necesita DB aún)
- El fallback cuando falla la API es buena UX
- Los usuarios valoran la honestidad sobre el paternalismo

---

## 🔍 PREGUNTAS ABIERTAS

1. ¿Cómo podemos hacer la narrativa más original manteniendo el tono?
2. ¿Qué estándares éticos específicos debemos cumplir?
3. ¿Necesitamos consulta con profesional de salud mental?
4. ¿El modelo de Claude actual (Sonnet 4) es el óptimo para este uso?
5. ¿Deberíamos agregar más contexto educativo sobre los medicamentos?

---

**FIN DEL DOCUMENTO DE MEMORIA**

_Este documento es un ser vivo. Crece con cada sesión._
