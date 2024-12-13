import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { jobUrl } = await req.json();
    
    const response = await fetch(jobUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch job posting');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract job details (this is a basic implementation)
    const jobData = {
      title: $('h1').first().text().trim(),
      description: $('[class*="description" i]').text().trim(),
      requirements: $('[class*="requirements" i] li').map((_, el) => $(el).text().trim()).get(),
      skills: extractSkills($('body').text()),
    };

    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Job scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job data' },
      { status: 500 }
    );
  }
}

// Basic skill extraction function
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