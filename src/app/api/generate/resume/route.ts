import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { githubUsername, jobUrl } = await req.json();
    console.log('Received request:', { githubUsername, jobUrl });

    // Get the full URL for API calls
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';

    console.log('Using base URL:', baseUrl);

    // Fetch GitHub data directly
    const githubResponse = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'InstantResume',
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API error: ${githubResponse.status}`);
    }

    const githubData = await githubResponse.json();
    console.log('GitHub data fetched successfully');

    // Fetch job data
    const jobResponse = await fetch(`${baseUrl}/api/scrape/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobUrl }),
    });

    if (!jobResponse.ok) {
      throw new Error(`Job scraping error: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    console.log('Job data fetched successfully');

    // Create resume entry
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        github_data: {
          repositories: githubData.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            url: repo.html_url,
          }))
        },
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