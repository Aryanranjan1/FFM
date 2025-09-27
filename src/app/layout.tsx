
"use client";

import React, { useEffect, useState } from 'react';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { MusicPlayerProvider } from '@/context/music-player-context';
import MusicPlayer from '@/components/music-player';
import { usePathname } from 'next/navigation';
import type { SiteSettingsFormValues } from '@/app/actions';
import { getSiteSettings } from '@/app/actions';
import type { SocialLink as SocialLinkType } from '@/lib/admin-types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Cinzel, Inter } from 'next/font/google';
import { Particles } from '@/components/particles';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// This is the root layout component. It's a client component to allow for hooks.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [settings, setSettings] = useState<SiteSettingsFormValues>({ email: '', phone: '', location: '' });
  const [socialLinks, setSocialLinks] = useState<SocialLinkType[]>([]);

  useEffect(() => {
    getSiteSettings().then(setSettings);

    const fetchSocialLinks = async () => {
      try {
        const socialLinksQuery = query(collection(db, "social-links"), orderBy("createdAt", "desc"));
        const socialLinksSnapshot = await getDocs(socialLinksQuery);
        const socialLinksData = socialLinksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialLinkType[];
        setSocialLinks(socialLinksData);
      } catch (error) {
        console.error("Failed to fetch social links for layout:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  return (
    <html lang="en" className={cn("dark", cinzel.variable, inter.variable)} suppressHydrationWarning>
      <head>
        <title>Fahmie Farhan</title>
        <meta name="description" content="Official artist website for Fahmie Farhan, Epic Orchestral & Malay Gamelan Composer" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col', { 'bg-background': isAdminPage })} suppressHydrationWarning>
        <MusicPlayerProvider>
          {isAdminPage ? (
            <div className="flex-1">{children}</div>
          ) : (
            <>
              <div className="bg-animation-container">
                <Particles />
              </div>
              <div className="flex flex-col flex-1" style={{ position: 'relative', zIndex: 1 }}>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer settings={settings} socialLinks={socialLinks} />
              </div>
            </>
          )}
          <MusicPlayer />
          <Toaster />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
