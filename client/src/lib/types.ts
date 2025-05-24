export interface VoiceSettings {
  speed: number;
  tone: string;
}

export interface TimelineElementData {
  id: string;
  type: 'video' | 'audio' | 'text';
  content: string;
  startTime: number;
  duration: number;
  track: number;
  color: string;
}
