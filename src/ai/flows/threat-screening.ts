'use server';
/**
 * @fileOverview Implements AI-powered threat screening for uploaded files.
 *
 * - threatScreen - Screens uploaded files for potential security threats.
 * - ThreatScreenInput - The input type for the threatScreen function.
 * - ThreatScreenOutput - The return type for the threatScreen function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThreatScreenInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to be screened.'),
  fileName: z.string().describe('The name of the file being screened.'),
});
export type ThreatScreenInput = z.infer<typeof ThreatScreenInputSchema>;

const ThreatScreenOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the file is considered safe.'),
  reason: z.string().describe('The reason for the safety determination.'),
  flaggedContent: z.string().optional().describe('If not safe, content of concern.'),
});
export type ThreatScreenOutput = z.infer<typeof ThreatScreenOutputSchema>;

export async function threatScreen(input: ThreatScreenInput): Promise<ThreatScreenOutput> {
  return threatScreenFlow(input);
}

const threatScreenPrompt = ai.definePrompt({
  name: 'threatScreenPrompt',
  input: {schema: ThreatScreenInputSchema},
  output: {schema: ThreatScreenOutputSchema},
  prompt: `You are a security expert analyzing files for potential threats.

  Analyze the following file content and determine if it contains any malicious code,
  exploits, or other security vulnerabilities.

  Respond with a JSON object that explains the security status of the file.
  Set isSafe to true if the file is safe, and false otherwise.
  Provide a detailed reason for your determination.
  If isSafe is false, include any flaggedContent from the file that is considered suspect.

  File Name: {{{fileName}}}
  File Content:
  {{#if fileContent}}
  {{{fileContent}}}
  {{else}}
  File content is empty.
  {{/if}}
  `,
});

const threatScreenFlow = ai.defineFlow(
  {
    name: 'threatScreenFlow',
    inputSchema: ThreatScreenInputSchema,
    outputSchema: ThreatScreenOutputSchema,
  },
  async input => {
    const {output} = await threatScreenPrompt(input);
    return output!;
  }
);

