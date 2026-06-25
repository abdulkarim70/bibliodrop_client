import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import AdminOverviewClient from "@/components/AdminOverviewClient";

export default async function AdminOverviewPage() {
  const currentUser = await getCurrentUser();

  // যদি ইউজার লগইন না থাকে বা অ্যাডমিন না হয়, তবে রিডাইরেক্ট করা
  // (ধরে নিচ্ছি আপনার role চেক করার ব্যবস্থা আছে, না থাকলে শুধু লগইন চেক করবে)
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <AdminOverviewClient />;
}