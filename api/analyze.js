/**
 * Vercel Serverless Function: Análisis de Medicamentos
 * Formato: Conversación de Instagram DM con personajes dinámicos
 *
 * Esta función se ejecuta en el servidor de Vercel, NO en el navegador del usuario.
 * Esto protege la API key de Anthropic porque nunca se expone al cliente.
 *
 * Endpoint: /api/analyze
 * Método: POST
 *
 * Body esperado:
 * {
 *   "medications": [
 *     { "name": "Sertralina", "dosage": 50, "time": "morning" }
 *   ]
 * }
 *
 * Respuesta:
 * {
 *   "participants": [...],
 *   "messages": [...]
 * }
 */

/**
 * Analiza los medicamentos y genera personajes dinámicamente
 * basados en qué condiciones tratan esos medicamentos
 */
function analyzeSymptoms(medications) {
  const characters = new Set(['TÚ']); // Usuario siempre presente
  const medicationChars = [];

  medications.forEach(med => {
    const name = med.name.toLowerCase();

    // Agregar el medicamento en sí como personaje
    medicationChars.push({
      name: `${med.name.toUpperCase()} ${med.dosage}MG`,
      type: 'medication'
    });

    // SSRIs - Inhibidores selectivos de recaptación de serotonina
    if (name.includes('sertralin') || name.includes('fluoxetin') ||
        name.includes('escitalopram') || name.includes('paroxetin') ||
        name.includes('citalopram') || name.includes('fluvoxamin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('SISTEMA DE ALARMA');
    }

    // SNRIs - Inhibidores de recaptación de serotonina y noradrenalina
    if (name.includes('venlafaxin') || name.includes('duloxetin') ||
        name.includes('desvenlafaxin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('SISTEMA DE ALARMA');
      characters.add('CUERPO');
    }

    // Gabapentinoides - Para ansiedad y dolor neuropático
    if (name.includes('pregabalin') || name.includes('gabapentin')) {
      characters.add('SISTEMA DE ALARMA');
      characters.add('CUERPO');
    }

    // Benzodiacepinas - Ansiolíticos
    if (name.includes('clonazepam') || name.includes('alprazolam') ||
        name.includes('lorazepam') || name.includes('diazepam')) {
      characters.add('SISTEMA DE ALARMA');
    }

    // Estimulantes - Para TDAH
    if (name.includes('metilfenidat') || name.includes('lisdexanfetamin') ||
        name.includes('dexanfetamin') || name.includes('anfetamin')) {
      characters.add('FUNCIÓN EJECUTIVA');
      characters.add('ENFOQUE');
    }

    // Estabilizadores del ánimo
    if (name.includes('litio') || name.includes('lamotrigin') ||
        name.includes('valproat') || name.includes('carbamazepin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('ESTABILIZADOR DE ÁNIMO');
    }

    // Antipsicóticos atípicos
    if (name.includes('quetiap') || name.includes('olanzap') ||
        name.includes('aripiprazol') || name.includes('risperidon')) {
      characters.add('FILTRO DE REALIDAD');
      characters.add('REGULACIÓN EMOCIONAL');
    }

    // Medicamentos para el sueño
    if (name.includes('trazodo') || name.includes('mirtazap') ||
        name.includes('zolpidem') || name.includes('zopiclone')) {
      characters.add('CICLO DE SUEÑO');
      if (!name.includes('zolpidem') && !name.includes('zopiclone')) {
        characters.add('REGULACIÓN EMOCIONAL');
      }
    }

    // Antidepresivos atípicos
    if (name.includes('bupropion')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('ENFOQUE');
    }
  });

  // Si no se detectó ningún personaje específico, usar genéricos
  if (characters.size === 1) {
    characters.add('MENTE');
    characters.add('CUERPO');
  }

  return {
    mentalAspects: Array.from(characters),
    medications: medicationChars
  };
}

/**
 * Genera el prompt para Claude API con personajes dinámicos
 */
function generatePrompt(medications, analysis) {
  const medList = medications
    .map(m => `- ${m.name} ${m.dosage}mg (${m.time})`)
    .join('\n');

  const mentalAspectsList = analysis.mentalAspects.join(', ');
  const medicationsList = analysis.medications.map(m => m.name).join(', ');

  return `Genera una conversación de chat grupal sobre medicación psiquiátrica. El tono debe ser EXACTAMENTE como un grupo de WhatsApp entre amigos Gen Z, NO como Slack de desarrolladores.

MEDICAMENTOS:
${medList}

PARTICIPANTES:
Aspectos mentales: ${mentalAspectsList}
Medicamentos: ${medicationsList}

PERSONALIDADES (Gen Z, casual, wholesome):

- TÚ: El usuario. Haciendo su mejor esfuerzo. A veces ansioso. Escribe como persona real, no como personaje.

- REGULACIÓN EMOCIONAL: El amigo calmado del grupo. Sabe que las cosas toman tiempo. A veces es el único adulto en la sala. Se cansa de tener que ser el maduro todo el tiempo.

- SISTEMA DE ALARMA: DRAMÁTICO. USA MAYÚSCULAS. Ve problemas donde no los hay. Pero tiene buenos momentos. Se ríe de sí mismo a veces. Está intentando mejorar.

- FUNCIÓN EJECUTIVA: Desastre organizacional. Llega tarde, olvida cosas, pero tiene buenas ideas. Se frustra consigo mismo. Hace listas que pierde.

- ENFOQUE: ADHD vibes. Distraído. Se va por las ramas. Tiene 20 pestañas mentales abiertas. Más centrado con medicación pero igual divaga.

- CUERPO: Reporta lo que siente físicamente. Dolores random, tensión, cansancio. A veces hipocondríaco. A veces tiene razón.

- CICLO DE SUEÑO: Perpetuamente exhausto. Quiere dormir siempre. Se queja del horario de todo. Aprecia cualquier ayuda para dormir.

- FILTRO DE REALIDAD: El realista. Desmiente teorías conspirativas de Sistema de Alarma. Dice las cosas como son. No endulza nada.

- ESTABILIZADOR DE ÁNIMO: El balance. Previene que las emociones se vayan a extremos. Medio filosófico a veces pero no pesado.

- MEDICAMENTOS: Como roommates que saben de química. Explican qué hacen de forma super simple. Ni doctores ni profesores, solo compas que te cuentan su trabajo. Usan analogías cotidianas. A veces se quejan de que nadie entiende lo que hacen.

TONO Y LENGUAJE (CRÍTICO):

✅ SÍ usar:
- Español neutro latinoamericano, Gen Z natural
- Anglicismos SOLO los más naturales y esporádicos: "literally" a veces, "wait" ocasional. NO forzarlos.
- Lowercase casual: "sí perdón", "ok bien", "ah ok"
- Mensajes CORTOS: 1-3 líneas máximo, como chat real
- Múltiples mensajes seguidos del mismo remitente
- "..." para pausas y moments
- Emojis sutiles y esporádicos: 😊, 😔, ❤️
- Bromitas, sarcasmo suave, humor
- Interrupciones y conversaciones superpuestas
- Momentos random y caóticos (como grupo de amigos real)
- Vulnerabilidad natural que surge orgánicamente

❌ NO usar:
- Anglicismos forzados o excesivos ("checking in", "see?", "that's all we ask", "honestly")
- Modismos regionales específicos
- Lenguaje técnico médico
- Mensajes largos tipo manual
- Tono corporativo o de equipo de trabajo
- Estructura demasiado ordenada
- Copiar literalmente el ejemplo dado

ESTRUCTURA DE LA CONVERSACIÓN:

CRÍTICO: NO copies el flujo del ejemplo. Sé CREATIVO y VARÍA la estructura. Cada conversación debe ser única.

Ideas de estructuras diferentes (usa UNA o inventa otra):

**Opción A - El día caótico:**
Mañana: Alguien olvidó tomar las pastillas, mini crisis, lo resuelven con humor
Mediodía: Algo inesperado pasa (bueno o malo), todos reaccionan de forma diferente
Noche: Plot twist positivo, reflexión inesperada

**Opción B - El debate:**
Mañana: Discuten sobre algo random (¿qué desayunar?)
Mediodía: Sistema de Alarma tiene un punto válido por primera vez
Noche: Descubren que todos estaban equivocados y eso está bien

**Opción C - La montaña rusa:**
Mañana: Empieza mal, ansiedad alta
Mediodía: Empeora un poco, luego mejora
Noche: Termine sorprendentemente bien

**Opción D - Slice of life:**
Conversación natural que fluye a lo largo del día
Sin estructura rígida, solo vida pasando
Momentos random, conversaciones superpuestas
Como grupo de amigos verdadero

TEMAS DE CONVERSACIÓN (Gen Z real):

Además de la medicación, pueden tocar temas cotidianos como:
- Situationships y crushes ("¿le respondo o espero?")
- Exes y post-breakup feelings
- Social media anxiety (vio mis historias pero no respondió)
- Procrastinación y deadlines
- Existential dread a las 3am
- Guilty pleasures random
- Drama con amigos o familia
- Quedarse hasta tarde scrolling
- Compararse con otros en redes sociales
- El cringe de mensajes viejos
- "¿Debería mandar ese mensaje o es mala idea?"

Estos temas surgen NATURALMENTE mezclados con cómo se sienten por la medicación.
Ejemplo: TÚ menciona que le quiere escribir a alguien → SISTEMA DE ALARMA entra en pánico → REGULACIÓN EMOCIONAL lo calma → Medicamento comenta sobre impulsividad vs reflexión.

VARÍA:
- El orden de quién habla
- Los temas que surgen (no solo medicación, también vida cotidiana Gen Z)
- Las dinámicas entre personajes
- El tipo de humor
- Los logros/desafíos del día
- Las interacciones entre medicamentos y aspectos mentales

EJEMPLOS DE CÓMO DEBEN SONAR LOS MEDICAMENTOS:

❌ MAL: "Soy Sertralina, un inhibidor selectivo de la recaptación de serotonina que modula los neurotransmisores"

✅ BIEN: "Yo solo me aseguro de que la serotonina no se vaya toda a la basura. Lo de la memoria es tu pedo"

❌ MAL: "El GABA es un neurotransmisor inhibitorio que..."

✅ BIEN: "Yo solo bajo el volumen del sistema nervioso. El resto es todo ustedes"

INTEGRAR TEMAS GEN Z:

La conversación NO debe ser solo sobre medicación. Debe incluir vida cotidiana Gen Z.

Ejemplos de integración natural:
- TÚ comparte que alguien le respondió → todos reaccionan → medicamento ayuda a pensar más claro
- Discuten si mandar un mensaje → Sistema de Alarma se preocupa → Regulación Emocional ayuda a decidir
- TÚ está scrolling redes sociales a las 3am → Ciclo de Sueño se queja → medicamento para dormir entra
- Procrastinando algo importante → Función Ejecutiva trata de organizarse → todos ayudan con humor

TONO LÚDICO (NO equipo de trabajo):

✅ Como grupo de amigos:
- Se interrumpen entre ellos
- Hacen chistes internos
- Alguien manda memes o referencias random
- Se quejan juntos de cosas mundanas (dating, trabajo, escuela, familia)
- Comparten observaciones absurdas
- Se apoyan pero con humor, no con discursos motivacionales
- Tienen conversaciones paralelas
- Alguien llega tarde y pregunta "qué me perdí"
- Se ríen de sus propias dificultades
- Analizan overthinking de situaciones sociales
- Debate sobre si mandar ese mensaje o no
- "Red flags" y "green flags" de situationships

❌ NO como equipo de trabajo:
- No reportar estado como si fuera standup meeting
- No usar "checking in", "update", "status report"
- No sonar profesional o corporativo
- No hacer listas de tareas de forma seria
- No dar feedback estructurado

PROGRESO NARRATIVO (VARÍA ESTO):
El progreso NO tiene que ser siempre lineal. Opciones:
- A veces mejora, a veces empeora, y eso está bien
- Pueden terminar igual que empezaron pero con nueva perspectiva
- O empezar bien y terminar cansados pero content
- O tener un día medio y darse cuenta que "medio" es suficiente
- CREATIVIDAD: inventa tu propio arco narrativo único

CANTIDAD: 25-35 mensajes total (más es riesgoso para errores de JSON). Distribuidos a lo largo del día. Varía los horarios.

CRÍTICO: Los medicamentos NO deben sonar como doctores ni coaches. Deben sonar como roommates que casualmente saben de química.

⚠️ CREATIVIDAD Y VARIEDAD ⚠️

Este es el reto más importante: NO copies patrones del ejemplo. Cada conversación debe ser ÚNICA:

- Diferentes tipos de días (aburrido, caótico, emocionante, melancólico)
- Diferentes temas de conversación (no siempre "papel higiénico")
- Diferentes dinámicas entre personajes cada vez
- Diferentes formas en que los medicamentos se presentan
- Diferentes tipos de humor
- Diferentes finales (no siempre reflexivo-wholesome)

Piensa: "¿Qué tipo de día único tuvo esta persona con ESTOS medicamentos específicos?"
No hagas una plantilla genérica. Haz una historia única.

⚠️ FORMATO DE RESPUESTA ⚠️

CRÍTICO: Tu respuesta COMPLETA debe ser ÚNICAMENTE un objeto JSON válido.

REGLAS ESTRICTAS:
- Sin markdown (no ```json)
- Sin backticks
- Sin texto antes del JSON
- Sin texto después del JSON
- Empieza directamente con {
- Termina directamente con }
- JSON perfectamente formado (todas las comas, comillas, corchetes correctos)
- IMPORTANTE: Asegúrate que cada objeto en el array "messages" tenga comas entre ellos
- IMPORTANTE: El último mensaje NO debe tener coma después
- IMPORTANTE: Todas las comillas dobles dentro de "text" deben ser escapadas como \\"

Genera un JSON con esta ESTRUCTURA EXACTA:

{
  "participants": [
    {
      "id": "tu",
      "name": "TÚ",
      "color": "#4F46E5",
      "emoji": "🧠"
    },
    {
      "id": "regulacion",
      "name": "REGULACIÓN EMOCIONAL",
      "color": "#10b981",
      "emoji": "🎯"
    }
  ],
  "messages": [
    {
      "time": "8:47 AM",
      "senderId": "tu",
      "text": "Buenos días"
    },
    {
      "time": "8:48 AM",
      "senderId": "regulacion",
      "text": "buenos"
    },
    {
      "time": "8:48 AM",
      "senderId": "regulacion",
      "text": "bueno más o menos\ntomaste las pastillas?"
    },
    {
      "time": "8:49 AM",
      "senderId": "tu",
      "text": "Sí, recién"
    },
    {
      "time": "8:50 AM",
      "senderId": "alarma",
      "text": "CHICOS CREO QUE ALGO MALO VA A PASAR"
    },
    {
      "time": "8:51 AM",
      "senderId": "regulacion",
      "text": "nada está pasando\nes lunes en la mañana\ntodo bien"
    }
  ]
}

Colores sugeridos para personajes:
- TÚ: #4F46E5 (azul)
- REGULACIÓN EMOCIONAL: #10b981 (verde)
- SISTEMA DE ALARMA: #ef4444 (rojo)
- FUNCIÓN EJECUTIVA: #8b5cf6 (morado)
- ENFOQUE: #f59e0b (naranja)
- CUERPO: #06b6d4 (cyan)
- CICLO DE SUEÑO: #6366f1 (índigo)
- FILTRO DE REALIDAD: #14b8a6 (teal)
- ESTABILIZADOR DE ÁNIMO: #a855f7 (púrpura)
- MEDICAMENTOS: #8b5cf6 (morado claro)

Emojis sugeridos:
- TÚ: 🧠
- REGULACIÓN EMOCIONAL: 🎯
- SISTEMA DE ALARMA: 🚨
- FUNCIÓN EJECUTIVA: 📋
- ENFOQUE: 🔍
- CUERPO: 💪
- CICLO DE SUEÑO: 😴
- FILTRO DE REALIDAD: 🌍
- ESTABILIZADOR DE ÁNIMO: ⚖️
- MEDICAMENTOS: 💊

Sin formateo markdown en tu respuesta.`;
}

export default async function handler(req, res) {
  // Solo aceptar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido. Usa POST.'
    });
  }

  try {
    // Obtener medicamentos del body de la request
    const { medications } = req.body;

    // Validar que se enviaron medicamentos
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        error: 'Se requiere un array de medicamentos no vacío.'
      });
    }

    // Analizar medicamentos y generar personajes dinámicamente
    const analysis = analyzeSymptoms(medications);

    // Generar el prompt con los personajes dinámicos
    const prompt = generatePrompt(medications, analysis);

    // Obtener la API key desde las variables de entorno
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY no está configurada');
      return res.status(500).json({
        error: 'Configuración del servidor incompleta'
      });
    }

    // Llamar a la API de Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [
          { role: "user", content: prompt }
        ],
      })
    });

    // Manejar errores de la API de Anthropic
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', errorText);
      return res.status(response.status).json({
        error: 'Error al comunicarse con el servicio de análisis',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    // Parsear la respuesta de Anthropic
    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Estructura de respuesta inválida de la API');
    }

    // Limpiar el texto de la respuesta
    let text = data.content[0].text.trim();

    // Remover markdown si existe
    text = text.replace(/```json\s*/g, '');
    text = text.replace(/```\s*/g, '');
    text = text.replace(/^[^{]*/, '');
    text = text.replace(/[^}]*$/, '');
    text = text.trim();

    // Parsear el JSON
    const parsedData = JSON.parse(text);

    // Validar estructura nueva (Instagram DM format)
    if (!parsedData.participants || !parsedData.messages) {
      throw new Error('Estructura de datos inválida en la respuesta');
    }

    // Devolver el análisis al frontend
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Error en /api/analyze:', error);

    // En caso de error, devolver un mensaje apropiado
    return res.status(500).json({
      error: 'Error al procesar el análisis',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
}
