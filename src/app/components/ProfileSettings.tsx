import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from '@/components/ui/avatar';
  import { Button } from '@/components/ui/button';
  import { Card } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Checkbox } from '@/components/ui/checkbox';
  import {
    Check,
    Pen,
    Camera,
    LogOut,
    Trash2,
  } from 'lucide-react';
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
import { useSession } from 'next-auth/react';
  
  export default function ProfileSettings() {
    const { data: session, status } = useSession();
    const profile_picture_url = session?.user?.profile_picture_url;
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
  
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            <Avatar className="w-full h-full">
              <AvatarImage src={profile_picture_url || "/images/emptyLogo.png"} alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
  
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" />
            </div>
            <div>
              <Label htmlFor="email">Confirmed Email Address</Label>
              <div className="flex items-center">
                <Input
                  id="email"
                  value="user@example.com"
                  readOnly
                  className="flex-grow"
                />
                <Check className="ml-2 text-green-500" size={20} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Pen size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        If you edit this, you need to approve the new email and
                        it will change the website of your company
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </Card>
  
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
              <Button variant="link" className="mt-2">
                Change Password
              </Button>
            </div>
            <div>
              <Label>Privacy Preferences</Label>
              <div className="space-y-2 mt-2">
                <Checkbox id="marketing-emails" />
                <label htmlFor="marketing-emails" className="ml-2">
                  Receive marketing emails
                </label>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Sign out everywhere
            </Button>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Delete my profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  