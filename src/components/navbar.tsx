
'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-screen-2xl">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-bold sm:inline-block">
              Opennote
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center space-x-6">
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Blog</Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center">
            <Button
              variant="accent"
              size="sm"
              asChild
            >
              <a
                href="#"
                rel="noopener noreferrer"
              >
                Sign In
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
