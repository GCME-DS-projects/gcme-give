import { InitiatePaymentDto } from "@/lib/types";

// Define a custom error class for better error handling
export class PaymentGatewayError extends Error {
  constructor(message: string, public status: number = 500, public details?: any) {
    super(message);
    this.name = 'PaymentGatewayError';
  }
}

/**
 * Service to handle all interactions with the external payment gateway.
 * This class should only be used on the server side.
 */
class PaymentGatewayService {
  private readonly gatewayUrl: string;
  private readonly authToken: string;
  private readonly redirectUrl: string;
  private readonly notifyUrl: string;

  constructor() {
    this.gatewayUrl = process.env.PAYMENT_GATEWAY_URL!;
    this.authToken = process.env.PAYMENT_GATEWAY_TOKEN!;
    this.redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL!;
    this.notifyUrl = process.env.NEXT_PUBLIC_NOTIFY_URL!;

    if (!this.gatewayUrl || !this.authToken || !this.redirectUrl || !this.notifyUrl) {
      throw new PaymentGatewayError("Server configuration error: Missing payment gateway credentials.", 500);
    }
  }

  /**
   * Initiates a payment transaction with the external gateway.
   */
  async initiateTransaction(paymentDetails: InitiatePaymentDto): Promise<string> {
    const formattedAmount = paymentDetails.amount.toFixed(2);

    const requestBody = {
      title: paymentDetails.title,
      amount: formattedAmount,
      callback_info: "telebirr",
      redirect_url: this.redirectUrl,
      notify_url: this.notifyUrl,
    };
    
    const response = await fetch(this.gatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new PaymentGatewayError(`Payment gateway error: ${response.statusText}`, response.status, responseText);
    }

    const paymentUrl = responseText.startsWith("@") ? responseText.substring(1) : responseText;
    
    try {
      new URL(paymentUrl);
      return paymentUrl;
    } catch (e) {
      console.error("Invalid payment URL received from gateway:", paymentUrl);
      throw new PaymentGatewayError("Received invalid payment URL format from gateway.", 500);
    }
  }
}

export const paymentGatewayService = new PaymentGatewayService();