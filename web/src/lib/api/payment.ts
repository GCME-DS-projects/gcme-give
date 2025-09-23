import { apiClient } from './base'; // Assuming you have a shared API client
import { InitiatePaymentDto, InitiatePaymentResponse } from '../types';

class PaymentApiService {
  /**
   * Calls our own backend API to initiate a payment process.
   */
  async initiatePayment(data: InitiatePaymentDto): Promise<InitiatePaymentResponse> {
    return apiClient.post<InitiatePaymentResponse>('/payment/initiate', data);
  }
}

export const paymentApi = new PaymentApiService();