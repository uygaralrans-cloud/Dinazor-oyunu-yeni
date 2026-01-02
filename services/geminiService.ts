
import { GoogleGenAI, Type } from "@google/genai";
import { EvolutionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEvolutionContent = async (score: number): Promise<EvolutionData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The player reached a score of ${score} in a cyberpunk dino run game. Generate a "Sector Evolution". 
      Provide a cool futuristic sector name, a short immersive description (max 15 words), and a mutation name (e.g., "Gravity Shift"). 
      Also provide a primary neon color hex code.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sectorName: { type: Type.STRING },
            description: { type: Type.STRING },
            mutationEffect: { type: Type.STRING },
            colorTheme: { type: Type.STRING },
          },
          required: ["sectorName", "description", "mutationEffect", "colorTheme"],
        },
      },
    });

    const data = JSON.parse(response.text.trim());
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      sectorName: "System Glitch",
      description: "Reality destabilizes as the code rewrites itself.",
      mutationEffect: "Chaos Theory",
      colorTheme: "#ff00ff"
    };
  }
};
