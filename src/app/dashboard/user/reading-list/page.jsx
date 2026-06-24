import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import ReadingListClient from "@/components/ReadingListClient";

export default async function ReadingListPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <ReadingListClient userEmail={currentUser.email} />;
}