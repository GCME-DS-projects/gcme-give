import { NextResponse } from "next/server";
import { paymentGatewayService, PaymentGatewayError } from "@/lib/services/payment-gateway";
import { InitiatePaymentDto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: InitiatePaymentDto = await request.json();

    // --- Validation ---
    if (!body.title || !body.amount) {
      return NextResponse.json({ error: "Missing required fields: title and amount." }, { status: 400 });
    }
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Must be a positive number." }, { status: 400 });
    }

    // --- Service Call ---
    const paymentUrl = await paymentGatewayService.initiateTransaction(body);

    // --- Success Response ---
    return NextResponse.json({ success: true, paymentUrl });

  } catch (error: unknown) {
    console.error("Error in /api/payment/initiate:", error);

    if (error instanceof PaymentGatewayError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }
    
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: "An unexpected internal server error occurred." }, { status: 500 });
  }
}