
'use client';

import type { ChangeEvent, DragEvent } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ThreatScreenOutput } from '@/ai/flows/threat-screening';
import { threatScreen } from '@/ai/flows/threat-screening';
import FileUploadZone from '@/components/file-upload-zone';
import ResultCard from '@/components/result-card';
import UploadStatus from '@/components/upload-status';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

type Status =
  | 'idle'
  | 'uploading'
  | 'screening'
  | 'success'
  | 'error'
  | 'ai_error';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [threatReport, setThreatReport] = useState<ThreatScreenOutput | null>(
    null
  );
  const [liveUrl, setLiveUrl] = useState('');
  const router = useRouter();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('uploading');
    }
  };

  const resetState = () => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    setThreatReport(null);
    setLiveUrl('');
  };

  useEffect(() => {
    if (status === 'uploading' && file) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('screening');
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [status, file]);

  useEffect(() => {
    if (status === 'screening' && file) {
      const screenFile = async () => {
        try {
          const fileContent = await file.text();
          const result = await threatScreen({
            fileContent,
            fileName: file.name,
          });
          setThreatReport(result);
          if (result.isSafe) {
            sessionStorage.setItem('fileContent', fileContent);
            setStatus('success');
          } else {
            setStatus('error');
          }
        } catch (error) {
          console.error('Threat screening failed:', error);
          setStatus('ai_error');
          setThreatReport({
            isSafe: false,
            reason: 'An unexpected error occurred while screening the file.',
          });
        }
      };

      screenFile();
    }
  }, [status, file]);

  useEffect(() => {
    if (status === 'success' && file) {
      setLiveUrl(`/view/${encodeURIComponent(file.name)}`);
    }
  }, [status, file]);

  const handleViewFile = () => {
    if (liveUrl) {
      router.push(liveUrl);
    }
  };

  const currentComponent = useMemo(() => {
    switch (status) {
      case 'idle':
        return <FileUploadZone onFileSelect={handleFileSelect} />;
      case 'uploading':
      case 'screening':
        return (
          <UploadStatus
            fileName={file?.name || ''}
            progress={uploadProgress}
            status={status}
          />
        );
      case 'success':
      case 'error':
      case 'ai_error':
        return (
          <ResultCard
            fileName={file?.name || ''}
            threatReport={threatReport!}
            liveUrl={liveUrl}
            onReset={resetState}
            onViewFile={handleViewFile}
          />
        );
      default:
        return <FileUploadZone onFileSelect={handleFileSelect} />;
    }
  }, [status, file, uploadProgress, threatReport, liveUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary">
            GenZHost
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Temporarily host & share files with AI-powered threat screening.
          </p>
        </header>
        <div className="relative min-h-[300px] flex items-center justify-center">
          {currentComponent}
        </div>
        <footer className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Powered by GenAI. Files are hosted temporarily. Created by{' '}
            <a
              href="https://linkedin.com/in/cicadasec"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Sahil Ansari
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
