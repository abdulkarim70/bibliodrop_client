import { getCurrentUser } from "@/lib/auth-server"; 
import { redirect } from "next/navigation";
import ManageUsersClient from "@/components/ManageUsersClient";

export default async function ManageUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.email) {
    redirect("/auth/login");
  }

  // অ্যাডমিন যেন ভুলে নিজের অ্যাকাউন্ট ডিলিট করতে না পারে, সেজন্য তার ইমেইলটি পাঠানো হচ্ছে
  return <ManageUsersClient currentUserEmail={currentUser.email} />;
}