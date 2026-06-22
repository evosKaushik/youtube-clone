import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Call | YouTube Clone",
  description: "Video call page for YouTube",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-background text-text">
      {children}
    </main>
  );
}
