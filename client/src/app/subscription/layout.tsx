import AppShell from "@/layout/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription | YouTube Clone",
  description: "Subscription for the youtube ",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
