

"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import YouTube from 'react-youtube';
import type { YouTubePlayer } from 'react-youtube';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { Video as VideoType, SocialLink as SocialLinkType, Testimonial as TestimonialType } from "@/lib/admin-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FloatingNotes } from "@/components/floating-notes";

import {
    Music,
    Mail,
    User,
    Phone,
    MapPin,
    Send,
    Play,
    Award,
    Star,
    Headphones,
    Link as LinkIcon,
    VolumeX,
    Volume2,
} from "lucide-react";
import { SoundcloudIcon, Instagram, Youtube, SpotifyIcon } from "@/components/icons";


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

const iconComponents: { [key: string]: React.FC<any> } = {
    YouTube: (props) => <Youtube {...props} />,
    Instagram: (props) => <Instagram {...props} />,
    Soundcloud: (props) => <SoundcloudIcon {...props} />,
    Spotify: (props) => <SpotifyIcon {...props} />,
    Default: LinkIcon,
};


export default function Home() {
    // Data state
    const [socialLinks, setSocialLinks] = useState<SocialLinkType[]>([]);
    const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
    const [allVideos, setAllVideos] = useState<VideoType[]>([]);
    
    // UI State
    const [hoveredMusicCard, setHoveredMusicCard] = useState<string | null>(null);

    // Player State
    const [featuredVideo, setFeaturedVideo] = useState<VideoType | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const playerRef = useRef<YouTubePlayer | null>(null);
    
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
        const fetchData = async () => {
            try {
                // Fetch Social Links
                const socialLinksQuery = query(collection(db, "social-links"), orderBy("createdAt", "desc"));
                const socialLinksSnapshot = await getDocs(socialLinksQuery);
                const socialLinksData = socialLinksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialLinkType[];
                setSocialLinks(socialLinksData);

                // Fetch Testimonials
                const testimonialsQuery = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
                const testimonialsSnapshot = await getDocs(testimonialsQuery);
                const testimonialsData = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TestimonialType[];
                setTestimonials(testimonialsData);
                
                // Fetch Videos
                const videosQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
                const videosSnapshot = await getDocs(videosQuery);
                const videosData = videosSnapshot.docs
                  .map(doc => ({ id: doc.id, ...doc.data() } as VideoType))
                  .filter(video => video.isPublished);
                
                setAllVideos(videosData);

                if (videosData.length > 0) {
                    const featuredVideos = videosData.filter(video => video.isFeatured);
                    if (featuredVideos.length > 0) {
                        const randomIndex = Math.floor(Math.random() * featuredVideos.length);
                        setFeaturedVideo(featuredVideos[randomIndex]);
                    } else {
                         setFeaturedVideo(videosData[0]);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data for landing page:", error);
            }
        };
        fetchData();
    }, []);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    
    const videoId = featuredVideo ? getYouTubeId(featuredVideo.videoUrl) : null;
    
    const playTrackFromPortfolio = (track: VideoType) => {
        setIsMuted(false);
        setFeaturedVideo(track);
        setTimeout(() => {
             document.getElementById('music-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handlePlayerReady = (event: { target: YouTubePlayer }) => {
        playerRef.current = event.target;
    };

    const handleUnmute = () => {
        if (playerRef.current) {
            playerRef.current.unMute();
            setIsMuted(false);
        }
    };
    
    const filteredTracks = allVideos.filter(video => video.isFeatured);
    
    return (
        <div className="min-h-screen bg-background text-foreground">
            <section id="home" className="relative flex flex-col items-center justify-center pt-20 pb-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                 <div className="hero-bg"></div>
                 <FloatingNotes />
                
                <div className="relative z-10 max-w-7xl mx-auto text-center mt-20">
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold mb-6 text-white font-headline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary">Fahmie Farhan</span>
                    </motion.h1>
                    <motion.h2 
                        className="text-2xl md:text-4xl font-bold mb-6 text-white font-headline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Epic Orchestral & Malay Gamelan Composer
                    </motion.h2>
                    <motion.p 
                        className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Crafting cinematic soundscapes that blend epic orchestral arrangements with the rich cultural heritage of Malay gamelan music. 
                        <span className="text-primary"> Experience the fusion of tradition and innovation.</span>
                    </motion.p>
                    
                    <motion.div className="flex justify-center space-x-4 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Link href="#music-portfolio">
                             <Button size="lg" className="btn-gold px-6 py-3 rounded-md flex items-center">
                                <span className="mr-2">⟡</span> Explore Works
                             </Button>
                           </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="#contact">
                              <Button variant="outline" size="lg" className="btn-outline-gold px-6 py-3 rounded-md flex items-center border-2">
                                <Send className="w-5 h-5 mr-2" /> Contact Me
                              </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                     <motion.div className="flex justify-center space-x-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {socialLinks.map((social, index) => {
                           const Icon = iconComponents[social.platform as keyof typeof iconComponents] || iconComponents.Default;
                           if (!Icon) return null;
                           return (
                                <motion.a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group transform transition-all duration-300 hover:scale-110"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + index * 0.1 }}
                                >
                                    <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/20">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                                        {social.platform}
                                    </p>
                                </motion.a>
                            );
                        })}
                    </motion.div>
                    <motion.div 
                        className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-muted-foreground text-sm mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <a href="mailto:contact@fahmiefarhan.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Mail className="w-4 h-4" />
                            <span>contact@fahmiefarhan.com</span>
                        </a>
                         <a href="tel:+601131377753" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>+60 11-31377753</span>
                        </a>
                         <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Malaysia</span>
                        </div>
                    </motion.div>
                </div>
            </section>
            
             <div className="section-divider-light"><div className="divider-content">♫ ♪ ♫</div></div>

            {/* --- FEATURED MUSIC TRACK SECTION --- */}
            <section id="music-player" className="py-20 bg-card scroll-mt-20">
                 <div className="container mx-auto px-4 md:px-6">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Featured Music Track</h2>
                         <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover a featured track from my collection. Select any song from the portfolio below to play it here.</p>
                     </div>
                     {featuredVideo && videoId ? (
                        <motion.div 
                            className="max-w-4xl mx-auto" 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.8 }}
                        >
                            <Card className="bg-background/50 backdrop-blur-sm border-primary/30 overflow-hidden">
                                <div className="relative aspect-video">
                                    <YouTube
                                        key={videoId}
                                        videoId={videoId}
                                        onReady={handlePlayerReady}
                                        opts={{
                                            height: '100%',
                                            width: '100%',
                                            playerVars: {
                                                autoplay: 1,
                                                mute: isMuted ? 1 : 0,
                                                controls: 1,
                                                rel: 0,
                                                showinfo: 0,
                                                modestbranding: 1,
                                            },
                                        }}
                                        className="w-full h-full"
                                    />
                                    {isMuted && (
                                        <div 
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 cursor-pointer group"
                                            onClick={handleUnmute}
                                        >
                                            <div className="flex items-center gap-2 text-white bg-black/50 p-3 rounded-lg">
                                                <VolumeX className="w-8 h-8" />
                                                <span className="text-lg font-semibold">Click to Unmute</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="text-2xl font-bold text-white mb-1 font-headline">{featuredVideo.title}</h3>
                                    <p className="text-lg text-muted-foreground mb-4">{featuredVideo.category}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                     ) : ( <div className="text-center text-muted-foreground">Loading featured music...</div> )}
                 </div>
            </section>

            <div className="section-divider"><div className="divider-content">♫ ♪ ♫</div></div>

            {/* --- MUSIC PORTFOLIO SECTION --- */}
            <section id="music-portfolio" className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Music Portfolio</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore my diverse collection of compositions spanning multiple genres and styles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTracks.map((track, index) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredMusicCard(track.id)}
                                onMouseLeave={() => setHoveredMusicCard(null)}
                            >
                                <Card className={`music-card bg-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col ${
                                    hoveredMusicCard === track.id ? 'transform scale-105 border-primary/50' : 'border-transparent'
                                }`}>
                                    <div className="relative cursor-pointer" onClick={() => playTrackFromPortfolio(track)}>
                                        <Image src={track.thumbnailUrl || `https://placehold.co/400x400`} 
                                            alt={track.title} 
                                            width={400}
                                            height={400}
                                            className="w-full h-48 object-cover"
                                            loading="eager" />
                                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                                            hoveredMusicCard === track.id ? 'opacity-100' : 'opacity-0'
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
                                        <h3 className="text-xl font-bold text-white mb-2 font-headline">{track.title}</h3>
                                        <p className="text-primary text-sm mb-2">{track.category}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    {allVideos.length === 0 && (
                        <div className="text-center text-muted-foreground pt-8">Loading music portfolio...</div>
                     )}
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>
            
            {/* --- ABOUT SECTION --- */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline">About the Composer</h2>
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
                            className="relative"
                        >
                            <div className="relative mx-auto max-w-md">
                                <Image src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop" 
                                    alt="Composer at work" 
                                    width={600}
                                    height={400}
                                    className="w-full rounded-xl shadow-xl" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div></div>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">What People Say</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Hear from clients and collaborators who have experienced the magic of my compositions.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-card/90 backdrop-blur-sm border-primary/30 h-full">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex items-center mb-4">
                                            <div>
                                                <h4 className="font-semibold text-white">{testimonial.author}</h4>
                                                {testimonial.publication && <p className="text-sm text-primary">{testimonial.publication}</p>}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground flex-grow">"{testimonial.quote}"</p>
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

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-20">
                <motion.div 
                    className="container mx-auto px-4 md:px-6"
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Get in Touch</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Interested in collaborating on a project or licensing music? I'd love to hear from you!
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div>
                            <h3 className="text-3xl font-bold mb-6 text-primary font-headline">Let's Connect</h3>
                            <p className="text-lg text-muted-foreground mb-8">
                                Whether you're looking for custom compositions, music licensing, or just want to discuss musical ideas, I'm here to help bring your vision to life.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Email</h4>
                                        <p className="text-muted-foreground">contact@fahmiefarhan.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Phone</h4>
                                        <p className="text-muted-foreground">+60 11-31377753</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Location</h4>
                                        <p className="text-muted-foreground">Malaysia</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div>
                            <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
                                <CardContent className="p-8">
                                     <Form {...form}>
                                        <form action={formAction} className="space-y-6">
                                            <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your name" {...field} />
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
                                                    <Input placeholder="your@email.com" {...field} />
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
                                                    <Input placeholder="What's this about?" {...field} />
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
                                                    <Textarea placeholder="Your message..." {...field} rows={5} />
                                                </FormControl>
                                                <FormMessage>{state.errors?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                            />
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button type="submit" size="lg" className="w-full btn-gold px-6 py-3 rounded-md flex items-center justify-center">
                                                    <Send className="w-5 h-5 mr-2" />Send Message
                                                </Button>
                                            </motion.div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
