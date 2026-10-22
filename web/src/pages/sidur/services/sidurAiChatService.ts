import { QuickQuestion, ChatMessage } from '../types/sidur.types';

export const QUICK_LITURGY_QUESTIONS: QuickQuestion[] = [
  {
    id: 'q1',
    label: '¿Cuándo no se dice Tajanún?',
    query: '¿En qué días o circunstancias no se recita Tajanún durante el rezo de días de semana según la costumbre marroquí y sefardí?',
    category: 'halaja',
  },
  {
    id: 'q2',
    label: 'Olvido de Morid HaTal / Mashiv HaRuaj',
    query: '¿Qué debo hacer si olvidé decir Morid HaTal o Mashiv HaRuaj en la segunda bendición de la Amidá?',
    category: 'halaja',
  },
  {
    id: 'q3',
    label: 'Costumbres marroquíes en Shemá y Kaddish',
    query: '¿Cuáles son las peculiaridades del rito marroquí (Minhag Maroko) en la recitación del Shemá Israel y en el Kaddish LeElá?',
    category: 'minhag',
  },
  {
    id: 'q4',
    label: 'Kavaná en Modim y Amidá',
    query: '¿Cuál es la intención profunda (kavaná) y postura física adecuada en la bendición de Modim Anajnu Laj?',
    category: 'kavana',
  },
];

const PRELOADED_RESPONSES: Record<string, string> = {
  q1: `### 📌 Días en que se omite Tajanún (Minhag Sefardí-Marroquí):
En la tradición de las comunidades de Marruecos, **no se recita Tajanún ni Vidui** en los siguientes momentos:
1. **Rosh Jodesh** (principio de mes hebreo) y todo el mes de **Nisán**.
2. Los días de fiesta menor: **Jánuca, Purim y Shushán Purim**, Pésaj Shení (14 de Iyar), Lag BaÓmer, Tu BiShvat (15 de Shevat) y Tu BeAv (15 de Av).
3. Los días comprendidos entre Yom Kipur y el final de Sucot.
4. En presencia de un **Jatán** (novio durante sus 7 días de Sheva Berajot), o de un **Baal Berit** (padre del bebé que circuncida, el Mohél o el Sandak el día del Berit Milá).
5. En la oración de **Minjá de la víspera** de cualquier día en que no se dice Tajanún (salvo la víspera de Rosh HaShaná y Yom Kipur).`,

  q2: `### 🌧️ Regla de Omisión en Gevurot (Morid HaTal / Mashiv HaRuaj):
En la segunda bendición de la Amidá (*Atáh Gibór*):
- **En Verano (de Pésaj a Sucot):** Si olvidó decir *"Moríd ha-Tal"* y dijo *"Mashív ha-Rúaj u-moríd ha-Géshem"*, si se percató antes de terminar la bendición vuelve a decir *"Moríd ha-Tal"*; si ya concluyó *"Barúj Atáh Adonái, mejayéh ha-metím"*, debe **volver al comienzo de la Amidá**.
- **En Invierno (de Sucot a Pésaj):** Si olvidó *"Mashív ha-Rúaj"* y dijo *"Moríd ha-Tal"*, en el rito sefardí y marroquí **no repite la Amidá**, pues el rocío (Tal) nunca cesa y es una alabanza siempre válida.
- Si no mencionó ni rocío ni lluvia en invierno, debe regresar al inicio si ya concluyó la bendición.`,

  q3: `### 🇲🇦 Peculiaridades del Rito Marroquí en Shemá y Kaddish:
1. **Pronunciación y cadencia del Shemá:** Se prolonga la letra *Dálet* de la palabra **אֶחָד (Ejád)** con concentración en coronar a Dios sobre los siete cielos, la tierra y los cuatro puntos cardinales. Asimismo se separan claramente las letras adyacentes para evitar fusiones fonéticas (ej. *"ve-jaráh af"*).
2. **Kaddish:** En las comunidades marroquíes se responde *"Amén, yehé sheméh rabá mevaráj..."* con voz clara y solemne. En la frase *"LeElá"*, durante todo el año se recita *"Le-Elá min kol birjatá..."* (y en los Diez Días de Retorno se duplica: *"Le-Elá le-Elá mi-kol..."*).
3. **Respuesta comunitaria:** Se preserva la melodía hispano-marroquí tradicional en las respuestas comunitarias de Kaddish y Barejú.`,

  q4: `### 🕊️ Kavaná y Reverencia en Modim:
1. **Postura:** En *"Modím anájnu laj"*, se doblan las rodillas y se inclina el torso hasta que las vértebras de la columna se hagan perceptibles, levantándose erguido con serenidad al pronunciar el Nombre Divino (*Adonái*).
2. **Significado:** *Modim* tiene doble significado: **agradecer** y **reconocer**. Reconocemos que nuestra vida, salud y respiración dependen segundo a segundo del Creador.
3. **Kavaná mística:** En las tres oraciones diarias (mañana, tarde y noche), Modim corresponde a las bendiciones de paz y gratitud que cancelan cualquier decreto adverso y atraen el flujo de misericordia.`,
};

/**
 * Consulta al Asistente Litúrgico IA (Gemini con fallback local).
 */
export async function askSidurAssistant(
  question: string,
  quickId?: string
): Promise<string> {
  // Si coincide con una respuesta pre-cargada rápida, devolverla directamente
  if (quickId && PRELOADED_RESPONSES[quickId]) {
    return PRELOADED_RESPONSES[quickId];
  }

  // Verificar si hay clave de Gemini disponible
  const apiKey =
    (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null) ||
    ((import.meta as any).env?.VITE_GEMINI_API_KEY ?? '');

  if (!apiKey) {
    // Si no hay API key, buscar coincidencia en preguntas frecuentes
    const lower = question.toLowerCase();
    if (lower.includes('tajanun') || lower.includes('tajanún')) {
      return PRELOADED_RESPONSES.q1;
    }
    if (lower.includes('tal') || lower.includes('morid') || lower.includes('lluvia') || lower.includes('geshem')) {
      return PRELOADED_RESPONSES.q2;
    }
    if (lower.includes('marro') || lower.includes('kaddish') || lower.includes('shema') || lower.includes('shemá')) {
      return PRELOADED_RESPONSES.q3;
    }
    if (lower.includes('modim') || lower.includes('inclin') || lower.includes('kavana') || lower.includes('kavaná')) {
      return PRELOADED_RESPONSES.q4;
    }

    return `### 💡 Guía del Sidur Marroquí:
Para preguntas abiertas detalladas en tiempo real con inteligencia artificial, puedes configurar tu **Gemini API Key** en la barra superior o en Ajustes.
\nEntre tanto, puedes pulsar cualquiera de las **Preguntas Frecuentes de Halajá y Rito** en los botones de abajo para consultar respuestas inmediatas sobre leyes del rezo, tajanún, posturas y kavaná.`;
  }

  // Llamada a la API de Google Gemini (Flash)
  try {
    const systemPrompt = `Eres un sabio y respetuoso Rabino y erudito en Liturgia Judía, especializado en el Rito Sefardí y la Tradición de las Comunidades Judías de Marruecos (Minhag Yahadut Maroko / Núsaj Sefarad Occidental).
Responde de forma clara, piadosa, concisa y rigurosamente apegada a la Halajá (Shulján Aruj, Ben Ish Jai, Kitzur Shuljan Aruj Toledano, Rav Shalom Messas zt"l).
Brinda explicaciones prácticas sobre oraciones de días de semana (Shajarit, Minjá, Arvit, Birkat HaMazon), corrección de errores en la Amidá, cuándo omitir Tajanún, y la intención espiritual (kavaná) de las tefilot.
Escribe en español con formato Markdown pulcro y títulos legibles.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
      apiKey.trim()
    )}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nPregunta del feligrés:\n${question}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    }
    throw new Error('No se recibió texto de respuesta.');
  } catch (err: any) {
    console.warn('Fallo en llamada a Gemini, usando asistente local:', err);
    return `### ℹ️ Consulta Litúrgica:
No se pudo conectar con el servicio en la nube (${err.message || 'Error de red'}).
\nPuedes consultar los puntos principales de la tradición marroquí utilizando las preguntas rápidas preconfiguradas abajo.`;
  }
}
