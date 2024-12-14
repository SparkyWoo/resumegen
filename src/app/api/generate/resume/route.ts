import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchGitHubData } from '@/services/github';
import { fetchJobData } from '@/services/job';

export async function POST(req: Request) {
  try {
    const { githubUsername, jobUrl } = await req.json();
    console.log('Received request:', { githubUsername, jobUrl });

    const [githubData, jobData] = await Promise.all([
      fetchGitHubData(githubUsername),
      fetchJobData(jobUrl)
    ]);

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
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume', details: error.message },
      { status: 500 }
    );
  }
} 