"use client";

import { LoginForm } from "@/components/login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const sessionToken = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");

    if (sessionToken && user) {
      console.log("User is already authenticated");
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
