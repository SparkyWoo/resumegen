import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Anthropic client (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { jobUrl } = await req.json();

    // Fetch job posting content
    const response = await fetch(jobUrl);
    const html = await response.text();

    // Extract relevant text from the HTML (basic extraction)
    const textContent = html
      .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();

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

    // Create a streaming response using Anthropic's Claude
    const stream = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      temperature: 0.7,
      stream: true,
    });

    // Convert the stream to text chunks
    const textEncoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
            controller.enqueue(textEncoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable);

  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 