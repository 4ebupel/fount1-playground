import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
            const response = await fetch('/api/me', {
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
          } catch (error: any) {
            const isXanoError = Boolean(error?.getResponse?.());
            console.log("isXanoError:", isXanoError);
            console.error("Xano auth/me error:", isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error);
            throw new Error(isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error.message || "An unexpected error occurred");
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
  };

  export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
