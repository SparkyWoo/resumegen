import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { jobUrl } = await req.json();
    console.log('Scraping job URL:', jobUrl);

    const response = await fetch(jobUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error('Job fetch error:', response.status, response.statusText);
      throw new Error(`Failed to fetch job posting: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract job details (Lever-specific selectors)
    const jobData = {
      title: $('.posting-headline h2').text().trim(),
      description: $('.posting-description').text().trim(),
      requirements: $('.posting-requirements li').map((_, el) => $(el).text().trim()).get(),
      skills: extractSkills($('.posting-description').text()),
    };

    console.log('Job data extracted:', {
      title: jobData.title,
      skillsCount: jobData.skills.length,
    });

    return NextResponse.json(jobData);
  } catch (error: any) {
    console.error('Job scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job data', details: error.message },
      { status: 500 }
    );
  }
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js',
    'aws', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb',
    'rest api', 'graphql', 'git', 'ci/cd', 'agile'
  ];

  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
} 