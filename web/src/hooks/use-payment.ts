'use client';

import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api/payment';
import { InitiatePaymentDto, InitiatePaymentResponse } from '@/lib/types';
import { toast } from 'sonner';

/**
 * A mutation hook for initiating a payment.
 * Handles the API call and provides UI feedback.
 */
export const useInitiatePayment = () => {
  return useMutation<InitiatePaymentResponse, Error, InitiatePaymentDto>({
    mutationFn: (paymentData: InitiatePaymentDto) => paymentApi.initiatePayment(paymentData),
    
    onSuccess: (data) => {
      toast.success('Redirecting to payment page...');
      // Redirect the user to the payment gateway
      window.location.href = data.paymentUrl;
    },
    
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate payment. Please try again.');
    },
  });
};