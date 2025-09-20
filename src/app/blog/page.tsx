

"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Calendar, User, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { BlogPost } from '@/lib/admin-types';
import { format } from 'date-fns';

const categories = ["All", "Composition", "Cultural Heritage", "Behind the Scenes", "Industry Insights", "Business", "Collaboration", "Tutorials", "Film Scoring", "Technology"];


export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const postsCollection = collection(db, 'blog');
      const q = query(
        postsCollection,
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate().toISOString() : data.createdAt,
            } as BlogPost;
        })
        .filter(post => post.isPublished);

      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeTab === 'All' ? posts : posts.filter(p => p.category === activeTab);
  const featuredArticles = posts.filter(p => p.isFeatured).slice(0, 2);


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
    const el = scrollRef.current;
    if (el) {
        el.addEventListener('scroll', checkScrollability);
    }
    return () => {
        window.removeEventListener('resize', checkScrollability);
        if (el) {
            el.removeEventListener('scroll', checkScrollability);
        }
    };
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
        <div className="container mx-auto px-4 md:px-12">
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
        <div className="container mx-auto px-4 md:px-12">
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
            {loading ? (
                <div className="md:col-span-2 flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : featuredArticles.length > 0 ? (
                featuredArticles.map((article) => (
                <motion.div key={article.id} variants={fadeInUp}>
                  <Link href={`/blog/${article.id}`}>
                    <Card className="bg-background border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                      <div className="relative">
                          <Image
                            src={article.coverImageUrl || 'https://placehold.co/600x400'}
                            alt={article.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-auto aspect-video group-hover:scale-105 transition-transform duration-300"
                          />
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
                            <span>5 min read</span>
                          </div>
                        </div>
                        <h3 className="font-headline text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                          {article.content}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
                <div className="md:col-span-2 text-center text-muted-foreground">No featured articles found.</div>
            )}
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
        <div className="container mx-auto px-4 md:px-12">
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
                   <ScrollArea className="w-full whitespace-nowrap">
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

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                >
                    {filteredPosts.map((article) => {
                        return (
                            <motion.div key={article.id} variants={fadeInUp}>
                                <Card className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                                    <div className="relative">
                                        <Image
                                            src={article.coverImageUrl || 'https://placehold.co/600x338'}
                                            alt={article.title}
                                            width={600}
                                            height={338}
                                            className="object-cover w-full h-auto aspect-video"
                                        />
                                        {article.isFeatured && <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">Featured</Badge>}
                                    </div>
                                    <CardHeader className="p-4 space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <Badge variant="outline" className="text-primary border-primary/50">
                                                {article.category}
                                            </Badge>
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="h-4 w-4 mr-1.5" />
                                                <span>5 min read</span>
                                            </div>
                                        </div>
                                        <h3 className="font-headline text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
                                            {article.content}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="p-4 flex flex-col flex-grow">
                                         <div className="flex flex-wrap gap-2 mb-4">
                                            {article.tags?.split(',').map(tag => (
                                                <Badge key={tag.trim()} variant="secondary" className="text-xs">{tag.trim()}</Badge>
                                            ))}
                                        </div>
                                        <div className="mt-auto space-y-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span className="flex items-center"><User className="h-3 w-3 mr-1.5"/>Fahmie Farhan</span>
                                                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1.5"/>{format(new Date(article.createdAt), 'PPP')}</span>
                                                <span className="flex items-center"><Heart className="h-3 w-3 mr-1.5"/>{Math.floor(Math.random()*500)}</span>
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
            )}
        </div>
      </motion.section>
    </div>
  );
}
