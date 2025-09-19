"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { albums, bio } from '@/lib/data';
import type { Album, Track, Collaboration, Achievement } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMusicPlayer } from '@/context/music-player-context';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, ArrowRight, Music, CheckCircle, Headphones, Film, Gamepad2, Star, ExternalLink, Heart, Share2 } from 'lucide-react';

const musicCategories = ['All', 'Cinematic', 'Orchestral', 'Gamelan', 'Ambient', 'Electronic'];

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

export default function MusicPage() {
    const { play } = useMusicPlayer();
    const [latestAlbum, ...otherAlbums] = [...albums].sort((a, b) => b.releaseYear - a.releaseYear);
    const heroImage = PlaceHolderImages.find(p => p.id === 'music-hero');
    const [filter, setFilter] = useState('All');
    
    const getCategoryForAlbum = (albumId: string) => {
        const cats = ['Cinematic', 'Orchestral', 'Gamelan', 'Ambient', 'Electronic'];
        let hash = 0;
        for (let i = 0; i < albumId.length; i++) {
            hash = albumId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return cats[Math.abs(hash) % cats.length];
    }
    
    const allAlbumsWithCats = albums.map(album => ({
        ...album,
        category: getCategoryForAlbum(album.id),
    }));

    const filteredAlbums = filter === 'All' ? allAlbumsWithCats : allAlbumsWithCats.filter(p => p.category === filter);


    const handlePlayAlbum = (album: Album) => {
        play(album.tracks[0], album.tracks);
    };

    const handlePlayTrack = (track: Track, album: Album) => {
        play(track, album.tracks);
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    return (
        <div className="bg-transparent text-foreground">
            {/* Hero Section */}
            <motion.section
                className="py-24 px-6 text-center relative overflow-hidden bg-card"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover opacity-20"
                        data-ai-hint={heroImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-0"></div>
                <div className="relative z-10">
                    <motion.h1 className="text-5xl md:text-7xl font-headline font-bold" variants={fadeInUp}>Music</motion.h1>
                    <motion.p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto" variants={fadeInUp}>
                        A curated collection of cinematic and cultural compositions for licensing and listening.
                    </motion.p>
                </div>
            </motion.section>
            
            {/* Explore My Music Section */}
            <motion.section
                className="py-20 px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
            >
                <div className="container mx-auto">
                    <motion.div className="flex justify-center flex-wrap gap-2 mb-12" variants={fadeInUp}>
                        {musicCategories.map(category => (
                            <Button
                                key={category}
                                variant={filter === category ? 'default' : 'outline'}
                                onClick={() => setFilter(category)}
                                className={cn(
                                    "capitalize rounded-md",
                                    filter === category
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-transparent border-primary/50 text-primary hover:bg-primary/10"
                                )}
                            >
                                {category}
                            </Button>
                        ))}
                    </motion.div>

                    <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
                    >
                        {filteredAlbums.map((album) => {
                            const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
                            return (
                                <motion.div layout key={album.id} variants={fadeInUp}>
                                    <Card className="overflow-hidden group bg-card border-border/50 h-full flex flex-col">
                                        {coverArt && (
                                            <div className="overflow-hidden relative">
                                                <Image
                                                    src={coverArt.imageUrl}
                                                    alt={`Cover for ${album.title}`}
                                                    width={600}
                                                    height={400}
                                                    className="object-cover w-full h-auto aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                                                    data-ai-hint={coverArt.imageHint}
                                                />
                                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" className="h-12 w-12 rounded-full" onClick={() => handlePlayAlbum(album)}>
                                                        <PlayCircle className="h-6 w-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        <CardContent className="p-4 flex-grow flex flex-col">
                                            <h3 className="font-bold text-lg truncate">{album.title}</h3>
                                            <p className="text-sm text-primary mb-2">{album.category}</p>
                                            <div className="flex justify-start items-center gap-2 text-muted-foreground mt-auto">
                                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </motion.section>

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
                                            Celestial Echoes takes you on a journey through starlit soundscapes and cosmic ambiances. A blend of electronic waves and orchestral arrangements perfect for storytelling.
                                        </p>
                                        <div className="mt-6">
                                            <h4 className="font-bold mb-3">Tracklist</h4>
                                            <ul className="space-y-3">
                                                {latestAlbum.tracks.map((track) => (
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

            {/* Collaborations Section */}
            <motion.section
                className="py-20 px-6 bg-transparent"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="container mx-auto">
                    <motion.div className="text-center mb-12" variants={fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4">Collaborations</h2>
                        <p className="text-lg text-muted-foreground">
                        Working with talented artists and ensembles to create extraordinary music
                        </p>
                    </motion.div>
                    <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerContainer}>
                        {collaborations.map((collab, index) => (
                        <motion.div key={index} variants={fadeInUp}>
                            <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all h-full">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={collab.image} alt={collab.name} width={64} height={64} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-xl">{collab.name}</CardTitle>
                                    <CardDescription className="text-primary">{collab.role}</CardDescription>
                                </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-6 leading-relaxed">{collab.description}</p>
                                {collab.link && collab.link !== "#" && (
                                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
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
                </div>
            </motion.section>

            {/* Achievements Section */}
            <motion.section
                className="py-20 px-6 bg-transparent"
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
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{achievement.description}</p>
                        </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </motion.div>
                </div>
            </motion.section>


            {/* Testimonials Section */}
            <section className="py-20 px-6 bg-card">
                <div className="container mx-auto">
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
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
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
        </div>
    );
}

    