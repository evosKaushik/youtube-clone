import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/libs/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YouTube Clone",
  description: "Modern YouTube UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <UserProvider>
          <Navbar />
          <Sidebar />
          <ThemeProvider>{children}</ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
