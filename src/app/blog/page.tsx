"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock data based on the image
const featuredPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Bridging Tradition and Innovation 2',
    description: 'Exploring the fusion of traditional and modern music.',
    category: 'Culture',
    readTime: '1 min read',
    isFeatured: true,
    imageId: 'project-1', // Re-using existing placeholder
  },
  {
    id: 'post-2',
    title: 'The Future of Music Production 4',
    description: 'Insights into upcoming innovations in music production.',
    category: 'Technology',
    readTime: '1 min read',
    isFeatured: true,
    imageId: 'project-2', // Re-using existing placeholder
  },
];

export default function BlogPage() {
  return (
    <div className="bg-transparent">
      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.h1 
            className="font-headline text-5xl md:text-7xl font-bold text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            BLOG
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Insights, tutorials, and stories from the world of orchestral composition and
            cultural music innovation. Join me on a journey through the art and craft of
            creating meaningful music.
          </motion.p>
        </div>
      </motion.section>
      
      {/* Featured Articles Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-headline font-bold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Featured Articles
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-center max-w-2xl mx-auto mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Hand-picked posts that showcase the best of musical composition and cultural innovation.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {featuredPosts.map((post, index) => {
              const image = PlaceHolderImages.find(p => p.id === post.imageId);
              return (
                <motion.div
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href="#">
                    <Card className="bg-card border-border/50 hover:border-primary/40 transition-all duration-300 group h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-auto aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        {post.isFeatured && (
                          <Badge variant="default" className="absolute top-3 left-3">Featured</Badge>
                        )}
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <Badge variant="secondary" className="bg-primary/10 text-primary w-fit mb-4">{post.category}</Badge>
                        <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{post.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-auto pt-4 border-t border-border/20">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{post.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
