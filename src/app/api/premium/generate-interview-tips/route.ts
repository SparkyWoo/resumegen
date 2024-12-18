import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { resumeId, resumeContent, jobDescription, companyName } = body;

    if (!resumeId || !resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has premium access
    const { data: premiumFeature } = await supabase
      .from('premium_features')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('resume_id', resumeId)
      .eq('feature_type', 'interview_tips')
      .eq('is_active', true)
      .single();

    if (!premiumFeature) {
      return NextResponse.json(
        { error: 'Premium feature not purchased' },
        { status: 403 }
      );
    }

    // Generate interview tips using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.2,
      system: "You are an expert interview coach with deep knowledge of company cultures and interview techniques. Your task is to analyze job descriptions and resumes to provide tailored interview preparation advice. Return your analysis in JSON format with the following structure: { company_culture: { values: string[], mission: string, talkingPoints: string[] }, role_keywords: { technical: string[], soft: string[], examples: { [question: string]: string } } }",
      messages: [{
        role: 'user',
        content: `Please analyze this job description and resume to provide interview preparation tips.

Company: ${companyName || 'Not specified'}

Resume:
${resumeContent}

Job Description:
${jobDescription}

Focus on:
1. Company culture and values
2. Key technical and soft skills required
3. Example answers for common interview questions
4. Specific talking points that align with the role and company`
      }]
    });

    const analysis = JSON.parse(message.content[0].type === 'text' ? message.content[0].text : '{}');

    // Store the analysis
    await supabase
      .from('interview_tips')
      .upsert({
        resume_id: resumeId,
        company_culture: analysis.company_culture,
        role_keywords: analysis.role_keywords,
        talking_points: analysis.talking_points || [],
      });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error generating interview tips:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview tips' },
      { status: 500 }
    );
  }
} 