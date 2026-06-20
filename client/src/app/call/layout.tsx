import AppShell from "@/layout/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Call | YouTube Clone",
  description: "Video call page for YouTube",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
