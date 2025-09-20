
"use server";

import { suggestBioUpdates, type SuggestBioUpdatesInput } from "@/ai/flows/suggest-bio-updates";
import { fetchYouTubeDetails as fetchYouTubeDetailsFlow, type FetchYouTubeDetailsOutput } from "@/ai/flows/fetch-youtube-details";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

const musicTrackSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  musicUrl: z.string().url("Please enter a valid URL."),
  coverImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  isPublished: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

export type MusicTrackFormValues = z.infer<typeof musicTrackSchema>;

export async function addMusicTrack(values: MusicTrackFormValues) {
    try {
        await addDoc(collection(db, 'music'), {
            ...values,
            createdAt: serverTimestamp(),
        });
        
        revalidatePath('/music');
        revalidatePath('/admin/music');
        
        return { success: true, message: "Successfully added new music track." };

    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to add music track." };
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
  videoUrl: z.string().url("Please enter a valid YouTube URL."),
  description: z.string().optional(),
  tags: z.string().optional(),
  thumbnailUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  isPublished: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export async function addVideo(values: VideoFormValues) {
  try {
    await addDoc(collection(db, 'videos'), {
      ...values,
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
