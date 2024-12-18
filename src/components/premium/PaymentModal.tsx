'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { XIcon, ShieldCheckIcon } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  featureType: 'ats_score' | 'interview_tips' | 'bundle';
}

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message ?? 'An error occurred');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <ShieldCheckIcon className="h-5 w-5" />
        <span>Your payment is secure and encrypted</span>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

export function PaymentModal({ isOpen, onClose, clientSecret, featureType }: PaymentModalProps) {
  const stripePromise = getStripe();

  const getFeatureTitle = () => {
    switch (featureType) {
      case 'ats_score':
        return 'ATS Score Analysis';
      case 'interview_tips':
        return 'AI Interview Tips';
      case 'bundle':
        return 'Complete Resume Package';
      default:
        return 'Premium Feature';
    }
  };

  const getFeaturePrice = () => {
    switch (featureType) {
      case 'ats_score':
      case 'interview_tips':
        return '$4.99';
      case 'bundle':
        return '$7.99';
      default:
        return '';
    }
  };

  const getFeatureDescription = () => {
    switch (featureType) {
      case 'ats_score':
        return 'Get detailed insights into how your resume performs against ATS systems and receive targeted improvement suggestions.';
      case 'interview_tips':
        return 'Receive AI-powered interview preparation tips tailored to the company and role you\'re applying for.';
      case 'bundle':
        return 'Get both ATS Score Analysis and AI Interview Tips at a discounted price.';
      default:
        return '';
    }
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
                    {getFeatureTitle()}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {getFeatureDescription()}
                    </p>
                  </div>

                  <div className="mt-4 flex items-baseline text-2xl font-semibold text-gray-900">
                    {getFeaturePrice()}
                    <span className="ml-1 text-sm font-normal text-gray-500">one-time payment</span>
                  </div>

                  <div className="mt-8">
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#2563eb',
                          },
                        },
                      }}
                    >
                      <CheckoutForm onClose={onClose} />
                    </Elements>
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