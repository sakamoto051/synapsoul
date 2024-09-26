import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2, User } from "lucide-react";
import { useState } from "react";
import useAuthStore from "~/store/useAuthStore";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        console.error("Sign in failed", result.error);
      } else {
        router.push("/");
      }
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
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button onClick={handleSignOut} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        Sign Out
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => handleSignIn("google")} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Sign In with Google
      </Button>
      <Button onClick={() => handleSignIn("credentials")} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <User className="mr-2 h-4 w-4" />
        )}
        Guest Login
      </Button>
    </div>
  );
};

export default LoginButton;
