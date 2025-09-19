"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const categories = ['All', 'Interview', 'Performance', 'Educational', 'Motivational', 'Heroic', 'Behind The Scenes'];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary">MUSIC PORTFOLIO</h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
          Explore my compositions and music videos.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map(category => (
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
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map(project => {
            const image = PlaceHolderImages.find(p => p.id === project.imageId);
            return (
              <motion.div layout key={project.id}>
                <Card className="overflow-hidden group bg-card border-border/50 h-full flex flex-col">
                  {image && (
                    <div className="overflow-hidden relative">
                      <Image
                        src={image.imageUrl}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-auto aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  )}
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg truncate">{project.title}</h3>
                    <p className="text-sm text-primary mb-2">{project.category}</p>
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
            )
        })}
      </motion.div>
    </div>
  );
}
