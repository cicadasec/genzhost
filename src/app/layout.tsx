import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'GenZHost',
  description: 'Temporarily host and share your web files with threat screening.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <div className="container mx-auto p-4">
          <Navbar />
          <main>{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
