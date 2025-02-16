"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface SignupError {
  message: string;
  field?: string;
}

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
  const [errors, setErrors] = useState<SignupError[]>([]);

  const handleSignup = async () => {
    setLoading(true);
    setErrors([]);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInput),
      });

      const signupResponse = await response.json();
      if (response.status === 200) {
        router.push("/login");
      } else {
        setErrors(
          Array.isArray(signupResponse.error)
            ? signupResponse.error
            : [{ message: signupResponse.error || "Something went wrong" }]
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors([
        {
          message: `An unexpected error occurred: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome to Mail Organizer
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Create an account to get started
                  </p>
                </div>
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc px-4">
                        {errors.map((err, index) => (
                          <li className="list-disc" key={index}>
                            {err.message}
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
                <Button
                  type="button"
                  onClick={handleSignup}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign up"}
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
              <Image
                src="/auth-background.png"
                alt="Mail Organizer"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 from-background to-background/60" />
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
