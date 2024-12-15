import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchGitHubData } from '@/services/github';
import { fetchJobData } from '@/services/job';
import { Anthropic } from '@anthropic-ai/sdk';
import crypto from 'crypto';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Generate a UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

async function generateSummary(jobUrl: string) {
  try {
    console.log('Starting summary generation...');
    
    // Fetch job posting content
    console.log('Fetching job posting...');
    const response = await fetch(jobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch job posting: ${response.status}`);
    }
    const html = await response.text();

    // Extract relevant text from the HTML
    const textContent = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

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
    console.log('Calling Anthropic API...');
    const response_ai = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      temperature: 0.7,
    }).catch(error => {
      console.error('Anthropic API error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        type: error.type
      });
      throw error;
    });
    console.log('Anthropic API response received');

    const summary = response_ai.content[0].type === 'text' 
      ? response_ai.content[0].text 
      : '';
    return summary.trim();
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  console.log('Starting resume generation...');
  try {
    const { jobUrl, userId, userData } = await req.json();
    console.log('Processing request for:', { jobUrl, userId, userData });

    console.log('Fetching job data...');
    const jobData = await fetchJobData(jobUrl);
    console.log('Job data fetched successfully');

    console.log('Saving resume to Supabase...');
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        name: userData.name,
        email: userData.email,
        job_data: jobData,
        summary: userData.summary || '',
        generated_content: {},
        created_at: new Date().toISOString(),
        // Initialize other required fields with default values
        phone: '',
        location: '',
        url: '',
        work: [],
        education: [],
        skills: [],
        projects: [],
        github_data: null,
        linkedin_data: null,
      })
      .select()
      .single();

    if (resumeError) {
      console.error('Supabase resume error:', resumeError);
      throw resumeError;
    }

    console.log('Resume generated successfully');
    return NextResponse.json(resume);
  } catch (error: any) {
    console.error('Error in resume generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume', details: error.message },
      { status: 500 }
    );
  }
} 