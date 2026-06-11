import AppShell from "@/layout/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | YouTube Clone",
  description: "user profile",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
