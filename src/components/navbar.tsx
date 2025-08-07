
'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-screen-2xl">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold sm:inline-block">
              GenZHost
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://github.com/firebase/studio-prototyping-examples"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="github"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
