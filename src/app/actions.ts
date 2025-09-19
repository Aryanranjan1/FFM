"use server";

import { suggestBioUpdates, type SuggestBioUpdatesInput } from "@/ai/flows/suggest-bio-updates";
import { z } from "zod";

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
  
  // Here you would typically send an email or save to a database.
  // For this example, we'll just log it.
  console.log("Contact form submitted:", validatedFields.data);

  return {
    message: "Thank you for your message! We'll get back to you soon.",
    errors: {}
  };
}
