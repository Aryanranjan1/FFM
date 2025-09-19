import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { MusicPlayerProvider } from '@/context/music-player-context';
import MusicPlayer from '@/components/music-player';
import { PageTransition } from '@/components/page-transition';

export const metadata: Metadata = {
  title: 'FFM',
  description: 'Official artist website for FFM',
};

export default function RootLayout({
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
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <MusicPlayerProvider>
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
          <MusicPlayer />
          <Toaster />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
