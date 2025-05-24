import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { generateScript, enhanceScript, analyzeScriptForTemplate } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      // For demo purposes, using user ID 1
      const userId = 1;
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      // For demo purposes, using user ID 1
      const userId = 1;
      const project = await storage.createProject({ ...projectData, userId });
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Avatars routes
  app.get("/api/avatars", async (req, res) => {
    try {
      const avatars = await storage.getAllAvatars();
      res.json(avatars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch avatars" });
    }
  });

  // Voices routes
  app.get("/api/voices", async (req, res) => {
    try {
      const voices = await storage.getAllVoices();
      res.json(voices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch voices" });
    }
  });

  // Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Video generation route
  app.post("/api/projects/:id/generate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Update project status to generating
      await storage.updateProject(id, { status: "generating" });

      // Simulate AI video generation process
      setTimeout(async () => {
        try {
          // Simulate completion after 30 seconds
          await storage.updateProject(id, {
            status: "completed",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: 90, // 90 seconds
          });
        } catch (error) {
          await storage.updateProject(id, { status: "error" });
        }
      }, 30000);

      res.json({ message: "Video generation started", status: "generating" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start video generation" });
    }
  });

  // Timeline elements routes
  app.get("/api/projects/:id/timeline", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const elements = await storage.getTimelineElementsByProjectId(projectId);
      res.json(elements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline elements" });
    }
  });

  // AI Script Generation route
  app.post("/api/generate-script", async (req, res) => {
    try {
      const { prompt, tone, duration, industry } = req.body;
      
      if (!prompt || !tone || !duration) {
        return res.status(400).json({ message: "Missing required fields: prompt, tone, duration" });
      }

      const script = await generateScript(prompt, tone, parseInt(duration), industry);
      res.json({ script });
    } catch (error) {
      console.error("Script generation error:", error);
      res.status(500).json({ message: "Failed to generate script" });
    }
  });

  // AI Script Enhancement route
  app.post("/api/enhance-script", async (req, res) => {
    try {
      const { script, enhancementType } = req.body;
      
      if (!script || !enhancementType) {
        return res.status(400).json({ message: "Missing required fields: script, enhancementType" });
      }

      const enhancedScript = await enhanceScript(script, enhancementType);
      res.json({ script: enhancedScript });
    } catch (error) {
      console.error("Script enhancement error:", error);
      res.status(500).json({ message: "Failed to enhance script" });
    }
  });

  // AI Template Analysis route
  app.post("/api/analyze-template", async (req, res) => {
    try {
      const { script } = req.body;
      
      if (!script) {
        return res.status(400).json({ message: "Missing required field: script" });
      }

      const templates = await storage.getAllTemplates();
      const analysis = await analyzeScriptForTemplate(script, templates);
      const recommendedTemplate = await storage.getTemplate(analysis.templateId);
      
      res.json({ 
        template: recommendedTemplate,
        confidence: analysis.confidence 
      });
    } catch (error) {
      console.error("Template analysis error:", error);
      res.status(500).json({ message: "Failed to analyze template" });
    }
  });

  // Video download route
  app.get("/api/projects/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project || !project.videoUrl) {
        return res.status(404).json({ message: "Video not found or not ready" });
      }

      // For demo, redirect to the video URL
      res.redirect(project.videoUrl);
    } catch (error) {
      res.status(500).json({ message: "Failed to download video" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
