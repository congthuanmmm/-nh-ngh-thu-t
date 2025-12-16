import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// CRITICAL: Using process.env.API_KEY as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image using Gemini Vision (Flash model).
 * It acts as an art critic/curator.
 */
export const analyzeArtwork = async (imageBase64: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `You are a world-renowned art critic and curator. Analyze this image. 
              Provide a JSON response with the following fields:
              - title: A creative title for the piece.
              - critique: A sophisticated, 2-sentence artistic critique of the composition, lighting, and meaning.
              - mood: One or two words describing the mood (e.g., Melancholic, Ethereal).
              - style: The likely art style (e.g., Baroque, Abstract Expressionism, Photorealism).`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            critique: { type: Type.STRING },
            mood: { type: Type.STRING },
            style: { type: Type.STRING },
          },
          required: ["title", "critique", "mood", "style"],
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No analysis returned");
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      title: "Untitled Mystery",
      critique: "The curator is currently on a coffee break and cannot analyze this piece right now.",
      mood: "Unknown",
      style: "Undefined"
    };
  }
};

/**
 * Generates a new artwork using Gemini Image Generation.
 */
export const generateArtwork = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    // Extract image from response
    // The response for image generation contains the image in inlineData
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};

/**
 * Helper to convert a URL (like picsum) to base64 for the Vision API
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};