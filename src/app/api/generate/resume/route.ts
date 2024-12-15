import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchGitHubData } from '@/services/github';
import { fetchJobData } from '@/services/job';

async function generateSummary(jobUrl: string) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
    
  const response = await fetch(`${baseUrl}/api/generate-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobUrl })
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let summary = '';

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    summary += decoder.decode(value);
  }

  return summary.trim();
}

export async function POST(req: Request) {
  try {
    const { githubUsername, jobUrl } = await req.json();
    console.log('Received request:', { githubUsername, jobUrl });

    const [githubData, jobData, summary] = await Promise.all([
      fetchGitHubData(githubUsername),
      fetchJobData(jobUrl),
      generateSummary(jobUrl)
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