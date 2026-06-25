import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import AllTransactionsClient from "@/components/AllTransactionsClient";

export default async function AllTransactionsPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন না থাকলে প্রটেক্টেড রাউট হিসেবে রিডাইরেক্ট করবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <AllTransactionsClient />;
}