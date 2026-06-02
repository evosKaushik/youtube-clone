import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload | YouTube Clone",
  description: "Upload a new video to your channel",
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
