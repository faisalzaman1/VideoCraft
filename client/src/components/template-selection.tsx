import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Template } from "@shared/schema";

interface TemplateSelectionProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Layers className="w-4 h-4 text-primary mr-2" />
          Templates
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`rounded-lg p-3 cursor-pointer transition-all ${
              selectedTemplate?.id === template.id
                ? "border border-primary bg-primary/5"
                : "border border-border hover:border-primary hover:bg-primary/5"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={template.thumbnailUrl}
                alt={template.description || template.name}
                className="w-12 h-8 object-cover rounded"
              />
              <div>
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">
                  {template.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
