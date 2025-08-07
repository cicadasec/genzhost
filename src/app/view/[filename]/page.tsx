
'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ViewFilePage({
  params,
}: {
  params: Promise<{ filename: string }>;
}) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { filename } = use(params);
  const decodedFilename = decodeURIComponent(filename);

  useEffect(() => {
    try {
      const fileContent = sessionStorage.getItem('fileContent');
      if (fileContent) {
        setContent(fileContent);
      } else {
        setError('File content not found. It might have expired or was not uploaded correctly.');
      }
    } catch (e) {
      setError('Could not retrieve file content due to a browser error.');
    }
  }, []);

  if (error) {
     router.push('/');
     return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Viewing: {decodedFilename}
        </h1>
        <Button onClick={() => router.push('/')}>Upload New File</Button>
      </header>
      <main className="p-4">
        {content ? (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
           <div>Loading...</div>
        )}
      </main>
    </div>
  );
}
