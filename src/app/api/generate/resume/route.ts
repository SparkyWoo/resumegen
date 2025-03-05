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
  stars: number;
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
  console.log('Resume generation API called');
  try {
    console.log('Parsing form data...');
    const formData = await req.formData();
    
    // Extract and validate form data
    const jobUrl = formData.get('jobUrl') as string;
    const userId = formData.get('userId') as string;
    const userDataRaw = formData.get('userData') as string;
    const oldResume = formData.get('oldResume') as File | null;
    
    console.log('Form data received:', { 
      jobUrl, 
      userId, 
      hasUserData: !!userDataRaw,
      hasOldResume: !!oldResume,
      oldResumeSize: oldResume?.size || 0,
      oldResumeName: oldResume?.name || 'none'
    });
    
    // Validate required fields
    if (!jobUrl) {
      console.error('Missing required field: jobUrl');
      return NextResponse.json(
        { error: 'Missing required field', details: 'Job URL is required' },
        { status: 400 }
      );
    }
    
    if (!userId) {
      console.error('Missing required field: userId');
      return NextResponse.json(
        { error: 'Missing required field', details: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!userDataRaw) {
      console.error('Missing required field: userData');
      return NextResponse.json(
        { error: 'Missing required field', details: 'User data is required' },
        { status: 400 }
      );
    }
    
    // Parse user data
    let userData;
    try {
      userData = JSON.parse(userDataRaw);
      console.log('User data parsed successfully:', {
        name: userData.name,
        email: userData.email,
        hasGithubUsername: !!userData.githubUsername
      });
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
      return NextResponse.json(
        { error: 'Invalid user data', details: 'Failed to parse user data JSON' },
        { status: 400 }
      );
    }

    // Check if user exists in the database
    console.log('Checking if user exists in database...');
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', userCheckError);
      return NextResponse.json(
        { error: 'Database error', details: `Failed to check for existing user: ${userCheckError.message}` },
        { status: 500 }
      );
    }
    
    // If user doesn't exist, create them
    if (!existingUser) {
      console.log('User not found, creating new user record...');
      const { data: newUser, error: userCreateError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (userCreateError) {
        console.error('Error creating user:', userCreateError);
        return NextResponse.json(
          { error: 'Database error', details: `Failed to create user: ${userCreateError.message}` },
          { status: 500 }
        );
      }
      
      console.log('User created successfully:', newUser.id);
    } else {
      console.log('User already exists in database');
    }

    // Parse old resume if provided
    let existingWorkExperience = null;
    if (oldResume) {
      console.log('Processing uploaded resume PDF...');
      try {
        const fullText = await processPDF(oldResume);
        console.log('PDF processed successfully, extracting work experience...');
        existingWorkExperience = await extractWorkExperience(fullText);
        console.log('Work experience extracted:', {
          experienceFound: !!existingWorkExperience,
          length: existingWorkExperience?.length || 0
        });
      } catch (pdfError: any) {
        console.error('Error processing PDF:', {
          message: pdfError.message,
          name: pdfError.name,
          stack: pdfError.stack?.split('\n').slice(0, 3).join('\n')
        });
        // Continue without work experience rather than failing
        console.log('Continuing without work experience from PDF');
      }
    }

    // Fetch job data
    console.log('Fetching job data from URL:', jobUrl);
    let jobData;
    try {
      jobData = await fetchJobData(jobUrl);
      console.log('Job data fetched successfully:', {
        title: jobData.title,
        skillsCount: jobData.skills?.length || 0,
        descriptionLength: jobData.description?.length || 0
      });
    } catch (jobError: any) {
      console.error('Error fetching job data:', {
        message: jobError.message,
        name: jobError.name,
        stack: jobError.stack?.split('\n').slice(0, 3).join('\n')
      });
      return NextResponse.json(
        { error: 'Job data error', details: `Failed to fetch job data: ${jobError.message}` },
        { status: 500 }
      );
    }

    // Generate summary and skills based on job data
    console.log('Generating summary...');
    let summary;
    try {
      summary = await generateSummary(jobData);
      console.log('Summary generated successfully:', {
        length: summary?.length || 0,
        preview: summary?.substring(0, 50) + '...'
      });
    } catch (summaryError: any) {
      console.error('Error generating summary:', {
        message: summaryError.message,
        name: summaryError.name,
        stack: summaryError.stack?.split('\n').slice(0, 3).join('\n')
      });
      return NextResponse.json(
        { error: 'Summary generation error', details: `Failed to generate summary: ${summaryError.message}` },
        { status: 500 }
      );
    }
    
    // Generate skills based on job data
    console.log('Generating skills...');
    let skills;
    try {
      skills = await generateSkills(jobData);
      console.log('Skills generated successfully:', {
        count: skills?.length || 0,
        skills: skills?.slice(0, 5).join(', ') + (skills?.length > 5 ? '...' : '')
      });
    } catch (skillsError: any) {
      console.error('Error generating skills:', {
        message: skillsError.message,
        name: skillsError.name,
        stack: skillsError.stack?.split('\n').slice(0, 3).join('\n')
      });
      return NextResponse.json(
        { error: 'Skills generation error', details: `Failed to generate skills: ${skillsError.message}` },
        { status: 500 }
      );
    }

    // Fetch GitHub data if username provided
    let githubData = null;
    let projects = [];
    
    if (userData.githubUsername) {
      console.log('Fetching GitHub data for username:', userData.githubUsername);
      try {
        githubData = await fetchGitHubData(userData.githubUsername);
        console.log('GitHub data fetched successfully:', {
          reposCount: githubData?.repositories?.length || 0,
          languages: githubData?.repositories?.slice(0, 3).map((repo: GitHubRepo) => repo.language).filter(Boolean).join(', ') || 'none'
        });
        
        // Convert GitHub repositories to projects
        if (githubData?.repositories?.length > 0) {
          console.log('Converting GitHub repositories to projects...');
          projects = githubData.repositories.slice(0, 5).map((repo: GitHubRepo) => ({
            name: repo.name,
            description: repo.description || '',
            url: repo.url,
            highlights: [],
            keywords: [repo.language].filter(Boolean),
            language: repo.language,
            stars: repo.stars
          }));
          console.log(`Converted ${projects.length} repositories to projects`);
        }
      } catch (githubError: any) {
        console.error('Error fetching GitHub data:', {
          message: githubError.message,
          name: githubError.name,
          stack: githubError.stack?.split('\n').slice(0, 3).join('\n')
        });
        // Continue without GitHub data rather than failing
        console.log('Continuing without GitHub data');
      }
    } else {
      console.log('No GitHub username provided, skipping GitHub data fetch');
    }

    // Process work experience
    let workExperience: WorkExperience[] = [];
    if (existingWorkExperience) {
      console.log('Improving existing work experience...');
      workExperience = (await improveWorkExperience(existingWorkExperience, jobData)) || [];
    }

    console.log('Preparing resume data for Supabase insertion...');
    const resumeData = {
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
    };
    
    console.log('Resume data prepared:', JSON.stringify({
      user_id: userId,
      name: userData.name,
      email: userData.email,
      // Log only the structure of larger objects to avoid console clutter
      job_data_keys: Object.keys(jobData || {}),
      summary_length: summary?.length || 0,
      work_experience_count: workExperience?.length || 0,
      skills_count: resumeData.skills.length || 0,
      projects_count: projects?.length || 0,
      github_data_keys: Object.keys(githubData || {}),
    }));

    console.log('Saving resume to Supabase...');
    try {
      const { data: resume, error: resumeError } = await supabaseAdmin
        .from('resumes')
        .insert(resumeData)
        .select()
        .single();

      if (resumeError) {
        console.error('Supabase resume error details:', {
          message: resumeError.message,
          code: resumeError.code,
          details: resumeError.details,
          hint: resumeError.hint
        });
        throw new Error(`Resume save error: ${resumeError.message || 'Unknown error'}, Code: ${resumeError.code}, Details: ${JSON.stringify(resumeError.details || {})}`);
      }

      console.log('Resume generated and saved successfully with ID:', resume.id);
      return NextResponse.json(resume);
    } catch (insertError: any) {
      console.error('Insert operation failed:', {
        message: insertError.message,
        name: insertError.name,
        stack: insertError.stack,
        cause: insertError.cause
      });
      throw insertError;
    }
  } catch (error: any) {
    console.error('Error in resume generation:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines of stack trace
      cause: error.cause
    });
    return NextResponse.json(
      { 
        error: 'Failed to generate resume', 
        message: error.message || 'Unknown error',
        code: error.code,
        details: error.details || {},
        hint: error.hint
      },
      { status: 500 }
    );
  }
} 