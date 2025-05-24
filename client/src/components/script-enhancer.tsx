import { useState } from "react";
import { Zap, Target, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ScriptEnhancerProps {
  currentScript: string;
  onScriptEnhanced: (script: string) => void;
  isEnhancing?: boolean;
}

export default function ScriptEnhancer({ currentScript, onScriptEnhanced, isEnhancing = false }: ScriptEnhancerProps) {
  const [enhancementType, setEnhancementType] = useState<string | null>(null);

  const enhancements = [
    {
      id: "engagement",
      icon: Target,
      title: "Increase Engagement",
      description: "Add hooks, questions, and call-to-actions",
      color: "bg-primary"
    },
    {
      id: "clarity",
      icon: Zap,
      title: "Improve Clarity",
      description: "Simplify language and structure",
      color: "bg-secondary"
    },
    {
      id: "emotional",
      icon: Users,
      title: "Add Emotional Appeal",
      description: "Include storytelling and emotional triggers",
      color: "bg-accent"
    },
    {
      id: "conversion",
      icon: TrendingUp,
      title: "Boost Conversions",
      description: "Optimize for sales and actions",
      color: "bg-emerald-500"
    }
  ];

  const handleEnhance = async (type: string) => {
    if (!currentScript.trim()) return;
    
    setEnhancementType(type);
    
    try {
      const response = await fetch('/api/enhance-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: currentScript,
          enhancementType: type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance script');
      }

      const data = await response.json();
      onScriptEnhanced(data.script);
    } catch (error) {
      console.error('Error enhancing script:', error);
      // Keep original script if enhancement fails
      onScriptEnhanced(currentScript);
    } finally {
      setEnhancementType(null);
    }
  };

  if (!currentScript.trim()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Write or generate a script first to use the enhancer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Zap className="w-4 h-4 text-primary mr-2" />
          Script Enhancer
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Current Script Preview
          </label>
          <div className="bg-muted p-3 rounded-lg max-h-20 overflow-y-auto">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {currentScript.substring(0, 150)}...
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Choose Enhancement Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {enhancements.map((enhancement) => {
              const Icon = enhancement.icon;
              const isActive = enhancementType === enhancement.id;
              
              return (
                <Button
                  key={enhancement.id}
                  variant="outline"
                  className={`h-auto p-4 text-left justify-start ${isActive ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => handleEnhance(enhancement.id)}
                  disabled={isEnhancing || isActive}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`w-8 h-8 rounded-lg ${enhancement.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{enhancement.title}</div>
                      <div className="text-xs text-muted-foreground">{enhancement.description}</div>
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="ml-2">
                        Enhancing...
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            AI will analyze your script and apply the selected enhancement
          </p>
        </div>
      </CardContent>
    </Card>
  );
}