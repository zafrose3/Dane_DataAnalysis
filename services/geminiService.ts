
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Shared system instruction to ensure clean, readable, and concise output without Markdown artifacts
const SYSTEM_INSTRUCTION = `You are Dane, a helpful and clear data assistant. 
Your goal is to explain complex data concepts using simple, plain language that anyone can understand.
CRITICAL RULES:
1. DO NOT use any Markdown formatting like asterisks (***), hashtags (###), or bolding (**).
2. DO NOT provide long-winded explanations. Keep responses under 4 short sentences.
3. Use a friendly, professional, and encouraging tone. Avoid being overly childish or using too many emojis.
4. Focus on clarity and immediate value.`;

export const getGeminiInsights = async (data: any[], question?: string) => {
  const model = 'gemini-3-flash-preview';
  
  const dataSample = data.slice(0, 10);
  const context = `
    Analyze this data sample: ${JSON.stringify(dataSample)}.
    ${question ? `User question: ${question}` : 'Explain the main trend or interesting fact in this data.'}
    Remember: No markdown, no hashtags, keep it brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: context,
      config: {
        temperature: 0.5, // Lower temperature for more focused, less "creative" (messy) output
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Dane is currently unable to read the data. Please check your connection or data format.";
  }
};

export const explainMLTask = async (task: string, data: any[], targetField?: string) => {
  const model = 'gemini-3-flash-preview';
  const dataSample = data.slice(0, 5);
  
  const response = await ai.models.generateContent({
    model,
    contents: `Explain how the ${task} tool works using this data: ${JSON.stringify(dataSample)}. ${targetField ? `The target is ${targetField}.` : ''} 
    Explain it like a helpful guide. No markdown symbols, just plain text. Max 3 sentences.`,
    config: {
      temperature: 0.5,
      systemInstruction: SYSTEM_INSTRUCTION
    }
  });

  return response.text;
};

export const getChartSuggestion = async (data: any[]) => {
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
