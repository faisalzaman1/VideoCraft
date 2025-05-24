import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import VideoEditor from "@/components/video-editor";
import TimelineEditor from "@/components/timeline-editor";
import ScriptEditor from "@/components/script-editor";
import AvatarSelection from "@/components/avatar-selection";
import VoiceSettings from "@/components/voice-settings";
import TemplateSelection from "@/components/template-selection";
import FloatingActions from "@/components/floating-actions";
import GenerationModal from "@/components/generation-modal";
import AIScriptWriter from "@/components/ai-script-writer";
import ScriptEnhancer from "@/components/script-enhancer";
import VideoSettings from "@/components/video-settings";
import VoiceClone from "@/components/voice-clone";
import AITemplateSelector from "@/components/ai-template-selector";
import type { Project, Avatar, Voice, Template } from "@shared/schema";
import type { VoiceSettings as VoiceSettingsType } from "@/lib/types";

export default function Studio() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    speed: 1.0,
    tone: "Professional",
  });
  const [script, setScript] = useState("Welcome to our innovative platform that transforms the way you create content. With cutting-edge AI technology, we're making professional video creation accessible to everyone.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(30);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [useAvatar, setUseAvatar] = useState(true);
  const [showVoiceClone, setShowVoiceClone] = useState(false);

  // Fetch avatars
  const { data: avatars = [] } = useQuery<Avatar[]>({
    queryKey: ["/api/avatars"],
  });

  // Fetch voices
  const { data: voices = [] } = useQuery<Voice[]>({
    queryKey: ["/api/voices"],
  });

  // Fetch templates
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  // Set defaults when data is loaded
  useEffect(() => {
    if (avatars.length > 0 && !selectedAvatar) {
      setSelectedAvatar(avatars.find(a => a.name === "Emma") || avatars[0]);
    }
  }, [avatars, selectedAvatar]);

  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      setSelectedVoice(voices.find(v => v.name.includes("Emma")) || voices[0]);
    }
  }, [voices, selectedVoice]);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates.find(t => t.name === "Corporate") || templates[0]);
    }
  }, [templates, selectedTemplate]);

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: (project: Project) => {
      setCurrentProject(project);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: (project: Project) => {
      setCurrentProject(project);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  // Generate video mutation
  const generateVideoMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/generate`);
      return response.json();
    },
    onSuccess: () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            setGenerationProgress(0);
            if (currentProject) {
              updateProjectMutation.mutate({
                id: currentProject.id,
                updates: { status: "completed" }
              });
            }
            return 100;
          }
          return newProgress;
        });
      }, 300);
    },
  });

  const handleGenerateVideo = async () => {
    try {
      if (!currentProject) {
        // Create new project first
        const projectData = {
          title: "Marketing Video Project",
          script,
          selectedAvatarId: selectedAvatar?.id,
          selectedVoiceId: selectedVoice?.id,
          selectedTemplateId: selectedTemplate?.id,
          voiceSettings,
          videoDuration,
          aspectRatio,
          useAvatar,
          status: "draft",
        };
        
        const project = await createProjectMutation.mutateAsync(projectData);
        generateVideoMutation.mutate(project.id);
      } else {
        // Update existing project and generate
        await updateProjectMutation.mutateAsync({
          id: currentProject.id,
          updates: {
            script,
            selectedAvatarId: selectedAvatar?.id,
            selectedVoiceId: selectedVoice?.id,
            selectedTemplateId: selectedTemplate?.id,
            voiceSettings,
          }
        });
        generateVideoMutation.mutate(currentProject.id);
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) {
      // Create new project
      const projectData = {
        title: "Marketing Video Project",
        script,
        selectedAvatarId: selectedAvatar?.id,
        selectedVoiceId: selectedVoice?.id,
        selectedTemplateId: selectedTemplate?.id,
        voiceSettings,
        videoDuration,
        aspectRatio,
        useAvatar,
        status: "draft",
      };
      
      createProjectMutation.mutate(projectData);
    } else {
      // Update existing project
      updateProjectMutation.mutate({
        id: currentProject.id,
        updates: {
          script,
          selectedAvatarId: selectedAvatar?.id,
          selectedVoiceId: selectedVoice?.id,
          selectedTemplateId: selectedTemplate?.id,
          voiceSettings,
          videoDuration,
          aspectRatio,
          useAvatar,
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Editor Area */}
          <div className="col-span-12 lg:col-span-8">
            <VideoEditor 
              project={currentProject}
              selectedTemplate={selectedTemplate}
              onPreview={() => {}}
            />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <AIScriptWriter 
              onScriptGenerated={setScript}
              isGenerating={false}
            />
            
            <ScriptEditor 
              script={script}
              onScriptChange={setScript}
              onGenerate={handleGenerateVideo}
              isGenerating={generateVideoMutation.isPending || isGenerating}
            />

            <ScriptEnhancer
              currentScript={script}
              onScriptEnhanced={setScript}
              isEnhancing={false}
            />

            <VideoSettings
              videoDuration={videoDuration}
              aspectRatio={aspectRatio}
              onDurationChange={setVideoDuration}
              onAspectRatioChange={setAspectRatio}
            />
            
            <AvatarSelection
              avatars={avatars}
              selectedAvatar={selectedAvatar}
              useAvatar={useAvatar}
              onSelectAvatar={setSelectedAvatar}
              onToggleAvatar={setUseAvatar}
            />
            
            {selectedVoice?.name === "Voice Clone" ? (
              <VoiceClone onVoiceCloned={() => {}} />
            ) : (
              <VoiceSettings
                voices={voices}
                selectedVoice={selectedVoice}
                voiceSettings={voiceSettings}
                onSelectVoice={setSelectedVoice}
                onUpdateSettings={setVoiceSettings}
              />
            )}

            <AITemplateSelector
              templates={templates}
              script={script}
              onTemplateSelected={setSelectedTemplate}
              isAnalyzing={false}
            />
            
            <TemplateSelection
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        </div>

        {/* Timeline Editor at Bottom */}
        <div className="mt-8">
          <TimelineEditor project={currentProject} />
        </div>
      </div>

      <FloatingActions 
        onSave={handleSaveProject}
        onExport={() => {}}
        onShare={() => {}}
        isSaving={createProjectMutation.isPending || updateProjectMutation.isPending}
      />

      <GenerationModal
        isOpen={isGenerating}
        progress={generationProgress}
        onCancel={() => {
          setIsGenerating(false);
          setGenerationProgress(0);
        }}
      />
    </div>
  );
}
