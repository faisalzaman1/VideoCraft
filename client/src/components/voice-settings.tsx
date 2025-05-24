import { Mic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Voice } from "@shared/schema";
import type { VoiceSettings as VoiceSettingsType } from "@/lib/types";

interface VoiceSettingsProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  voiceSettings: VoiceSettingsType;
  onSelectVoice: (voice: Voice) => void;
  onUpdateSettings: (settings: VoiceSettingsType) => void;
}

export default function VoiceSettings({
  voices,
  selectedVoice,
  voiceSettings,
  onSelectVoice,
  onUpdateSettings,
}: VoiceSettingsProps) {
  const toneOptions = ["Professional", "Casual", "Energetic", "Warm"];

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Mic className="w-4 h-4 text-primary mr-2" />
          Voice Settings
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Voice Type
          </label>
          <Select
            value={selectedVoice?.id.toString()}
            onValueChange={(value) => {
              const voice = voices.find(v => v.id === parseInt(value));
              if (voice) onSelectVoice(voice);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id.toString()}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Speaking Speed
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-muted-foreground">Slow</span>
            <div className="flex-1">
              <Slider
                value={[voiceSettings.speed]}
                onValueChange={([value]) =>
                  onUpdateSettings({ ...voiceSettings, speed: value })
                }
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tone
          </label>
          <div className="grid grid-cols-2 gap-2">
            {toneOptions.map((tone) => (
              <Button
                key={tone}
                variant={voiceSettings.tone === tone ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onUpdateSettings({ ...voiceSettings, tone })
                }
                className="text-sm"
              >
                {tone}
              </Button>
            ))}
          </div>
        </div>
        
        <Button variant="secondary" className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Preview Voice
        </Button>
      </CardContent>
    </Card>
  );
}
