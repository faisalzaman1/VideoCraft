import { useState } from "react";
import { Mic, Upload, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface VoiceCloneProps {
  onVoiceCloned: (voiceData: any) => void;
}

export default function VoiceClone({ onVoiceCloned }: VoiceCloneProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setStep('processing');
      
      // Simulate processing
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        setUploadProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(interval);
          setStep('complete');
          onVoiceCloned({
            name: "Your Voice Clone",
            quality: "High",
            file: file.name
          });
        }
      }, 500);
    }
  };

  const resetClone = () => {
    setStep('upload');
    setUploadProgress(0);
    setAudioFile(null);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <h3 className="font-sf-pro font-semibold flex items-center">
          <Mic className="w-4 h-4 text-primary mr-2" />
          Voice Cloning
          <Badge variant="secondary" className="ml-2">Premium</Badge>
        </h3>
      </CardHeader>
      <CardContent className="p-4">
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Upload Voice Sample</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a clear 30-60 second audio sample of your voice
              </p>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="voice-upload"
              />
              <label htmlFor="voice-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Click to upload audio file
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supported: MP3, WAV, M4A (Max 10MB)
                  </div>
                </div>
              </label>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div>📝 <strong>Tips for best results:</strong></div>
              <div>• Speak clearly and naturally</div>
              <div>• Record in a quiet environment</div>
              <div>• Include varied sentence types</div>
              <div>• Avoid background noise</div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h4 className="font-medium mb-2">Processing Voice Sample</h4>
              <p className="text-sm text-muted-foreground mb-4">
                AI is analyzing your voice characteristics...
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              {uploadProgress < 30 && "Analyzing audio quality..."}
              {uploadProgress >= 30 && uploadProgress < 60 && "Extracting voice features..."}
              {uploadProgress >= 60 && uploadProgress < 90 && "Training voice model..."}
              {uploadProgress >= 90 && "Finalizing voice clone..."}
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Voice Clone Ready!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your personalized voice is ready to use
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Your Voice Clone</div>
                  <div className="text-xs text-muted-foreground">
                    Quality: High • File: {audioFile?.name}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Play className="w-3 h-3 mr-1" />
                  Test
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetClone} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button className="flex-1">
                Use This Voice
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}