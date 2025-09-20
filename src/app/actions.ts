
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
  coverImageUrl: z.string().url("Please enter a valid URL for the cover image.").optional().or(z.literal('')),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
  isPublished: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

export type AddMusicTrackState = {
  errors?: {
    title?: string[];
    musicUrl?: string[];
    coverImageUrl?: string[];
    isFeatured?: string[];
    isPublished?: string[];
    _form?: string[];
  };
  message: string | null;
};

export async function addMusicTrack(prevState: AddMusicTrackState, formData: FormData): Promise<AddMusicTrackState> {
    const validatedFields = musicTrackSchema.safeParse({
        title: formData.get('title'),
        musicUrl: formData.get('musicUrl'),
        coverImageUrl: formData.get('coverImageUrl'),
        isFeatured: formData.get('isFeatured'),
        isPublished: formData.get('isPublished'),
    });
    
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Validation failed. Please check your input.',
        };
    }

    try {
        await addDoc(collection(db, 'music'), {
            ...validatedFields.data,
            createdAt: serverTimestamp(),
        });

    } catch (e) {
        console.error(e);
        return {
            errors: { _form: ["Something went wrong. Please try again."] },
            message: "Failed to add music track.",
        };
    }

    try {
        revalidatePath('/music');
        revalidatePath('/admin/music');
    } catch (error) {
        console.error("Failed to revalidate paths:", error);
    }
    

    return {
        message: "Successfully added new music track.",
        errors: {},
    };
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

export type AddVideoState = {
  errors?: {
    title?: string[];
    videoUrl?: string[];
    description?: string[];
    tags?: string[];
    thumbnailUrl?: string[];
    isPublished?: string[];
    isFeatured?: string[];
    _form?: string[];
  };
  message: string | null;
};

export async function addVideo(prevState: AddVideoState, formData: FormData): Promise<AddVideoState> {
  const validatedFields = videoSchema.safeParse({
    title: formData.get('title'),
    videoUrl: formData.get('videoUrl'),
    description: formData.get('description'),
    tags: formData.get('tags'),
    thumbnailUrl: formData.get('thumbnailUrl'),
    isPublished: formData.get('isPublished'),
    isFeatured: formData.get('isFeatured'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }

  try {
    await addDoc(collection(db, 'videos'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error(e);
    return {
      errors: { _form: ["Something went wrong. Please try again."] },
      message: "Failed to add video.",
    };
  }

  try {
    revalidatePath('/videos');
    revalidatePath('/admin/videos');
  } catch (error) {
    console.error("Failed to revalidate paths:", error);
  }

  return { message: "Successfully added new video.", errors: {} };
}
