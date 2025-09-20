
'use server';

/**
 * @fileOverview A flow to fetch details from a YouTube video URL.
 *
 * - fetchYouTubeDetails - Fetches title, description, and thumbnail from a YouTube URL.
 * - FetchYouTubeDetailsInput - The input type for the fetchYouTubeDetails flow.
 * - FetchYouTubeDetailsOutput - The return type for the fetchYouTubeDetails flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchYouTubeDetailsInputSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the YouTube video.'),
});
export type FetchYouTubeDetailsInput = z.infer<typeof FetchYouTubeDetailsInputSchema>;

const FetchYouTubeDetailsOutputSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  description: z.string().describe('The description of the YouTube video.'),
  thumbnailUrl: z.string().url().describe('The URL of the high-quality thumbnail image.'),
});
export type FetchYouTubeDetailsOutput = z.infer<typeof FetchYouTubeDetailsOutputSchema>;

export async function fetchYouTubeDetails(
  input: FetchYouTubeDetailsInput
): Promise<FetchYouTubeDetailsOutput> {
  return fetchYouTubeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchYouTubeDetailsPrompt',
  input: { schema: FetchYouTubeDetailsInputSchema },
  output: { schema: FetchYouTubeDetailsOutputSchema },
  prompt: `You are an expert at extracting information from web pages.
    Given the following YouTube video URL, extract the video title, description, and the highest quality thumbnail URL.

    YouTube Video URL: {{{videoUrl}}}
    
    Analyze the content of the linked page to find the requested information.
    The thumbnail URL should be for the highest resolution available (e.g., maxresdefault.jpg).
    `,
});

const fetchYouTubeDetailsFlow = ai.defineFlow(
  {
    name: 'fetchYouTubeDetailsFlow',
    inputSchema: FetchYouTubeDetailsInputSchema,
    outputSchema: FetchYouTubeDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
