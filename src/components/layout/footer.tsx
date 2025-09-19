import { Twitter, Instagram, Youtube, Gitlab } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '../icons';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'Youtube' },
  { icon: Gitlab, href: '#', label: 'Gitlab' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo className="h-6 w-auto text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FFM. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {socialLinks.map((social) => (
            <Button key={social.label} variant="ghost" size="icon" asChild>
              <Link href={social.href} target="_blank" rel="noopener noreferrer">
                <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">{social.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
