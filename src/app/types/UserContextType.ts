import { User } from "./User";

export interface UserContextType {
    userData: User | null;
    setUserData: (user: User | null) => void;
}