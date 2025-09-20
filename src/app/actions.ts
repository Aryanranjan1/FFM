

"use server";

import { suggestBioUpdates, type SuggestBioUpdatesInput } from "@/ai/flows/suggest-bio-updates";
import { fetchYouTubeDetails as fetchYouTubeDetailsFlow, type FetchYouTubeDetailsOutput } from "@/ai/flows/fetch-youtube-details";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getBioSuggestions(input: SuggestBioUpdatesInput) {
  try {
    const result = await suggestBioUpdates(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get suggestions. Please try again." };
  }
}

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }
  
  try {
    await addDoc(collection(db, "contacts"), {
      ...validatedFields.data,
      submittedAt: serverTimestamp(),
    });
    revalidatePath("/admin/contacts");
    return {
      message: "Thank you for your message! We'll get back to you soon.",
      errors: {}
    };
  } catch (error) {
    console.error("Error saving contact form submission:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      errors: {}
    }
  }
}

export async function fetchYouTubeDetails(videoUrl: string): Promise<{ success: boolean, data?: FetchYouTubeDetailsOutput, error?: string }> {
  try {
    const result = await fetchYouTubeDetailsFlow({ videoUrl });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to fetch YouTube details: ${errorMessage}` };
  }
}

const videoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  videoId: z.string().min(11, "Please enter a valid YouTube URL or Video ID."),
  isPublished: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  category: z.string().optional(),
  thumbnailUrl: z.string().url("Please provide a thumbnail URL").optional().or(z.literal('')),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

const getYouTubeId = (urlOrId: string): string | null => {
    if (!urlOrId) return null;
    if (urlOrId.length === 11 && !urlOrId.includes('/')) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

async function prepareVideoData(values: VideoFormValues) {
    const videoId = getYouTubeId(values.videoId);
    if (!videoId) {
        throw new Error("Invalid YouTube URL or Video ID");
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnailUrl = values.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    return {
      title: values.title,
      videoUrl,
      thumbnailUrl,
      isPublished: values.isPublished,
      isFeatured: values.isFeatured,
      category: values.category,
    };
}


export async function addVideo(values: VideoFormValues) {
  try {
    const videoData = await prepareVideoData(values);
    await addDoc(collection(db, 'videos'), {
      ...videoData,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    
    return { success: true, message: "Successfully added new video." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to add video." };
  }
}

export async function updateVideo(id: string, values: VideoFormValues) {
  try {
    const videoData = await prepareVideoData(values);
    const videoRef = doc(db, 'videos', id);
    await updateDoc(videoRef, videoData);
    
    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    revalidatePath(`/admin/videos/edit/${id}`);
    
    return { success: true, message: "Successfully updated video." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to update video." };
  }
}

export async function deleteVideo(id: string) {
  try {
    await deleteDoc(doc(db, 'videos', id));
    
    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    
    return { success: true, message: "Successfully deleted video." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete video." };
  }
}

// Testimonial Actions
const testimonialSchema = z.object({
    author: z.string().min(2, "Author is required."),
    publication: z.string().min(2, "Publication/Role is required."),
    quote: z.string().min(10, "Quote must be at least 10 characters."),
});
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export async function addTestimonial(values: TestimonialFormValues) {
    try {
        await addDoc(collection(db, 'testimonials'), { ...values, createdAt: serverTimestamp() });
        revalidatePath('/admin/testimonials');
        return { success: true, message: "Testimonial added successfully." };
    } catch (e) {
        return { success: false, message: "Failed to add testimonial." };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await deleteDoc(doc(db, 'testimonials', id));
        revalidatePath('/admin/testimonials');
        return { success: true, message: "Testimonial deleted successfully." };
    } catch (e) {
        return { success: false, message: "Failed to delete testimonial." };
    }
}

// Social Link Actions
const socialLinkSchema = z.object({
    platform: z.string().min(2, "Platform is required."),
    url: z.string().url("A valid URL is required."),
});
export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

export async function addSocialLink(values: SocialLinkFormValues) {
    try {
        await addDoc(collection(db, 'social-links'), { ...values, createdAt: serverTimestamp() });
        revalidatePath('/admin/social-links');
        return { success: true, message: "Social link added successfully." };
    } catch (e) {
        return { success: false, message: "Failed to add social link." };
    }
}

export async function deleteSocialLink(id: string) {
    try {
        await deleteDoc(doc(db, 'social-links', id));
        revalidatePath('/admin/social-links');
        return { success: true, message: "Social link deleted successfully." };
    } catch (e) {
        return { success: false, message: "Failed to delete social link." };
    }
}


// Blog Post Actions
const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().min(2, "Category is required."),
  tags: z.string().optional(),
  coverImageUrl: z.string().url("A valid URL is required.").optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export async function addBlogPost(values: BlogPostFormValues) {
  try {
    await addDoc(collection(db, 'blog'), {
      ...values,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true, message: "Blog post added successfully." };
  } catch (e) {
    console.error("Error adding blog post:", e);
    return { success: false, message: "Failed to add blog post." };
  }
}

export async function updateBlogPost(id: string, values: BlogPostFormValues) {
  try {
    const postRef = doc(db, 'blog', id);
    await updateDoc(postRef, values);
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/edit/${id}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    return { success: true, message: "Blog post updated successfully." };
  } catch (e) {
    console.error("Error updating blog post:", e);
    return { success: false, message: "Failed to update blog post." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await deleteDoc(doc(db, 'blog', id));
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true, message: "Blog post deleted successfully." };
  } catch (e) {
    return { success: false, message: "Failed to delete blog post." };
  }
}

// Site Settings Actions
const siteSettingsSchema = z.object({
    email: z.string().email("Invalid email address.").optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
});
export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export async function updateSiteSettings(values: SiteSettingsFormValues) {
    try {
        const settingsRef = doc(db, 'settings', 'site');
        await updateDoc(settingsRef, values, { merge: true });
        revalidatePath('/');
        return { success: true, message: "Settings updated successfully." };
    } catch (error) {
        // If the document doesn't exist, create it.
        if ((error as any).code === 'not-found') {
            try {
                const settingsRef = doc(db, 'settings', 'site');
                await addDoc(collection(db, 'settings'), values);
                revalidatePath('/');
                return { success: true, message: "Settings saved successfully." };
            } catch (e) {
                 return { success: false, message: "Failed to save settings." };
            }
        }
        return { success: false, message: "Failed to update settings." };
    }
}

export async function getSiteSettings() {
    try {
        const settingsRef = doc(db, 'settings', 'site');
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists()) {
            return docSnap.data() as SiteSettingsFormValues;
        }
        return { email: 'contact@fahmiefarhan.com', phone: '+60 11-31377753', location: 'Malaysia' }; // Default values
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return { email: 'contact@fahmiefarhan.com', phone: '+60 11-31377753', location: 'Malaysia' }; // Default values
    }
}
