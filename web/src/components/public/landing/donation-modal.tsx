"use client";

import { useState } from "react";
import type React from "react";
import { useInitiatePayment } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Smartphone, Loader2, Share2 } from "lucide-react";

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
  // --- UI State ---
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState<"one-time" | "monthly">(
    "one-time",
  );
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // --- React Query Mutation for Payment ---
  const { mutate: initiatePayment, isPending: isProcessing } = useInitiatePayment();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null); // Reset error on new submission

    if (paymentMethod === "telebirr") {
      // 1. Validate amount from the current state
      const rawAmount = getCurrentAmount();
      const cleanedAmount = rawAmount.replace(/,/g, "");
      const numericAmount = parseFloat(cleanedAmount);

      if (isNaN(numericAmount) || numericAmount <= 0) {
        setPaymentError("Please enter a valid donation amount.");
        return;
      }

      // 2. Prepare payment data transfer object (DTO)
      const paymentTitle = `Great Commission Ethiopia - ${
        type === "project" ? "Project" : "Missionary"
      } Support: ${title}`;
      
      const paymentDto = { title: paymentTitle, amount: numericAmount };

      // 3. Store details in session storage before redirecting
      // This allows retrieving details on the redirect confirmation page.
      sessionStorage.setItem(
        "donationDetails",
        JSON.stringify({
          type,
          title,
          amount: cleanedAmount,
          timestamp: new Date().toISOString(),
        }),
      );

      // 4. Call the mutation hook to initiate the payment
      initiatePayment(paymentDto, {
        onError: (error) => {
          // The hook shows a generic toast, but we also show a specific error inside the modal.
          setPaymentError(error.message || "An unexpected error occurred.");
        }
      });

    } else {
      // Handle other (currently simulated) payment methods
      setStep(4);
    }
  };

  const resetModal = () => {
    setStep(1);
    setDonationType("one-time");
    setAmount("");
    setCustomAmount("");
    setPaymentMethod("");
    setPaymentError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
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
        await navigator.clipboard.writeText(shareableLink);
        alert("Link copied to clipboard!");
      }
    } else {
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
          {step !== 4 && (
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
                parseFloat(getCurrentAmount().replace(/,/g, '')) <= 0
              }
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white h-12 shadow-lg"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
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
                    <Smartphone className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">TeleBirr</div>
                      <div className="text-sm text-neutral-600">
                        Mobile money transfer
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

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
            <div>
              <Label className="text-base font-semibold text-neutral-800 mb-3 block">
                Confirm Donation
              </Label>
              <p className="text-neutral-600 text-sm">
                You are about to donate{" "}
                <strong className="text-primary-600">
                  ብር {getCurrentAmount()}
                </strong>{" "}
                to support <strong>{title}</strong>. Clicking 'Donate' will proceed to the TeleBirr payment page to complete your transaction.
              </p>
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                Thank You!
              </h3>
              <p className="text-neutral-600 mb-4">
                Your simulated donation of{" "}
                <span className="font-semibold text-primary-600">
                  ብር {getCurrentAmount()}
                </span>{" "}
                is complete.
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
      </DialogContent>
    </Dialog>
  );
}