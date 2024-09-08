import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import MyBooksClient from "./MyBooksClient";

export default async function MyBooksPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <MyBooksClient />;
}
