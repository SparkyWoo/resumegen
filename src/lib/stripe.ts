import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Stripe.js
export const getStripe = async () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  return stripePromise;
};

// Premium feature prices (in cents)
export const PREMIUM_PRICES = {
  ATS_SCORE: 499, // $4.99
  INTERVIEW_TIPS: 499, // $4.99
  BUNDLE: 799, // $7.99 for both
} as const;

// Premium feature IDs
export const PREMIUM_PRODUCTS = {
  ATS_SCORE: process.env.STRIPE_ATS_SCORE_PRICE_ID!,
  INTERVIEW_TIPS: process.env.STRIPE_INTERVIEW_TIPS_PRICE_ID!,
  BUNDLE: process.env.STRIPE_BUNDLE_PRICE_ID!,
} as const;

export type PremiumFeatureType = 'ats_score' | 'interview_tips' | 'bundle';

// Create a checkout session
export const createCheckoutSession = async ({
  userId,
  resumeId,
  featureType,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  resumeId: string;
  featureType: PremiumFeatureType;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRODUCTS[featureType.toUpperCase() as keyof typeof PREMIUM_PRODUCTS],
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
        featureType,
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