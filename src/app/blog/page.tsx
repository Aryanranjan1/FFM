
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import type { BlogPost } from "@/lib/admin-types";
import { BlogPageClient } from "./_components/blog-page-client";

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
          : new Date().toISOString(),
      } as BlogPost;
    });
    return postsData;
}


export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogPageClient initialPosts={posts} />;
}
