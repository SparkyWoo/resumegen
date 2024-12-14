import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { githubUsername } = await req.json();
    console.log('Scraping GitHub for:', githubUsername);
    
    // Fetch user's repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'InstantResume',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }
    );

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text();
      console.error('GitHub API error:', {
        status: reposResponse.status,
        statusText: reposResponse.statusText,
        body: errorText
      });
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();

    // Process and format the data
    const githubData = {
      repositories: repos.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      })),
    };

    return NextResponse.json(githubData);
  } catch (error: any) {
    console.error('GitHub scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error.message },
      { status: 500 }
    );
  }
} 