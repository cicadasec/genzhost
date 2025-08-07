'use client';

import { FileCode, Loader2, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadStatusProps {
  fileName: string;
  progress: number;
  status: 'uploading' | 'screening';
}

const statusConfig = {
  uploading: {
    icon: Loader2,
    text: 'Uploading...',
    color: 'text-primary',
  },
  screening: {
    icon: ShieldCheck,
    text: 'Screening for threats...',
    color: 'text-accent',
  },
};

export default function UploadStatus({
  fileName,
  progress,
  status,
}: UploadStatusProps) {
  const { icon: Icon, text, color } = statusConfig[status];

  return (
    <Card className="w-full max-w-lg text-center animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <FileCode className="h-5 w-5 text-muted-foreground" />
          <span>{fileName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <div className="flex items-center justify-center gap-2">
          <Icon className={cn('h-5 w-5 animate-spin', color, { 'animate-none': status !== 'uploading' })} />
          <p className={cn('font-medium', color)}>{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
