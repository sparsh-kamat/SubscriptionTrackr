// Your existing ThemeSwitch.tsx, modified to use the icon prop
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react"; // Using SunIcon to match general usage, or SunMediumIcon from demo
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // This is now your customized Switch
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeSwitchProps {
  label?: boolean;
}

export function ThemeSwitch({ label = true }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isCurrentlyDark = mounted ? resolvedTheme === "dark" : false;

  const handleChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  if (!mounted) {
    // Placeholder to avoid hydration mismatch and layout shift
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-7 w-12" /> {/* Skeleton for switch root */}
        <Skeleton className="h-6 w-6" /> {/* Skeleton for thumb */}
        {label && <Skeleton className="h-4 w-24" />} {/* Skeleton for label */}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Optional: Keep external Sun/Moon icons if you like the look */}
      {/* <SunIcon className={`h-5 w-5 transition-colors ${isCurrentlyDark ? "text-muted-foreground" : "text-yellow-500"}`} /> */}
      
      <Switch
        id="theme-switch"
        checked={isCurrentlyDark}
        onCheckedChange={handleChange}
        aria-label="Toggle dark mode"
        // Props from your SwitchCustomizationDemo to size it and the thumb
        className="h-7 w-12" // Custom size for the switch root
        thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5" // Custom size & translate for thumb
        icon={
          isCurrentlyDark ? (
            <MoonIcon className="h-4 w-4" /> // Icon for dark state (moon in thumb)
          ) : (
            <SunIcon className="h-4 w-4" />   // Icon for light state (sun in thumb)
          )
        }
      />
      
      {/* Optional: Keep external Sun/Moon icons if you like the look */}
      {/* <MoonIcon className={`h-5 w-5 transition-colors ${isCurrentlyDark ? "text-blue-500" : "text-muted-foreground"}`} /> */}
      
      {label && (
        <Label htmlFor="theme-switch" className="cursor-pointer">
          {isCurrentlyDark ? "Dark Mode" : "Light Mode"}
        </Label>
      )}
    </div>
  );
}