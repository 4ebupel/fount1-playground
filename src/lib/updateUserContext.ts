export default async function updateUserContext(setUserData: (data: any) => void, setLoading: (loading: boolean) => void) {
    setLoading(true);
    try {
        const response = await fetch('/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response}`);
        }

        const data = await response.json();
        setUserData(data);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    } finally {
        setLoading(false);
    }
}
