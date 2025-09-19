import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-headline text-7xl md:text-9xl font-bold tracking-tighter">FFM</h1>
        <p className="font-body text-xl md:text-2xl mt-4 max-w-2xl mx-auto text-primary-foreground/80">
          Crafting sonic landscapes that transcend boundaries.
        </p>
        <Button asChild size="lg" className="mt-8 group">
          <Link href="/music">
            Explore Music
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
