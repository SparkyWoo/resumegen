import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Anthropic client (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Configure route to allow public access
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { jobUrl } = await req.json();
    console.log('Generating summary for job URL:', jobUrl);

    // Fetch job posting content
    console.log('Fetching job posting...');
    const response = await fetch(jobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch job posting: ${response.status}`);
    }
    const html = await response.text();
    console.log('Job posting fetched successfully');

    // Extract relevant text from the HTML (basic extraction)
    const textContent = html
      .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    console.log('Extracted text content length:', textContent.length);

    // Create the prompt for the LLM
    const prompt = `You are a professional resume writer. Based on the following job posting, write a concise, impactful summary (2-3 sentences) that would attract recruiters. Focus on relevant skills and experience that match the job requirements. Make it specific but don't mention the company name.

Job posting:
${textContent}

Write a professional summary that:
1. Highlights relevant technical skills and experience
2. Demonstrates impact and leadership
3. Is concise and specific
4. Uses active voice and strong verbs
5. Avoids clichés and generic statements`;

    console.log('Calling Anthropic API...');
    // Create a streaming response using Anthropic's Claude
    const stream = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      temperature: 0.7,
      stream: true,
    });
    console.log('Anthropic API call successful');

    // Convert the stream to text chunks
    const textEncoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting to process stream...');
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
              controller.enqueue(textEncoder.encode(chunk.delta.text));
            }
          }
          console.log('Stream processing complete');
          controller.close();
        } catch (error) {
          console.error('Error processing stream:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable);

  } catch (error) {
    console.error('Detailed error in summary generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 