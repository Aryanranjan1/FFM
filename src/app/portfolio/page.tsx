"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
        {filteredProjects.map(project => (
          <motion.div layout key={project.id}>
             <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
