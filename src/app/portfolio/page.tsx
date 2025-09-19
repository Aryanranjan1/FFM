"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
          A collection of creative works, from music videos to live performances.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map(category => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            onClick={() => setFilter(category)}
            className="capitalize"
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
