"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/libs/AuthContext";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If user is already logged in, redirect them away from auth pages
    if (user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-card border-t-text" />
      </div>
    );
  }

  // If user is already logged in, don't render the auth page content
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-card border-t-text" />
      </div>
    );
  }

  return <>{children}</>;
}
