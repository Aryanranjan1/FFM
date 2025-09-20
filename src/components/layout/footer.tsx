

import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Logo, SoundcloudIcon, Youtube, Instagram, SpotifyIcon } from '../icons';
import type { SiteSettingsFormValues } from '@/app/actions';
import type { SocialLink as SocialLinkType } from '@/lib/admin-types';


const services = [
  { name: 'Custom Compositions', href: '#' },
  { name: 'Orchestral Arrangements', href: '#' },
  { name: 'Gamelan Composition', href: '#' },
  { name: 'Malay Gamelan coaching', href: '#' },
];

const iconComponents: { [key: string]: React.FC<any> } = {
    YouTube: (props) => <Youtube {...props} />,
    Instagram: (props) => <Instagram {...props} />,
    Soundcloud: (props) => <SoundcloudIcon {...props} />,
    Spotify: (props) => <SpotifyIcon {...props} />,
    Default: LinkIcon,
};


export function Footer({ settings, socialLinks }: { settings: SiteSettingsFormValues, socialLinks: SocialLinkType[] }) {
    return (
        <footer className="bg-card py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-left md:col-span-1 lg:col-span-1">
                        <div className="flex justify-start mb-4">
                          <Logo className="h-8 w-auto text-primary" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                        Fahmie Farhan Music - Epic orchestral compositions and modern Malay gamelan interpretations.
                        </p>
                        <div className="flex justify-start space-x-4 mt-6">
                            {socialLinks.map((social) => {
                                const Icon = iconComponents[social.platform as keyof typeof iconComponents] || iconComponents.Default;
                                return (
                                    <Link key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <div className="lg:col-start-2 lg:col-span-3 text-center md:text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-primary">Quick Links</h3>
                            <ul className="space-y-2">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/music" className="text-muted-foreground hover:text-primary transition-colors">Music</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
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
                                <a href={`mailto:${settings.email}`}>{settings.email}</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>{settings.phone}</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <MapPin className="w-4 h-4" />
                                <span>{settings.location}</span>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Fahmie Farhan Music. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
