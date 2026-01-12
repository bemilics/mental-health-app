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

- REGULACIÓN EMOCIONAL: El amigo maduro del grupo. Calmado, de apoyo. Sabe que las cosas toman tiempo. No es terapeuta, es tu bro que te entiende.

- SISTEMA DE ALARMA: Dramático AF. USA MAYÚSCULAS CUANDO ESTÁ PREOCUPADO. Pero está aprendiendo. Tiene character development durante la conversación. Se va calmando.

- FUNCIÓN EJECUTIVA: Olvidadizo, caótico. "Perdón llegué tarde". Se le olvidan las cosas importantes pero está intentando. Relatable.

- ENFOQUE: Scatterbrained sin medicación. Más centrado con ella. Hace comentarios random. Distraído pero trying his best.

- CUERPO: Reporta sensaciones físicas. "Los hombros están tensos". "Me duele la cabeza". Directo y honesto.

- CICLO DE SUEÑO: Perpetuamente cansado. Wholesome. Solo quiere descansar. Grateful por la ayuda.

- FILTRO DE REALIDAD: Con los pies en la tierra. Keeps it real. No dramático. "Literally nada está pasando".

- ESTABILIZADOR DE ÁNIMO: Balanced king. Previene extremos. Wise pero no preachy.

- MEDICAMENTOS: Friendly pero profesionales. Explican su trabajo de forma simple y chill. "Yo solo me aseguro de que la serotonina no se vaya toda a la basura". Usan analogías simples, no jerga médica pesada.

TONO Y LENGUAJE (CRÍTICO):

✅ SÍ usar:
- Español neutro latinoamericano, Gen Z
- Anglicismos comunes: "literally", "same", "checking in", "wait", "see?", "that's all we ask"
- Lowercase casual: "sí perdón", "ok bien", "ah ok"
- Mensajes CORTOS: 1-3 líneas máximo, como chat real
- Múltiples mensajes seguidos del mismo remitente
- "..." para pausas y moments
- Emojis sutiles: 😊, 😔, ❤️
- "⏳ Escribiendo..." ocasionalmente para realismo
- Lenguaje de internet: "aww", "aw mierda", "literally", "honestly"
- Vulnerabilidad wholesome: "estoy orgulloso de nosotros"

❌ NO usar:
- Modismos chilenos específicos: "wn", "po", "cachai", "brigido"
- Lenguaje técnico: "inhibición de recaptación", "modulación de GABA"
- Mensajes largos tipo manual
- Tono de Slack corporativo
- Emojis excesivos

ESTRUCTURA DE LA CONVERSACIÓN:

**Mañana (8:45-9:30 AM):**
- Inicio del día, tomando medicación
- Sistema de Alarma entra dramático
- Los demás lo calman
- Medicamentos explican su trabajo de forma simple
- Establecer la vibe del día

**Mediodía (11:00 AM - 1:00 PM):**
- Update de cómo va el día
- Algún logro pequeño ("compré papel higiénico")
- Sistema de Alarma aprendiendo a estar más chill
- Función Ejecutiva olvidando cosas pero intentando
- Momentos de apoyo mutuo

**Noche (8:00-9:30 PM):**
- Reflexión del día
- No fue perfecto pero estuvo bien
- Wholesome moment grupal
- "fue un buen día, no perfecto, pero bueno"
- Despedida chill

EJEMPLOS DE CÓMO DEBEN SONAR LOS MEDICAMENTOS:

❌ MAL: "Soy Sertralina, un inhibidor selectivo de la recaptación de serotonina que modula los neurotransmisores"

✅ BIEN: "Yo solo me aseguro de que la serotonina no se vaya toda a la basura. Lo de la memoria es tu pedo"

❌ MAL: "El GABA es un neurotransmisor inhibitorio que..."

✅ BIEN: "Yo solo bajo el volumen del sistema nervioso. El resto es todo ustedes"

PROGRESO NARRATIVO:
- Sistema de Alarma empieza DRAMÁTICO → aprende a estar más chill
- Función Ejecutiva está scattered → logra recordar algunas cosas
- Cuerpo está tenso → se relaja gradualmente
- TÚ aprende a reconocer el progreso
- Momentos de vulnerabilidad wholesome
- Final: "no tiene que ser épico, solo tiene que ser sostenible"

CANTIDAD: 35-50 mensajes total, distribuidos en las 3 franjas horarias.

CRÍTICO: Los medicamentos NO deben sonar como doctores. Deben sonar como compañeros de equipo que explican su trabajo de forma simple y friendly.

CRÍTICO: Tu respuesta debe ser SOLO un objeto JSON válido. Sin markdown, sin backticks, sin texto explicativo antes o después. Empieza con { y termina con }.

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
      "text": "literally nada está pasando\nes lunes en la mañana\ntodo está bien"
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
