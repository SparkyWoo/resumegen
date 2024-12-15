import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
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

async function generateSkills(jobData: any) {
  try {
    console.log('Starting skills generation...');
    
    // Create a prompt that focuses on extracting relevant skills
    const prompt = `Extract a list of 10-15 most relevant technical and professional skills for this job posting. Format the response as a single-line JSON array of strings, with skills separated by commas. Focus on specific, concrete skills (e.g., "Python", "Agile Project Management") rather than general qualities. Consider both explicit requirements and implicit needs based on the role.

Job Title: ${jobData.title}
Job Description:
${jobData.description}
Requirements:
${jobData.requirements?.join(', ')}

Return only the JSON array in a single line, like this: ["Skill 1", "Skill 2", "Skill 3"]`;

    // Generate skills using Claude
    console.log('Calling Anthropic API for skills...');
    const response = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      temperature: 0.5,
    });

    const skillsText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    try {
      // Parse the JSON array from the response
      const skills = JSON.parse(skillsText);
      if (Array.isArray(skills)) {
        return skills;
      }
      throw new Error('Skills response is not an array');
    } catch (error) {
      console.error('Error parsing skills JSON:', error);
      // Fallback: try to extract skills from text if JSON parsing fails
      return skillsText
        .replace(/[\[\]"]/g, '')
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
  } catch (error) {
    console.error('Error in generateSkills:', error);
    return [];
  }
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

    // Extract and trim relevant text from the HTML
    const textContent = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000);

    // Create a more concise prompt
    const prompt = `Write a concise, impactful professional summary (2-3 sentences) for a resume targeting this job. Focus on relevant skills and impact. Don't mention company names.

Job posting:
${textContent}`;

    // Generate summary using Claude
    console.log('Calling Anthropic API for summary...');
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

    // Generate skills based on job data
    console.log('Generating skills...');
    const skills = await generateSkills(jobData);
    console.log('Generated skills:', skills);

    console.log('Saving resume to Supabase...');
    const { data: resume, error: resumeError } = await supabaseAdmin
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
        skills: skills, // Use the generated skills
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