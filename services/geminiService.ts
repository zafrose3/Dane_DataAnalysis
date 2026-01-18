
import { GoogleGenAI, Type } from "@google/genai";

const DANE_SYSTEM_INSTRUCTION = `You are Dane, a professional and concise data analysis assistant. 
Your goal is to explain data insights and machine learning concepts in plain, high-contrast English.

STRICT FORMATTING RULES:
1. NEVER use Markdown formatting. Absolutely no bolding (**), italics (*), headers (#), bullet points (-), or backticks (\`).
2. ONLY return raw, unformatted plain text.
3. Keep responses extremely concise: maximum 2 to 3 short sentences.
4. Tone: Helpful, professional, and clear. Do not use "cute" or childish language. Avoid excessive emojis.
5. Focus on the direct business or data value of the insight.`;

const handleAiError = (error: any) => {
  console.error("Gemini Error:", error);
  const msg = error?.message || "";
  // Per guidelines: if entity was not found, we need to re-trigger key selection
  if (msg.includes("Requested entity was not found") || msg.includes("API_KEY_INVALID")) {
    return "RESET_KEY";
  }
  return "ERROR";
};

export const getGeminiInsights = async (data: any[], question?: string) => {
  if (!process.env.API_KEY) return "AI_ASLEEP";

  // Create instance right before use with literal process.env.API_KEY per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  } catch (error: any) {
    const status = handleAiError(error);
    if (status === "RESET_KEY") return "RESET_KEY";
    return "I encountered an error analyzing the data. Please ensure the data format is correct.";
  }
};

export const explainMLTask = async (task: string, data: any[], targetField?: string) => {
  if (!process.env.API_KEY) return "AI_ASLEEP";

  // Create instance right before use with literal process.env.API_KEY per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview'; 
  const dataSample = data.slice(0, 5);
  
  try {
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
  } catch (error: any) {
    const status = handleAiError(error);
    if (status === "RESET_KEY") return "RESET_KEY";
    return "AI is having trouble thinking right now. Please try again.";
  }
};
