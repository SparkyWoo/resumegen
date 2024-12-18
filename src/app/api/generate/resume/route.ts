import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchGitHubData } from '@/services/github';
import { fetchJobData } from '@/services/job';
import { Anthropic } from '@anthropic-ai/sdk';
import crypto from 'crypto';

// Import PDF.js with proper Node.js configuration
import * as pdfjs from 'pdfjs-dist/build/pdf.min.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

async function initPDFWorker() {
  await import('pdfjs-dist/build/pdf.worker.min.mjs');
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Generate a UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

async function extractWorkExperience(pdfText: string) {
  // Common section headers for work experience
  const sectionHeaders = [
    'work history',
    'employment history',
    'work experience',
    'professional experience',
    'experience',
    'employment',
    'career history'
  ];

  // Find the work experience section
  const lowerText = pdfText.toLowerCase();
  let startIndex = -1;
  let matchedHeader = '';

  for (const header of sectionHeaders) {
    const index = lowerText.indexOf(header);
    if (index !== -1 && (startIndex === -1 || index < startIndex)) {
      startIndex = index;
      matchedHeader = header;
    }
  }

  if (startIndex === -1) {
    return null;
  }

  // Extract the section content (until the next section or end of text)
  const nextSectionHeaders = ['education', 'skills', 'projects', 'certifications', 'awards'];
  let endIndex = pdfText.length;

  for (const header of nextSectionHeaders) {
    const index = lowerText.indexOf(header, startIndex + matchedHeader.length);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  return pdfText.slice(startIndex, endIndex).trim();
}

async function improveWorkExperience(workExperience: string, jobData: any) {
  try {
    const prompt = `You are a professional resume writer. Improve these work experience bullet points to precisely match this job posting's requirements while maintaining truthfulness. Focus on:

1. Key requirements from the job posting
2. Technical skills and tools mentioned in the job description
3. Quantifiable achievements and metrics that demonstrate relevant expertise
4. Leadership and soft skills that match the role
5. Industry-specific terminology from the job posting

Job Title: ${jobData.title}

Job Description:
${jobData.description?.slice(0, 500)}

Key Requirements:
${jobData.requirements?.join('\n')}

Original Work Experience:
${workExperience}

Instructions:
- Keep company names, positions, and dates exactly as they are
- Transform each bullet point to directly address a job requirement
- Add specific metrics and achievements that demonstrate required skills
- Use keywords and terminology from the job posting
- Maintain truthfulness while highlighting relevant experience
- Focus on achievements that match the role's technical requirements
- Limit each bullet point to 1-2 lines for readability

Return the improved work experience in this exact format for each role:
Company: [Name]
Position: [Title]
Dates: [Start] - [End]
Highlights:
• [Improved bullet point targeting specific job requirement]
• [Improved bullet point showcasing relevant technical skill]
...`;

    const response = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.5,
    });

    const improvedContent = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse the improved content into structured work experience
    const workEntries = improvedContent.split(/\n\n(?=Company:)/);
    const structuredWork = workEntries
      .map(entry => {
        const lines = entry.split('\n');
        const company = lines.find(l => l.startsWith('Company:'))?.replace('Company:', '').trim() || '';
        const position = lines.find(l => l.startsWith('Position:'))?.replace('Position:', '').trim() || '';
        const dates = lines.find(l => l.startsWith('Dates:'))?.replace('Dates:', '').trim() || '';
        const [startDate, endDate] = dates.split('-').map(d => d.trim());
        
        const highlightsStart = lines.findIndex(l => l.startsWith('Highlights:'));
        const highlights = lines.slice(highlightsStart + 1)
          .filter(l => l.trim().startsWith('•'))
          .map(l => l.replace('•', '').trim());

        return {
          company,
          position,
          startDate,
          endDate,
          highlights
        };
      })
      .filter(entry => entry.company && entry.position && entry.highlights.length > 0);

    return structuredWork;
  } catch (error) {
    console.error('Error improving work experience:', error);
    return null;
  }
}

async function generateSkills(jobData: any) {
  try {
    console.log('Starting skills generation...');
    
    const prompt = `You are a professional resume writer. Extract 8-10 most relevant skills from this job posting for a resume's skills section. 

Focus on concrete abilities and competencies ONLY:
1. Technical Skills: Specific tools, technologies, programming languages, or platforms mentioned
2. Domain Knowledge: Industry-specific systems, frameworks, or standards
3. Methodologies & Practices: Development approaches, best practices, or processes
4. Core Competencies: Essential professional abilities required for the role

DO NOT include:
- Education requirements
- Years of experience
- Certifications
- Job titles
- Industry knowledge
- Qualifications
- Any introductory phrases like "Based on" or "The skills are"

Job Title: ${jobData.title}
Description: ${jobData.description?.slice(0, 500)}

IMPORTANT: Return ONLY a comma-separated list with NO introduction or explanation.`;

    console.log('Calling Anthropic API for skills...');
    const response = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      temperature: 0.1,
    });

    const skillsText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    return skillsText
      .replace(/^[^,]+(,|$)/, '$1')
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 30);
  } catch (error) {
    console.error('Error in generateSkills:', error);
    return [];
  }
}

async function generateSummary(jobData: any) {
  try {
    console.log('Starting summary generation...');
    
    const prompt = `You are a professional resume writer crafting a targeted summary for a job application. Create a concise, impactful summary that demonstrates alignment with this specific role.

Job Title: ${jobData.title}

Job Description:
${jobData.description?.slice(0, 1000)}

Requirements:
${jobData.requirements?.join('\n')}

Write a 2-3 sentence professional summary that:
1. Highlights relevant experience and expertise that directly matches the job requirements
2. Uses specific, quantifiable achievements when possible
3. Incorporates key technical skills and domain knowledge from the job posting
4. Demonstrates understanding of the company's needs
5. Uses active voice and strong action verbs
6. Avoids generic statements that could apply to any job

DO NOT:
- Use first person pronouns (I, my, etc.)
- Include objectives or career goals
- Mention years of experience
- Use cliché phrases like "results-driven" or "team player"
- Make it longer than 3 sentences
- Include any introductory phrases

Example format:
"Software engineer specializing in distributed systems and cloud architecture, with proven expertise in designing and scaling microservices on AWS. Led development of mission-critical applications processing over 1M transactions daily while maintaining 99.99% uptime. Demonstrated track record of optimizing system performance and reducing infrastructure costs through innovative architectural solutions."

Return ONLY the summary text with NO additional context or explanation.`;

    console.log('Calling Anthropic API for summary...');
    const response = await anthropic.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      temperature: 0.5,
    });

    const summaryText = response.content[0].type === 'text' ? response.content[0].text : '';
    return summaryText.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

interface GitHubRepo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

async function processPDF(oldResume: File) {
  const arrayBuffer = await oldResume.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);

  try {
    await initPDFWorker();
    const loadingTask = pdfjs.getDocument({
      data: typedArray,
      cMapUrl: undefined,
      cMapPacked: true
    });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += text + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
}

export async function POST(req: Request) {
  console.log('Starting resume generation...');
  try {
    const formData = await req.formData();
    const jobUrl = formData.get('jobUrl') as string;
    const userId = formData.get('userId') as string;
    const userData = JSON.parse(formData.get('userData') as string);
    const oldResume = formData.get('oldResume') as File | null;

    console.log('Processing request for:', { jobUrl, userId, userData });

    // Parse old resume if provided
    let existingWorkExperience = null;
    if (oldResume) {
      const fullText = await processPDF(oldResume);
      existingWorkExperience = await extractWorkExperience(fullText);
    }

    // Fetch job data
    console.log('Fetching job data...');
    const jobData = await fetchJobData(jobUrl);
    console.log('Job data fetched successfully');

    // Generate summary and skills based on job data
    console.log('Generating summary...');
    const summary = await generateSummary(jobData);
    console.log('Generated summary:', summary);

    console.log('Generating skills...');
    const skills = await generateSkills(jobData);
    console.log('Generated skills:', skills);

    // Fetch GitHub data if username provided
    let githubData = null;
    if (userData.githubUsername) {
      console.log('Fetching GitHub data...');
      githubData = await fetchGitHubData(userData.githubUsername);
      console.log('GitHub data fetched successfully');
    }

    // Map GitHub repositories to projects
    const projects = githubData?.repositories?.map((repo: GitHubRepo) => ({
      name: repo.name,
      url: repo.url,
      highlights: [repo.description || `A ${repo.language || 'software'} project`]
    })) || [];

    // Process work experience
    let workExperience: WorkExperience[] = [];
    if (existingWorkExperience) {
      console.log('Improving existing work experience...');
      workExperience = (await improveWorkExperience(existingWorkExperience, jobData)) || [];
    }

    console.log('Saving resume to Supabase...');
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id: userId,
        name: userData.name,
        email: userData.email,
        job_data: jobData,
        summary: summary,
        generated_content: {},
        created_at: new Date().toISOString(),
        phone: '',
        location: '',
        url: '',
        work: workExperience,
        education: [],
        skills: skills,
        projects: projects,
        github_data: githubData,
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