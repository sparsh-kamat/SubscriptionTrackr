"use client"

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

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
import { ThemeSwitch } from "@/components/custom/ThemeSwitch"
import { Button } from "@/components/ui/button";
//navbar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"


export const  Navbar = () => {
return (
    < div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <Link href="/" className="text-xl font-bold">UnderGround Tix</Link>
        <nav className="space-x-4">
            <Link href="/events" className="hover:underline">Events</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/cart" className="hover:underline">Cart</Link>
            <ThemeSwitch />
        </div>
    </div>
)
}


