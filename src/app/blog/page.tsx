"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Search, Filter, ExternalLink, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Post } from '@/lib/types';


const categories = ["All", "Composition", "Cultural Heritage", "Behind the Scenes", "Industry Insights", "Business", "Collaboration"];

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
  const [blogPosts, setBlogPosts] = useState<Post[]>(featuredPosts);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    // In a real app, you'd fetch posts here.
    // For now, we'll just use the mock data.
    setBlogPosts(featuredPosts);
    setLoading(false);
  }, []);


  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    // Add more sorting logic if needed
    return 0;
  });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.section 
        className="py-20 px-6 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-5xl font-headline font-bold mb-4 text-primary"
            variants={fadeInUp}
          >
            Blog
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Insights, tutorials, and stories from the world of orchestral composition and cultural music innovation. 
            Join me on a journey through the art and craft of creating meaningful music.
          </motion.p>
        </div>
      </motion.section>

      {/* Featured Posts */}
      <motion.section 
        className="py-16 px-6 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-headline font-bold mb-4 text-primary">Featured Articles</h2>
            <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
              Hand-picked posts that showcase the best of musical composition and cultural innovation
            </motion.p>
          </motion.div>

          <motion.div className="grid lg:grid-cols-2 gap-8 mb-12" variants={staggerContainer}>
            {featuredPosts.map((post) => {
              const image = PlaceHolderImages.find(p => p.id === post.imageId);
              return (
              <motion.div key={post.id} variants={fadeInUp}>
                <Card className="bg-card border-border/20 overflow-hidden hover:border-primary/40 transition-all hover:transform hover:scale-105 group">
                   {image && (
                      <div className="relative overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-auto aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.imageHint}
                          />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {'Fahmie Farhan'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {Math.floor(Math.random() * 100)}
                          </div>
                        </div>
                      </div>
                      <Button asChild className="w-full mt-4 btn-gold">
                        <Link href={`/blog/${post.id}`}>
                          Read Article
                        </Link>
                      </Button>
                    </CardContent>
                </Card>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </motion.section>

      {/* All Posts */}
      <motion.section 
        className="py-16 px-6 bg-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          {/* Filters and Search */}
          <motion.div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12" variants={fadeInUp}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-background border-border/20 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Posts Grid */}
          {sortedPosts.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {sortedPosts.map((post) => {
                const image = PlaceHolderImages.find(p => p.id === post.imageId);
                return (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card className="bg-background border-border/20 hover:border-primary/40 transition-all hover:transform hover:scale-105 group">
                    <CardHeader className="pb-2">
                      {image && (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg mb-4 relative overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            data-ai-hint={image.imageHint}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {post.isFeatured && (
                            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                              Featured
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-3">{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {['composition', 'gamelan'].map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {'Fahmie Farhan'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {Math.floor(Math.random() * 100)}
                        </div>
                      </div>
                      <Button asChild className="w-full btn-gold">
                        <Link href={`/blog/${post.id}`}>
                          Read Article
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )})}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
