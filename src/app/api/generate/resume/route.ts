import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { githubUsername, jobUrl } = await req.json();
    console.log('Received request:', { githubUsername, jobUrl });

    // Fetch GitHub data
    const githubResponse = await fetch('/api/scrape/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ githubUsername }),
    });
    const githubData = await githubResponse.json();
    console.log('GitHub data:', githubData);

    // Fetch job data
    const jobResponse = await fetch('/api/scrape/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobUrl }),
    });
    const jobData = await jobResponse.json();
    console.log('Job data:', jobData);

    // Create resume entry
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        github_data: githubData,
        job_data: jobData,
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
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume', details: error.message },
      { status: 500 }
    );
  }
} 