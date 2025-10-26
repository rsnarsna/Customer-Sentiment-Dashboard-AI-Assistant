import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { AnalysisResult, ChatMessage, AIProvider } from '../types';

// --- Google GenAI Setup ---
const googleAI = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentimentTrend: {
      type: Type.ARRAY,
      description: "An array of objects, where each object represents a review and its sentiment score. The order must be preserved.",
      items: {
        type: Type.OBJECT,
        properties: {
          reviewNumber: { type: Type.INTEGER, description: "The sequential number of the review, starting from 1." },
          sentimentScore: { type: Type.NUMBER, description: "A score from -1 (very negative) to 1 (very positive) representing the review's sentiment." },
        },
        required: ["reviewNumber", "sentimentScore"],
      },
    },
    wordCloud: {
      type: Type.ARRAY,
      description: "An array of the most frequent and important words or short phrases from the reviews, along with their frequencies. Include a mix of positive and negative terms.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The word or short phrase." },
          value: { type: Type.INTEGER, description: "The frequency or importance of the word/phrase." },
        },
        required: ["text", "value"],
      },
    },
    summary: {
      type: Type.STRING,
      description: "A concise, well-written executive summary in markdown format. It must detail the top 3 actionable areas for improvement based on the provided reviews.",
    },
  },
  required: ["sentimentTrend", "wordCloud", "summary"],
};

export const analyzeReviews = async (reviews: string, provider: AIProvider): Promise<AnalysisResult> => {
  switch (provider) {
    case 'google':
      try {
        const response = await googleAI.models.generateContent({
          model: "gemini-2.5-pro",
          contents: `Analyze the following customer reviews and provide a structured analysis. The reviews are separated by newlines:\n\n---\n${reviews}\n---`,
          config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
          },
        });
        return JSON.parse(response.text) as AnalysisResult;
      } catch (error) {
        console.error("Error analyzing reviews with Google Gemini:", error);
        throw new Error("Failed to analyze reviews with Google Gemini API.");
      }
    case 'openai':
    case 'mistral':
      // To fully implement OpenAI and Mistral, you would need their API keys (e.g., process.env.OPENAI_API_KEY) and SDKs or fetch calls.
      // This is a placeholder to demonstrate the architecture.
      console.warn(`Analysis with ${provider} is a placeholder.`);
      throw new Error(`Analysis with ${provider} is not implemented. Please add the API call in services/aiService.ts.`);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

// FIX: Corrected the return type to AsyncIterable<GenerateContentResponse> to match the type returned by chat.sendMessageStream.
export const sendMessage = async (
    provider: AIProvider,
    history: ChatMessage[],
    message: string,
    thinkingMode: boolean
): Promise<AsyncIterable<GenerateContentResponse> | string> => {
  switch (provider) {
    case 'google':
      const model = thinkingMode ? "gemini-2.5-pro" : "gemini-2.5-flash";
      const config = thinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
      
      const chat = googleAI.chats.create({
          model,
          config,
          history: history.map(m => ({
              role: m.role,
              parts: [{ text: m.content }]
          }))
      });
      return chat.sendMessageStream({ message });
    
    case 'openai':
    case 'mistral':
      // This is a non-streaming placeholder to demonstrate the architecture.
      // You would replace this with a `fetch` call to the OpenAI/Mistral API.
      console.warn(`Chat with ${provider} is a placeholder.`);
      throw new Error(`Chat with ${provider} is not implemented. Please add the API call in services/aiService.ts.`);

    default:
      throw new Error(`Unsupported provider for chat: ${provider}`);
  }
};