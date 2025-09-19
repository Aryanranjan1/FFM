
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { albums } from '@/lib/data';
import type { Album, Track } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMusicPlayer } from '@/context/music-player-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, ArrowRight, Music, Disc } from 'lucide-react';

export default function MusicPage() {
  const { play } = useMusicPlayer();
  const [latestAlbum, ...otherAlbums] = [...albums].sort((a, b) => b.releaseYear - a.releaseYear);
  const featuredAlbums = albums.slice(0, 3); // For carousel

  const handlePlayAlbum = (album: Album) => {
    play(album.tracks[0], album.tracks);
  };

  const handlePlayTrack = (track: Track, album: Album) => {
    play(track, album.tracks);
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6 text-center relative overflow-hidden bg-card"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
         <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-0"></div>
        <div className="relative z-10">
          <motion.h1 className="text-5xl md:text-7xl font-headline font-bold" variants={fadeInUp}>Discography</motion.h1>
          <motion.p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto" variants={fadeInUp}>
            Explore the collection of sounds and stories from FFM.
          </motion.p>
        </div>
      </motion.section>

      {/* Featured Albums Carousel */}
      <motion.section 
        className="py-20 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12" variants={fadeInUp}>
            Featured Albums
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredAlbums.map((album) => {
                  const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
                  return (
                    <CarouselItem key={album.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Card className="bg-card border-border/50 overflow-hidden group">
                          <div className="relative">
                            {coverArt && (
                              <Image
                                src={coverArt.imageUrl}
                                alt={`Cover for ${album.title}`}
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={coverArt.imageHint}
                              />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" className="h-16 w-16 rounded-full" onClick={() => handlePlayAlbum(album)}>
                                <PlayCircle className="h-8 w-8" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-xl font-bold truncate">{album.title}</h3>
                            <p className="text-muted-foreground">{album.releaseYear}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </motion.div>
        </div>
      </motion.section>

      <Separator className="my-8 bg-border/20" />

      {/* Latest Release Section */}
      {latestAlbum && (
        <motion.section 
          className="py-20 px-6 bg-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto">
            <motion.h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-4" variants={fadeInUp}>
              Latest Release
            </motion.h2>
            <motion.p className="text-muted-foreground text-center mb-12" variants={fadeInUp}>
              Check out the newest sounds from FFM.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden bg-transparent border-0 md:border md:bg-card md:border-border/50">
                <CardContent className="p-0 md:p-6 grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative group aspect-square md:aspect-auto">
                    {(() => {
                      const coverArt = PlaceHolderImages.find(p => p.id === latestAlbum.coverArtId);
                      return coverArt && (
                        <Image
                          src={coverArt.imageUrl}
                          alt={`Cover for ${latestAlbum.title}`}
                          width={600}
                          height={600}
                          className="w-full h-full object-cover md:rounded-lg"
                          data-ai-hint={coverArt.imageHint}
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-black/20 md:rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" className="h-20 w-20 rounded-full" onClick={() => handlePlayAlbum(latestAlbum)}>
                        <PlayCircle className="h-10 w-10" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 md:p-0">
                    <Badge variant="default" className="mb-4">Latest Release</Badge>
                    <h3 className="font-headline text-4xl font-bold">{latestAlbum.title}</h3>
                    <p className="text-muted-foreground mt-2 text-lg">{latestAlbum.releaseYear}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Celestial Echoes takes you on a journey through starlit soundscapes and cosmic ambiances. A blend of electronic waves and orchestral arrangements.
                    </p>
                    <div className="mt-6">
                      <h4 className="font-bold mb-3">Tracklist</h4>
                      <ul className="space-y-3">
                        {latestAlbum.tracks.map((track, index) => (
                          <li key={track.id} className="flex items-center justify-between hover:bg-accent/50 p-2 rounded-md transition-colors">
                            <div className="flex items-center gap-4">
                              <Music className="h-5 w-5 text-primary" />
                              <button onClick={() => handlePlayTrack(track, latestAlbum)} className="text-left hover:text-primary transition-colors">
                                <span className="font-medium">{track.title}</span>
                              </button>
                            </div>
                            <span className="text-sm text-muted-foreground">{track.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      )}
      
      <Separator className="my-8 bg-border/20" />

      {/* Singles & EPs */}
      <motion.section 
        className="py-20 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12" variants={fadeInUp}>
            Singles & EPs
          </motion.h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" variants={staggerContainer}>
            {otherAlbums.map((album) => {
              const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
              return (
                <motion.div key={album.id} variants={fadeInUp}>
                  <Card className="bg-card border-border/50 overflow-hidden group h-full flex flex-col">
                    <div className="relative">
                      {coverArt && (
                        <Image
                          src={coverArt.imageUrl}
                          alt={`Cover for ${album.title}`}
                          width={400}
                          height={400}
                          className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={coverArt.imageHint}
                        />
                      )}
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" className="h-12 w-12 rounded-full" onClick={() => handlePlayAlbum(album)}>
                          <PlayCircle className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-lg truncate flex-grow">{album.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{album.releaseYear}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want more?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explore the full catalog, including collaborations and unreleased tracks.
          </p>
          <Button size="lg" asChild className="btn-gold">
            <Link href="/portfolio">
              Explore Full Catalog <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

