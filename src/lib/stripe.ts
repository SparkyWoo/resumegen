import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Premium feature price (in cents)
export const PREMIUM_PRICE = 999; // $9.99 for all features

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
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ResumeHey Premium Features',
              description: `• AI-powered ATS Score Analysis
• Personalized Interview Tips
• Keyword Optimization
• Unlimited Resume Exports
• Priority Support`,
              images: ['https://resumehey.com/premium-features.png'],
            },
            unit_amount: PREMIUM_PRICE,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: 'Your premium features will be activated instantly after payment'
        }
      },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userId,
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