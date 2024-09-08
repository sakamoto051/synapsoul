import { redirect } from "next/navigation";
import { initializeAuthStore } from "~/utils/authInitializer";
import MyBooksClient from "./MyBooksClient";
import useAuthStore from "~/store/useAuthStore";

export default async function MyBooksPage() {
  await initializeAuthStore();

  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    redirect("/api/auth/signin");
  }

  return <MyBooksClient />;
}
