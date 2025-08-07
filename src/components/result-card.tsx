
'use client';

import type { ThreatScreenOutput } from '@/ai/flows/threat-screening';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Badge } from './ui/badge';

interface ResultCardProps {
  fileName: string;
  threatReport: ThreatScreenOutput;
  liveUrl: string;
  onReset: () => void;
  onViewFile: () => void;
}

export default function ResultCard({
  fileName,
  threatReport,
  liveUrl,
  onReset,
  onViewFile,
}: ResultCardProps) {
  const { toast } = useToast();
  const [, copy] = useCopyToClipboard();

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${liveUrl}`;
    copy(fullUrl)
      .then(() => {
        toast({
          title: 'Copied to clipboard!',
          description: 'The live URL is now in your clipboard.',
        });
      })
      .catch(() => {
        toast({
          title: 'Copy failed',
          description: 'Could not copy the URL to your clipboard.',
          variant: 'destructive',
        });
      });
  };

  return (
    <Card className="w-full max-w-lg animate-fade-in">
      {threatReport.isSafe ? (
        <>
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-2 w-fit mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Upload Successful!</CardTitle>
            <CardDescription>
              Your file <span className="font-semibold">{fileName}</span> is
              live.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-md flex items-center justify-between space-x-2">
              <p className="text-sm font-mono truncate">{liveUrl}</p>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {threatReport.reason}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Upload Another
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="accent"
              onClick={onViewFile}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View File
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 rounded-full p-2 w-fit mb-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Threat Detected</CardTitle>
            <CardDescription>{threatReport.reason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {threatReport.flaggedContent && (
              <div>
                <Badge variant="destructive" className="mb-2">
                  Suspicious Content
                </Badge>
                <pre className="bg-secondary p-3 rounded-md text-xs overflow-x-auto">
                  <code className="font-mono text-secondary-foreground">
                    {threatReport.flaggedContent}
                  </code>
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Another File
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
