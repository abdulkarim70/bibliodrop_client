import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import ManageAllBooksClient from "@/components/ManageAllBooksClient";

export default async function ManageAllBooksPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন না থাকলে লগইন পেজে পাঠাবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <ManageAllBooksClient />;
}