// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SessionProviderWrapper from '@/components/SessionProviderWrapper'; // Import your session provider wrapper
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Import Sonner toaster (aliased to avoid name clash if needed)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comedy Tix App",
  description: "Your underground comedy show hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <main className="p-4">{children}</main>
          {/* Use Sonner's Toaster */}
          {/* You can add props like position, richColors, theme, etc. */}
          <SonnerToaster richColors position="top-right" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}