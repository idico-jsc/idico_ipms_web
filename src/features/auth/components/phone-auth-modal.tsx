import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string, verificationId: string) => void;
}

export function PhoneAuthModal({ isOpen, onClose, onSuccess }: PhoneAuthModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [useVisibleRecaptcha, setUseVisibleRecaptcha] = useState(false);

  // Cleanup reCAPTCHA on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber("");
      setOtp("");
      setVerificationId("");
      setConfirmationResult(null);
      setError(null);
      setStep("phone");
      setIsLoading(false);
      setUseVisibleRecaptcha(false);
    }
  }, [isOpen]);

  const setupRecaptcha = () => {
    // Clear any existing recaptcha verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore errors during cleanup
      }
      window.recaptchaVerifier = null;
    }

    // Create new recaptcha verifier
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: useVisibleRecaptcha ? "normal" : "invisible",
          callback: () => {
            console.log("✅ reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.log("⏰ reCAPTCHA expired");
          },
          "error-callback": (error: any) => {
            console.error("❌ reCAPTCHA error:", error);
          },
        }
      );
      console.log("✅ reCAPTCHA verifier created successfully");
    } catch (error) {
      console.error("❌ Error setting up reCAPTCHA:", error);
      throw error;
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setError("Please enter a phone number");
      return;
    }

    // Phone number should be in E.164 format (+[country code][number])
    if (!phoneNumber.startsWith("+")) {
      setError("Phone number must start with + and country code (e.g., +1234567890)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        setError("Failed to setup reCAPTCHA. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Sending OTP to:", phoneNumber);
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

      setConfirmationResult(confirmation);
      setVerificationId(confirmation.verificationId);

      // Log verification ID to console as requested
      console.log("✅ OTP Sent Successfully!");
      console.log("Verification ID:", confirmation.verificationId);

      setStep("otp");
      setError(null);
    } catch (err: any) {
      console.error("❌ Error sending OTP:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      let errorMessage = "Failed to send OTP. ";

      // Handle specific Firebase errors
      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format. Use E.164 format (e.g., +1234567890)";
      } else if (err.code === "auth/missing-phone-number") {
        errorMessage = "Phone number is required";
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Try again later or contact support.";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This phone number has been disabled.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage = "⚠️ Phone authentication is NOT enabled!\n\nSteps to fix:\n1. Go to Firebase Console\n2. Authentication → Sign-in method\n3. Enable 'Phone' provider\n4. Save and try again\n\nSee console for direct link.";
      } else if (err.code === "auth/billing-not-enabled") {
        errorMessage = "⚠️ Billing not enabled!\n\nTo use phone authentication:\n1. Go to Firebase Console\n2. Add test phone numbers (free), OR\n3. Upgrade to Blaze plan\n\nSee console for details.";
      } else {
        errorMessage = err.message || "Failed to send OTP. Please try again.";
      }

      setError(errorMessage);

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!confirmationResult) {
      setError("No confirmation result found. Please request OTP again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await confirmationResult.confirm(otp);

      console.log("Phone authentication successful:", result.user);

      // Call the onSuccess callback
      onSuccess(phoneNumber, verificationId);

      // Close the modal
      handleClose();
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up reCAPTCHA
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore cleanup errors
      }
      window.recaptchaVerifier = null;
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {step === "phone" ? "Enter Phone Number" : "Enter OTP"}
        </h2>

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />

            </div>

            {/* Visible reCAPTCHA container (only shows if useVisibleRecaptcha is true) */}
            {useVisibleRecaptcha && (
              <div className="flex justify-center">
                <div id="recaptcha-container"></div>
              </div>
            )}

            {error && (
              <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSendOTP} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
              {!useVisibleRecaptcha && (
                <button
                  type="button"
                  onClick={() => setUseVisibleRecaptcha(true)}
                  className="text-muted-foreground text-xs hover:underline"
                  disabled={isLoading}
                >
                  Having trouble? Show reCAPTCHA
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                className="mt-1"
                maxLength={6}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>

            {error && (
              <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError(null);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onClick={handleVerifyOTP} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}

        {/* Invisible reCAPTCHA container - only rendered when not in phone step or not using visible */}
        {!useVisibleRecaptcha && <div id="recaptcha-container"></div>}
      </div>
    </div>
  );
}

// Extend window interface for RecaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}
