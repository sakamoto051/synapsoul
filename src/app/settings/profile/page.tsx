// src/app/settings/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSettingsPage = () => {
  const [displayName, setDisplayName] = useState("");
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.displayName) {
      setDisplayName(session.user.displayName);
    }
  }, [session]);

  const updateDisplayNameMutation = api.user.updateDisplayName.useMutation({
    onSuccess: async () => {
      await update({ displayName });
      toast({
        title: "表示名を更新しました",
        description: "表示名が正常に更新されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `表示名の更新に失敗しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      updateDisplayNameMutation.mutate({ displayName });
    }
    router.push("/");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                表示名
              </label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={updateDisplayNameMutation.isPending}
            >
              {updateDisplayNameMutation.isPending
                ? "更新中..."
                : "表示名を更新"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsPage;
