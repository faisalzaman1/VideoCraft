import { Download, Save, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FloatingActionsProps {
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
  isSaving?: boolean;
}

export default function FloatingActions({
  onSave,
  onExport,
  onShare,
  isSaving = false,
}: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all"
            onClick={onExport}
          >
            <Download className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Export Video</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Save Project</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all"
            onClick={onShare}
          >
            <Share className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Share Project</TooltipContent>
      </Tooltip>
    </div>
  );
}
