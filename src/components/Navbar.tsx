"use client";

import Link from "next/link";
import { ThemeSwitch } from "@/components/custom/ThemeSwitch";
import { useSession } from "next-auth/react"; // Adjust path if needed
import { signOut } from "next-auth/react";

import { Button, buttonVariants } from "@/components/ui/button"; // Adjust path if needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust path
import { Menu } from "lucide-react"; // For mobile menu icon
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu drawer

export const Navbar = () => {
  const { data: session } = useSession();

  //get only the first name from the user name
  const firstName = session?.user?.name?.split(" ")[0];
  return (
    <nav className="sticky flex h-16 top-0 z-50 w-full border-b bg-background/95 backdrop:backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      <div className="ml-5 container flex  items-center">
        <Link href="/" className=" flex items-center space-x-2">
          <span className="font-normal inline-block  text-2xl ">
            TrackMySubs
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-between space-x-4 ml-auto ">
        {session?.user ? (
          //show avatar and dropdown menu if user is logged in
          <div className=" flex items-center m-0">
            <div className="hidden md:flex  items-center space-x-4">
              <Link
                href={"/dashboard"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Dashboard
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative  rounded-full"
                >
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={session.user?.image ?? undefined}
                      alt="User Avatar"
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* <span className="">{ firstName }</span> */}
                  {/* add icon for dropown */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>

                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel
                  className="font-normal"
                  onClick={() => signOut()}
                >
                  Sign Out
                </DropdownMenuLabel>
                <DropdownMenuSeparator />     
                <DropdownMenuLabel className="font-normal">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          //show login button if user is not logged in
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Link href={"/auth/signin"}>Login</Link>
          </Button>
        )}

        {/* Mobile Menu Trigger (Visible on small screens) */}
        {session && (
          <div className="sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                {/* Add Mobile Navigation Links Here */}
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Dashboard
                  </Link>

                  {/* Add other mobile links here */}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </nav>
  );
};
