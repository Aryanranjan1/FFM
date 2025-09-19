"use client";

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Play, Star, Music, Heart, Share2, PlayCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Particles } from '@/components/particles';
import { useMusicPlayer } from '@/context/music-player-context';
import type { Album, Track, Project } from '@/lib/types';
import { albums, bio, projects } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeaturedTrackClient } from '@/components/featured-track-client';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const orbsRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const { play } = useMusicPlayer();
  const [hoveredMusicCard, setHoveredMusicCard] = useState<string | null>(null);
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-artist');

  useEffect(() => {
    if (orbsRef.current) {
      orbsRef.current.innerHTML = '';
      for (let i = 0; i < 8; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";
        const size = Math.random() * 100 + 50;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 90}%`;
        orb.style.top = `${Math.random() * 90}%`;
        orb.style.animationDuration = `${Math.random() * 15 + 10}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        orbsRef.current.appendChild(orb);
      }
    }

    if (notesRef.current) {
      notesRef.current.innerHTML = '';
      const noteChars = ["♪", "♫", "♬", "♩"];
      for (let i = 0; i < 15; i++) {
        const note = document.createElement("div");
        note.className = "music-note";
        note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
        note.style.left = `${Math.random() * 100}%`;
        note.style.animationDuration = `${Math.random() * 10 + 20}s`;
        note.style.animationDelay = `${Math.random() * 10}s`;
        notesRef.current.appendChild(note);
      }
    }
  }, []);

  const handlePlayAlbum = (album: Album) => {
    play(album.tracks[0], album.tracks);
  };
  
  const playTrackFromPortfolio = (track: Track, album: Album) => {
    play(track, album.tracks);
     const player = document.getElementById('music-player');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <>
      <div className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
        <div className="absolute inset-0 floating-orbs" ref={orbsRef}></div>
        <div className="absolute inset-0 floating-notes" ref={notesRef}></div>

        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="font-headline text-7xl md:text-9xl font-bold tracking-tighter text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            FFM
          </motion.h1>
          <motion.h2 
              className="text-2xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
          >
              Epic Orchestral &amp; Malay Gamelan Composer
          </motion.h2>
          <motion.p 
            className="font-body text-xl md:text-2xl mt-4 max-w-2xl mx-auto text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting sonic landscapes that transcend boundaries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center space-x-4 mb-12"
          >
            <Button asChild size="lg" className="mt-8 group">
              <Link href="#music-portfolio">
                Explore Music
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
             <Button variant="outline" size="lg" asChild className="mt-8 group border-2">
                <Link href="/contact">
                  Contact Me
                  <Mail className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

      <FeaturedTrackClient />
      
      <div className="section-divider"><div className="divider-content">♫ ♪ ♫</div><div className="divider-line"></div></div>
      
      <section id="music-portfolio" className="py-20 px-6 bg-deep-black">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Music Portfolio</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Explore my diverse collection of compositions spanning multiple genres and styles.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {albums.map((album, index) => {
                    const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
                    return (
                      <motion.div
                          key={album.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          onMouseEnter={() => setHoveredMusicCard(album.id)}
                          onMouseLeave={() => setHoveredMusicCard(null)}
                      >
                          <Card className={`music-card bg-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col ${
                              hoveredMusicCard === album.id ? 'transform scale-105 border-primary/50' : 'border-transparent'
                          }`}>
                              <div className="relative">
                                  {coverArt && <Image src={coverArt.imageUrl} 
                                      alt={album.title} 
                                      width={400}
                                      height={400}
                                      className="w-full h-48 object-cover"
                                      data-ai-hint={coverArt.imageHint}
                                      loading="eager" />}
                                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                                      hoveredMusicCard === album.id ? 'opacity-100' : 'opacity-0'
                                  }`}>
                                      <Button 
                                          size="lg"
                                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16"
                                          onClick={() => handlePlayAlbum(album)}
                                      >
                                          <Play className="w-8 h-8" />
                                      </Button>
                                  </div>
                              </div>
                              <CardContent className="p-6 flex-grow flex flex-col">
                                  <h3 className="text-xl font-bold text-foreground mb-2">{album.title}</h3>
                                  <p className="text-primary text-sm mb-4">{album.releaseYear}</p>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto border-t border-border/10 pt-4">
                                      <div className="flex items-center space-x-4">
                                          <span className="flex items-center space-x-1"><Play className="w-4 h-4" /><span>{album.tracks.length} tracks</span></span>
                                      </div>
                                      <span>{album.tracks.reduce((acc, track) => {
                                          const [min, sec] = track.duration.split(':').map(Number);
                                          return acc + min * 60 + sec;
                                      }, 0) / 60 > 1 ? `${Math.floor((album.tracks.reduce((acc, track) => {
                                          const [min, sec] = track.duration.split(':').map(Number);
                                          return acc + min * 60 + sec;
                                      }, 0)) / 60)} min` : ''}</span>
                                  </div>
                              </CardContent>
                          </Card>
                      </motion.div>
                  )})}
              </div>
          </div>
      </section>

      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

      <section id="about" className="py-20 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8 }}
                  >
                      <h2 className="text-3xl md:text-4xl font-bold mb-6">About the Composer</h2>
                      <p className="text-lg text-muted-foreground mb-4">
                          {bio.content}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center space-x-3">
                              <Award className="w-8 h-8 text-primary" />
                              <div>
                                  <div className="font-semibold">Award Winning</div>
                                  <div className="text-sm text-muted-foreground">Multiple compositions</div>
                              </div>
                          </div>
                          <div className="flex items-center space-x-3">
                              <Star className="w-8 h-8 text-primary" />
                              <div>
                                  <div className="font-semibold">Top Rated</div>
                                  <div className="text-sm text-muted-foreground">5-star reviews</div>
                              </div>
                          </div>
                      </div>
                  </motion.div>
                  <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative group"
                  >
                      <div 
                        className="relative mx-auto max-w-md transition-transform duration-500 group-hover:[transform:rotateY(5deg)_rotateX(2deg)_scale(1.05)]"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                          {aboutImage && <Image src={aboutImage.imageUrl}
                              alt="Composer at work"
                              width={600}
                              height={400}
                              data-ai-hint={aboutImage.imageHint}
                              className="w-full rounded-xl shadow-xl" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

      <section id="testimonials" className="py-20 px-6 bg-deep-black">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Hear from clients and collaborators who have experienced the magic of my compositions.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bio.pressReleases.map((testimonial, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="group"
                      >
                          <Card 
                            className="bg-card/90 backdrop-blur-sm border-primary/30 h-full transition-transform duration-500 group-hover:[transform:rotateY(-5deg)_rotateX(2deg)_scale(1.05)]"
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                              <CardContent className="p-6 flex flex-col h-full">
                                  <div className="flex items-center mb-4">
                                      <div>
                                          <h4 className="font-semibold text-foreground">{testimonial.publication}</h4>
                                          <p className="text-sm text-primary">{new Date(testimonial.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                                  <p className="text-muted-foreground flex-grow">"{testimonial.title}"</p>
                                  <div className="flex mt-4">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className="w-5 h-5 text-primary fill-current" />
                                      ))}
                                  </div>
                              </CardContent>
                          </Card>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>
    </>
  );
}
