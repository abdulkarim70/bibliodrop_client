import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";

import ManageInventoryClient from "@/components/ManageInventoryClient"; 

export default async function ManageInventoryPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <ManageInventoryClient librarianEmail={currentUser.email} />;
}