
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ViewFilePage({
  params,
}: {
  params: { filename: string };
}) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const fileContent = sessionStorage.getItem('fileContent');
      if (fileContent) {
        setContent(fileContent);
      } else {
        setError('File content not found. It might have expired.');
      }
    } catch (e) {
      setError('Could not retrieve file content.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Viewing: {decodeURIComponent(params.filename)}
        </h1>
        <Button onClick={() => router.push('/')}>Upload New File</Button>
      </header>
      <main className="p-4">
        {error ? (
          <div className="text-destructive text-center">{error}</div>
        ) : (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </main>
    </div>
  );
}
