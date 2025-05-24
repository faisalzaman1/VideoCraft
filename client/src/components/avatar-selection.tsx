import { UserCircle, Plus, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { Avatar } from "@shared/schema";

interface AvatarSelectionProps {
  avatars: Avatar[];
  selectedAvatar: Avatar | null;
  useAvatar: boolean;
  onSelectAvatar: (avatar: Avatar) => void;
  onToggleAvatar: (useAvatar: boolean) => void;
}

export default function AvatarSelection({
  avatars,
  selectedAvatar,
  useAvatar,
  onSelectAvatar,
  onToggleAvatar,
}: AvatarSelectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sf-pro font-semibold flex items-center">
            <UserCircle className="w-4 h-4 text-primary mr-2" />
            Avatar Settings
          </h3>
          <div className="flex items-center space-x-2">
            <Switch
              checked={useAvatar}
              onCheckedChange={onToggleAvatar}
            />
            <span className="text-sm text-muted-foreground">
              {useAvatar ? "With Avatar" : "Voice Only"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!useAvatar ? (
          <div className="text-center py-8">
            <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium mb-2">Voice-Only Mode</h4>
            <p className="text-sm text-muted-foreground">
              Your video will feature background visuals with AI voice narration
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="relative group cursor-pointer"
                  onClick={() => onSelectAvatar(avatar)}
                >
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.description || avatar.name}
                    className={`w-full aspect-square object-cover rounded-lg transition-all ${
                      selectedAvatar?.id === avatar.id
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-primary/50"
                    }`}
                  />
                  <div
                    className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedAvatar?.id === avatar.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {avatar.name}
                  </div>
                  {avatar.isPremium && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded">
                      Pro
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Upload Custom Avatar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
