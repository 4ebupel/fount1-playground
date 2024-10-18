"use client"

import { Search, Sun, Moon, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import LogoMenu from "./LogoMenu";
import { useRouter } from "next/navigation";

export default function Header() {
  // const { theme, setTheme } = useTheme();

  // const handleThemeToggle = () => {
  //   setTheme(theme === "light" ? "dark" : "light");
  // };

  const router = useRouter()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
        <Avatar className="flex-shrink-0 w-12 h-12 rounded-full">
              <AvatarImage 
                src={"../../images/Logo-04.svg"}
                alt={`Company Logo`}
                className="rounded-full"
              />
              <AvatarFallback className="rounded-full">F</AvatarFallback>
            </Avatar>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>Start</Button>
            <Button variant="ghost" onClick={() => router.push("/candidates")}>Candidates</Button>
          </nav>
        </div>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder='e.g. "create jobad"' className="pl-8" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            {/* {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )} */}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <LogoMenu />
        </div>
      </div>
    </header>
  )
}