"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/libs/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please login to access this page");
      // Preserve the page the user was trying to access so we can redirect back after login
      const returnUrl = encodeURIComponent(pathname || "/");
      router.push(`/signup?redirect=${returnUrl}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-card border-t-text" />
      </div>
    );
  }

  return <>{children}</>;
}
