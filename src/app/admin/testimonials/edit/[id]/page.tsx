
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import type { Testimonial } from "@/lib/admin-types";
import { TestimonialForm } from "../../_components/testimonial-form";
import { notFound } from "next/navigation";

async function getTestimonial(id: string): Promise<Testimonial | null> {
  const testimonialRef = doc(db, 'testimonials', id);
  const testimonialSnap = await getDoc(testimonialRef);

  if (!testimonialSnap.exists()) {
    return null;
  }
  
  const data = testimonialSnap.data();
  return { 
    id: testimonialSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(),
  } as Testimonial;
}


export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await getTestimonial(params.id);

  if (!testimonial) {
    notFound();
  }

  return (
      <TestimonialForm testimonial={testimonial} />
  );
}
