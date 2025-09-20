
"use client";

import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/admin-types";
import { BlogList } from "./blog-list";

export function BlogPageClient({ initialPosts }: { initialPosts: BlogPost[] }) {
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

      <BlogList initialPosts={initialPosts} />
      
    </div>
  );
}
