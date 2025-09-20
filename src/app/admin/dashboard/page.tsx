
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Newspaper, Users, Link as LinkIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, Timestamp, onSnapshot } from "firebase/firestore";
import type { Video as VideoType, ContactSubmission } from "@/lib/admin-types";
import Image from "next/image";
import Link from 'next/link';
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DashboardData {
    videosCount: number;
    blogCount: number;
    socialLinksCount: number;
    recentContacts: ContactSubmission[];
    recentVideos: VideoType[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const videosQuery = query(collection(db, 'videos'));
        const blogQuery = query(collection(db, 'blog'));
        const socialLinksQuery = query(collection(db, 'social-links'));
        const contactsQuery = query(collection(db, 'contacts'), orderBy('submittedAt', 'desc'), limit(5));
        const recentVideosQuery = query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(5));

        const [
            videosSnapshot,
            blogSnapshot,
            socialLinksSnapshot,
            contactsSnapshot,
            recentVideosSnapshot,
        ] = await Promise.all([
            getDocs(videosQuery),
            getDocs(blogQuery),
            getDocs(socialLinksQuery),
            getDocs(contactsQuery),
            getDocs(recentVideosQuery),
        ]);
        
        const videosCount = videosSnapshot.size;
        const blogCount = blogSnapshot.size;
        const socialLinksCount = socialLinksSnapshot.size;
        
        const recentContacts = contactsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                submittedAt: (data.submittedAt as Timestamp)?.toDate ? (data.submittedAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
            } as ContactSubmission;
        });

        const recentVideos = recentVideosSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
            } as VideoType;
        });

        setData({ videosCount, blogCount, socialLinksCount, recentContacts, recentVideos });
        setLoading(false);
    };

    fetchData();

    // Set up listeners for real-time updates
    const unsubscribers = [
      onSnapshot(collection(db, 'videos'), () => fetchData()),
      onSnapshot(collection(db, 'blog'), () => fetchData()),
      onSnapshot(collection(db, 'social-links'), () => fetchData()),
      onSnapshot(collection(db, 'contacts'), () => fetchData()),
    ];

    return () => unsubscribers.forEach(unsub => unsub());

  }, []);

  if (loading || !data) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  const { videosCount, blogCount, socialLinksCount, recentContacts, recentVideos } = data;
  
  const stats = [
    { title: "YouTube Videos", value: videosCount, icon: Video },
    { title: "Blog Posts", value: blogCount, icon: Newspaper },
    { title: "Social Links", value: socialLinksCount, icon: LinkIcon },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {recentVideos.length > 0 ? (
                <div className="space-y-4">
                  {recentVideos.map(video => (
                    <Link href={`/admin/videos/edit/${video.id}`} key={video.id} className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <Image 
                        src={video.thumbnailUrl || "https://placehold.co/120x68"} 
                        alt={video.title}
                        width={80}
                        height={45}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold line-clamp-1">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(video.createdAt), 'PPP')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No videos found.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
               {recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map(contact => (
                    <Link href="/admin/contacts" key={contact.id} className="flex items-start gap-4 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(contact.submittedAt), 'PPP')}</p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{contact.subject || "No Subject"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No contact submissions found.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
