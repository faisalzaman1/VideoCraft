import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function ScriptEditor({ 
  script, 
  onScriptChange, 
  onGenerate, 
  isGenerating 
}: ScriptEditorProps) {
  const wordCount = script.trim().split(/\s+/).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Edit className="w-4 h-4 text-primary mr-2" />
          Script Editor
        </h3>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          className="w-full h-32 resize-none"
          placeholder="Enter your video script here..."
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            Word count: {wordCount}
          </span>
          <Button 
            onClick={onGenerate} 
            size="sm"
            disabled={isGenerating || !script.trim()}
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
