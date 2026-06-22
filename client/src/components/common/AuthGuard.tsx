"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/libs/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to access this page");
      router.push("/signin"); // Assuming /signin handles the auth flow
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Return a full screen loader or null to prevent flash of content
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-card border-t-text" />
      </div>
    );
  }

  return <>{children}</>;
}
