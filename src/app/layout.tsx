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
  // Default title for all pages, with a template for page-specific titles
  title: {
    default: "Subscription Trackr - Manage Your Subscriptions with Ease",
    template: "%s | Subscription Trackr",
  },
  description: "Track all your subscriptions in one place. Get insights into your monthly and yearly spending, manage renewals, and take control of your finances.",
  keywords: ["subscription tracker", "expense manager", "recurring payments", "budgeting tool", "personal finance"],
  
  // Open Graph (Meta/Facebook) metadata
  openGraph: {
    title: "Subscription Trackr",
    description: "Manage your subscriptions with ease and get insights into your spending.",
    url: "https://subsciptiontrackr.vercel.app/", // Replace with your actual website URL
    siteName: "Subscription Trackr",
    images: [
      {
        url: "/og-image.png", // Replace with a URL to your open graph image (e.g., in the /public folder)
        width: 1200,
        height: 630,
        alt: "Subscription Trackr Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Subscription Trackr - Manage Your Subscriptions with Ease",
    description: "Track all your subscriptions in one place and take control of your finances.",
    images: ["/og-image.png"], // Replace with the same image as Open Graph
    creator: "@sparshstwt", 
  },

  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  
  // Robots file configuration for search engine crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
