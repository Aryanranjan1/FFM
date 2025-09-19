"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

export default function BlogPage() {
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
    </div>
  );
}