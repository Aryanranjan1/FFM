
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FloatingNotes } from '@/components/floating-notes';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Admin - FFM',
  description: 'Admin section for FFM website',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground min-h-screen">
        <FloatingNotes />
        <AuthProvider>
            <main className="z-10">
              {children}
            </main>
        </AuthProvider>
        <Toaster />
    </div>
  );
}
