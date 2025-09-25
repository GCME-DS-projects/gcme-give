"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart,Smartphone, Loader2, Share2 } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "project" | "missionary";
  title: string;
  description?: string;
}

export default function DonationModal({
  isOpen,
  onClose,
  type,
  title,
  description,
}: DonationModalProps) {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState<"one-time" | "monthly">(
    "one-time",
  );
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const predefinedAmounts = ["2,000", "5,000", "10,000", "25,000", "50,000", "100,000"];

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  const getCurrentAmount = () => {
    return customAmount || amount;
  };

  const processTelebirrPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Validate and clean amount
      const rawAmount = getCurrentAmount();
      const amount = rawAmount.replace(/,/g, ''); // Remove commas

      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Create a descriptive title based on the donation type and details
      // const paymentTitle = `Great Commission Ethiopia - ${
      //   type === "project" ? "Project" : "Missionary"
      // } Support: ${title}`;

      const apiKey = process.env.NEXT_PUBLIC_PAYMENT_API_KEY;
      const paymentGatewayUrl = "/api/payment";

        // remove unused: const paymentTitle = ...

        const response = await fetch(paymentGatewayUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            amount,
            title,
            test: true,
          }),
        });

        type PaymentResponse = {
          success?: boolean;
          paymentUrl?: string;
          message?: string;
          error?: string;
        };

        const data: PaymentResponse = await response.json();
        console.log("Payment response:", data);


      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Payment failed: ${response.status}`,
        );
      }

      if (data.success && data.paymentUrl) {
        // Store donation details in session storage before redirecting
        sessionStorage.setItem(
          "donationDetails",
          JSON.stringify({
            type,
            title,
            amount,
            timestamp: new Date().toISOString(),
          }),
        );

        // Redirect to payment URL
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "An error occurred during payment",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // function useAnchorOpen(link: string) {
  //   let anchorEle = document.createElement("a");
  //   anchorEle.setAttribute("href", link);
  //   anchorEle.setAttribute("target", "_blank");
  //   anchorEle.setAttribute("rel", "external");
  //   anchorEle.style.display = "none";
  //   anchorEle.click();
  // }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "telebirr") {
      await processTelebirrPayment();
    } else {
      // For other payment methods, simulate payment processing
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setStep(4); // Success step for other payment methods
    }
  };

  const resetModal = () => {
    setStep(1);
    setDonationType("one-time");
    setAmount("");
    setCustomAmount("");
    setPaymentMethod("");
    setIsProcessing(false);
    setPaymentError(null);
    setPaymentUrl(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const redirectToPayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      type,
      title,
      ...(description && { description }),
    });
    return `${baseUrl}/donate?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareableLink = generateShareableLink();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${type === "project" ? "Project" : "Missionary"}: ${title}`,
          text: `Join me in supporting ${title} through Great Commission Ethiopia.`,
          url: shareableLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareableLink);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-xl text-neutral-800">
                {step === 4
                  ? "Thank You!"
                  : step === 5
                    ? "Complete Payment"
                    : `Support ${type === "project" ? "Project" : "Missionary"}`}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-neutral-600 hover:text-primary-600"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          {step !== 4 && step !== 5 && (
            <DialogDescription className="text-neutral-600">
              {title}
              {description && (
                <span className="block text-sm mt-1">{description}</span>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Donation Type */}
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Donation Type
              </Label>
              <RadioGroup
                value={donationType}
                onValueChange={(value: "one-time" | "monthly") =>
                  setDonationType(value)
                }
              >
                <div className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                    <div className="font-medium">One-time Donation</div>
                    <div className="text-sm text-neutral-600">
                      Make a single donation today
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                    <div className="font-medium">Monthly Partnership</div>
                    <div className="text-sm text-neutral-600">
                      Ongoing monthly support
                    </div>
                  </Label>
                  <Badge className="bg-primary-100 text-primary-800">
                    Recommended
                  </Badge>
                </div>
              </RadioGroup>
            </div>

            {/* Amount Selection */}
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Amount (Ethiopian Birr)
              </Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {predefinedAmounts.map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    type="button"
                    variant={amount === presetAmount ? "default" : "outline"}
                    className={`h-12 transition-all duration-200 ${
                      amount === presetAmount
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
                        : "border-neutral-300 hover:bg-primary-50 hover:border-primary-300"
                    }`}
                    onClick={() => handleAmountSelect(presetAmount)}
                  >
                    ብር {presetAmount}
                  </Button>
                ))}
              </div>
              <div>
                <Label
                  htmlFor="custom-amount"
                  className="text-sm text-neutral-600 mb-2 block"
                >
                  Or enter custom amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount in Birr"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={
                !getCurrentAmount() ||
                Number.parseFloat(getCurrentAmount()) <= 0
              }
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white h-12 shadow-lg"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Payment Method
              </Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors">
                  <RadioGroupItem value="telebirr" id="telebirr" />
                  <Label
                    htmlFor="telebirr"
                    className="flex-1 cursor-pointer flex items-center"
                  >
                    <Smartphone className="w-5 h-5 mr-3 text-success-600" />
                    <div>
                      <div className="font-medium">TeleBirr</div>
                      <div className="text-sm text-neutral-600">
                        Mobile money transfer
                      </div>
                    </div>
                  </Label>
                </div>
                {/* <div className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors">
                  <RadioGroupItem value="cbe" id="cbe" />
                  <Label
                    htmlFor="cbe"
                    className="flex-1 cursor-pointer flex items-center"
                  >
                    <Banknote className="w-5 h-5 mr-3 text-secondary-600" />
                    <div>
                      <div className="font-medium">CBE Birr</div>
                      <div className="text-sm text-neutral-600">
                        Commercial Bank of Ethiopia
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex-1 cursor-pointer flex items-center"
                  >
                    <CreditCard className="w-5 h-5 mr-3 text-neutral-600" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-neutral-600">
                        Visa, Mastercard
                      </div>
                    </div>
                  </Label>
                </div> */}
              </RadioGroup>
            </div>

            {/* Summary */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">Amount:</span>
                  <span className="font-semibold text-neutral-800">
                    ብር {getCurrentAmount()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">Type:</span>
                  <span className="font-semibold text-neutral-800">
                    {donationType === "monthly" ? "Monthly" : "One-time"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Supporting:</span>
                  <span className="font-semibold text-neutral-800 text-right text-sm">
                    {title}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!paymentMethod}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Details */}
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Payment Details
              </Label>

              {paymentMethod === "telebirr" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm text-neutral-600 mb-2 block"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+251 9XX XXX XXX"
                      required
                      className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "cbe" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="account"
                      className="text-sm text-neutral-600 mb-2 block"
                    >
                      Account Number
                    </Label>
                    <Input
                      id="account"
                      type="text"
                      placeholder="Enter your CBE account number"
                      required
                      className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="card-number"
                      className="text-sm text-neutral-600 mb-2 block"
                    >
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="expiry"
                        className="text-sm text-neutral-600 mb-2 block"
                      >
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        required
                        className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="cvv"
                        className="text-sm text-neutral-600 mb-2 block"
                      >
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        required
                        className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information */}
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Your Information
              </Label>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="donor-name"
                    className="text-sm text-neutral-600 mb-2 block"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="donor-name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="donor-email"
                    className="text-sm text-neutral-600 mb-2 block"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-sm text-neutral-600 mb-2 block"
                  >
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Leave an encouraging message..."
                    className="border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {paymentError}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Donate ብር ${getCurrentAmount()}`
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Heart className="w-8 h-8 text-success-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                Thank You!
              </h3>
              <p className="text-neutral-600 mb-4">
                Your donation of{" "}
                <span className="font-semibold text-primary-600">
                  ብር {getCurrentAmount()}
                </span>{" "}
                has been processed successfully.
              </p>
              <p className="text-sm text-neutral-500">
                You will receive a confirmation email shortly. Your support
                makes a real difference in the lives of those we serve.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
            >
              Close
            </Button>
          </div>
        )}

        {step === 5 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Smartphone className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                Complete Your Payment
              </h3>
              <p className="text-neutral-600 mb-4">
                Your TeleBirr payment of{" "}
                <span className="font-semibold text-primary-600">
                  ብር {getCurrentAmount()}
                </span>{" "}
                is ready.
              </p>
              <p className="text-sm text-neutral-500 mb-6">
                Click the button below to be redirected to the TeleBirr payment
                gateway to complete your transaction.
              </p>

              <Button
                onClick={redirectToPayment}
                className="w-full bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-lg h-12 mb-4"
              >
                Complete Payment on TeleBirr
              </Button>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
