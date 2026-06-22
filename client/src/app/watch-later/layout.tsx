import type { Metadata } from "next";
import AppShell from "@/layout/AppShell";

export const metadata: Metadata = {
  title: "Watch Later | YouTube Clone",
  description: "Videos you have saved to watch later",
};

export default function WatchLaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
