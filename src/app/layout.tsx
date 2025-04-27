// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // Import your session provider wrapper
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Import Sonner toaster (aliased to avoid name clash if needed)
import { ThemeProvider } from "@/components/theme-provider"; // Import your theme provider
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Underground Tix App",
  description: "Your underground show hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper>
            <main className="p-4">{children}</main>
            <SonnerToaster richColors position="top-right" />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
