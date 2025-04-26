// src/components/icons.tsx

import {
  type LucideProps,
  Loader2, // A good spinner icon
  Chrome, // Using Chrome icon as a placeholder for Google logo
  // Add other icons from 'lucide-react' as needed
} from "lucide-react";

// Define the Icons object
// Each key maps to a React component function rendering a specific Lucide icon
// We pass props down to allow customization (like className, size)
export const Icons = {
  spinner: (props: LucideProps) => (
    <Loader2 className="h-4 w-4 animate-spin" {...props} /> // Default size and spin animation
  ),
  google: (props: LucideProps) => (
    <Chrome className="h-4 w-4" {...props} /> // Default size for Google button icon
  ),
  // Example for GitHub if you add it back later
  // gitHub: (props: LucideProps) => (
  //   <Github className="h-4 w-4" {...props} />
  // ),
  // Add more icons here as your application needs them
  // e.g., user: User, lock: Lock, etc.
};

// Optional: You could also define types if needed elsewhere
// export type IconKeys = keyof typeof Icons;
