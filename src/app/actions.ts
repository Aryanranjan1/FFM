
"use server";

import { suggestBioUpdates, type SuggestBioUpdatesInput } from "@/ai/flows/suggest-bio-updates";
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
  errors: {
    title?: string[];
    musicUrl?: string[];
    coverImageUrl?: string[];
    isFeatured?: string[];
    isPublished?: string[];
    _form?: string[];
  };
  message: string | null;
};

export async function addMusicTrack(prevState: any, formData: FormData): Promise<AddMusicTrackState> {
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

        revalidatePath('/music');
        revalidatePath('/admin/music');

        return {
            message: "Successfully added new music track.",
            errors: {},
        };
    } catch (e) {
        console.error(e);
        return {
            errors: { _form: ["Something went wrong. Please try again."] },
            message: "Failed to add music track.",
        };
    }
}
