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
    <div className="text-sm text-red-600">
      ゲストログインの場合、ログアウトすると再度ログインすることができません。
      <br />
      Googleアカウントよりログインください。
    </div>
  );
}
