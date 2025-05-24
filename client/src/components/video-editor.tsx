import { Play, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project, Template } from "@shared/schema";

interface VideoEditorProps {
  project: Project | null;
  selectedTemplate: Template | null;
  onPreview: () => void;
}

export default function VideoEditor({ project, selectedTemplate, onPreview }: VideoEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-sf-pro font-bold">
              {project?.title || "Marketing Video Project"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Last edited 2 minutes ago
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button onClick={onPreview}>
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
          {selectedTemplate && (
            <img 
              src={selectedTemplate.thumbnailUrl} 
              alt={selectedTemplate.description}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button 
              onClick={onPreview}
              className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-opacity-100 transition-all"
            >
              <Play className="w-6 h-6 ml-1" />
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white bg-opacity-20 rounded-full h-1">
              <div className="bg-white h-1 rounded-full w-1/3"></div>
            </div>
          </div>
          
          {/* Duration */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            0:23 / 1:30
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
