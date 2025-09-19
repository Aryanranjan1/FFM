import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '../icons';

const services = [
  { name: 'Custom Compositions', href: '#' },
  { name: 'Orchestral Arrangements', href: '#' },
  { name: 'Gamelan Composition', href: '#' },
  { name: 'Malay Gamelan coaching', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
            <div className="flex justify-center md:justify-start mb-4">
              <Logo className="h-8 w-auto text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Fahmie Farhan Music - Epic orchestral compositions and modern Malay gamelan interpretations.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/music" className="text-muted-foreground hover:text-primary transition-colors">Music</Link></li>
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@fahmiefarhan.com">contact@fahmiefarhan.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+60 11-31377753</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Malaysia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fahmie Farhan Music. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

    