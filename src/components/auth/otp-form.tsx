"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";

export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyOTP, sendOTP, loading, error: authError } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      await verifyOTP(email, otp);
      router.push("/movies");
    } catch {
      setError(authError || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    try {
      await sendOTP(email);
      setError("OTP sent successfully. Check your email.");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Verify Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className={`rounded p-3 text-sm ${
            error.includes("successfully")
              ? "bg-green-500/10 text-green-700"
              : "bg-destructive/10 text-destructive"
          }`}>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium">
            One-Time Password
          </label>
          <input
            id="otp"
            type="text"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-center text-sm font-mono tracking-widest placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-muted-foreground">
            Check your email for the 6-digit code
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}
