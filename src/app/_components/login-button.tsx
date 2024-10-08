"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "~/store/useAuthStore";

const LoginButton = ({ isOpen }: { isOpen: boolean }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        displayName: session.user.displayName,
      });
    } else {
      logout();
    }
  }, [session, setUser, logout]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      logout();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Button variant="ghost" className="w-full justify-start mb-2" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isOpen && "Loading..."}
      </Button>
    );
  }

  if (session) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={handleSignOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        {isOpen && "Sign Out"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start mb-2"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="mr-2 h-4 w-4" />
      )}
      {isOpen && "Sign In"}
    </Button>
  );
};

export default LoginButton;
