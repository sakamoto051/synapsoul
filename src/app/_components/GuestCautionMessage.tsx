"use client";
import { useSession } from "next-auth/react";

export function GuestCautionMessage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  if (session.user.email) {
    return null;
  }

  return (
    <div className="text-sm text-destructive">
      ゲストログインではログアウト後にご利用できなくなります。
      <br />
      設定からアカウント連携してください。
    </div>
  );
}
