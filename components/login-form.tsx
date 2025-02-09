"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface LoginError {
  message: string;
  field?: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrors([]);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInput),
      });

      const loginData = await response.json();
      if (response.status === 200) {
        try {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: loginData.user.id,
              username: loginData.user.username,
            })
          );
          router.push("/dashboard");
        } catch (storageError) {
          console.error("Error storing session data:", storageError);
          setErrors([{ message: "Failed to store session data" }]);
        }
      } else {
        setErrors([{ message: loginData.error || "Something went wrong" }]);
      }
    } catch (error) {
      console.error("Login error:", error);
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
                  Login to your Mail Organizer account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  required
                  value={loginInput.username}
                  onChange={(e) =>
                    setLoginInput({ ...loginInput, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  value={loginInput.password}
                  onChange={(e) =>
                    setLoginInput({ ...loginInput, password: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                onClick={handleLogin}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              {errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {errors.map((err, index) => (
                    <p key={index}>{err.message}</p>
                  ))}
                </div>
              )}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={() => {
                    router.push("/signup");
                  }}
                >
                  Sign up
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
