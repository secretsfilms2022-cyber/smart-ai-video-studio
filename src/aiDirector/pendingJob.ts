export type AiDirectorStyle = 'wedding' | 'cinematic' | 'reel' | 'event' | 'documentary';
export type AiDirectorAspect = '9:16' | '16:9' | '1:1';

export interface PendingAiDirectorJob {
  file: File;
  style: AiDirectorStyle;
  aspect: AiDirectorAspect;
  duration: string;
  prompt: string;
}

let pending: PendingAiDirectorJob | null = null;

export function setPendingAiDirectorJob(job: PendingAiDirectorJob): void {
  pending = job;
}

export function consumePendingAiDirectorJob(): PendingAiDirectorJob | null {
  const value = pending;
  pending = null;
  return value;
}
