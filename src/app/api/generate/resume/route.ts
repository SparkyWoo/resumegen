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
        user_id: '00000000-0000-0000-0000-000000000000', // Default public user ID
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