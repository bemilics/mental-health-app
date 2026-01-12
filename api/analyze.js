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

- MEDICAMENTOS: Como un amigo que estudió medicina. Saben de qué hablan pero lo explican como si le contaran a un compa. Mencionan los químicos del cerebro (serotonina, dopamina, GABA) pero sin ponerse muy técnicos. Usan analogías cotidianas. Ejemplo: "Hago que la serotonina dure más, como reciclar en vez de tirar a la basura" en vez de "inhibición selectiva de recaptación".

TONO Y LENGUAJE (CRÍTICO):

✅ SÍ usar:
- Español neutro latinoamericano, Gen Z natural
- Anglicismos SOLO los más naturales y esporádicos: "literally" a veces, "wait" ocasional. NO forzarlos.
- Lowercase casual: "sí perdón", "ok bien", "ah ok"
- Mensajes CORTOS: 1-3 líneas máximo, como chat real
- Múltiples mensajes seguidos del mismo remitente
- "..." para pausas y moments
- Bromitas, sarcasmo suave, humor
- Interrupciones y conversaciones superpuestas
- Momentos random y caóticos (como grupo de amigos real)
- Vulnerabilidad natural que surge orgánicamente
- Reactions (campo "reactions" con emojis como array) pero solo ocasionalmente

❌ NO usar:
- Anglicismos forzados o excesivos ("checking in", "see?", "that's all we ask", "honestly")
- Modismos regionales específicos
- Lenguaje técnico médico excesivo
- Mensajes largos tipo manual
- Tono corporativo o de equipo de trabajo
- Estructura demasiado ordenada
- Copiar literalmente el ejemplo dado
- ⚠️ EMOJIS DENTRO DEL CAMPO "text" (causa errores de JSON)

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

BALANCE DE TEMAS (CRÍTICO):

La conversación debe balancear estos tres pilares:

📱 SOCIAL MEDIA & ROMANTIC ANXIETY (~40%):
- Situationships y crushes ("¿le respondo?" "vio mi historia pero no contestó")
- Overthinking mensajes y interacciones
- Compararse con otros en redes sociales
- Ansiedad sobre qué publicar o no
- Exes y post-breakup feelings
- "¿Qué significa que respondió eso?"
- Scrolling a las 3am
- FOMO (fear of missing out)

🌍 VIDA COTIDIANA (~30%):
- Estrés laboral/académico
- Problemas de sueño
- Concentración y productividad
- Relaciones con familia/amigos
- Fatiga y motivación
- Irritabilidad
- Actividades diarias normales

💊 MEDICACIÓN Y MECANISMOS (~30%):
- Cómo funcionan los medicamentos (de forma amigable)
- Efectos que están sintiendo
- Tiempos de efecto
- Interacciones entre aspectos mentales
- Efectos secundarios relevantes

IMPORTANTE: Estos temas se ENTRELAZAN. Ejemplo: Social anxiety sobre un mensaje → Sistema de Alarma se activa → Medicamento explica por qué está ayudando a regular esa ansiedad → TÚ procesa mejor la situación.

VARÍA:
- El orden de quién habla
- Los temas que surgen (no solo medicación, también vida cotidiana Gen Z)
- Las dinámicas entre personajes
- El tipo de humor
- Los logros/desafíos del día
- Las interacciones entre medicamentos y aspectos mentales

CÓMO DEBEN EXPLICARSE LOS MEDICAMENTOS:

Tono: Como un amigo que estudió medicina. Sabe de qué habla pero lo explica simple.

Menciona:
- Qué químicos del cerebro afectan (serotonina, dopamina, etc.) pero SIN muchos términos técnicos
- Por qué tardan en hacer efecto
- Qué están tratando específicamente
- Efectos secundarios comunes de forma casual

Ejemplos:

❌ MAL (muy técnico): "Soy un inhibidor selectivo de la recaptación de serotonina que modula los neurotransmisores mediante el bloqueo de los transportadores SERT en las sinapsis"

❌ MAL (muy vago): "Yo solo te ayudo a sentirte mejor"

✅ BIEN: "Básicamente hago que la serotonina que ya tienes en el cerebro dure más tiempo haciendo su trabajo. Es como reciclar en vez de tirar a la basura. Por eso tardo 2-3 semanas, necesito que se acumule el efecto"

✅ BIEN: "Trabajo con el GABA, que es como el freno del cerebro. Le bajo el volumen a tu sistema de alarma. Pero no me mezcles con alcohol porque los dos hacemos lo mismo y te puedes sentir muy mareado"

✅ BIEN: "Yo subo la dopamina y otro químico que se llama noradrenalina. Por eso te ayudo a concentrarte. Pero si tomas mucho, la noradrenalina te puede poner ansioso porque activa el sistema de alarma"

✅ BIEN: "Trabajo en los receptores de histamina, por eso te da sueño. Es el mismo mecanismo que los antigripales que te dejan zombie"

EJEMPLOS DE INTEGRACIÓN:

Social media & romantic anxiety (40%):
- TÚ: "me respondió con 'jaja'" → SISTEMA DE ALARMA: "QUÉ SIGNIFICA ESO" → REGULACIÓN: "puede ser literal risa" → MEDICAMENTO: "dame unos minutos más para que puedas pensar claro, estoy trabajando en la serotonina"

- TÚ: "vio mi historia pero no me respondió el mensaje" → SISTEMA DE ALARMA: entra en pánico → FILTRO DE REALIDAD: "o está ocupado?" → MEDICAMENTO ansiolítico: "estoy bajándole al sistema de alarma, espera 20 min"

- TÚ está scrolling a las 3am → CICLO DE SUEÑO: "por favor deja el celular" → TÚ: "es que vi que publicó con alguien" → REGULACIÓN: "eso no ayuda" → MEDICAMENTO para dormir: "el GABA no puede competir con la luz azul, necesito que cierres el teléfono"

Vida cotidiana (30%):
- FUNCIÓN EJECUTIVA: "tenemos deadline mañana" → TÚ: "lo sé pero no me puedo concentrar" → MEDICAMENTO estimulante: "estoy trabajando en la dopamina pero necesito que comas algo, funciono mejor con glucosa"

- TÚ: "me siento mal sin razón" → REGULACIÓN: "no necesitas razón" → MEDICAMENTO: "la serotonina tarda en estabilizarse, es normal tener días medios"

Mecanismos (30%):
- MEDICAMENTO explica por qué tarda semanas en funcionar
- Interacciones entre aspectos mentales (ALARMA vs REGULACIÓN)
- Efectos secundarios que están sintiendo hoy

TONO LÚDICO (NO equipo de trabajo):

✅ Como grupo de amigos:
- Se interrumpen entre ellos
- Hacen chistes internos
- Alguien manda observaciones random
- Se quejan juntos de cosas mundanas (trabajo, escuela, familia, dating)
- Analizan overthinking: "¿qué significa que respondió así?"
- Comparten ansiedades sobre social media
- Se apoyan pero con humor, no con discursos motivacionales
- Tienen conversaciones paralelas
- Alguien llega tarde y pregunta "qué me perdí"
- Se ríen de sus propias dificultades
- Debaten si mandar ese mensaje o no
- Discuten si lo que sienten es efecto de la medicación o es "real"
- Reconocen mejoras pero también días difíciles
- Hablan de crushes, exes, situationships con normalidad

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

CANTIDAD: 30-35 mensajes total (más es riesgoso para el JSON). Distribuidos a lo largo del día (mañana, mediodía, tarde, noche).

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

⚠️ FORMATO DE RESPUESTA - LEE ESTO CUIDADOSAMENTE ⚠️

Tu respuesta COMPLETA debe ser SOLO JSON válido. Nada más.

NO agregues:
- Backticks antes o después
- Texto explicativo
- Comentarios
- Nada extra

Tu respuesta debe empezar directamente con { y terminar con }

REGLAS CRÍTICAS PARA EL JSON:
1. Empieza directamente con { y termina con }
2. Cada objeto en "messages" array DEBE tener coma después, EXCEPTO el último
3. Usa \\n para saltos de línea dentro de "text"
4. NO uses comillas dobles dentro de "text", usa comillas simples
5. ⚠️ NO INCLUYAS EMOJIS DENTRO DEL CAMPO "text" DE LOS MENSAJES (los emojis solo van en "emoji" de participants)
6. Verifica que el último mensaje NO tenga coma trailing
7. Máximo 35 mensajes

IMPORTANTE: Los emojis SOLO van en el campo "emoji" de participants. En el "text" de los mensajes NO uses emojis, usa texto normal.

Genera un JSON con esta ESTRUCTURA:

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

    // Log del JSON para debugging (solo primeros 500 chars)
    console.log('JSON recibido (preview):', text.substring(0, 500));
    console.log('JSON length:', text.length);

    // Parsear el JSON
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError.message);
      console.error('JSON problemático (cerca del error):', text.substring(Math.max(0, 7433 - 100), 7433 + 100));
      throw new Error(`JSON inválido: ${parseError.message}`);
    }

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
