"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

const LoginButton = ({ isOpen }: { isOpen: boolean }) => {
  const { data: session } = useSession();
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {session ? (
        <Button
          variant="ghost"
          className="w-full justify-start mb-2"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2" />
          {isOpen && "Sign Out"}
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start mb-2"
          onClick={handleSignIn}
        >
          <LogIn className="mr-2" />
          {isOpen && "Sign In"}
        </Button>
      )}
    </>
  );
};

export default LoginButton;
