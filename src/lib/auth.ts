// src/lib/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client"; // Import your UserRole enum

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate input
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        // 2. Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null; // User not found
        console.log("User found:", user);

        // 3. Check if password is set (might be OAuth user)
        console.log("User password:", user.password); // Log the password for debugging
        if (!user.password) return null; // No password set for this user

        //4.check email verification
        console.log("User email verified:", user.emailVerified); // Log the email verification status
        if (!user.emailVerified) return null; // Email not verified

        // 5. Compare password hash
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("Password match:", isValidPassword); // Log the password match result
        if (!isValidPassword) return null; // Passwords don't match

        // 5. Return user object if valid
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }), // End CredentialsProvider
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role as UserRole;
        session.user.image = user.image || null; // Optional image property
      }
      return session;
    },
  },

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
});

export { UserRole };
