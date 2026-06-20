import AppShell from "@/layout/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up | YouTube Clone",
  description: "Sign up to get started ",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
