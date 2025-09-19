"use client";

import type { Track } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MusicPlayerContextType {
  playlist: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  play: (track?: Track, playlist?: Track[]) => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = currentTrackIndex >= 0 ? playlist[currentTrackIndex] : null;

  const play = (track?: Track, newPlaylist?: Track[]) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      const trackIndex = track ? newPlaylist.findIndex(t => t.id === track.id) : 0;
      setCurrentTrackIndex(trackIndex !== -1 ? trackIndex : 0);
    } else if (track) {
      const trackIndex = playlist.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        setCurrentTrackIndex(trackIndex);
      } else {
        setPlaylist([track]);
        setCurrentTrackIndex(0);
      }
    } else if (playlist.length > 0 && currentTrackIndex === -1) {
      setCurrentTrackIndex(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const value = {
    playlist,
    currentTrack,
    isPlaying,
    play,
    pause,
    playNext,
    playPrev,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
