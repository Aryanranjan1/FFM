"use client";

import { useMusicPlayer } from '@/context/music-player-context';
import { albums } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Plus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Album, Track } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function MusicPage() {
  const { play, currentTrack, isPlaying } = useMusicPlayer();

  const handlePlayAlbum = (album: Album) => {
    play(album.tracks[0], album.tracks);
  };

  const handlePlayTrack = (track: Track, album: Album) => {
    play(track, album.tracks);
  };
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold">Discography</h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
          Explore the collection of sounds and stories from FFM.
        </p>
      </div>
      <div className="space-y-12">
        {albums.map((album) => {
          const coverArt = PlaceHolderImages.find(p => p.id === album.coverArtId);
          return (
            <Card key={album.id} className="overflow-hidden">
              <CardContent className="p-0 md:p-6 md:flex md:gap-8">
                <div className="md:w-1/3 relative group">
                  {coverArt && (
                    <Image
                      src={coverArt.imageUrl}
                      alt={`Cover art for ${album.title}`}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover md:rounded-lg"
                      data-ai-hint={coverArt.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 md:rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-16 w-16 rounded-full"
                      onClick={() => handlePlayAlbum(album)}
                    >
                      <PlayCircle className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <div className="md:w-2/3 p-6 md:p-0">
                  <h2 className="font-headline text-3xl font-semibold">{album.title}</h2>
                  <p className="text-muted-foreground mt-1">{album.releaseYear}</p>
                  
                  <div className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Tracklist</AccordionTrigger>
                        <AccordionContent>
                          <ul className="divide-y divide-border">
                            {album.tracks.map((track, index) => (
                              <li key={track.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-4">
                                  <span className="text-muted-foreground w-4 text-center">{index + 1}</span>
                                  <button onClick={() => handlePlayTrack(track, album)} className="text-left hover:text-primary transition-colors">
                                    {track.title}
                                  </button>
                                  {currentTrack?.id === track.id && isPlaying && <Music className="h-4 w-4 text-primary animate-pulse" />}
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                                  <Button variant="ghost" size="icon" onClick={() => handlePlayTrack(track, album)} aria-label={`Play ${track.title}`}>
                                    <PlayCircle className="h-5 w-5" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
