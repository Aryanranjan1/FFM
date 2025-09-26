
"use client";

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Collaboration, Achievement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import type { Video } from '@/lib/admin-types';
import { useToast } from "@/hooks/use-toast";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, ArrowRight, Music, CheckCircle, Headphones, Film, Gamepad2, Star, ExternalLink, Heart, Share2, Loader2, X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { bio } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { TestimonialCard } from '@/components/testimonial-card';

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
    const [hoveredMusicCard, setHoveredMusicCard] = useState<string | null>(null);
    const [likedTracks, setLikedTracks] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 9;
    const { toast } = useToast();

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

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleShare = async (e: React.MouseEvent, video: Video) => {
        e.stopPropagation();
        const shareData = {
        title: video.title,
        text: `Check out this track: ${video.title}`,
        url: video.videoUrl,
        };
        try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(video.videoUrl);
            toast({
                title: "Link Copied!",
                description: "The video URL has been copied to your clipboard.",
            });
        }
        } catch (error) {
        console.error('Error sharing:', error);
        toast({
                title: "Error",
                description: "Could not share the track.",
                variant: "destructive",
            });
        }
    };


    const handlePlayVideo = (video: Video) => {
        setSelectedVideo(video);
    };

    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };
    
    const toggleLike = (trackId: string) => {
        setLikedTracks(prev => 
            prev.includes(trackId) 
            ? prev.filter(id => id !== trackId)
            : [...prev, trackId]
        );
    };

    const latestRelease = useMemo(() => videos.find(t => t.isFeatured) || videos[0], [videos]);

    const VideoSkeleton = () => (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );


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
                <div className="relative z-10 container mx-auto px-4 md:px-6">
                    <h1 
                        className="text-5xl md:text-7xl font-headline font-bold text-primary" 
                    >
                        Music
                    </h1>
                    <p 
                        className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto" 
                    >
                        A curated collection of cinematic and cultural compositions for licensing and listening.
                    </p>
                </div>
            </section>
            
            {/* Video Portfolio Section */}
            <section
                className="py-20"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-center flex-wrap gap-2 mb-12">
                        {videoCategories.map(category => (
                            <Button
                                key={category}
                                variant={filter === category ? 'default' : 'outline'}
                                onClick={() => { setFilter(category); setCurrentPage(1); }}
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
                    </div>

                    {loading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                             {Array.from({ length: videosPerPage }).map((_, i) => <VideoSkeleton key={i} />)}
                         </div>
                    ) : (
                        <>
                        <motion.div 
                            layout 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
                        >
                            {currentVideos.map((video, index) => {
                                return (
                                     <div
                                        key={video.id}
                                        onMouseEnter={() => setHoveredMusicCard(video.id)}
                                        onMouseLeave={() => setHoveredMusicCard(null)}
                                    >
                                        <Card className={`music-card bg-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col ${
                                            hoveredMusicCard === video.id ? 'transform scale-105 border-primary/50' : 'border-transparent'
                                        }`}>
                                            <div className="relative cursor-pointer" onClick={() => handlePlayVideo(video)}>
                                                <Image src={video.thumbnailUrl || `https://placehold.co/400x400`} 
                                                    alt={video.title} 
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-48 object-cover"
                                                    loading="eager" />
                                                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                                                    hoveredMusicCard === video.id ? 'opacity-100' : 'opacity-0'
                                                }`}>
                                                    <Button 
                                                        size="lg"
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16"
                                                    >
                                                        <Play className="w-8 h-8" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardContent className="p-6 flex-grow flex flex-col">
                                                <h3 className="text-xl font-bold text-white mb-2 font-headline">{video.title}</h3>
                                                <p className="text-primary text-sm mb-2">{video.category}</p>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="flex items-center space-x-1"><Headphones className="w-4 h-4" /><span>{Math.floor(Math.random() * 20000)}</span></span>
                                                        <span className="flex items-center space-x-1"><Heart className="w-4 h-4" /><span>{Math.floor(Math.random() * 5000)}</span></span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-start space-x-2 mt-4 border-t border-primary/10 pt-4">
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleLike(video.id); }} className={`p-2 ${likedTracks.includes(video.id) ? 'text-red-500' : 'text-primary'}`}>
                                                        <Heart className={`w-5 h-5 ${likedTracks.includes(video.id) ? 'fill-current' : ''}`} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-primary p-2" onClick={(e) => handleShare(e, video)}>
                                                        <Share2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </motion.div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 space-x-4">
                                <Button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <span className="text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                        </>
                    )}
                </div>
            </section>

             {/* Latest Release Section */}
            {!loading && latestRelease && (
                <section
                    className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
                >
                    <div className="hero-bg"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div>
                            <Card className="overflow-hidden bg-transparent border-0 md:border md:bg-card md:border-border/50">
                                 <CardContent className="p-0 md:p-6 grid md:grid-cols-2 gap-8 items-center">
                                    <div className="relative group aspect-video md:aspect-[16/9] cursor-pointer" onClick={() => handlePlayVideo(latestRelease)}>
                                        <Image
                                            src={latestRelease.thumbnailUrl || "https://placehold.co/600/338"}
                                            alt={`Cover for ${latestRelease.title}`}
                                            width={600}
                                            height={338}
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
                        </div>
                    </div>
                </section>
            )}

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Collaborations Section */}
            <section
                className="py-20"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Collaborations</h2>
                        <p className="text-lg text-muted-foreground">
                        Working with talented artists and ensembles to create extraordinary music
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {collaborations.map((collab, index) => (
                        <div key={index}>
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
                        </div>
                        ))}
                    </div>
                </div>
            </section>

             <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Achievements Section */}
            <section
                className="py-20"
            >
                <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Achievements</h2>
                    <p className="text-lg text-muted-foreground">
                    Recognition and awards received throughout my musical journey
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                    <div key={index}>
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
                    </div>
                    ))}
                </div>
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2
                        className="text-3xl md:text-4xl font-headline font-bold text-center mb-12"
                    >
                        What My Clients Say
                    </h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                         {bio.pressReleases.slice(0, 3).map((testimonial, index) => (
                            <div
                                key={index}
                            >
                               <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto text-center px-4 md:px-6">
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

    