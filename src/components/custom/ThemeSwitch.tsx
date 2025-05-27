"use client"

import * as React from "react"
import { useTheme } from "next-themes"
//import sun and moon icons if needed
import { Sun, Moon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ThemeSwitchProps {
  label?: boolean  // Optionally show the label
}

export function ThemeSwitch({ label = true }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [theme])

  const handleChange = (checked: boolean) => {
    setIsDarkMode(checked)
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
     {/* //add sun to left  */}
      <Sun className={`h-5 w-5 ${isDarkMode ? "text-muted-foreground" : "text-yellow-500"}`} />
      {/* //add moon to right */}
      <Switch id="theme-switch" checked={isDarkMode} onCheckedChange={handleChange} aria-label="Toggle dark mode" />
      <Moon className={`h-5 w-5 ${isDarkMode ? "text-blue-500" : "text-muted-foreground"}`} />
      {label && (
        <Label htmlFor="theme-switch">
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Label>
      )}
    </div>
  )
}
