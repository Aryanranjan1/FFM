

"use client";

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { Collaboration, Achievement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import type { Video } from '@/lib/admin-types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, ArrowRight, Music, CheckCircle, Headphones, Film, Gamepad2, Star, ExternalLink, Heart, Share2, Loader2, X } from 'lucide-react';
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

export default function MusicPage() {
    const [filter, setFilter] = useState('All');
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            const videosCol = collection(db, 'videos');
            const q = query(videosCol, orderBy("createdAt", "desc"));
            const videoSnapshot = await getDocs(q);
            const videoList = videoSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
                } as Video;
            }).filter(video => video.isPublished);
            setVideos(videoList);
            setLoading(false);
        };

        fetchVideos();
    }, []);
    
    const videoCategories = useMemo(() => {
        const categories = new Set(videos.map(v => v.category).filter(Boolean));
        return ['All', ...Array.from(categories)] as string[];
    }, [videos]);

    const filteredVideos = useMemo(() => {
        if (filter === 'All') return videos;
        return videos.filter(p => p.category === filter);
    }, [videos, filter]);

    const handlePlayVideo = (video: Video) => {
        setSelectedVideo(video);
    };

    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const latestRelease = useMemo(() => videos.find(t => t.isFeatured) || videos[0], [videos]);

    return (
        <div className="bg-background text-foreground">
             <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative w-full max-w-4xl aspect-video"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-10 right-0 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                            <iframe
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl)}?autoplay=1`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full rounded-lg"
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Hero Section */}
            <section className="py-24 text-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <div className="hero-bg"></div>
                <div className="relative z-10 container mx-auto px-4 md:px-12">
                    <motion.h1 
                        className="text-5xl md:text-7xl font-headline font-bold text-primary" 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Music
                    </motion.h1>
                    <motion.p 
                        className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto" 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        A curated collection of cinematic and cultural compositions for licensing and listening.
                    </motion.p>
                </div>
            </section>
            
            {/* Latest Release Section */}
            {!loading && latestRelease && (
                <motion.section
                    className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <div className="hero-bg"></div>
                    <div className="container mx-auto px-4 md:px-12 relative z-10">
                        <motion.div variants={fadeInUp}>
                            <Card className="overflow-hidden bg-transparent border-0 md:border md:bg-card md:border-border/50">
                                <CardContent className="p-0 md:p-6 grid md:grid-cols-2 gap-8 items-center">
                                    <div className="relative group aspect-square md:aspect-auto cursor-pointer" onClick={() => handlePlayVideo(latestRelease)}>
                                        <Image
                                            src={latestRelease.thumbnailUrl || "https://placehold.co/600x600"}
                                            alt={`Cover for ${latestRelease.title}`}
                                            width={600}
                                            height={600}
                                            className="w-full h-full object-cover md:rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/20 md:rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" className="h-20 w-20 rounded-full" onClick={() => handlePlayVideo(latestRelease)}>
                                                <PlayCircle className="h-10 w-10" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-0">
                                        <Badge variant="default" className="mb-4">Latest Release</Badge>
                                        <h3 className="font-headline text-4xl font-bold">{latestRelease.title}</h3>
                                        <p className="text-muted-foreground mt-2 text-lg">{new Date(latestRelease.createdAt).getFullYear()}</p>
                                        <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
                                            {latestRelease.description || `Listen to the latest track, ${latestRelease.title}.`}
                                        </p>
                                        <div className="mt-6">
                                            <Button onClick={() => handlePlayVideo(latestRelease)}>Play Now</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* Video Portfolio Section */}
            <motion.section
                className="py-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4 md:px-12">
                    <motion.div className="flex justify-center flex-wrap gap-2 mb-12" variants={fadeInUp}>
                        {videoCategories.map(category => (
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

                    {loading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <motion.div 
                            layout 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
                        >
                            {filteredVideos.map((video) => {
                                return (
                                    <motion.div layout key={video.id} variants={fadeInUp}>
                                        <Card className="overflow-hidden group bg-card border-border/50 h-full flex flex-col cursor-pointer" onClick={() => handlePlayVideo(video)}>
                                            <div className="overflow-hidden relative">
                                                <Image
                                                    src={video.thumbnailUrl || "https://placehold.co/600x400"}
                                                    alt={`Cover for ${video.title}`}
                                                    width={600}
                                                    height={400}
                                                    className="object-cover w-full h-auto aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                                                />
                                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" className="h-12 w-12 rounded-full">
                                                        <PlayCircle className="h-6 w-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 flex-grow flex flex-col">
                                                <h3 className="font-bold text-lg truncate">{video.title}</h3>
                                                <p className="text-sm text-primary mb-2">{video.category || 'Video'}</p>
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
                    )}
                </div>
            </motion.section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Collaborations Section */}
            <motion.section
                className="py-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4 md:px-12">
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

             <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Achievements Section */}
            <motion.section
                className="py-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4 md:px-12">
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

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Testimonials Section */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-4 md:px-12">
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

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto text-center px-4 md:px-12">
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
