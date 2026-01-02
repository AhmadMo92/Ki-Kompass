import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI client
// Note: In Replit, if no API key is provided, this might fail unless using the integration.
// We'll rely on the environment variable OPENAI_API_KEY being present or the integration handling it.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build", 
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  app.post("/api/generate-tasks", async (req, res) => {
    try {
      const { roleName, language } = req.body;
      
      if (!roleName) {
        return res.status(400).json({ error: "Role name is required" });
      }

      // Check if API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "OpenAI API key not configured", 
          mock: true 
        });
      }

      const systemPrompt = `You are a workforce intelligence expert. Generate 5-8 typical professional tasks for the job role: "${roleName}".
      The tasks should be specific, realistic, and cover different categories (Analysis, Coordination, Documentation, Planning, etc.).
      
      Output JSON format:
      {
        "tasks": [
          { "label": "Task Name in ${language === 'de' ? 'German' : 'English'}", "category": "One of: Analysis, Coordination, Documentation, Problem Solving, Planning, Monitoring" }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "gpt-4o",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content generated");
      
      const data = JSON.parse(content);
      res.json(data);

    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate tasks" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
