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
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import updateUserContext from '@/lib/updateUserContext';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ErrorMessage } from './ErrorMessage';
export default function ProfileSettings() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { userData, setUserData } = useUser();

  useEffect(() => {
    setFirstName(userData?.name_first || '');
    setLastName(userData?.name_last || '');
    setEmail(userData?.email || '');
  }, [userData?.email, userData?.name_first, userData?.name_last]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
        
      const formData = new FormData();
      formData.append('file', selectedFile);
        
      setIsLoading(true);
      try {
        const response = await fetch(`/api/uploadProfilePicture`, {
          method: 'POST',
          body: formData,
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error?.message);
        }
    
        setFile(null);
        updateUserContext(setUserData, setIsLoading);
      } catch (err: any) {
        // Clear the file input
        e.target.value = '';
        setFile(null);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  async function handleUpdateProfileInformation(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await fetch('/api/updateProfileInformation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to update profile information.');
      }

      if (email !== userData?.email) {
        const verifyResponse = await fetch('/api/resendVerification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
          
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) {
          throw new Error(verifyData.error?.message || 'Failed to send verification email.');
        }
      }

      updateUserContext(setUserData, setIsLoading);
      setError('');
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
  
      <div className="relative">
        <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <label htmlFor="profile-upload" className="cursor-pointer group relative block w-full h-full">
              <Avatar className="w-full h-full overflow-hidden transition-all duration-200 group-hover:blur-sm">
                <AvatarImage 
                  src={file ? URL.createObjectURL(file) : userData?.employer_profile?.profile_picture?.url || "/images/emptyLogo.png"} 
                  alt="Profile picture"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </label>
          )}
          <input 
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
        </div>
        {error && <ErrorMessage error={error} setError={setError} />}
      </div>
  
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="first-name">First Name</Label>
            {isLoading ? (
              <Skeleton className="w-full h-8" />
            ) : (
              <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            )}
          </div>
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            {isLoading ? (
              <Skeleton className="w-full h-8" />
            ) : (
              <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            )}
          </div>
          <div>
            <Label htmlFor="email">Confirmed Email Address</Label>
            {isLoading ? (
              <Skeleton className="w-full h-8" />
            ) : (
              <div className="flex items-center">
                <Input
                  id="email"
                  value={email}
                  className="flex-grow"
                  onChange={(e) => setEmail(e.target.value)}
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
            )}
          </div>

          <Button 
            variant="outline" 
            className="w-full active:bg-gray-200 dark:active:bg-gray-800" 
            onClick={handleUpdateProfileInformation}
            disabled={
              firstName === userData?.name_first 
                && lastName === userData?.name_last 
                && email === userData?.email
            }
          >
            Update Profile Information
          </Button>
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
            <LogOut className="mr-2 h-4 w-4" />
            {' '}
            Sign out everywhere
          </Button>
          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            {' '}
            Delete my profile
          </Button>
        </div>
      </Card>
    </div>
  );
}
