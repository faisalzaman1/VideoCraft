import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  script: text("script").notNull(),
  selectedAvatarId: integer("selected_avatar_id"),
  selectedVoiceId: integer("selected_voice_id"),
  selectedTemplateId: integer("selected_template_id"),
  voiceSettings: json("voice_settings").$type<{
    speed: number;
    tone: string;
  }>(),
  videoDuration: integer("video_duration").notNull().default(30), // in seconds
  aspectRatio: text("aspect_ratio").notNull().default("16:9"), // video aspect ratio
  useAvatar: boolean("use_avatar").notNull().default(true),
  status: text("status").notNull().default("draft"), // draft, generating, completed, error
  videoUrl: text("video_url"),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const avatars = pgTable("avatars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  isPremium: boolean("is_premium").notNull().default(false),
});

export const voices = pgTable("voices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(), // male, female
  accent: text("accent"),
  description: text("description"),
  sampleUrl: text("sample_url"),
  isPremium: boolean("is_premium").notNull().default(false),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // corporate, marketing, educational
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
});

export const timelineElements = pgTable("timeline_elements", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  type: text("type").notNull(), // video, audio, text
  content: text("content"),
  startTime: integer("start_time").notNull(), // in milliseconds
  duration: integer("duration").notNull(), // in milliseconds
  track: integer("track").notNull().default(0),
  properties: json("properties").$type<Record<string, any>>(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAvatarSchema = createInsertSchema(avatars).omit({
  id: true,
});

export const insertVoiceSchema = createInsertSchema(voices).omit({
  id: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export const insertTimelineElementSchema = createInsertSchema(timelineElements).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Avatar = typeof avatars.$inferSelect;
export type InsertAvatar = z.infer<typeof insertAvatarSchema>;

export type Voice = typeof voices.$inferSelect;
export type InsertVoice = z.infer<typeof insertVoiceSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type TimelineElement = typeof timelineElements.$inferSelect;
export type InsertTimelineElement = z.infer<typeof insertTimelineElementSchema>;
