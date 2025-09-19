import Image from 'next/image';
import type { Project } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const image = PlaceHolderImages.find(p => p.id === project.imageId);

  return (
    <Card className="overflow-hidden group">
      {image && (
        <div className="overflow-hidden">
          <Image
            src={image.imageUrl}
            alt={project.title}
            width={600}
            height={400}
            className="object-cover w-full h-auto aspect-[3/2] group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={image.imageHint}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
          <Badge variant="secondary">{project.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
