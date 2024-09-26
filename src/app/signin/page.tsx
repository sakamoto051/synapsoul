"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        console.error("Sign in failed", result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => handleSignIn("google")}
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In with Google
            </Button>
            <Button
              className="w-full"
              onClick={() => handleSignIn("credentials")}
              disabled={isLoading}
            >
              <User className="mr-2 h-4 w-4" />
              Guest Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
