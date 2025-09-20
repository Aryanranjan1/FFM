
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import type { BlogPost } from "@/lib/admin-types";
import { BlogPostForm } from "../../_components/blog-post-form";
import { notFound } from "next/navigation";

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


export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
      <BlogPostForm post={post} />
  );
}
