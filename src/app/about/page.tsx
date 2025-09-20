

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ExternalLink, MapPin, Music, ArrowRight, Star } from 'lucide-react';
import type { Collaboration, Achievement } from '@/lib/types';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bio } from '@/lib/data';

const collaborations: Collaboration[] = [
    {
      name: "Diane Allen",
      role: "Violin Virtuoso",
      description: "Collaborated on multiple orchestral projects for live keynote performances in the United States, creating powerful musical experiences that have deeply moved audiences.",
      link: "https://dianeallen.com/",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      name: "GEMAWAN KISAS",
      role: "Cultural Ensemble",
      description: "Gema Gamelan Waqafan (GEMAWAN) from Kolej Islam Sultan Alam Shah (KISAS). Collaboration includes training the ensemble and composing original modern gamelan pieces.",
      link: "http://www.youtube.com/@gemawankisas4271",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop"
    }
];

const achievements: Achievement[] = [
    {
      title: "1st Prize – National Gamelan Competition (HKSBP)",
      description: "Awarded for outstanding composition and performance in the prestigious national competition",
      year: "2023 & 2024",
      icon: "🏆"
    },
    {
      title: "1st Place – Ensemble of Gamelan Competition, UTP",
      description: "Recognized as the best gamelan ensemble in the university competition",
      year: "2023",
      icon: "🥇"
    },
    {
      title: "Featured in Ensemble of Gamelan Performance, UTP",
      description: "Selected to showcase original compositions at the university's premier gamelan event",
      year: "2025",
      icon: "⭐"
    },
    {
      title: "International Collaborations",
      description: "Successful partnerships with renowned international artists and performers",
      year: "2023-2024",
      icon: "🤝"
    },
    {
      title: "Growing Global Audience on YouTube",
      description: "Expanding international reach with increasing subscribers and engagement",
      year: "Ongoing",
      icon: "📈"
    },
    {
      title: "Music Licensed for Media, Games, and Online Creators",
      description: "Compositions featured in various media productions and by content creators worldwide",
      year: "Ongoing",
      icon: "🎵"
    }
];


export default function AboutPage() {
  const artistImage = PlaceHolderImages.find(p => p.id === 'about-artist');

  const bioContent = {
    name: 'FAHMIE FARHAN ARIFFIN',
    main: `Fahmie Farhan Ariffin is a Malaysia-based composer and music producer known for his orchestral hybrid compositions, drawing inspiration from acclaimed Japanese anime composers including Hiroyuki Sawano, Kohta Yamamoto, Yasuharu Takanashi, Yoshiaki Fujisawa, Kenichiro Suehiro, Masaru Yokoyama, and many others. His music blends sweeping orchestral arrangements with modern cinematic energy, delivering powerful emotional impact for a wide range of storytelling mediums.

Fahmie's portfolio covers both international collaborations and competitive music performances. He has arranged and composed orchestral works for live keynote events in the United States, including multiple projects with violinist Diane Allen, whose audiences have been deeply moved by his music.`,
    traditional: `In the realm of traditional ensemble performance, Fahmie collaborates with Gema Gamelan Waqafan (GEMAWAN), the gamelan group from Kolej Islam Sultan Alam Shah (KISAS). He trains the ensemble and composes original modern gamelan pieces, leading the group to multiple top awards — including 1st Prize in the SBP Gamelan Competition in both 2023 and 2024, as well as 1st Place in the Ensemble of Gamelan Competition at Universiti Teknologi Petronas (UTP) in 2023.`,
    digital: `Fahmie is also active on YouTube, where he shares his original works with a growing international audience, and on stock music platforms where his compositions are licensed for use in films, games, and online content. Whether it's a high-energy anime-inspired battle theme or a reflective, emotionally driven score, Fahmie's focus is always on creating music that elevates the stories it accompanies.`
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
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            <div className="hero-bg"></div>
            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">ABOUT</h1>
                <p className="text-muted-foreground text-lg mt-4 max-w-3xl mx-auto">
                    Discover the journey of a Malaysian composer who bridges cultural heritage with contemporary musical innovation
                </p>
            </div>
        </section>
        
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
          <div className="hero-bg"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
              <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 items-start">
              <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative w-full max-w-xs md:max-w-full transition-transform duration-300 hover:-rotate-3">
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
          </div>
        </section>
      
        <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

        <div className="py-12 bg-card">
            <motion.section
            className="container mx-auto px-4 md:px-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
                <h2 className="font-headline text-4xl font-bold mb-4">COLLABORATIONS</h2>
                <p className="text-lg text-muted-foreground">
                Working with talented artists and ensembles to create extraordinary music
                </p>
            </motion.div>
            <motion.div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" variants={staggerContainer}>
                {collaborations.map((collab, index) => (
                <motion.div key={index} variants={fadeInUp}>
                    <Card className="bg-background/50 border border-primary/20 hover:border-primary/40 transition-all h-full flex flex-col">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={collab.image} alt={collab.name} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-xl">{collab.name}</CardTitle>
                            <CardDescription className="text-primary">{collab.role}</CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">{collab.description}</p>
                        {collab.link && collab.link !== "#" && (
                        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" asChild>
                            <a href={collab.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit {collab.name}
                            </a>
                        </Button>
                        )}
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </motion.div>
            </motion.section>
        </div>

        <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

        <div className="py-20 container mx-auto px-4 md:px-12">
            <motion.section
                className="bg-transparent"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
            <div className="container mx-auto">
                <motion.div className="text-center mb-12" variants={fadeInUp}>
                    <h2 className="text-4xl font-bold mb-4">Achievements</h2>
                    <p className="text-lg text-muted-foreground">
                    Recognition and awards received throughout my musical journey
                    </p>
                </motion.div>
                <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
                    {achievements.map((achievement, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                        <Card className="bg-card border-primary/20 text-center hover:border-primary/40 transition-colors h-full">
                        <CardHeader>
                            <div className="text-4xl mb-4">{achievement.icon}</div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription className="text-primary">
                            {achievement.year}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-muted-foreground text-sm">{achievement.description}</p>
                        </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </motion.div>
            </div>
            </motion.section>
        </div>
      
        <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

        <div className="py-12 bg-card">
            <section className="container mx-auto px-4 md:px-12">
                <motion.h2
                    className="text-3xl md:text-4xl font-headline font-bold text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    What My Clients Say
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bio.pressReleases.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="bg-background/50 border-border/50 h-full flex flex-col p-6">
                                <div className="flex-grow mb-4">
                                    <p className="text-muted-foreground italic">"{testimonial.title}"</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-primary fill-current" />
                                            ))}
                                        </div>
                                        <p className="font-bold mt-2">{testimonial.publication}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(testimonial.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
      
        <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

        <div className="container mx-auto px-4 md:px-12">
            <section className="py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Let's Create Something Amazing</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Have a project in mind? I'd love to hear about it. Contact me for custom compositions or licensing inquiries.
                    </p>
                    <Button size="lg" asChild className="btn-gold">
                        <Link href="/contact">
                            Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            <div className="text-center mt-20 text-primary text-2xl">
            ♪ ♫ ♪
            </div>
        </div>
    </div>
  );
}
