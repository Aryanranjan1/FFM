"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/context/music-player-context";
import { albums } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Track } from "@/lib/types";
import { Play, Pause, Volume2, VolumeX, Heart, Share2 } from "lucide-react";
import Image from 'next/image';

export function FeaturedTrackClient() {
    const { currentTrack: contextTrack, isPlaying, play, pause, playlist } = useMusicPlayer();
    const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [likedTracks, setLikedTracks] = useState<string[]>([]);
    
    // Set initial featured track
    useEffect(() => {
        const featuredAlbum = albums.find(a => a.id === 'album-1');
        if (featuredAlbum && featuredAlbum.tracks.length > 0) {
            setFeaturedTrack(featuredAlbum.tracks[0]);
        }
    }, []);

    // Sync with context
    useEffect(() => {
        if (contextTrack) {
            setFeaturedTrack(contextTrack);
        }
    }, [contextTrack]);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setProgress(audio.currentTime);
        };
        const setAudioTime = () => setProgress(audio.currentTime);
        
        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => pause());

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => pause());
        };
    }, [pause]);

    useEffect(() => {
        const audio = audioRef.current;
        if(audio && featuredTrack) {
            if(audio.src !== featuredTrack.audioSrc) {
                audio.src = featuredTrack.audioSrc;
            }
            if (isPlaying && contextTrack?.id === featuredTrack.id) {
                audio.play().catch(e => console.error("Audio play error", e));
            } else {
                audio.pause();
            }
        }
    }, [featuredTrack, isPlaying, contextTrack]);


    const toggleAudioPlay = () => {
        if (featuredTrack) {
            if (isPlaying && contextTrack?.id === featuredTrack.id) {
                pause();
            } else {
                play(featuredTrack, playlist);
            }
        }
    };
    
    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = (Number(e.target.value) / 100) * audio.duration;
            audio.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const toggleLike = (trackId: string) => {
        setLikedTracks(prev => 
            prev.includes(trackId) 
            ? prev.filter(id => id !== trackId)
            : [...prev, trackId]
        );
    };

    const currentAlbum = albums.find(album => album.tracks.some(t => t.id === featuredTrack?.id));
    const coverArt = PlaceHolderImages.find(p => p.id === currentAlbum?.coverArtId);

    return (
      <section id="music-player" className="py-20 px-6 bg-card/50 scroll-mt-20">
           <div className="max-w-7xl mx-auto">
               <div className="text-center mb-12">
                   <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Music Track</h2>
                   <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover a featured track from my collection. Select any song from the portfolio below to play it here.</p>
               </div>
               {featuredTrack ? (
                   <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                       <Card className="bg-card/90 backdrop-blur-sm border-primary/30 overflow-hidden">
                           <CardContent className="p-8">
                               <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                   <div className="relative group w-48 h-48 flex-shrink-0">
                                       {coverArt && <Image
                                           src={coverArt.imageUrl}
                                           alt={featuredTrack.title}
                                           width={192}
                                           height={192}
                                           className="w-full h-full object-cover rounded-lg"
                                            data-ai-hint={coverArt.imageHint}
                                       />}
                                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                           <Button
                                               size="lg"
                                               onClick={toggleAudioPlay}
                                               className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16 flex items-center justify-center"
                                           >
                                               {isPlaying && contextTrack?.id === featuredTrack.id ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                           </Button>
                                       </div>
                                   </div>
                                   <div className="flex-1 text-center md:text-left w-full">
                                       <h3 className="text-2xl font-bold text-foreground mb-2">{featuredTrack.title}</h3>
                                       <p className="text-lg text-muted-foreground mb-2">{currentAlbum?.title}</p>
                                       <p className="text-sm text-muted-foreground mb-4">An atmospheric electronic track with dreamy synths.</p>
                                       <audio ref={audioRef} src={featuredTrack.audioSrc} preload="metadata"></audio>
                                       <div className="mb-4">
                                           <input
                                               type="range"
                                               min="0"
                                               max="100"
                                               value={duration ? (progress / duration) * 100 : 0}
                                               onChange={handleProgressChange}
                                               className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer range-lg accent-primary"
                                           />
                                           <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                               <span>{formatTime(progress)}</span>
                                               <span>{formatTime(duration)}</span>
                                           </div>
                                       </div>
                                       <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                                            <Button size="sm" onClick={toggleAudioPlay} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                {isPlaying && contextTrack?.id === featuredTrack.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                            </Button>
                                            <Button
                                                variant="ghost" size="sm"
                                                onClick={() => {
                                                    if (audioRef.current) {
                                                        const newMutedState = !isMuted;
                                                        audioRef.current.muted = newMutedState;
                                                        setIsMuted(newMutedState);
                                                    }
                                                }}
                                                className="text-primary hover:text-white"
                                            >
                                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                            </Button>
                                       </div>
                                       <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-muted-foreground">
                                           <div className="flex items-center space-x-1 cursor-pointer hover:text-primary" onClick={() => toggleLike(featuredTrack.id)}>
                                               <Heart className={`w-4 h-4 ${likedTracks.includes(featuredTrack.id) ? 'text-red-500 fill-current' : ''}`} />
                                               <span>Like</span>
                                           </div>
                                           <div className="flex items-center space-x-1 cursor-pointer hover:text-primary">
                                               <Share2 className="w-4 h-4" />
                                               <span>Share</span>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </CardContent>
                       </Card>
                   </motion.div>
               ) : ( <div className="text-center text-muted-foreground">Loading featured music...</div> )}
           </div>
       </section>
    );
}
