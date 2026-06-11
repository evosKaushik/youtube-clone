import AppShell from "@/layout/AppShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youtube | History",
  description:
    "Watch your YouTube watch history, manage it, and clear it if you want.",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}