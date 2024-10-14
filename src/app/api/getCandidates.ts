import { User } from '../types/User';

export async function getCandidates(queryString: string): Promise<User[]> {
  try {
    const response = await fetch(`/api/candidates?${queryString}`);

    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching candidates (getCandidates):', error);
    return [];
  }
}
