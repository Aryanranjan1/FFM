'use server';

/**
 * @fileOverview Provides AI-powered suggestions for project descriptions.
 *
 * - suggestProjectDescriptions - A function that suggests project descriptions.
 * - SuggestProjectDescriptionsInput - The input type for the suggestProjectDescriptions function.
 * - SuggestProjectDescriptionsOutput - The return type for the suggestProjectDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectDescriptionsInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDetails: z
    .string()
    .describe('Detailed information about the project including its goals, the process, and unique aspects.'),
  artistStyle: z
    .string()
    .describe(
      "The artist's style, including genres, influences, and unique artistic characteristics."
    ),
  targetAudience: z
    .string()
    .describe(
      'Description of the target audience including demographics, interests, and preferences.'
    ),
});

export type SuggestProjectDescriptionsInput = z.infer<
  typeof SuggestProjectDescriptionsInputSchema
>;

const SuggestProjectDescriptionsOutputSchema = z.object({
  suggestedDescriptions: z
    .array(z.string())
    .describe('An array of suggested project descriptions.'),
  marketingHooks: z
    .array(z.string())
    .describe(
      'An array of suggested marketing hooks to promote the project effectively.'
    ),
});

export type SuggestProjectDescriptionsOutput = z.infer<
  typeof SuggestProjectDescriptionsOutputSchema
>;

export async function suggestProjectDescriptions(
  input: SuggestProjectDescriptionsInput
): Promise<SuggestProjectDescriptionsOutput> {
  return suggestProjectDescriptionsFlow(input);
}

const suggestProjectDescriptionsPrompt = ai.definePrompt({
  name: 'suggestProjectDescriptionsPrompt',
  input: {schema: SuggestProjectDescriptionsInputSchema},
  output: {schema: SuggestProjectDescriptionsOutputSchema},
  prompt: `You are an AI assistant helping an artist generate compelling descriptions and marketing hooks for their new projects.

  The artist will provide information about the project, their style, and their target audience. Your task is to generate a list of suggested project descriptions and marketing hooks that highlight the unique aspects of the project and appeal to the target audience.

  Here are the details of the project:
  Project Name: {{projectName}}
  Project Details: {{projectDetails}}
  Artist Style: {{artistStyle}}
  Target Audience: {{targetAudience}}

  Please provide a list of 3 suggested project descriptions and 3 marketing hooks. The descriptions should be concise, engaging, and highlight the key aspects of the project. The marketing hooks should be attention-grabbing and designed to promote the project effectively.
  Descriptions:
  1.
  2.
  3.
  Marketing Hooks:
  1.
  2.
  3.`,
});

const suggestProjectDescriptionsFlow = ai.defineFlow(
  {
    name: 'suggestProjectDescriptionsFlow',
    inputSchema: SuggestProjectDescriptionsInputSchema,
    outputSchema: SuggestProjectDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await suggestProjectDescriptionsPrompt(input);
    return output!;
  }
);
