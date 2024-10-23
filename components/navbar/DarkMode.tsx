"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function DarkMode() {
//   const { setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

export default function DarkMode() {
  // Because we cannot know the theme on the server, many of the values returned from useTheme will be undefined until mounted on the client. 
  // This means if you try to render UI based on the current theme before mounting on the client, you will see a hydration mismatch error.
  
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // This is just a placeholder to avoid layout shift
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0" />
      </Button>
    );
  }

  return (
    <>
      {theme === "light" ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90" />
        </Button>
      )}
      <span className="sr-only">Toggle theme</span>
    </>
  );
}
