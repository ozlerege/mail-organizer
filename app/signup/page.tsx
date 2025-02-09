"use client";

import { SignupForm } from "@/components/signup-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const sessionToken = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");

    if (sessionToken && user) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
