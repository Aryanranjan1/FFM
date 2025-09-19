'use server';

/**
 * @fileOverview Provides AI-driven suggestions for updating an artist's biography.
 *
 * - suggestBioUpdates -  A function that suggests updates to the artist's biography.
 * - SuggestBioUpdatesInput - The input type for the suggestBioUpdates function.
 * - SuggestBioUpdatesOutput - The return type for the suggestBioUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBioUpdatesInputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  latestWorkDescription: z
    .string()
    .describe("A description of the artist's latest work and style."),
  currentBio: z.string().describe('The artist current biography.'),
});
export type SuggestBioUpdatesInput = z.infer<typeof SuggestBioUpdatesInputSchema>;

const SuggestBioUpdatesOutputSchema = z.object({
  suggestedUpdates: z
    .string()
    .describe('AI-suggested updates to the artist biography.'),
  marketingHooks: z
    .string()
    .describe("Optional marketing hooks that can be used in the artist's bio."),
});
export type SuggestBioUpdatesOutput = z.infer<typeof SuggestBioUpdatesOutputSchema>;

export async function suggestBioUpdates(
  input: SuggestBioUpdatesInput
): Promise<SuggestBioUpdatesOutput> {
  return suggestBioUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBioUpdatesPrompt',
  input: {schema: SuggestBioUpdatesInputSchema},
  output: {schema: SuggestBioUpdatesOutputSchema},
  prompt: `You are an AI assistant helping artists update their biographies to be more engaging.

  Given the artist's name, a description of their latest work and style, and their current biography, suggest updates to the biography and suggest marketing hooks to include.

  Artist Name: {{{artistName}}}
  Latest Work Description: {{{latestWorkDescription}}}
  Current Biography: {{{currentBio}}}

  Suggested Updates:
  Marketing Hooks: `,
});

const suggestBioUpdatesFlow = ai.defineFlow(
  {
    name: 'suggestBioUpdatesFlow',
    inputSchema: SuggestBioUpdatesInputSchema,
    outputSchema: SuggestBioUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
