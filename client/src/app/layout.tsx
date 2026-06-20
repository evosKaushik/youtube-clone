import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "plyr-react/plyr.css";
import Navbar from "@/components/layout/navbar/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { UserProvider } from "@/libs/AuthContext";
import { Toaster } from "react-hot-toast";
import { PopupProvider } from "@/contexts/popupContext";
import { getThemeByLocationAndTime } from "@/libs/utils";

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
      <body className={`${inter.variable} bg-background text-text`}>
        <PopupProvider>
          <UserProvider>
            <Navbar />
            <Sidebar />
            {children}
          </UserProvider>
        </PopupProvider>
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
        <div id="root"></div>
      </body>
    </html>
  );
}
