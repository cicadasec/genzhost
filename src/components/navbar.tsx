
'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl flex-row w-full items-center justify-between select-none h-full">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-bold sm:inline-block">
              GenZ Host
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
        </div>
      </div>
    </header>
  );
}
