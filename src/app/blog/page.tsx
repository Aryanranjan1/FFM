"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Calendar, User, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const featuredArticles = [
  {
    id: 'blog-1',
    title: 'Bridging Tradition and Innovation 2',
    description: 'Exploring the fusion of traditional and modern music.',
    category: 'Culture',
    readTime: '1 min read',
    imageId: 'project-1'
  },
  {
    id: 'blog-2',
    title: 'The Future of Music Production 4',
    description: 'Insights into upcoming innovations in music production.',
    category: 'Technology',
    readTime: '1 min read',
    imageId: 'project-2'
  }
];

const publishedArticles = [
    {
        id: 'pub-1',
        title: 'Bridging Tradition and Innovation 2',
        description: 'Exploring the fusion of traditional and modern music.',
        category: 'Culture',
        readTime: '1 min read',
        imageId: 'blog-pub-1',
        tags: ['gamelan', 'fusion', 'innovation'],
        author: 'Fahmie Farhan',
        date: '9/20/2025',
        views: 200,
        featured: true,
    },
    {
        id: 'pub-2',
        title: 'The Future of Music Production 4',
        description: 'Insights into upcoming innovations in music production.',
        category: 'Technology',
        readTime: '1 min read',
        imageId: 'blog-pub-2',
        tags: ['production', 'future', 'AI'],
        author: 'Fahmie Farhan',
        date: '9/20/2025',
        views: 250,
        featured: true,
    },
    {
        id: 'pub-3',
        title: 'Behind the Scenes: Scoring for Film 5',
        description: 'Composing music for movies and TV shows.',
        category: 'Film Scoring',
        readTime: '1 min read',
        imageId: 'blog-pub-3',
        tags: ['film', 'media', 'composition'],
        author: 'Fahmie Farhan',
        date: '9/20/2025',
        views: 190,
        featured: true,
    },
    {
        id: 'pub-4',
        title: 'The Art of Composing Epic Orchestral Music 1',
        description: 'A deep dive into creating large-scale orchestral pieces.',
        category: 'Composition',
        readTime: '1 min read',
        imageId: 'blog-pub-4',
        tags: ['orchestral', 'epic', 'theory'],
        author: 'Fahmie Farhan',
        date: '9/18/2025',
        views: 310,
        featured: true,
    },
    {
        id: 'pub-5',
        title: 'My Creative Process: From Idea to Masterpiece 3',
        description: 'A look into the journey of a musical composition.',
        category: 'Process',
        readTime: '1 min read',
        imageId: 'blog-pub-5',
        tags: ['creativity', 'workflow', 'inspiration'],
        author: 'Fahmie Farhan',
        date: '9/15/2025',
        views: 180,
        featured: true,
    },
    {
        id: 'pub-6',
        title: 'Understanding Music Theory Basics 6',
        description: 'A beginner-friendly guide to the building blocks of music.',
        category: 'Education',
        readTime: '1 min read',
        imageId: 'blog-pub-6',
        tags: ['theory', 'basics', 'learning'],
        author: 'Fahmie Farhan',
        date: '9/12/2025',
        views: 450,
        featured: true,
    },
];

const categories = ["All", "Composition", "Cultural Heritage", "Behind the Scenes", "Industry Insights", "Business", "Collaboration", "Tutorials", "Film Scoring", "Technology"];


export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth);
    }
  }, []);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.section
        className="py-20 text-center bg-transparent"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.h1 className="text-5xl font-headline font-bold text-primary mb-4" variants={fadeInUp}>
            BLOG
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp}>
            Insights, tutorials, and stories from the world of orchestral composition and cultural music innovation. Join me on a journey through the art and craft of creating meaningful music.
          </motion.p>
        </div>
      </motion.section>

      {/* Featured Articles Section */}
      <motion.section
        className="py-20 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-headline font-bold text-primary mb-4">
              FEATURED ARTICLES
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked posts that showcase the best of musical composition and cultural innovation
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {featuredArticles.map((article) => {
              const image = PlaceHolderImages.find(p => p.id === article.imageId);
              return (
                <motion.div key={article.id} variants={fadeInUp}>
                  <Link href={`/blog/${article.id}`}>
                    <Card className="bg-background border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                      <div className="relative">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={article.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-auto aspect-video group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <Badge variant="outline" className="text-primary border-primary/50">
                            {article.category}
                          </Badge>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <h3 className="font-headline text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {article.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Published Articles Section */}
       <motion.section
        className="py-20 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
            <div className="flex flex-col gap-4 mb-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <Input placeholder="Search articles..." className="pl-10" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select defaultValue="recent">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Recent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Recent</SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="relative flex items-center">
                   {canScrollLeft && (
                     <Button variant="ghost" size="icon" className="absolute left-0 z-10 rounded-full bg-card/80 hover:bg-card" onClick={() => handleScroll('left')}>
                       <ChevronLeft className="h-5 w-5"/>
                     </Button>
                   )}
                   <ScrollArea className="w-full whitespace-nowrap" onScroll={checkScrollability}>
                     <div ref={scrollRef} className="flex w-max space-x-2 py-2.5 px-12">
                       {categories.map((category) => (
                         <Button
                           key={category}
                           variant={activeTab === category ? "default" : "outline"}
                           onClick={() => setActiveTab(category)}
                           className="capitalize whitespace-nowrap"
                         >
                           {category}
                         </Button>
                       ))}
                     </div>
                     <ScrollBar orientation="horizontal" className="invisible"/>
                   </ScrollArea>
                   {canScrollRight && (
                     <Button variant="ghost" size="icon" className="absolute right-0 z-10 rounded-full bg-card/80 hover:bg-card" onClick={() => handleScroll('right')}>
                       <ChevronRight className="h-5 w-5"/>
                     </Button>
                   )}
                 </div>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
            >
                {publishedArticles.map((article) => {
                    const image = PlaceHolderImages.find(p => p.id === article.imageId);
                    return (
                        <motion.div key={article.id} variants={fadeInUp}>
                            <Card className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                                <div className="relative">
                                    {image && (
                                        <Image
                                            src={image.imageUrl}
                                            alt={article.title}
                                            width={600}
                                            height={338}
                                            className="object-cover w-full h-auto aspect-video"
                                            data-ai-hint={image.imageHint}
                                        />
                                    )}
                                    {article.featured && <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">Featured</Badge>}
                                </div>
                                <CardHeader className="p-4 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <Badge variant="outline" className="text-primary border-primary/50">
                                            {article.category}
                                        </Badge>
                                        <div className="flex items-center text-muted-foreground">
                                            <Clock className="h-4 w-4 mr-1.5" />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-headline text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
                                        {article.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col flex-grow">
                                     <div className="flex flex-wrap gap-2 mb-4">
                                        {article.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className="mt-auto space-y-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span className="flex items-center"><User className="h-3 w-3 mr-1.5"/>{article.author}</span>
                                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1.5"/>{article.date}</span>
                                            <span className="flex items-center"><Heart className="h-3 w-3 mr-1.5"/>{article.views}</span>
                                        </div>
                                         <Button asChild className="w-full btn-gold mt-2">
                                            <Link href={`/blog/${article.id}`}>Read Article</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

    