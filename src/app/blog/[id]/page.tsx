
'use client';

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, limit, query, where, orderBy, Timestamp } from "firebase/firestore";
import type { BlogPost } from "@/lib/admin-types";
import { notFound, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, User, Tag, Heart, MessageCircle, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

async function getBlogPost(id: string): Promise<BlogPost | null> {
  const postRef = doc(db, 'blog', id);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    return null;
  }

  const data = postSnap.data();
  return {
    id: postSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
  } as BlogPost;
}


async function getRelatedPosts(currentPostId: string, category: string): Promise<BlogPost[]> {
    const postsCollection = collection(db, 'blog');
    const q = query(
        postsCollection,
        where('isPublished', '==', true),
        where('category', '==', category),
        where('__name__', '!=', currentPostId),
        orderBy('__name__'), // to have a consistent order
        limit(2)
    );
    
    const querySnapshot = await getDocs(q);
    
    const postsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate().toISOString() : data.createdAt,
        } as BlogPost;
    });

    if (postsData.length < 2) {
        const fallbackQuery = query(
            postsCollection,
            where('isPublished', '==', true),
            where('__name__', '!=', currentPostId),
            orderBy('__name__', "desc"), 
            limit(2 - postsData.length)
        );
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const fallbackPosts = fallbackSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate().toISOString() : data.createdAt,
            } as BlogPost;
        }).filter(p => !postsData.some(existing => existing.id === p.id));
        postsData.push(...fallbackPosts);
    }
    
    return postsData;
}


export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const fetchedPost = await getBlogPost(params.id);
        if (fetchedPost) {
            setPost(fetchedPost);
            const fetchedRelatedPosts = await getRelatedPosts(fetchedPost.id, fetchedPost.category);
            setRelatedPosts(fetchedRelatedPosts);
        } else {
            notFound();
        }
        setLoading(false);
    }
    fetchData();
  }, [params.id]);
  
  if (loading || !post) {
      return (
          <div className="flex justify-center items-center h-screen">
              {/* You can add a loader component here */}
              <p>Loading...</p>
          </div>
      )
  }

  // Simple markdown-to-HTML
  const formatContent = (content: string) => {
    return content
        .split('\n\n')
        .map(p => `<p class="mb-6 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');
  }
  
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support navigator.share
        // The clipboard API is restricted in this environment, so we just log a message.
        console.log("Web Share API not supported. URL to share: ", window.location.href);
        toast({
            title: "Share Not Available",
            description: "Please copy the URL from your browser's address bar.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
       toast({
            title: "Error",
            description: "Could not share the article.",
            variant: "destructive",
        });
    }
  };


  return (
    <div className="bg-background text-foreground">
        <section className="relative py-12 md:py-20 bg-gradient-to-br from-gray-900 to-black">
            <div className="hero-bg"></div>
             <div className="container mx-auto px-4 md:px-6 relative z-10">
                <article className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="mb-4">
                        <Badge variant="outline" className="text-primary border-primary/50 text-sm">
                            {post.category}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
                    {post.title}
                    </h1>
                    <div className="flex justify-center items-center space-x-6 text-muted-foreground text-sm">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/artist/100/100" alt="Author" />
                            <AvatarFallback>FF</AvatarFallback>
                        </Avatar>
                        <span>Fahmie Farhan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(post.createdAt), 'PPP')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>5 min read</span>
                    </div>
                    </div>
                </header>
                </article>
            </div>
        </section>
        
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10 pb-20">
             <article className="max-w-4xl mx-auto">
                 {/* Cover Image */}
                {post.coverImageUrl && (
                    <div className="mb-12 rounded-lg overflow-hidden shadow-xl">
                    <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        width={1200}
                        height={675}
                        className="w-full object-cover"
                        priority
                    />
                    </div>
                )}

                {/* Article Content */}
                <div 
                    className="prose prose-lg prose-invert mx-auto text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />

                {/* Tags */}
                {post.tags && (
                    <div className="mt-12 flex flex-wrap items-center gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        {post.tags.split(',').map(tag => (
                            <Badge key={tag.trim()} variant="secondary" className="text-xs">
                                {tag.trim()}
                            </Badge>
                        ))}
                    </div>
                )}
                
                <Separator className="my-8" />
                
                {/* Actions */}
                <div className="flex justify-between items-center text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Heart className="h-4 w-4" /> {Math.floor(Math.random()*500)}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> {Math.floor(Math.random()*50)}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </article>
        </div>


        {/* Related Articles */}
        {relatedPosts.length > 0 && (
            <section className="py-20 border-t border-border/50">
                 <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-headline font-bold text-center mb-12">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {relatedPosts.map(relatedPost => (
                            <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                                <Card className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                                    {relatedPost.coverImageUrl && (
                                        <div className="relative">
                                            <Image
                                                src={relatedPost.coverImageUrl}
                                                alt={relatedPost.title}
                                                width={600}
                                                height={338}
                                                className="object-cover w-full h-auto aspect-video"
                                            />
                                        </div>
                                    )}
                                    <CardHeader className="p-4 space-y-2">
                                        <Badge variant="outline" className="text-primary border-primary/50 w-fit">
                                            {relatedPost.category}
                                        </Badge>
                                        <h3 className="font-headline text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
                                            {relatedPost.content}
                                        </p>
                                        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            <span>{format(new Date(relatedPost.createdAt), 'PPP')}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        )}
    </div>
  );
}
