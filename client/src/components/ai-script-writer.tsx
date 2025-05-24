import { useState } from "react";
import { Sparkles, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AIScriptWriterProps {
  onScriptGenerated: (script: string) => void;
  isGenerating?: boolean;
}

export default function AIScriptWriter({ onScriptGenerated, isGenerating = false }: AIScriptWriterProps) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [duration, setDuration] = useState("30");
  const [industry, setIndustry] = useState("");

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "energetic", label: "Energetic" },
    { value: "friendly", label: "Friendly" },
    { value: "authoritative", label: "Authoritative" },
    { value: "conversational", label: "Conversational" },
  ];

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          tone,
          duration: parseInt(duration),
          industry: industry.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      onScriptGenerated(data.script);
    } catch (error) {
      console.error('Error generating script:', error);
      // Fallback to a simple message
      onScriptGenerated("I apologize, but I'm unable to generate a script right now. Please try writing your own script or try again later.");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Sparkles className="w-4 h-4 text-primary mr-2" />
          AI Script Writer
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What do you want to talk about?
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video topic, key points, or message..."
            className="w-full h-20 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tone
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Duration (sec)
            </label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="15"
              max="900"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Industry (Optional)
          </label>
          <Input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Healthcare, Technology, Finance..."
          />
        </div>

        <Button 
          onClick={handleGenerateScript}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Script
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}