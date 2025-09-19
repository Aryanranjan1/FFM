"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useMusicPlayer } from '@/context/music-player-context';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatePresence, motion } from 'framer-motion';
import { albums } from '@/lib/data';

const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, playNext, playPrev, pause, play } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', playNext);
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', playNext);
    };
  }, [playNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (currentTrack && isPlaying) {
        if (audio.src !== currentTrack.audioSrc) {
          audio.src = currentTrack.audioSrc;
        }
        audio.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack || undefined);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const currentAlbum = albums.find(album => album.tracks.some(t => t.id === currentTrack?.id));
  const coverArt = PlaceHolderImages.find(p => p.id === currentAlbum?.coverArtId);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <audio ref={audioRef} src={currentTrack?.audioSrc} preload="metadata" />
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-card/80 border-t border-border/80 backdrop-blur-md z-50"
          >
            <div className="container h-full mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-1/4">
                {coverArt && (
                  <Image
                    src={coverArt.imageUrl}
                    alt={currentTrack.title}
                    width={56}
                    height={56}
                    className="rounded-md"
                    data-ai-hint={coverArt.imageHint}
                  />
                )}
                <div>
                  <p className="font-bold truncate">{currentTrack.title}</p>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 w-1/2">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={playPrev}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="default" size="icon" onClick={togglePlayPause} className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNext}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
                  <Slider
                    value={[progress]}
                    max={duration}
                    step={1}
                    onValueChange={handleProgressChange}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-1/4 justify-end">
                <VolumeIcon className="h-5 w-5 text-muted-foreground" />
                <Slider
                  defaultValue={[0.75]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
