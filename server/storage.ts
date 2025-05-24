import { 
  users, projects, avatars, voices, templates, timelineElements,
  type User, type InsertUser,
  type Project, type InsertProject,
  type Avatar, type InsertAvatar,
  type Voice, type InsertVoice,
  type Template, type InsertTemplate,
  type TimelineElement, type InsertTimelineElement
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Avatars
  getAllAvatars(): Promise<Avatar[]>;
  getAvatar(id: number): Promise<Avatar | undefined>;
  createAvatar(avatar: InsertAvatar): Promise<Avatar>;

  // Voices
  getAllVoices(): Promise<Voice[]>;
  getVoice(id: number): Promise<Voice | undefined>;
  createVoice(voice: InsertVoice): Promise<Voice>;

  // Templates
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Timeline Elements
  getTimelineElementsByProjectId(projectId: number): Promise<TimelineElement[]>;
  createTimelineElement(element: InsertTimelineElement): Promise<TimelineElement>;
  updateTimelineElement(id: number, updates: Partial<TimelineElement>): Promise<TimelineElement | undefined>;
  deleteTimelineElement(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private avatars: Map<number, Avatar> = new Map();
  private voices: Map<number, Voice> = new Map();
  private templates: Map<number, Template> = new Map();
  private timelineElements: Map<number, TimelineElement> = new Map();

  private currentUserId = 1;
  private currentProjectId = 1;
  private currentAvatarId = 1;
  private currentVoiceId = 1;
  private currentTemplateId = 1;
  private currentTimelineElementId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed avatars
    const defaultAvatars: InsertAvatar[] = [
      {
        name: "Sarah",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=200&h=200&fit=crop&crop=face",
        description: "Professional businesswoman",
        isPremium: false,
      },
      {
        name: "Marcus",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        description: "Professional businessman",
        isPremium: false,
      },
      {
        name: "Emma",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        description: "Young professional woman",
        isPremium: false,
      },
      {
        name: "David",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        description: "Professional mature man",
        isPremium: false,
      },
      {
        name: "Jessica",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
        description: "Creative professional",
        isPremium: false,
      },
      {
        name: "Michael",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        description: "Technology executive",
        isPremium: false,
      },
      {
        name: "Sofia",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
        description: "Marketing specialist",
        isPremium: true,
      },
      {
        name: "James",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
        description: "Sales professional",
        isPremium: true,
      },
      {
        name: "Rachel",
        imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
        description: "Healthcare professional",
        isPremium: true,
      },
      {
        name: "Alex",
        imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
        description: "Educational instructor",
        isPremium: false,
      },
    ];

    defaultAvatars.forEach(avatar => {
      const id = this.currentAvatarId++;
      this.avatars.set(id, { ...avatar, id });
    });

    // Seed voices
    const defaultVoices: InsertVoice[] = [
      {
        name: "Emma - Professional Female",
        gender: "female",
        accent: "American",
        description: "Clear, professional female voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "Marcus - Deep Male",
        gender: "male",
        accent: "American",
        description: "Deep, authoritative male voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "Sarah - Friendly Female",
        gender: "female",
        accent: "British",
        description: "Warm, friendly female voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "David - Authoritative Male",
        gender: "male",
        accent: "American",
        description: "Strong, confident male voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "Sofia - Conversational Female",
        gender: "female",
        accent: "Spanish",
        description: "Natural, conversational voice with Spanish accent",
        sampleUrl: null,
        isPremium: true,
      },
      {
        name: "James - Executive Male",
        gender: "male",
        accent: "British",
        description: "Sophisticated British executive voice",
        sampleUrl: null,
        isPremium: true,
      },
      {
        name: "Aria - Young Female",
        gender: "female",
        accent: "Australian",
        description: "Energetic young Australian voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "Nathan - Technical Male",
        gender: "male",
        accent: "Canadian",
        description: "Clear technical presentation voice",
        sampleUrl: null,
        isPremium: false,
      },
      {
        name: "Voice Clone",
        gender: "custom",
        accent: "Custom",
        description: "Clone your own voice for personalized videos",
        sampleUrl: null,
        isPremium: true,
      },
    ];

    defaultVoices.forEach(voice => {
      const id = this.currentVoiceId++;
      this.voices.set(id, { ...voice, id });
    });

    // Seed templates
    const defaultTemplates: InsertTemplate[] = [
      {
        name: "Corporate",
        category: "corporate",
        description: "Professional business presentation",
        thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "Marketing",
        category: "marketing",
        description: "Product promotion & sales",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "Educational",
        category: "educational",
        description: "Training & tutorials",
        thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "Social Media",
        category: "social",
        description: "Engaging social media content",
        thumbnailUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "News & Media",
        category: "news",
        description: "Professional news and media content",
        thumbnailUrl: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=300&h=200&fit=crop",
        isPremium: true,
      },
      {
        name: "Healthcare",
        category: "healthcare",
        description: "Medical and healthcare presentations",
        thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
        isPremium: true,
      },
      {
        name: "Technology",
        category: "technology",
        description: "Tech product demos and explainers",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "Finance",
        category: "finance",
        description: "Financial services and banking",
        thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop",
        isPremium: true,
      },
      {
        name: "Real Estate",
        category: "realestate",
        description: "Property showcases and tours",
        thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
        isPremium: false,
      },
      {
        name: "E-commerce",
        category: "ecommerce",
        description: "Product demonstrations and reviews",
        thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
        isPremium: false,
      },
    ];

    defaultTemplates.forEach(template => {
      const id = this.currentTemplateId++;
      this.templates.set(id, { ...template, id });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const newProject: Project = {
      ...project,
      id,
      selectedAvatarId: project.selectedAvatarId || null,
      selectedVoiceId: project.selectedVoiceId || null,
      selectedTemplateId: project.selectedTemplateId || null,
      voiceSettings: project.voiceSettings || null,
      videoDuration: project.videoDuration || 30,
      aspectRatio: project.aspectRatio || "16:9",
      useAvatar: project.useAvatar !== undefined ? project.useAvatar : true,
      status: project.status || "draft",
      videoUrl: project.videoUrl || null,
      duration: project.duration || null,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Avatars
  async getAllAvatars(): Promise<Avatar[]> {
    return Array.from(this.avatars.values());
  }

  async getAvatar(id: number): Promise<Avatar | undefined> {
    return this.avatars.get(id);
  }

  async createAvatar(avatar: InsertAvatar): Promise<Avatar> {
    const id = this.currentAvatarId++;
    const newAvatar: Avatar = { ...avatar, id };
    this.avatars.set(id, newAvatar);
    return newAvatar;
  }

  // Voices
  async getAllVoices(): Promise<Voice[]> {
    return Array.from(this.voices.values());
  }

  async getVoice(id: number): Promise<Voice | undefined> {
    return this.voices.get(id);
  }

  async createVoice(voice: InsertVoice): Promise<Voice> {
    const id = this.currentVoiceId++;
    const newVoice: Voice = { ...voice, id };
    this.voices.set(id, newVoice);
    return newVoice;
  }

  // Templates
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const newTemplate: Template = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  // Timeline Elements
  async getTimelineElementsByProjectId(projectId: number): Promise<TimelineElement[]> {
    return Array.from(this.timelineElements.values()).filter(element => element.projectId === projectId);
  }

  async createTimelineElement(element: InsertTimelineElement): Promise<TimelineElement> {
    const id = this.currentTimelineElementId++;
    const newElement: TimelineElement = { ...element, id };
    this.timelineElements.set(id, newElement);
    return newElement;
  }

  async updateTimelineElement(id: number, updates: Partial<TimelineElement>): Promise<TimelineElement | undefined> {
    const element = this.timelineElements.get(id);
    if (!element) return undefined;

    const updatedElement = { ...element, ...updates };
    this.timelineElements.set(id, updatedElement);
    return updatedElement;
  }

  async deleteTimelineElement(id: number): Promise<boolean> {
    return this.timelineElements.delete(id);
  }
}

export const storage = new MemStorage();
