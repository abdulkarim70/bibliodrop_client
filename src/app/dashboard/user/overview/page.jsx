import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/UserDashboardClient";

export default async function UserDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  return <UserDashboardClient userEmail={currentUser.email} />;
}