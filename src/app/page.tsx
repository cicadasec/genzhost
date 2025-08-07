
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { ThreatScreenOutput } from '@/ai/flows/threat-screening';
import { threatScreen } from '@/ai/flows/threat-screening';
import FileUploadZone from '@/components/file-upload-zone';
import ResultCard from '@/components/result-card';
import UploadStatus from '@/components/upload-status';
import { Logo } from '@/components/logo';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('screening'); 
    }
  }, []);

  const resetState = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    setThreatReport(null);
    setLiveUrl('');
  }, []);

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
            setStatus('uploading'); 
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
    if (status === 'uploading' && file) {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          setStatus('error');
          setThreatReport({
            isSafe: false,
            reason: 'File upload failed. Please try again.',
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLiveUrl(downloadURL);
            setStatus('success');
          });
        }
      );
    }
  }, [status, file]);

  const handleViewFile = useCallback(() => {
    if (liveUrl) {
      window.open(liveUrl, '_blank');
    }
  }, [liveUrl]);

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
  }, [status, file, uploadProgress, threatReport, liveUrl, handleFileSelect, resetState, handleViewFile]);

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
