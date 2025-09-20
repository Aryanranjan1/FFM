
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import type { BlogPost } from "@/lib/admin-types";
import { BlogList } from "./_components/blog-list";

async function getPosts(): Promise<BlogPost[]> {
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
    return postsData;
}


export default async function BlogPage() {
  const posts = await getPosts();

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

      <BlogList initialPosts={posts} />
      
    </div>
  );
}
