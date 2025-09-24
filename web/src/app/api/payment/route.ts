import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PaymentRequestBody {
  title: string;
  amount: string;
  callback_info: string;
  redirect_url: string;
  notify_url: string;
}

export async function POST(request: Request) {
  // Read environment variables at runtime
  const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL as string;
  const PAYMENT_GATEWAY_TOKEN = process.env.PAYMENT_GATEWAY_TOKEN as string;
  const PAYMENT_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL as string;
  const PAYMENT_NOTIFY_URL = process.env.NEXT_PUBLIC_NOTIFY_URL as string;

  // Enhanced check for environment variables
  if (
    !PAYMENT_GATEWAY_URL ||
    !PAYMENT_GATEWAY_TOKEN ||
    !PAYMENT_REDIRECT_URL ||
    !PAYMENT_NOTIFY_URL
  ) {
    const missingVars = [];
    if (!PAYMENT_GATEWAY_URL) missingVars.push("PAYMENT_GATEWAY_URL");
    if (!PAYMENT_GATEWAY_TOKEN) missingVars.push("PAYMENT_GATEWAY_TOKEN");
    if (!PAYMENT_REDIRECT_URL) missingVars.push("NEXT_PUBLIC_REDIRECT_URL");
    if (!PAYMENT_NOTIFY_URL) missingVars.push("NEXT_PUBLIC_NOTIFY_URL");

    return NextResponse.json(
      {
        error: `Missing required environment variables: ${missingVars.join(
          ", "
        )}`,
      },
      { status: 500 }
    );
  }

  try {
    console.log("Received payment request");

    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log("Request body:", JSON.stringify(body, null, 2));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.amount || !body.title) {
      console.error("Missing required fields:", {
        amount: body.amount,
        title: body.title,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure amount is a number
    const amount = parseFloat(body.amount);
    console.log("this is the amount: ", amount);
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount:", body.amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Format amount to have 2 decimal places
    const formattedAmount = amount.toFixed(2);

    // Create the request body exactly as expected by the payment gateway
    const requestBody = {
      title: body.title,
      amount: formattedAmount,
      callback_info: "telebirr",
      redirect_url: PAYMENT_REDIRECT_URL,
      notify_url: PAYMENT_NOTIFY_URL,
    };

    console.log(
      "Payment gateway request body:",
      JSON.stringify(requestBody, null, 2)
    );
    console.log("Making request to payment gateway...");
    console.log("Request URL:", PAYMENT_GATEWAY_URL);

    try {
      const response = await fetch(PAYMENT_GATEWAY_URL as string, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_GATEWAY_TOKEN as string}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Payment gateway response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Response body (raw):", responseText);

      const contentType = response.headers.get("content-type");

      // Check if the response is an HTML page and contains the specific error indicator
      if (
        contentType &&
        contentType.includes("text/html") &&
        responseText.includes("pcError.html")
      ) {
        console.error(
          "Received an HTML error page from payment gateway:",
          responseText
        );
        try {
          const errorUrl = new URL(responseText);
          const errorMessage =
            errorUrl.searchParams.get("error_msg") ||
            "Unknown error from payment gateway";
          return NextResponse.json(
            {
              error: `Payment gateway redirect error: ${decodeURIComponent(
                errorMessage
              )}`,
            },
            { status: 400 }
          );
        } catch (urlError) {
          console.error(
            "Failed to parse error URL from HTML response:",
            urlError
          );
          return NextResponse.json(
            { error: "Payment gateway returned an unparsable HTML error page" },
            { status: 500 }
          );
        }
      }

      if (!response.ok) {
        console.error("Payment gateway error:", {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });
        return NextResponse.json(
          {
            error: `Payment gateway error: ${response.statusText}`,
            details: responseText,
          },
          { status: response.status }
        );
      }

      // Handle Telebirr payment URL response
      if (
        responseText.startsWith("@") ||
        (contentType && contentType.includes("text/html"))
      ) {
        const paymentUrl = responseText.startsWith("@")
          ? responseText.substring(1)
          : responseText;
        console.log("Received Telebirr payment URL:", paymentUrl);

        try {
          new URL(paymentUrl);
          return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
          });
        } catch (e) {
          console.error("Invalid payment URL received:", paymentUrl);
          return NextResponse.json(
            { error: "Invalid payment URL format received from gateway" },
            { status: 500 }
          );
        }
      }

      // Try to parse the response as JSON
      try {
        const responseJson = JSON.parse(responseText);
        return NextResponse.json(responseJson);
      } catch (e) {
        console.error(
          "Failed to parse response as JSON from payment gateway:",
          e
        );
        return NextResponse.json(
          {
            error: "Failed to parse payment gateway response as JSON",
            rawResponse: responseText,
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Failed to communicate with payment gateway:", error);

      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          cause: error.cause,
          stack: error.stack,
        });
      }

      return NextResponse.json(
        {
          error: "Failed to communicate with payment gateway",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Unexpected error in payment route handler:", error);
    return NextResponse.json(
      {
        error: "Internal server error in payment route",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
