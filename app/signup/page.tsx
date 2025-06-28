"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtp } from "../actions/auth/sendOtp";
import { useRouter } from "next/navigation";

// ========================
// SCHEMAS
// ========================
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone is required"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

// ========================
// OTP MODAL
// ========================
const OtpModal = ({
  open,
  onClose,
  onVerify,
}: {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const handleOtpSubmit = async (data: OtpFormValues) => {
    await onVerify(data.otp);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-2 text-center">Enter OTP</h2>
        <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-3">
          <Input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            {...register("otp")}
            autoFocus
          />
          {errors.otp && (
            <p className="text-xs text-red-500">{errors.otp.message}</p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer "
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========================
// REGISTER FORM
// ========================
const RegisterForm = () => {
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<RegisterFormValues | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("action", "signup");

    const res = await sendOtp(formData);
    if (res?.success) {
      setPendingUser(data);
      setShowOtpModal(true);
      toast.info("OTP sent to your email/phone.", {
        className: "bg-blue-500 text-white",
      });
    } else {
      toast.error(res?.message || "Failed to send OTP", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!pendingUser) return;

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingUser, otp }),
        credentials: "include",
      }
    );

    const result = await response.json();
    if (result?.error) {
      toast.error(result?.msg, { className: "bg-red-500 text-white" });
    } else {
      toast.success(result?.msg, { className: "bg-green-500 text-white" });
      reset();
      setPendingUser(null);
      setShowOtpModal(false);
      router.push("/");
    }
  };

  return (
    <>
      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Register
            </CardTitle>
            <CardDescription>
              Create your account to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {["name", "email", "password", "phone"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={`Enter your ${field}`}
                    {...register(field as keyof RegisterFormValues)}
                    autoComplete={field}
                  />
                  {errors[field as keyof RegisterFormValues] && (
                    <p className="text-xs text-red-500">
                      {
                        errors[field as keyof RegisterFormValues]?.message
                      }
                    </p>
                  )}
                </div>
              ))}
              <Button disabled={isSubmitting} type="submit" className="w-full cursor-pointer">
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
            <div className="flex justify-center text-sm">
              <Link href={"/"}>Already have an account?</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterForm;
