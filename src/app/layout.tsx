
"use client";

import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { MusicPlayerProvider } from '@/context/music-player-context';
import MusicPlayer from '@/components/music-player';
import { PageTransition } from '@/components/page-transition';
import { Particles } from '@/components/particles';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  
  // No metadata export, as this is a client component

  return (
    <html lang="en" className="dark">
      <head>
        <title>FFM</title>
        <meta name="description" content="Official artist website for FFM" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col', { 'bg-background': isAdminPage })}>
        <ClientOnly>
          <Particles />
        </ClientOnly>
        <MusicPlayerProvider>
          {isAdminPage ? (
            <div className="flex-1">{children}</div>
          ) : (
            <div className="flex flex-col flex-1 z-0">
              <Header />
              <main className="flex-1">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </div>
          )}
          <MusicPlayer />
          <Toaster />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
