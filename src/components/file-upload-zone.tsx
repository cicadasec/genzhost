'use client';

import type { ChangeEvent, DragEvent } from 'react';
import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add a copy effect to show the user it's a valid drop target
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // For now, we only handle the first file.
      // Could be extended to handle folders or multiple files.
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'relative w-full p-8 text-center bg-card rounded-lg border-2 border-dashed border-border transition-all duration-300 ease-in-out',
        { 'border-primary bg-accent/20': isDragging }
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadCloud
          className={cn('w-16 h-16 text-muted-foreground transition-transform', {
            'scale-110 text-primary': isDragging,
          })}
        />
        <h3 className="text-xl font-semibold text-card-foreground">
          Drag & drop your files here
        </h3>
        <p className="text-muted-foreground">
          Supports HTML, folders, and ZIP archives.
        </p>
        <div className="flex items-center space-x-2">
          <hr className="flex-grow border-t border-border" />
          <span className="text-muted-foreground">OR</span>
          <hr className="flex-grow border-t border-border" />
        </div>
        <Button onClick={handleBrowseClick} variant="outline">
          Browse Files
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        // These attributes are for folder and zip support, though the logic currently only handles a single file
        // webkitdirectory="true"
        accept=".html,.zip"
      />
    </div>
  );
}
