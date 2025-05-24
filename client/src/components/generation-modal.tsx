import { Video, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GenerationModalProps {
  isOpen: boolean;
  progress: number;
  onCancel: () => void;
}

export default function GenerationModal({
  isOpen,
  progress,
  onCancel,
}: GenerationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">Video Generation Progress</DialogTitle>
        <DialogDescription className="sr-only">AI is generating your video content</DialogDescription>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-sf-pro font-bold mb-2">
            Generating Your Video
          </h3>
          <p className="text-muted-foreground mb-6">
            AI is creating your professional video. This usually takes 2-3 minutes.
          </p>
          
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            <div className="text-sm text-muted-foreground">
              Processing script and generating scenes...
            </div>
            
            <Button variant="outline" onClick={onCancel}>
              Cancel Generation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
