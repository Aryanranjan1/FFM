import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FloatingNotes } from '@/components/floating-notes';

export const metadata: Metadata = {
  title: 'Admin Login - FFM',
  description: 'Admin login page for FFM website',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground min-h-screen flex items-center justify-center')}>
        <FloatingNotes />
        <main className="z-10">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
