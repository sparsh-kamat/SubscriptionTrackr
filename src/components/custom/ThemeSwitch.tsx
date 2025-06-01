"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"

interface ThemeSwitchProps {
  label?: boolean;
}

export function ThemeSwitch({ label = true }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so we can safely set mounted to true
  // This helps avoid rendering the switch with a potentially incorrect state
  // during server-side rendering or initial hydration before the client knows the theme.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual current theme state once mounted
  // 'resolvedTheme' is preferred as it correctly interprets 'system' preference
  const isCurrentlyDark = mounted ? resolvedTheme === "dark" : false;
  // Before mounting, you might default to false or try to guess from a cookie/localStorage
  // if next-themes is configured to use them, but relying on 'mounted' and 'resolvedTheme'
  // is generally safer for the final client-side state.

  const handleChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  // To prevent flash of incorrect state or hydration mismatch,
  // you can return a placeholder or null until mounted.
  if (!mounted) {
    // Render a static placeholder that won't cause a hydration mismatch
    // Or, if a brief default state is acceptable before useEffect kicks in,
    // you can render the switch directly but it might flicker.
    // A placeholder maintains layout and indicates loading.
    return (
      <div className="flex items-center space-x-2" aria-hidden="true">
        <Sun className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-5 w-10" />
        <Moon className="h-5 w-5 text-muted-foreground" />
        {label && <Label htmlFor="theme-switch-placeholder">&nbsp;</Label>}
      </div>
    );
  }

  // Once mounted, render the actual switch based on the resolved theme
  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-colors ${isCurrentlyDark ? "text-muted-foreground" : "text-yellow-500"}`} />
      <Switch
        id="theme-switch"
        checked={isCurrentlyDark}
        onCheckedChange={handleChange}
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-5 w-5 transition-colors ${isCurrentlyDark ? "text-blue-500" : "text-muted-foreground"}`} />
      {label && (
        <Label htmlFor="theme-switch">
          {isCurrentlyDark ? "Dark Mode" : "Light Mode"}
        </Label>
      )}
    </div>
  );
}