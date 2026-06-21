"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

import UserSidebar from "@/components/UserSidebar";
import AdminSidebar from "@/components/AdminSidebar";
import LibrarianSidebar from "@/components/LibrarianSidebar";

export default function RoleBasedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const role = user?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // ROLE BASED PROTECTION (clean version)
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      router.replace("/dashboard/user");
    }

    if (pathname.startsWith("/dashboard/librarian") && role !== "librarian") {
      router.replace("/dashboard/user");
    }

    if (pathname.startsWith("/dashboard/user") && role === "admin") {
      router.replace("/dashboard/admin");
    }

  }, [user, isPending, pathname, role]);

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="Checking access..." />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">

      {role === "admin" && <AdminSidebar />}
      {role === "librarian" && <LibrarianSidebar />}
      {role === "reader" && <UserSidebar />}

      <main className="flex-1 p-6 bg-gray-50/30">
        {children}
      </main>

    </div>
  );
}