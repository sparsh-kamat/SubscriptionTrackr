// src/components/SessionProviderWrapper.tsx
'use client'; // <--- Mark this component as a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

// Define the props type, accepting children
interface Props {
  children: React.ReactNode;
}

/**
 * A wrapper component for NextAuth's SessionProvider.
 * This is necessary because SessionProvider uses React Context/Hooks,
 * which are only available in Client Components. We use this wrapper
 * within the root Server Component layout (layout.tsx) to provide
 * session context to the rest of the (client-side) application.
 */
export default function SessionProviderWrapper({ children }: Props) {
  return (
    // Render the actual SessionProvider from next-auth, passing children through
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}