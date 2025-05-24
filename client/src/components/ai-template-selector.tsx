import { useState } from "react";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Template } from "@shared/schema";

interface AITemplateSelectorProps {
  templates: Template[];
  script: string;
  onTemplateSelected: (template: Template) => void;
  isAnalyzing?: boolean;
}

export default function AITemplateSelector({ 
  templates, 
  script, 
  onTemplateSelected, 
  isAnalyzing = false 
}: AITemplateSelectorProps) {
  const [suggestion, setSuggestion] = useState<Template | null>(null);
  const [confidence, setConfidence] = useState(0);

  const analyzeScript = () => {
    if (!script.trim()) return;

    // Simulate AI analysis
    const keywords = script.toLowerCase();
    let bestMatch = templates[0];
    let bestScore = 0;

    // Simple keyword matching for demo
    const categoryKeywords = {
      corporate: ['business', 'professional', 'company', 'enterprise', 'corporate', 'organization'],
      marketing: ['product', 'sale', 'buy', 'offer', 'promotion', 'brand', 'customer', 'marketing'],
      educational: ['learn', 'teach', 'tutorial', 'guide', 'training', 'course', 'education', 'skill'],
      social: ['share', 'follow', 'like', 'social', 'community', 'engage', 'connect'],
      technology: ['tech', 'software', 'digital', 'app', 'platform', 'innovation', 'solution'],
      healthcare: ['health', 'medical', 'care', 'treatment', 'wellness', 'patient', 'doctor'],
      finance: ['money', 'investment', 'financial', 'bank', 'payment', 'cost', 'budget'],
      realestate: ['property', 'home', 'house', 'real estate', 'location', 'space'],
      ecommerce: ['shop', 'store', 'purchase', 'product', 'order', 'delivery', 'shipping'],
      news: ['news', 'report', 'update', 'announcement', 'information', 'breaking']
    };

    templates.forEach(template => {
      const categoryKeys = categoryKeywords[template.category as keyof typeof categoryKeywords] || [];
      let score = 0;
      
      categoryKeys.forEach(keyword => {
        if (keywords.includes(keyword)) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    });

    // Calculate confidence based on keyword matches
    const maxPossibleScore = categoryKeywords[bestMatch.category as keyof typeof categoryKeywords]?.length || 1;
    const calculatedConfidence = Math.min(85, (bestScore / maxPossibleScore) * 100 + Math.random() * 20);

    setTimeout(() => {
      setSuggestion(bestMatch);
      setConfidence(Math.round(calculatedConfidence));
    }, 1500);
  };

  if (!script.trim()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Write a script first to get AI template suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Sparkles className="w-4 h-4 text-primary mr-2" />
          AI Template Selector
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {!suggestion && !isAnalyzing && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Get AI Recommendation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Let AI analyze your script and suggest the perfect template
              </p>
              <Button onClick={analyzeScript} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Script & Suggest Template
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Analyzing Your Script...</h4>
              <p className="text-sm text-muted-foreground">
                AI is finding the best template match for your content
              </p>
            </div>
          </div>
        )}

        {suggestion && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                {confidence}% Match Confidence
              </Badge>
              <h4 className="font-medium mb-2">Recommended Template</h4>
              <p className="text-sm text-muted-foreground">
                Based on your script content analysis
              </p>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={suggestion.thumbnailUrl}
                  alt={suggestion.name}
                  className="w-16 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-muted-foreground">{suggestion.description}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">
                    {suggestion.category} • {suggestion.isPremium ? 'Premium' : 'Free'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSuggestion(null);
                    setConfidence(0);
                  }}
                >
                  Try Again
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onTemplateSelected(suggestion)}
                >
                  Use Template
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              💡 This suggestion is based on keyword analysis of your script content and template categories.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}