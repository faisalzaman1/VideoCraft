import { Clock, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface VideoSettingsProps {
  videoDuration: number;
  aspectRatio: string;
  onDurationChange: (duration: number) => void;
  onAspectRatioChange: (ratio: string) => void;
}

export default function VideoSettings({
  videoDuration,
  aspectRatio,
  onDurationChange,
  onAspectRatioChange,
}: VideoSettingsProps) {
  const aspectRatios = [
    { value: "16:9", label: "16:9 (Landscape)", description: "YouTube, LinkedIn" },
    { value: "9:16", label: "9:16 (Portrait)", description: "TikTok, Instagram Stories" },
    { value: "1:1", label: "1:1 (Square)", description: "Instagram Posts" },
    { value: "4:3", label: "4:3 (Standard)", description: "Traditional TV" },
    { value: "21:9", label: "21:9 (Cinematic)", description: "Widescreen" },
    { value: "4:5", label: "4:5 (Vertical)", description: "Instagram Feed" },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Clock className="w-4 h-4 text-primary mr-2" />
          Video Settings
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Video Duration: {formatDuration(videoDuration)}
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-muted-foreground">30s</span>
            <div className="flex-1">
              <Slider
                value={[videoDuration]}
                onValueChange={([value]) => onDurationChange(value)}
                min={30}
                max={900}
                step={15}
                className="w-full"
              />
            </div>
            <span className="text-xs text-muted-foreground">15m</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Recommended: 30s-2min for social media, 2-5min for presentations
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
            <Monitor className="w-4 h-4 mr-1" />
            Aspect Ratio
          </label>
          <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  <div>
                    <div className="font-medium">{ratio.label}</div>
                    <div className="text-xs text-muted-foreground">{ratio.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="mb-1">💡 <strong>Quick Tips:</strong></div>
            <div>• 16:9 for YouTube and business presentations</div>
            <div>• 9:16 for TikTok, Instagram Stories, YouTube Shorts</div>
            <div>• 1:1 for Instagram posts and general social media</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}