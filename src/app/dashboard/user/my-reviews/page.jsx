import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import MyReviewsClient from "@/components/MyReviewsClient";

export default async function MyReviewsPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন না থাকলে প্রটেক্টেড রাউট হিসেবে রিডাইরেক্ট করবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <MyReviewsClient userEmail={currentUser.email} />;
}