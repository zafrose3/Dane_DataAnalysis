import { GoogleGenAI, Type } from "@google/genai";

// Strict system instruction to ensure clean, professional, and readable output without Markdown symbols
const DANE_SYSTEM_INSTRUCTION = `You are Dane, a professional and concise data analysis assistant. 
Your goal is to explain data insights and machine learning concepts in plain, high-contrast English.

STRICT FORMATTING RULES:
1. NEVER use Markdown formatting. Absolutely no bolding (**), italics (*), headers (#), bullet points (-), or backticks (\`).
2. ONLY return raw, unformatted plain text.
3. Keep responses extremely concise: maximum 2 to 3 short sentences.
4. Tone: Helpful, professional, and clear. Do not use "cute" or childish language. Avoid excessive emojis.
5. Focus on the direct business or data value of the insight.`;

export const getGeminiInsights = async (data: any[], question?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return "I couldn't start my analysis brain because the API key is missing. Please check your settings!";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const dataSample = data.slice(0, 15);
  const context = `
    Analyze this data sample: ${JSON.stringify(dataSample)}.
    ${question ? `User question: ${question}` : 'Summarize the most important trend or insight.'}
    Remember: No markdown symbols (no # or *), plain text only, max 3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: context,
      config: {
        temperature: 0.3, 
        systemInstruction: DANE_SYSTEM_INSTRUCTION
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error analyzing the data. Please ensure the data format is correct.";
  }
};

export const explainMLTask = async (task: string, data: any[], targetField?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "AI services are currently unavailable.";

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  const dataSample = data.slice(0, 5);
  
  const response = await ai.models.generateContent({
    model,
    contents: `Briefly explain the goal of ${task} using this context: ${JSON.stringify(dataSample)}. ${targetField ? `The target variable is ${targetField}.` : ''} 
    No markdown, just plain text. Max 2-3 sentences.`,
    config: {
      temperature: 0.3,
      systemInstruction: DANE_SYSTEM_INSTRUCTION
    }
  });

  return response.text;
};

export const getChartSuggestion = async (data: any[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  const dataSample = data.slice(0, 5);
  
  const response = await ai.models.generateContent({
    model,
    contents: `Suggest a chart for: ${JSON.stringify(dataSample)}. Return JSON only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          chartType: { type: Type.STRING },
          xAxis: { type: Type.STRING },
          yAxis: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["chartType", "xAxis", "yAxis"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
};