import { Plus, Scissors, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project } from "@shared/schema";
import type { TimelineElementData } from "@/lib/types";

interface TimelineEditorProps {
  project: Project | null;
}

export default function TimelineEditor({ project }: TimelineEditorProps) {
  const timelineElements: TimelineElementData[] = [
    {
      id: "video-1",
      type: "video",
      content: "Scene 1",
      startTime: 0,
      duration: 30000,
      track: 0,
      color: "from-primary to-indigo-500",
    },
    {
      id: "video-2",
      type: "video",
      content: "Scene 2",
      startTime: 30000,
      duration: 30000,
      track: 0,
      color: "from-secondary to-pink-500",
    },
    {
      id: "audio-1",
      type: "audio",
      content: "AI Voice",
      startTime: 0,
      duration: 60000,
      track: 1,
      color: "from-accent to-purple-500",
    },
    {
      id: "text-1",
      type: "text",
      content: "Title",
      startTime: 0,
      duration: 45000,
      track: 2,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sf-pro font-semibold">Timeline Editor</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Scissors className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Timeline Ruler */}
        <div className="mb-4">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <span className="w-16">0:00</span>
            <span className="flex-1 text-center">0:30</span>
            <span className="w-16 text-right">1:00</span>
            <span className="w-16 text-right">1:30</span>
          </div>
          <div className="h-2 bg-muted rounded relative">
            <div className="absolute top-0 left-1/4 w-0.5 h-2 bg-primary"></div>
          </div>
        </div>
        
        {/* Timeline Tracks */}
        <div className="space-y-3">
          {/* Video Track */}
          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-foreground">Video</div>
            <div className="flex-1 h-12 bg-muted rounded border-2 border-dashed border-border relative">
              <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-primary to-indigo-500 rounded flex items-center px-3">
                <span className="text-primary-foreground text-xs font-medium">Scene 1</span>
              </div>
              <div className="absolute left-1/3 top-0 w-1/3 h-full bg-gradient-to-r from-secondary to-pink-500 rounded flex items-center px-3 ml-1">
                <span className="text-secondary-foreground text-xs font-medium">Scene 2</span>
              </div>
            </div>
          </div>
          
          {/* Audio Track */}
          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-foreground">Audio</div>
            <div className="flex-1 h-12 bg-muted rounded border-2 border-dashed border-border relative">
              <div className="absolute left-0 top-0 w-2/3 h-full bg-gradient-to-r from-accent to-purple-500 rounded flex items-center px-3">
                <span className="text-accent-foreground text-xs font-medium">AI Voice</span>
              </div>
            </div>
          </div>
          
          {/* Text Track */}
          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-foreground">Text</div>
            <div className="flex-1 h-12 bg-muted rounded border-2 border-dashed border-border relative">
              <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded flex items-center px-3">
                <span className="text-white text-xs font-medium">Title</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
