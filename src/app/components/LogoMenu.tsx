'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, HelpCircle, Settings, Building2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useUser } from "../contexts/UserContext"

export default function LogoMenu() {
  const router = useRouter()
  const { data: session } = useSession();
  const { userData } = useUser();
  const profile_picture_url = userData?.employer_profile?.profile_picture?.url;

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
            {/* <CircleUser className="h-6 w-6" />
            <span className="sr-only">Open menu</span> */}
            <Avatar className="flex-shrink-0 w-10 h-10 rounded-full">
              <AvatarImage 
                src={profile_picture_url}
                alt={`Profile Picture`}
                className="rounded-full"
              />
              <AvatarFallback className="rounded-full">{session?.user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => router.push('/settings')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push('/settings')
              }
            }}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>
              Personal Settings
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/settings')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push('/settings')
              }
            }}
            className="cursor-pointer"
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>
              Company Settings
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push('/support')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push('/support')
              }
            }}
            className="cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogout()
              }
            }}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}