import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liked Videos | YouTube Clone",
  description: "Videos you have liked",
};

export default function LikedVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
