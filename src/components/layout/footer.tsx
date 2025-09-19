import { Twitter, Instagram, Youtube, Facebook, Linkedin, Twitch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '../icons';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'Youtube' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitch, href: '#', label: 'Twitch' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/40 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <Logo className="h-8 w-auto text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Crafting sonic landscapes that transcend boundaries. Epic Orchestral & Malay Gamelan Composer.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#music-portfolio" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Me</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild>
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FFM. All Rights Reserved. Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
}
