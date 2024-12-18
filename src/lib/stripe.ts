import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Client-side Stripe promise
declare global {
  var stripePromise: Promise<StripeType | null> | null;
}

if (!global.stripePromise && typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  console.log('[Stripe] Initializing with key available:', !!key);
  global.stripePromise = loadStripe(key!);
}

export const getStripe = () => {
  console.log('[Stripe] Getting Stripe instance');
  return global.stripePromise;
};

// Premium feature price (in cents)
export const PREMIUM_PRICE = 999; // $9.99 for all features

// Premium product ID
export const PREMIUM_PRODUCT = process.env.STRIPE_PREMIUM_PRICE_ID;

export type PremiumFeatureType = 'premium';

// Create a checkout session
export const createCheckoutSession = async ({
  userId,
  resumeId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  resumeId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRODUCT,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userId, // We'll update this with actual email
      metadata: {
        userId,
        resumeId,
        featureType: 'premium',
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
};

// Verify a successful payment
export const verifyPayment = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      success: session.payment_status === 'paid',
      metadata: session.metadata,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
}; 