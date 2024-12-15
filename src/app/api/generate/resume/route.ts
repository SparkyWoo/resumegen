import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchGitHubData } from '@/services/github';
import { fetchJobData } from '@/services/job';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

async function generateSummary(jobUrl: string) {
  try {
    // Log API key presence (not the actual key)
    console.log('Anthropic API key present:', !!process.env.ANTHROPIC_API_KEY);
    
    // Fetch job posting content
    console.log('Fetching job posting for summary from URL:', jobUrl);
    const response = await fetch(jobUrl);
    if (!response.ok) {
      console.error('Job posting fetch failed:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch job posting: ${response.status}`);
    }
    const html = await response.text();
    console.log('Job posting HTML length:', html.length);

    // Extract relevant text from the HTML
    const textContent = html
      .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    console.log('Extracted text length:', textContent.length);

    // Create the prompt for Claude
    const prompt = `You are a professional resume writer. Based on the following job posting, write a concise, impactful summary (2-3 sentences) that would attract recruiters. Focus on relevant skills and experience that match the job requirements. Make it specific but don't mention the company name.

Job posting:
${textContent}

Write a professional summary that:
1. Highlights relevant technical skills and experience
2. Demonstrates impact and leadership
3. Is concise and specific
4. Uses active voice and strong verbs
5. Avoids clichés and generic statements`;

    // Generate summary using Claude
    console.log('Calling Anthropic API with prompt length:', prompt.length);
    try {
      const response_ai = await anthropic.messages.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-sonnet-20240229',
        max_tokens: 150,
        temperature: 0.7,
      });
      console.log('Anthropic API response received:', {
        contentLength: response_ai.content.length,
        firstContentType: response_ai.content[0]?.type
      });

      const summary = response_ai.content[0].type === 'text' 
        ? response_ai.content[0].text 
        : '';
      console.log('Generated summary:', summary);
      return summary.trim();
    } catch (anthropicError: any) {
      console.error('Anthropic API error:', {
        message: anthropicError.message,
        status: anthropicError.status,
        type: anthropicError.type,
        error: anthropicError
      });
      throw anthropicError;
    }
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { githubUsername, jobUrl } = await req.json();
    console.log('Received request:', { githubUsername, jobUrl });

    const [githubData, jobData, summary] = await Promise.all([
      fetchGitHubData(githubUsername),
      fetchJobData(jobUrl),
      generateSummary(jobUrl).catch(error => {
        console.error('Summary generation failed:', error);
        return 'Failed to generate summary. Please try again later.';
      })
    ]);

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: null, // Create as unclaimed resume
        github_data: githubData,
        job_data: jobData,
        summary: summary,
        generated_content: {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(resume);
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume', details: error.message },
      { status: 500 }
    );
  }
} 