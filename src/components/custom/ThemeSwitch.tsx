"use client"

import * as React from "react"
import { useTheme } from "next-themes"

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
      <Switch id="theme-switch" checked={isDarkMode} onCheckedChange={handleChange} />
      {label && (
        <Label htmlFor="theme-switch">
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Label>
      )}
    </div>
  )
}
