'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { XIcon, ShieldCheckIcon } from 'lucide-react';

// Load Stripe outside of component to avoid recreating Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  error: string | null;
}

export function PaymentModal({ isOpen, onClose, sessionId, error }: PaymentModalProps) {
  const [stripeError, setStripeError] = useState<string | null>(null);

  const handleRedirectToCheckout = async () => {
    if (!sessionId) return;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        setStripeError(error.message ?? null);
      }
    } catch (err) {
      console.error('Error redirecting to checkout:', err);
      setStripeError('Failed to load checkout. Please try again.');
    }
  };

  // Redirect to checkout as soon as we have a session ID
  if (sessionId && isOpen) {
    handleRedirectToCheckout();
  }

  const renderContent = () => {
    if (error || stripeError) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Payment Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || stripeError}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            >
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Premium Resume Features
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Get access to all premium features including ATS Score Analysis and AI Interview Tips. 
                      Optimize your resume and prepare for interviews with our advanced AI tools.
                    </p>
                  </div>

                  <div className="mt-4 flex items-baseline text-2xl font-semibold text-gray-900">
                    $9.99
                    <span className="ml-1 text-sm font-normal text-gray-500">one-time payment</span>
                  </div>

                  <div className="mt-8">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 