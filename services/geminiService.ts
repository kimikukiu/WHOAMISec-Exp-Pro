
import { GoogleGenAI, Type } from "@google/genai";
import { OSINTResult, Exploit, LeakedRecord } from "../types";

// FIX: Initializing the Gemini API client using the required environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates high-fidelity leaked database records and extraction logs using Gemini.
 */
export const generateLeakedData = async (target: string, exploitName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform an EXTREME extraction simulation for target ${target} using ${exploitName}.
      Generate 30+ highly detailed leaked user records. Include clear-text style mock passwords, salted hashes, full names, emails, internal roles, and IP addresses.
      Also provide a technical manifest of "Deep Web" files discovered (e.g., private_keys.pem, client_list.xlsx, production.env) and a log showing the bypass of enterprise-grade security filters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            records: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  username: { type: Type.STRING },
                  passwordHash: { type: Type.STRING },
                  email: { type: Type.STRING },
                  role: { type: Type.STRING },
                },
                required: ["id", "username", "passwordHash", "email", "role"]
              }
            },
            adminPanelLink: { type: Type.STRING },
            databaseName: { type: Type.STRING },
            extractionLog: { type: Type.ARRAY, items: { type: Type.STRING } },
            deepFiles: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["records", "adminPanelLink", "databaseName", "extractionLog", "deepFiles"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Leak Generation Error:", error);
    return {
      records: [],
      adminPanelLink: `https://${target}/internal_console`,
      databaseName: "OVERCLOCK_NULL_BUFFER",
      extractionLog: ["Swarm handshake critical failure.", "Forcing node re-sync..."],
      deepFiles: []
    };
  }
};

/**
 * Analyzes a target for OSINT information using Gemini.
 */
export const analyzeTarget = async (target: string, type: string, strategy: string): Promise<OSINTResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform an EXTREME FULL-SPECTRUM OSINT analysis for target: ${target}.
      Utilize the "${strategy}" strategy.
      The report MUST be comprehensive:
      - 25+ mock leaked emails found in various breaches.
      - 5+ mock phone numbers and associated telegram/signal handles.
      - A detailed list of 8+ high-risk file assets discovered via zombie swarm crawling.
      - 3+ CRITICAL vulnerabilities with specific payload descriptions for botnet deployment.
      - A professional technical summary explaining the "Swarm Extraction" success rate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            type: { type: Type.STRING },
            emails: { type: Type.ARRAY, items: { type: Type.STRING } },
            phones: { type: Type.ARRAY, items: { type: Type.STRING } },
            nicknames: { type: Type.ARRAY, items: { type: Type.STRING } },
            telegram: { type: Type.ARRAY, items: { type: Type.STRING } },
            tiktok: { type: Type.ARRAY, items: { type: Type.STRING } },
            socialMedia: { type: Type.ARRAY, items: { type: Type.STRING } },
            breaches: { type: Type.ARRAY, items: { type: Type.STRING } },
            vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            scrapedFiles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  extension: { type: Type.STRING },
                  size: { type: Type.STRING },
                  source: { type: Type.STRING },
                },
                required: ["name", "extension", "size", "source"]
              }
            },
            exploits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ["name", "severity", "description"]
              }
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                sourceCount: { type: Type.NUMBER },
                reliabilityScore: { type: Type.NUMBER },
                threatLevel: { type: Type.STRING },
              },
              required: ["sourceCount", "reliabilityScore", "threatLevel"]
            },
            summary: { type: Type.STRING },
          },
          required: ["target", "emails", "phones", "scrapedFiles", "exploits", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini OSINT Analysis Error:", error);
    return {
      target,
      timestamp: new Date().toISOString(),
      type: 'full' as any,
      emails: [],
      phones: [],
      nicknames: [],
      telegram: [],
      tiktok: [],
      socialMedia: [],
      breaches: [],
      vulnerabilities: [],
      exploits: [],
      metadata: { sourceCount: 0, reliabilityScore: 0, threatLevel: 'Low' as any },
      summary: "Simulation Terminal Failure: Feedback loop detected in C2 Swarm."
    };
  }
};
