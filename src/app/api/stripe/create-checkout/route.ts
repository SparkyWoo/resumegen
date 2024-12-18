import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already has active premium features
    const { data: existingFeatures } = await supabase
      .from('premium_features')
      .select('*')
      .eq('user_id', userId)
      .eq('resume_id', resumeId)
      .eq('feature_type', 'premium')
      .eq('is_active', true)
      .single();

    if (existingFeatures) {
      return NextResponse.json(
        { error: 'Feature already purchased' },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    let { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || '',
        metadata: {
          userId: session.user.id,
        },
      } as Stripe.CustomerCreateParams);

      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const { sessionId } = await createCheckoutSession({
      userId: session.user.email || '',
      resumeId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/resume/${resumeId}/builder?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/resume/${resumeId}/builder`,
    });

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 