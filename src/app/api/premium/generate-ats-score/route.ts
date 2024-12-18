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
    const { resumeId, resumeContent, jobDescription } = body;

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
      .eq('feature_type', 'ats_score')
      .eq('is_active', true)
      .single();

    if (!premiumFeature) {
      return NextResponse.json(
        { error: 'Premium feature not purchased' },
        { status: 403 }
      );
    }

    // Generate ATS score using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0,
      system: "You are an expert ATS (Applicant Tracking System) analyzer. Your task is to analyze resumes against job descriptions and provide detailed scoring and feedback. Return your analysis in JSON format with the following structure: { score: number, breakdown: { summary: number, skills: number, experience: number, keywords: number }, suggestions: string[] }. The score and breakdown values should be numbers between 0-100.",
      messages: [{
        role: 'user',
        content: `Please analyze this resume against the job description and provide an ATS compatibility score and suggestions for improvement.

Resume:
${resumeContent}

Job Description:
${jobDescription}`
      }]
    });

    const analysis = JSON.parse(message.content[0].type === 'text' ? message.content[0].text : '{}');

    // Store the analysis
    await supabase
      .from('ats_scores')
      .upsert({
        resume_id: resumeId,
        score: analysis.score,
        breakdown: analysis.breakdown,
        suggestions: analysis.suggestions,
      });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error generating ATS score:', error);
    return NextResponse.json(
      { error: 'Failed to generate ATS score' },
      { status: 500 }
    );
  }
} 