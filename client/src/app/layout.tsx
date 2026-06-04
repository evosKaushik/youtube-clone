import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "plyr-react/plyr.css";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/libs/AuthContext";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-black text-white`}>
        <UserProvider>
          <Navbar />
          <Sidebar />
          {children}
        </UserProvider>
        <Toaster
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "var(--card)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "var(--card)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
