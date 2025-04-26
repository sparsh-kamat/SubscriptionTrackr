
import { type DefaultSession, type User as DefaultUser } from "next-auth";
import { type UserRole } from "@prisma/client"; // Import your UserRole enum

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Extends the built-in session.user type to include properties
   * you added to your User model in prisma.schema and returned in the
   * session callback in src/lib/auth.ts
   */
  interface Session extends DefaultSession {
    user: {
      id: string; // Add the user ID property
      role: UserRole; // Add the user role property
      image?: string | null; // Optional image property
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }

  /**
   * Extends the built-in User type (typically returned by the adapter or authorize function)
   * to include properties added to your Prisma model.
   */
  interface User extends DefaultUser {
    role: UserRole; // Add the role property
    // Add any other custom fields from your Prisma User model that you might
    // return from the authorize function or expect from the adapter.
  }
}