'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, HelpCircle, Settings, Building2, CircleUser } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoMenu() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call the API route to invalidate the refresh token
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
  
      if (!response.ok) {
        console.error('Failed to invalidate refresh token');
        // Handle the error (e.g., show a notification)
      }
  
      // Proceed to sign out
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle the error (e.g., show a notification)
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
            <CircleUser className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Personal Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Company Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span onClick={() => router.push('/support')}>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}