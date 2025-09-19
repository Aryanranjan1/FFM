"use client";

import { useState } from 'react';
import { bio as initialBioData } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Edit } from 'lucide-react';
import { AboutEditor } from '@/components/about-editor';
import { AnimatePresence, motion } from 'framer-motion';

export default function AboutPage() {
  const [bio, setBio] = useState(initialBioData.content);
  const [pressReleases] = useState(initialBioData.pressReleases);
  const [isEditing, setIsEditing] = useState(false);
  const artistImage = PlaceHolderImages.find(p => p.id === 'about-artist');

  const handleSave = (newBio: string) => {
    setBio(newBio);
    setIsEditing(false);
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold">About FFM</h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
          The story, the journey, and the vision behind the music.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AboutEditor
              initialBio={bio}
              artistName="FFM"
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-1">
              {artistImage && (
                <Image
                  src={artistImage.imageUrl}
                  alt={artistImage.description}
                  width={500}
                  height={600}
                  className="rounded-lg object-cover w-full h-auto"
                  data-ai-hint={artistImage.imageHint}
                />
              )}
            </div>
            <div className="md:col-span-2 space-y-8">
              <Card className='bg-transparent'>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-3xl">Biography</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {bio}
                  </p>
                </CardContent>
              </Card>

              <Card className='bg-transparent'>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">Press</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {pressReleases.map((release, index) => (
                      <li key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-md hover:bg-accent">
                        <div>
                          <a href={release.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors flex items-center">
                            {release.title} <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                          <p className="text-sm text-muted-foreground">{release.publication}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 sm:mt-0">{release.date}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
