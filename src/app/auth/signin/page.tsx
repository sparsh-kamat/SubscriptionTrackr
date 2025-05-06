// src/app/signin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner"; // Use Sonner for toasts
import { Icons } from "../../../components/icons";
//import { ThemeSwitch } from "@/components/custom/ThemeSwitch"

// Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

// Infer the TypeScript type from the Zod schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInPage() {
  // State for loading indicators
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Next.js hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  // Effect to handle messages/errors passed via URL query parameters
  //eg ?error=CredentialsSignin
  //eg ?success=EmailVerified
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      const errorMessage =
        error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : error === "OAuthAccountNotLinked"
          ? "This email is linked to another provider. Try signing in with that provider."
          : error === "VerificationFailed"
          ? "Failed to Verify Email"
          : error === "MissingToken"
          ? "Token is Missing, Register Again"
          : error === "InvalidToken"
          ? "Token is expired/invalid, register again."
          : "An error occurred during sign in. Please try again.";
      toast.error("Login Failed", { description: errorMessage });
      // Clean the URL search params without reloading the page
      window.history.replaceState(null, "", "/auth/signin"); // Adjust path if needed
    }

    //for success messages from other pages
    const success = searchParams?.get("success");
    if (success) {
      //for email sent, email verified and password reset success
      const successMessage =
        success === "EmailVerified"
          ? "Your email has been verified. You can now log in."
          : success === "PasswordReset"
          ? "Your password has been reset successfully. You can now log in."
          : success === "EmailSent"
          ? "A verification email has been sent to your email address."
          : success === "EmailVerificationSent"
          ? "A verification email has been sent to your email address."
          : "";

      toast.success("Success", { description: successMessage });
      window.history.replaceState(null, "", "/auth/signin"); // Adjust path if needed
    }
  }, [searchParams]);

  // Setup react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handler for Email/Password form submission
  const onCredentialsSubmit = async (values: LoginFormValues) => {
    setIsLoadingCredentials(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // Handle redirection manually
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // Use Sonner to show generic error for credentials failure
        toast.error("Login Failed", {
          description: "Invalid email or password.",
        });
      } else if (result?.ok) {
        // Success! Redirect to dashboard or the page the user was trying to access
        // const session = await getSession();
        // console.log("Session started:", session);
        const callbackUrl = searchParams?.get("callbackUrl") || "/";
        // if (session) {
        router.push(callbackUrl);
        // }

        // Optionally refresh server components after login
        // router.refresh();
      } else {
        // Handle unexpected non-error, non-ok results
        toast.error("Login Failed", {
          description: "An unexpected error occurred.",
        });
      }
    } catch (error) {
      // Handle fetch or other unexpected errors
      console.error("Login submit error:", error);
      toast.error("Login Failed", {
        description: "An error occurred while trying to sign in.",
      });
    } finally {
      setIsLoadingCredentials(false);
    }
  };

  // Handler for "Continue with Google" button click
  const handleGoogleSignIn = () => {
    setIsLoadingGoogle(true);
    // Initiate Google sign-in flow
    // NextAuth handles the redirect loop and callback
    signIn("google", {
      callbackUrl: searchParams?.get("callbackUrl") || "/dashboard",
    });                                                             
    // No need to set loading false, page redirects
  };

  // Combined loading state
  const isLoading = isLoadingCredentials || isLoadingGoogle;

  return (
    // Centering container
    <div className="flex justify-center  pt-32 h-min bg-muted/40 ">
      <Card className=" ml-5 mr-5  w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Google Sign In Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoadingGoogle ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCredentialsSubmit)}
              className="grid gap-4"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-baseline">
                      <FormLabel>Password</FormLabel>
                      {/* Forgot Password Link */}
                      <Link
                        // Adjust href if your auth routes aren't under /auth/
                        href={"/auth/confirmemail"}
                        className="text-sm font-medium text-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoadingCredentials && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              // Adjust href if your auth routes aren't under /auth/
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
