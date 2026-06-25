import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import LibrarianOverviewClient from "@/components/LibrarianOverviewClient";

export default async function LibrarianOverviewPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন না থাকলে প্রটেক্টেড রাউট হিসেবে রিডাইরেক্ট করবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <LibrarianOverviewClient librarianEmail={currentUser.email} />;
}