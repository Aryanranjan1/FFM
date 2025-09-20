"use client";

import { bio as initialBioData } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin, Music } from 'lucide-react';

export default function AboutPage() {
  const artistImage = PlaceHolderImages.find(p => p.id === 'about-artist');

  const bioContent = {
    name: 'FAHMIE FARHAN ARIFFIN',
    main: `Fahmie Farhan Ariffin is a Malaysia-based composer and music producer known for his orchestral hybrid compositions, drawing inspiration from acclaimed Japanese anime composers including Hiroyuki Sawano, Kohta Yamamoto, Yasuharu Takanashi, Yoshiaki Fujisawa, Kenichiro Suehiro, Masaru Yokoyama, and many others. His music blends sweeping orchestral arrangements with modern cinematic energy, delivering powerful emotional impact for a wide range of storytelling mediums.

Fahmie's portfolio covers both international collaborations and competitive music performances. He has arranged and composed orchestral works for live keynote events in the United States, including multiple projects with violinist Diane Allen, whose audiences have been deeply moved by his music.`,
    traditional: `In the realm of traditional ensemble performance, Fahmie collaborates with Gema Gamelan Waqafan (GEMAWAN), the gamelan group from Kolej Islam Sultan Alam Shah (KISAS). He trains the ensemble and composes original modern gamelan pieces, leading the group to multiple top awards — including 1st Prize in the SBP Gamelan Competition in both 2023 and 2024, as well as 1st Place in the Ensemble of Gamelan Competition at Universiti Teknologi Petronas (UTP) in 2023.`,
    digital: `Fahmie is also active on YouTube, where he shares his original works with a growing international audience, and on stock music platforms where his compositions are licensed for use in films, games, and online content. Whether it's a high-energy anime-inspired battle theme or a reflective, emotionally driven score, Fahmie's focus is always on creating music that elevates the stories it accompanies.`
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">ABOUT</h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-3xl mx-auto">
          Discover the journey of a Malaysian composer who bridges cultural heritage with contemporary musical innovation
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative w-full max-w-xs md:max-w-full">
            {artistImage && (
              <Image
                src={artistImage.imageUrl}
                alt={artistImage.description}
                width={500}
                height={600}
                className="rounded-lg object-cover w-full h-auto shadow-lg"
                data-ai-hint={artistImage.imageHint}
              />
            )}
          </div>
          <div className="mt-6 space-y-3 text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Malaysia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Music className="w-4 h-4" />
              <span>Composer & Producer</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8 text-foreground/90">
          <div>
            <h2 className="font-headline text-3xl font-bold text-white mb-4">{bioContent.name}</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {bioContent.main}
            </p>
          </div>

          <div>
            <h3 className="font-headline text-2xl font-bold text-primary mb-3">TRADITIONAL EXCELLENCE</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {bioContent.traditional}
            </p>
          </div>

          <div>
            <h3 className="font-headline text-2xl font-bold text-primary mb-3">DIGITAL PRESENCE</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {bioContent.digital}
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mt-20 text-primary text-2xl">
        ♪ ♫ ♪
      </div>
    </div>
  );
}
