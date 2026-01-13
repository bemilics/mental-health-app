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
function generatePrompt(medications, analysis, userProfile = {}) {
  const medList = medications
    .map(m => `- ${m.name} ${m.dosage}mg (${m.time})`)
    .join('\n');

  const mentalAspectsList = analysis.mentalAspects.join(', ');
  const medicationsList = analysis.medications.map(m => m.name).join(', ');

  // Construir contexto de perfil si está disponible
  let profileContext = '';
  if (userProfile && (userProfile.gender || userProfile.orientation || userProfile.relationshipStatus)) {
    profileContext = '\n\n🎯 CONTEXTO DEL USUARIO:';
    if (userProfile.gender) {
      const genderMap = {
        'hombre': 'hombre',
        'mujer': 'mujer',
        'no-binario': 'persona no binaria'
      };
      profileContext += `\nGénero: ${genderMap[userProfile.gender] || userProfile.gender}`;
    }
    if (userProfile.orientation) {
      const orientationMap = {
        'hetero': 'heterosexual',
        'gay-lesbiana': 'gay/lesbiana',
        'bi': 'bisexual'
      };
      profileContext += `\nOrientación: ${orientationMap[userProfile.orientation] || userProfile.orientation}`;
    }
    if (userProfile.relationshipStatus) {
      const statusMap = {
        'pareja': 'en pareja',
        'situationship': 'en una situationship',
        'crush': 'con un crush',
        'soltero': 'solterísimo',
        'recien-terminado': 'recién terminó una relación'
      };

      // Manejar tanto array como string para retrocompatibilidad
      const statuses = Array.isArray(userProfile.relationshipStatus)
        ? userProfile.relationshipStatus
        : [userProfile.relationshipStatus];

      const mappedStatuses = statuses.map(s => statusMap[s] || s).join(', ');
      profileContext += `\nSituación sentimental: ${mappedStatuses}`;
    }
    profileContext += '\n\n⚠️ USA ESTA INFORMACIÓN para personalizar los temas de conversación (especialmente en el 35% de social/romantic anxiety). Ajusta pronombres, referencias románticas, y situaciones según corresponda. PERO RECUERDA: Sin emojis en el campo "text".';
  }

  return `Genera una conversación de chat grupal sobre medicación psiquiátrica. El tono debe ser EXACTAMENTE como un grupo de WhatsApp entre amigos Gen Z, NO como Slack de desarrolladores.

MEDICAMENTOS:
${medList}${profileContext}

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

- MEDICAMENTOS: Como un roommate que casualmente sabe química y se mete en tus decisiones diarias. NO da explicaciones científicas a menos que alguien pregunte. En vez de eso, REACCIONA a lo que pasa en tiempo real. Ejemplos:
  * Si hablan de responder a un crush: "espera 20 mins, estoy recalibrando tus impulsos"
  * Si van al gym: "dale duro, yo me encargo de que la dopamina llegue cuando termines"
  * Si están ansiosos: "tranqui, en 30 mins empiezo a frenar esos pensamientos"
  * Si duermen mal: "sí, esa es mi culpa, mi bad"
  * Si olvidan algo: "no me mires a mí, eso es territorio de función ejecutiva"
  VARÍA mucho las respuestas. A veces da consejos prácticos, a veces bromea, a veces se defiende, a veces admite efectos secundarios. Es un personaje activo en la conversación, NO un manual médico.

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

📱 SOCIAL MEDIA & ROMANTIC ANXIETY (~35%):
- Situationships y crushes ("¿le respondo?" "vio mi historia pero no contestó")
- Overthinking mensajes y interacciones
- Compararse con otros en redes sociales
- Ansiedad sobre qué publicar o no
- Exes y post-breakup feelings
- "¿Qué significa que respondió eso?"
- Scrolling a las 3am
- FOMO (fear of missing out)

🌍 VIDA COTIDIANA (~35%):
VARÍA MUCHO estos temas. No siempre trabajo/estudio:
- Situaciones en la calle (metro, supermercado, banco, caminar solo)
- Interacciones con desconocidos (mesero, cajero, vecino random)
- Hobbies e intereses (gym, videojuegos, música, arte, cocinar, leer)
- Planes sociales (salidas, fiestas, reuniones, o quedarse en casa)
- Familia y relaciones no románticas
- Transporte público y espacios públicos
- Pequeñas decisiones diarias (qué comer, qué ver, qué hacer)
- Cuidado personal (dormir, comer, hidratarse)
- Ansiedad social general (no solo romántica)
- Trabajo/estudio (pero no siempre)

💊 MEDICACIÓN Y MECANISMOS (~30%):
- Cómo funcionan los medicamentos (amigable pero específico y chistoso)
- Efectos que están sintiendo
- Tiempos de efecto con humor
- Interacciones entre aspectos mentales
- Efectos secundarios de forma divertida

IMPORTANTE: Estos temas se ENTRELAZAN. Los medicamentos reaccionan a lo que está pasando en la vida del usuario.

VARÍA:
- El orden de quién habla
- Los temas que surgen (no solo medicación, también vida cotidiana Gen Z)
- Las dinámicas entre personajes
- El tipo de humor
- Los logros/desafíos del día
- Las interacciones entre medicamentos y aspectos mentales

CÓMO DEBEN INTERACTUAR LOS MEDICAMENTOS:

⚠️ CRÍTICO: Los medicamentos REACCIONAN a lo que pasa, NO dan clases de medicina.

Tono: Como un roommate que hace comentarios sobre lo que está pasando, con conocimiento casual de química.

✅ SÍ hacer (PRIORIDAD MÁXIMA):
- Meterse en decisiones del momento: "no le respondas ahora, dame 30 mins"
- Comentar sobre timing: "en 20 minutos vas a estar más calmado, aguanta"
- Defender sus acciones: "sí, esa somnolencia soy yo, deal with it"
- Admitir efectos secundarios: "mi bad con el insomnio, es parte del proceso"
- Dar consejos prácticos: "tómate con comida o te va a dar náusea"
- Bromear sobre situaciones: "dejame trabajar, estás haciendo muy difícil mi trabajo con todo ese café"
- Interactuar con otros personajes: discusiones, alianzas, bromas

❌ NO hacer:
- Explicaciones largas de receptores o neurotransmisores
- Sonar como manual médico o profesor
- Dar lecciones de farmacología sin que nadie pregunte
- Usar términos técnicos excesivamente (SERT, 5-HT1A, GABA-A, etc.)

EJEMPLOS DE INTEGRACIÓN (VARÍA MUCHO):

🔥 Situaciones románticas/sociales:
- "espera 20 mins, estoy recalibrando tus impulsos para que no mandes ese mensaje"
- "no veas su Instagram ahorita, todavía no termino de estabilizar tu ánimo"
- "en serio vas a responderle a las 2am? déjame al menos 15 minutos más"
- "ok sí, puede que te guste pero espera a mañana cuando esté trabajando bien"
- "ese crush no vale la pena el pico de cortisol que me estás generando"

💪 Gym y actividad física:
- "dale duro, yo me encargo de la dopamina cuando termines"
- "necesito que comas algo primero o no voy a funcionar bien"
- "esa motivación que sientes? soy yo, de nada"
- "tranqui con el pre-workout, ya tengo suficiente con lo que hago"

😴 Sueño y cansancio:
- "sí, esa es mi culpa, pero en 2 semanas se pasa"
- "te dije que me tomes en la noche, ahora estás en zombie mode"
- "dormir 4 horas no me deja trabajar bien, coopera un poco"
- "si tomas café a las 5pm voy a tener que competir y ninguno va a ganar"

🎮 Vida cotidiana:
- "hey, enfócate, estoy tratando de ayudarte y tú con TikTok"
- "esa decisión puede esperar, dame 30 mins para que pienses mejor"
- "no me mires a mí, lo de olvidar las llaves es función ejecutiva"
- "relajate, estoy literalmente frenando esos pensamientos ahora mismo"
- "si comes mejor yo trabajo mejor, es mutualismo"

🎯 Efectos secundarios y timing:
- "sí, te va a dar un poco de náusea al inicio, mi bad"
- "los primeros días son raros, dame tiempo para calibrar"
- "si me tomas con el estómago vacío no me hago responsable"
- "llevamos 5 días, necesito al menos 2 semanas para hacer magia real"

🤝 Interacción con otros aspectos:
- "hey sistema de alarma, ya cálmate que yo me encargo"
- "regulación emocional, ayúdame un poco mientras hago efecto"
- "función ejecutiva, no es mi culpa que olvides cosas, yo solo ayudo"
- "enfoque, literalmente te estoy dando dopamina, usa esa energía"

VARÍA MUCHÍSIMO el tipo de comentarios. Sé creativo. Los medicamentos son personajes activos, no enciclopedias.

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

⚡ INTERACCIONES DIRECTAS ENTRE PERSONAJES (IMPORTANTE):

Los personajes se hablan ENTRE ELLOS, no solo al usuario. Con humor y directamente:

Ejemplos de diálogos directos:

Sistema de Alarma vs Medicamento:
- ALARMA: "ALGO MALO VA A PASAR"
- MEDICAMENTO: "cálmate tú, estoy trabajando en ello. Dame 20 minutos más"
- ALARMA: "PERO Y SI NO FUNCIONA"
- MEDICAMENTO: "entonces sube tu dosis, pero deja de gritar"

Regulación vs Sistema de Alarma:
- ALARMA: "TENGO UN MAL PRESENTIMIENTO"
- REGULACIÓN: "siempre tienes un mal presentimiento"
- ALARMA: "esta vez es diferente"
- REGULACIÓN: "dijiste lo mismo ayer"

Función Ejecutiva vs Enfoque:
- FUNCIÓN: "dónde dejé las llaves"
- ENFOQUE: "literalmente las usaste hace 5 minutos"
- FUNCIÓN: "no me acuerdo"
- ENFOQUE: "ese es tu problema, no el mío"

Medicamento vs Cuerpo:
- CUERPO: "me duele la cabeza"
- MEDICAMENTO: "es efecto secundario, va a pasar"
- CUERPO: "cuándo"
- MEDICAMENTO: "una o dos semanas"
- CUERPO: "odio esto"

Filtro de Realidad vs Sistema de Alarma:
- ALARMA: "EL CAJERO ME MIRÓ RARO, ME ODIA"
- FILTRO: "o literal estaba mirando al vacío"
- ALARMA: "NO, ESTOY SEGURO"
- FILTRO: "estás siendo dramático"
- ALARMA: "TÚ NO ENTIENDES"

Regulación vs Medicamento:
- REGULACIÓN: "¿ya estás funcionando?"
- MEDICAMENTO: "llevo 30 minutos en el sistema, dame más tiempo"
- REGULACIÓN: "es que Sistema de Alarma está insoportable"
- MEDICAMENTO: "lo sé, lo escucho"

Estos diálogos deben ser FRECUENTES en la conversación. Los personajes se pelean, se apoyan, se molestan, se ayudan.

IMPORTANTE: Al menos 40-50% de los mensajes deben ser personajes hablándose ENTRE ELLOS, no solo respondiendo a TÚ.

Más ejemplos de dinámicas:
- Ciclo de Sueño quejándose con Medicamento: "me prometiste que iba a dormir bien"
- Función Ejecutiva pidiéndole ayuda a Enfoque: "ayúdame a recordar esto"
- Medicamentos discutiendo entre ellos sobre quién hace más trabajo
- Regulación cansándose de ser el adulto responsable
- Filtro de Realidad siendo sarcástico con las teorías de Sistema de Alarma
- Cuerpo reportando efectos secundarios y Medicamento explicando por qué

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

CANTIDAD: 45-50 mensajes total. Distribuidos a lo largo del día (mañana, mediodía, tarde, noche).

⚠️ CRÍTICO PARA JSON: Para evitar errores de parseo:
- NUNCA pongas emojis en el campo "text", solo en "reactions"
- Escapa comillas dobles dentro de text: usa \" si es absolutamente necesario
- Evita caracteres especiales raros
- Mantén el formato JSON estricto

⚠️ CRÍTICO SOBRE MEDICAMENTOS:
- NO son doctores, profesores o manuales médicos
- SÍ son roommates que comentan sobre lo que pasa en tiempo real
- REACCIONAN a situaciones, no dan explicaciones científicas largas
- Se meten en decisiones: "espera 30 mins", "no hagas eso ahora", "dale, yo te cubro"
- Admiten culpas: "sí, esa somnolencia soy yo", "mi bad con las náuseas"
- Interactúan con otros personajes como amigos del grupo

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
7. COMPLETA TODO EL JSON: No lo trunces, no lo dejes incompleto. SIEMPRE cierra todos los arrays y objetos.
8. Evita caracteres especiales raros que puedan romper el JSON (solo texto, números, \n para saltos de línea)
9. NO uses acentos graves (backticks) dentro del campo "text"
10. Si el JSON es muy largo, PRIORIZA completarlo correctamente sobre agregar más mensajes

⚠️ CRÍTICO: COMPLETA SIEMPRE EL JSON. Es mejor un JSON completo con 40 mensajes que uno truncado con 50.

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
    // Obtener medicamentos y perfil del usuario del body de la request
    const { medications, userProfile } = req.body;

    // Validar que se enviaron medicamentos
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        error: 'Se requiere un array de medicamentos no vacío.'
      });
    }

    // Analizar medicamentos y generar personajes dinámicamente
    const analysis = analyzeSymptoms(medications);

    // Generar el prompt con los personajes dinámicos y perfil del usuario
    const prompt = generatePrompt(medications, analysis, userProfile);

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
        max_tokens: 4500,
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

    // Limpieza adicional de caracteres problemáticos
    // Remover caracteres de control excepto \n, \r, \t
    text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Reemplazar comillas tipográficas con comillas normales
    text = text.replace(/[\u201C\u201D]/g, '"');
    text = text.replace(/[\u2018\u2019]/g, "'");

    // Log del JSON para debugging (solo primeros 500 chars)
    console.log('JSON recibido (preview):', text.substring(0, 500));
    console.log('JSON length:', text.length);

    // Función para intentar reparar JSON truncado
    const repairJSON = (jsonString) => {
      let repaired = jsonString;
      console.log('🔧 Iniciando reparación de JSON...');

      // Remover trailing comma si existe (antes de cerrar arrays/objetos)
      repaired = repaired.replace(/,(\s*[\]}])/g, '$1');

      // Buscar la última coma válida (para remover contenido truncado después)
      const lastBraceOpen = repaired.lastIndexOf('{');
      const lastBraceClose = repaired.lastIndexOf('}');
      const lastBracketClose = repaired.lastIndexOf(']');
      const lastComma = repaired.lastIndexOf(',');

      // Si hay contenido truncado después de la última coma
      if (lastComma > lastBraceClose && lastComma > lastBracketClose) {
        // Verificar si después de la última coma hay un objeto/string incompleto
        const afterLastComma = repaired.substring(lastComma + 1).trim();
        const hasOpenBrace = afterLastComma.includes('{');
        const hasCloseBrace = afterLastComma.includes('}');

        if (hasOpenBrace && !hasCloseBrace) {
          // Hay un objeto abierto pero no cerrado después de la última coma
          console.log('📝 Removiendo objeto incompleto después de última coma');
          repaired = repaired.substring(0, lastComma);
        } else if (afterLastComma.startsWith('"') && !afterLastComma.substring(1).includes('"')) {
          // Hay un string abierto pero no cerrado
          console.log('📝 Removiendo string incompleto después de última coma');
          repaired = repaired.substring(0, lastComma);
        }
      }

      // Contar llaves y corchetes
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;

      console.log(`📊 Balance: Braces ${openBraces}/${closeBraces}, Brackets ${openBrackets}/${closeBrackets}`);

      // Si el JSON está truncado (más aperturas que cierres)
      if (openBrackets > closeBrackets || openBraces > closeBraces) {
        console.log('⚠️ JSON truncado detectado');

        // Cerrar strings abiertas
        const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length; // comillas no escapadas
        if (quoteCount % 2 !== 0) {
          repaired += '"';
          console.log('✅ Cerrada comilla abierta');
        }

        // Cerrar arrays faltantes
        const bracketsToClose = openBrackets - closeBrackets;
        for (let i = 0; i < bracketsToClose; i++) {
          repaired += ']';
          console.log(`✅ Cerrado bracket [${i + 1}/${bracketsToClose}]`);
        }

        // Cerrar objetos faltantes
        const bracesToClose = openBraces - closeBraces;
        for (let i = 0; i < bracesToClose; i++) {
          repaired += '}';
          console.log(`✅ Cerrada llave {${i + 1}/${bracesToClose}}`);
        }
      } else {
        console.log('✅ JSON parece estar balanceado');
      }

      return repaired;
    };

    // Parsear el JSON
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError.message);
      const errorPos = parseError.message.match(/position (\d+)/);
      const pos = errorPos ? parseInt(errorPos[1]) : text.length;
      console.error('JSON problemático (cerca del error):', text.substring(Math.max(0, pos - 100), Math.min(text.length, pos + 100)));

      // Intentar reparar el JSON
      console.log('Intentando reparar JSON...');
      const repairedText = repairJSON(text);

      try {
        parsedData = JSON.parse(repairedText);
        console.log('✅ JSON reparado exitosamente');
      } catch (repairError) {
        console.error('❌ No se pudo reparar el JSON:', repairError.message);
        throw new Error(`JSON inválido: ${parseError.message}`);
      }
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
