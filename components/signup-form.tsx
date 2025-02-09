"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signupInput, setSignupInput] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string[]>([]);
  const handleSignup = async () => {
    setLoading(true);
    setError([]);
    try {
      // First, create the user account
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInput),
      });

      const signupData = await signupResponse.json();
      if (signupResponse.ok) {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupInput),
        });

        if (loginResponse.ok) {
          router.push("/dashboard");
        } else {
          setError([
            "Account created but login failed. Please try logging in.",
          ]);
          router.push("/login");
        }
      } else {
        if (signupData.error === "Validation error" && signupData.details) {
          setError(signupData.details.map((detail: any) => detail.message));
        } else {
          setError([signupData.error || "Something went wrong"]);
        }
      }
    } catch (error: any) {
      console.error("Signup failed", error);
      setError(["An unexpected error occurred"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Alert>
            <AlertTitle>Please wait...</AlertTitle>
            <AlertDescription>
              <p className="text-balance text-muted-foreground">
                Creating your account...
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome to Mail Organizer
                  </h1>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc px-4">
                        {error.map((errorMessage) => (
                          <li className="list-disc" key={errorMessage}>
                            {errorMessage}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    required
                    value={signupInput.username}
                    onChange={(e) =>
                      setSignupInput({
                        ...signupInput,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    required
                    value={signupInput.password}
                    onChange={(e) =>
                      setSignupInput({
                        ...signupInput,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="button" onClick={handleSignup} className="w-full">
                  Sign up
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4"
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
}
