import { User } from "../types/User";
import axios from "axios";
import { useSession } from "next-auth/react";

export async function getUsers(queryString: string): Promise<User[]> {
    const { data: session, status } = useSession();
    const authToken = session?.user?.authToken;

    if (!authToken) {
        throw new Error("No authentication token available");
    }

    const apiUrl = process.env.XANO_API_GROUP_BASE_URL;
    if (!apiUrl) {
        throw new Error("XANO_API_GROUP_BASE_URL is not defined in environment variables");
    }

    try {
        const response = await axios.get<User[]>(`${apiUrl}/user?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}