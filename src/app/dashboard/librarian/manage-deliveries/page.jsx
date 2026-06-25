import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import ManageDeliveryClient from "@/components/ManageDeliveryClient";

export default async function ManageDeliveryPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <ManageDeliveryClient librarianEmail={currentUser.email} />;
}