import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import DeliveryHistoryClient from "@/components/DeliveryHistoryClient"; // Client Component ইমপোর্ট করা হলো

export default async function DeliveryHistoryPage() {
  const currentUser = await getCurrentUser();

  // ইউজার লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেবে
  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <DeliveryHistoryClient userEmail={currentUser.email} />;
}