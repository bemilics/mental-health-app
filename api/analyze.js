/**
 * Vercel Serverless Function: Análisis de Medicamentos
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
 *   "skills": [...],
 *   "dialogue": [...],
 *   "summary": "..."
 * }
 */

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

    // Construir la lista de medicamentos para el prompt
    const medList = medications
      .map(m => `- ${m.name} ${m.dosage}mg (${m.time})`)
      .join('\n');

    // Construir el prompt (mismo que antes, pero ahora en el backend)
    const prompt = `You are generating an internal dialogue analysis for someone's psychiatric medication, styled after Disco Elysium's skill system.

Medications:
${medList}

CRITICAL: Your response must be ONLY a valid JSON object. No markdown, no backticks, no explanation text before or after. Start with { and end with }.

Generate a JSON response with this EXACT structure:

{
  "skills": [
    {"name": "Emotional Regulator", "level": 4, "color": "#60a5fa"},
    {"name": "The Catastrophizer", "level": 5, "color": "#ef4444"},
    {"name": "Executive Function", "level": 3, "color": "#8b5cf6"},
    {"name": "The Body", "level": 4, "color": "#10b981"}
  ],
  "dialogue": [
    {"speaker": "Emotional Regulator", "text": "A complete sentence about the medication.", "color": "#60a5fa"},
    {"speaker": "The Catastrophizer", "text": "Another complete thought.", "color": "#ef4444"}
  ],
  "summary": "A 2-3 sentence final assessment."
}

Requirements:
- 4-6 internal voices in skills array
- 5-8 dialogue exchanges
- Each voice should have a distinct personality
- Be specific about what these medications do
- Disco Elysium tone: literary, darkly humorous, deeply human
- Normalize psychiatric medication
- No markdown formatting in your response`;

    // Obtener la API key desde las variables de entorno
    // En Vercel, esto se configura en el dashboard
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
        max_tokens: 2000,
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

    // Validar estructura
    if (!parsedData.skills || !parsedData.dialogue || !parsedData.summary) {
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
