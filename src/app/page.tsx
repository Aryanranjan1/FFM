
"use client";

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Play, Star, Music, Heart, Share2, PlayCircle, Mail, Phone, MapPin, Diamond, Youtube, Instagram, Headphones, Send, Newspaper, Link as LinkIcon, Music2 as SoundcloudIconLucide, Pause } from 'lucide-react';
import { useRef, useEffect, useState, useActionState } from 'react';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '@/context/music-player-context';
import type { Album, Track, Project } from '@/lib/types';
import { albums, bio, projects } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SoundcloudIcon } from '@/components/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FloatingNotes } from '@/components/floating-notes';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  subject: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const initialState = {
  message: null,
  errors: {},
};


export default function Home() {
  const orbsRef = useRef<HTMLDivElement>(null);
  const { play, pause, currentTrack, isPlaying } = useMusicPlayer();
  const [hoveredMusicCard, setHoveredMusicCard] = useState<string | null>(null);
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-artist');

  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      subject: "",
    },
  });

  useEffect(() => {
    if (state.message) {
      if (Object.keys(state.errors).length > 0) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
        form.reset();
      }
    }
  }, [state, toast, form]);

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
      <div className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-black/80"></div>
        <div className="floating-orbs" ref={orbsRef}></div>
        <FloatingNotes />

        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary">Fahmie Farhan</span>
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
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting cinematic soundscapes that blend epic orchestral arrangements with the rich cultural heritage of Malay gamelan music. <span className="text-primary">Experience the fusion of tradition and innovation.</span>
          </motion.p>
          <motion.div
            className="flex justify-center items-center space-x-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
              <Link href="#" className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/20">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <span className="text-xs group-hover:text-primary transition-colors">YouTube</span>
              </Link>
               <Link href="#" className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/20">
                    <SoundcloudIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs group-hover:text-primary transition-colors">SoundCloud</span>
              </Link>
               <Link href="#" className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/20">
                    <Instagram className="w-8 h-8" />
                  </div>
                  <span className="text-xs group-hover:text-primary transition-colors">Instagram</span>
              </Link>
          </motion.div>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="mailto:contact@fahmiefarhan.com" className="flex items-center gap-2 hover:text-primary"><Mail className="w-4 h-4 text-primary" /> contact@fahmiefarhan.com</a>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +60 11-31377753</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Malaysia</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="btn-gold px-6 py-3 rounded-md flex items-center">
                  <Link href="#music-portfolio">
                    <Diamond className="w-5 h-5 mr-2" />
                    Explore Works
                  </Link>
                </Button>
            </motion.div>
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" asChild className="btn-outline-gold px-6 py-3 rounded-md flex items-center border-2">
                    <Link href="#contact">
                      <Send className="w-5 h-5 mr-2" />
                      Contact Me
                    </Link>
                </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

       <section id="music-player" className="py-20 px-6 bg-card scroll-mt-20">
           <div className="max-w-7xl mx-auto">
               <div className="text-center mb-12">
                   <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Music Track</h2>
                   <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover a featured track from my collection. Select any song from the portfolio below to play it here.</p>
               </div>
               {currentTrack ? (
                   <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                       <Card className="bg-card/90 backdrop-blur-sm border-primary/30 overflow-hidden">
                           <CardContent className="p-8">
                               <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                   <div className="relative group w-48 h-48 flex-shrink-0">
                                       {(() => {
                                          const album = albums.find(a => a.tracks.some(t => t.id === currentTrack.id));
                                          const coverArt = PlaceHolderImages.find(p => p.id === album?.coverArtId);
                                          return coverArt && <Image
                                             src={coverArt.imageUrl}
                                             alt={currentTrack.title}
                                             width={192}
                                             height={192}
                                             className="w-full h-full object-cover rounded-lg"
                                             data-ai-hint={coverArt.imageHint}
                                          />
                                       })()}
                                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                           <Button
                                               size="lg"
                                               onClick={() => isPlaying ? pause() : play(currentTrack)}
                                               className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16 flex items-center justify-center"
                                           >
                                               {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                           </Button>
                                       </div>
                                   </div>
                                   <div className="flex-1 text-center md:text-left w-full">
                                       <h3 className="text-2xl font-bold text-foreground mb-2">{currentTrack.title}</h3>
                                       <p className="text-lg text-muted-foreground mb-2">{albums.find(a => a.tracks.some(t => t.id === currentTrack.id))?.title}</p>
                                       <p className="text-sm text-muted-foreground mb-4">An atmospheric electronic track with dreamy synths.</p>
                                      
                                   </div>
                               </div>
                           </CardContent>
                       </Card>
                   </motion.div>
               ) : ( <div className="text-center text-muted-foreground">Loading featured music...</div> )}
           </div>
       </section>
      
      <div className="section-divider"><div className="divider-content">♫ ♪ ♫</div></div>
      
      <section id="music-portfolio" className="py-20 px-6 bg-transparent">
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

      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

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
                                Fahmie Farhan is a Malaysian composer who specializes in creating epic orchestral music and modern interpretations of traditional Malay gamelan.
                            </p>
                            <p className="text-lg text-muted-foreground mb-4">
                                His work spans from cinematic stock music for films, games, and media projects to cultural compositions that preserve and innovate upon Malaysia's rich musical heritage.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6">
                                With a unique blend of Western orchestral techniques and traditional Malay instruments, Fahmie creates immersive soundscapes that transport listeners to different worlds and emotions.
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
                        className="relative mx-auto max-w-md transition-transform duration-500 group-hover:-rotate-3"
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

      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

      <section id="testimonials" className="py-20 px-6 bg-transparent">
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

      <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>
      
      <section id="contact" className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">GET IN TOUCH</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Interested in collaborating on a project or licensing music? I'd love to hear from you!
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="font-headline text-3xl font-bold mb-6 text-primary">LET'S CONNECT</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                        Whether you're looking for custom compositions, music licensing, or just want to discuss musical ideas, I'm here to help bring your vision to life.
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">EMAIL</h4>
                                <p className="text-muted-foreground">contact@fahmiefarhan.com</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">PHONE</h4>
                                <p className="text-muted-foreground">+60 11-31377753</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">LOCATION</h4>
                                <p className="text-muted-foreground">Malaysia</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="w-8 h-8" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <SoundcloudIcon className="w-8 h-8" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-8 h-8" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Card className="bg-card/80 p-8 rounded-lg">
                        <CardContent className="p-0">
                            <Form {...form}>
                              <form action={formAction} className="space-y-6">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your name" {...field} className="contact-input" />
                                      </FormControl>
                                      <FormMessage>{state.errors?.name}</FormMessage>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input placeholder="your@email.com" {...field} className="contact-input"/>
                                      </FormControl>
                                      <FormMessage>{state.errors?.email}</FormMessage>
                                    </FormItem>
                                  )}
                                />
                                 <FormField
                                  control={form.control}
                                  name="subject"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Subject</FormLabel>
                                      <FormControl>
                                        <Input placeholder="What's this about?" {...field} className="contact-input"/>
                                      </FormControl>
                                      <FormMessage>{state.errors?.subject}</FormMessage>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="message"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Message</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Your message..." {...field} rows={5} className="contact-input" />
                                      </FormControl>
                                      <FormMessage>{state.errors?.message}</FormMessage>
                                    </FormItem>
                                  )}
                                />
                                <div className="text-right">
                                   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                      <Button type="submit" size="lg" className="w-full btn-gold px-6 py-3 rounded-md flex items-center justify-center">
                                          <Send className="w-5 h-5 mr-2" />Send Message
                                      </Button>
                                  </motion.div>
                                </div>
                              </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
      </section>
    </>
  );
}

    

    
