import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

// Disable body parsing, need raw body for Stripe webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const { userId, resumeId } = session.metadata;

        // Create premium feature record
        await supabase
          .from('premium_features')
          .insert({
            user_id: userId,
            resume_id: resumeId,
            is_active: true,
          });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as any;
        console.log('Checkout session expired:', session.id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await supabase
          .from('users')
          .update({ 
            subscription_status: subscription.status,
            subscription_id: subscription.id
          })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await supabase
          .from('users')
          .update({ 
            subscription_status: 'canceled',
            subscription_id: null
          })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as any;
        console.log('Payment processing:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 