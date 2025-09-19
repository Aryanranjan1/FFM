import Image from 'next/image';
import type { Project } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from './ui/card';
import { Heart, Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const image = PlaceHolderImages.find(p => p.id === project.imageId);

  return (
    <Card className="overflow-hidden group bg-card border-border/50">
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
      <CardContent className="p-4">
        <h3 className="font-bold text-lg truncate">{project.title}</h3>
        <p className="text-sm text-primary mb-2">{project.category}</p>
        <div className="flex justify-start items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
