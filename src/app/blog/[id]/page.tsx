
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
import { Clock, Calendar, User, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

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
  const { id } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const fetchedPost = await getBlogPost(id);
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
  }, [id]);
  
  if (loading || !post) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p>Loading...</p>
          </div>
      )
  }

  return (
    <div className="bg-transparent text-foreground">
        <section className="relative py-12 md:py-20">
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
                    dangerouslySetInnerHTML={{ __html: post.content }}
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
                
            </article>
        </div>


        {/* Related Articles */}
        {relatedPosts.length > 0 && (
            <section className="py-20">
                 <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-headline font-bold text-center mb-12">Related Articles</h2>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    >
                        {relatedPosts.map(relatedPost => (
                            <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                                <div>
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
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        )}
    </div>
  );
}
