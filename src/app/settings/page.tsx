"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession, signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trash2, LinkIcon } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const deleteAccountMutation = api.user.deleteAccount.useMutation();
  const { data: session } = useSession();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountMutation.mutateAsync();
      toast({
        title: "アカウントが削除されました",
        description: "ご利用ありがとうございました。",
      });
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      toast({
        title: "エラー",
        description: "アカウントの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      await signIn("google", { callbackUrl: "/settings" });
    } catch (error) {
      toast({
        title: "エラー",
        description: "アカウントのアップグレード中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const isGuestUser = session?.user?.email === null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">設定</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-4">
            <Link href="/settings/profile" passHref>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2" />
                プロフィール設定
              </Button>
            </Link>
            {isGuestUser && (
              <Button
                variant="default"
                className="w-full justify-start bg-green-600 hover:bg-green-700"
                onClick={handleUpgrade}
              >
                <LinkIcon className="mr-2" />
                アカウント連携
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="mr-2" />
                  アカウントを削除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    本当にアカウントを削除しますか？
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は取り消せません。全てのデータが完全に削除されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "削除中..." : "削除する"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
