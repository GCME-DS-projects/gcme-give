/**
 * Data Transfer Object (DTO) for initiating a payment from the client.
 */
export interface InitiatePaymentDto {
  title: string;
  amount: number; // Send amount as a number from the client for clear validation.
}

/**
 * The successful response structure sent back to the client from our API.
 */
export interface InitiatePaymentResponse {
  success: boolean;
  paymentUrl: string;
}