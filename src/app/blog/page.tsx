
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import type { BlogPost } from "@/lib/admin-types";
import { format } from "date-fns";

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const postsCollection = collection(db, "blog");
      const q = query(
        postsCollection,
        where("isPublished", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as any)?.toDate
            ? (data.createdAt as any).toDate().toISOString()
            : data.createdAt,
        } as BlogPost;
      });

      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    if (loading) return ["All"];
    const allCategories = posts.map((p) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set(allCategories))];
  }, [posts, loading]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    if (activeTab !== "All") {
      filtered = filtered.filter((p) => p.category === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    let sorted = [...filtered];
    switch (sortBy) {
        case 'popular':
            sorted.sort(() => Math.random() - 0.5);
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'recent':
        default:
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
    }
    return sorted;

  }, [posts, activeTab, searchTerm, sortBy]);

  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    const sortedByDate = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const featured = sortedByDate.find((p) => p.isFeatured);
    return featured || sortedByDate[0];
  }, [posts]);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    checkScrollability(); 
    if (el) {
      el.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);

      return () => {
        el.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [checkScrollability, loading, posts]); 

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = direction === "left" ? -200 : 200;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="hero-bg"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.h1
            className="text-5xl font-headline font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BLOG
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Insights, tutorials, and stories from the world of orchestral
            composition and cultural music innovation.
          </motion.p>
        </div>
      </section>

      {/* Featured Post Section */}
      {loading ? (
        <div className="py-20 bg-card flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        featuredPost && (
          <motion.section
            className="py-20 bg-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <div className="container mx-auto px-4 md:px-6">
              <motion.div className="text-center mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-headline font-bold text-primary mb-4">
                  FEATURED POST
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  A hand-picked article to spark your curiosity.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="bg-background border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden md:grid md:grid-cols-2 items-center max-w-4xl mx-auto">
                  <div className="relative">
                    <Link href={`/blog/${featuredPost.id}`}>
                      <Image
                        src={
                          featuredPost.coverImageUrl ||
                          "https://picsum.photos/seed/featured/600/400"
                        }
                        alt={featuredPost.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-auto aspect-video md:aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </Link>
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1.5" /> Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <Badge
                      variant="outline"
                      className="text-primary border-primary/50"
                    >
                      {featuredPost.category}
                    </Badge>
                    <Link href={`/blog/${featuredPost.id}`}>
                      <h3 className="font-headline text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredPost.content}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground pt-3 border-t border-border/50">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        {format(new Date(featuredPost.createdAt), "PPP")}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" />5 min read
                      </span>
                    </div>
                    <Button asChild className="w-full btn-gold mt-2">
                      <Link href={`/blog/${featuredPost.id}`}>
                        Read Full Article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )
      )}

      {/* All Articles Section */}
      <motion.section
        className="py-20 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-12">
            <motion.div className="text-center" variants={fadeInUp}>
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">
                ALL ARTICLES
              </h2>
            </motion.div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-xs">
                <Input placeholder="Search articles..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 z-10 rounded-full bg-card/80 hover:bg-card -translate-x-1/2"
                  onClick={() => handleScroll("left")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <ScrollArea className="w-full whitespace-nowrap">
                <div
                  ref={scrollRef}
                  className="flex w-max space-x-2 py-2.5 px-4"
                >
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
                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>
              {canScrollRight && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 z-10 rounded-full bg-card/80 hover:bg-card translate-x-1/2"
                  onClick={() => handleScroll("right")}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAndSortedPosts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
              >
                {filteredAndSortedPosts.map((article) => (
                  <motion.div key={article.id} variants={fadeInUp}>
                    <Card className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                      <Link href={`/blog/${article.id}`} className="block">
                        <div className="relative">
                          <Image
                            src={
                              article.coverImageUrl ||
                              `https://picsum.photos/seed/${article.id}/600/338`
                            }
                            alt={article.title}
                            width={600}
                            height={338}
                            className="object-cover w-full h-auto aspect-video"
                          />
                          {article.isFeatured && (
                            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <CardHeader className="p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <Badge
                            variant="outline"
                            className="text-primary border-primary/50"
                          >
                            {article.category}
                          </Badge>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span>5 min read</span>
                          </div>
                        </div>
                        <Link href={`/blog/${article.id}`}>
                          <h3 className="font-headline text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2 flex-grow">
                          {article.content}
                        </p>
                        <div className="mt-4 space-y-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1.5" />
                              Fahmie Farhan
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1.5" />
                              {format(new Date(article.createdAt), "PPP")}
                            </span>
                          </div>
                          <Button asChild className="w-full btn-gold mt-2">
                            <Link href={`/blog/${article.id}`}>
                              Read Article
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No articles found. Check back later!</p>
                </div>
            )
          }
        </div>
      </motion.section>
    </div>
  );
}
