import { Suspense } from "react";
import { OTPForm } from "@/components/auth/otp-form";

export const metadata = {
  title: "Verify Email - Movie Portal",
  description: "Verify your email with OTP",
};

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}
