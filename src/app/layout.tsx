// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // Import your session provider wrapper
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Import Sonner toaster (aliased to avoid name clash if needed)
import { ThemeProvider } from "@/components/theme-provider"; // Import your theme provider
import { Navbar } from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics} from "@vercel/analytics/react"; // Import Vercel Analytics
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper className="flex flex-col min-h-screen flex-grow">
            <Navbar />
            
            <main className=" flex flex-col flex-grow ">{children}</main>
            <SonnerToaster richColors position="bottom-right" />
          </SessionProviderWrapper>
        </ThemeProvider>
        <SpeedInsights/>
        <Analytics />
      </body>
    </html>
  );
}
