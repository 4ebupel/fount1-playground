import { createContext, ReactNode, useEffect, useState } from "react";
import { UserContextType } from "../types/UserContextType";
import { useSession } from "next-auth/react";
import { User } from "../types/User";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<User | null>(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (status === 'authenticated' && session?.accessToken) {
          try {
            const response = await fetch('/auth/me', {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
              },
            });
  
            if (response.ok) {
              const data: User = await response.json();
              setUserData(data);
            } else {
              console.error('Failed to fetch user data:', response.statusText);
              // Optionally handle specific status codes
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setUserData(null);
        }
      };
  
      fetchUserData();
    }, [status, session]);
  
    return (
      <UserContext.Provider value={{ userData, setUserData }}>
        {children}
      </UserContext.Provider>
    );
  }
