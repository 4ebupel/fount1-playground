import { SkillStandardized } from "../types/SkillsStandardized";

// export async function querySkills(query: string, filterSkills: string[]): Promise<SkillStandardized[]> {
//     const authToken = process.env.NEXT_PUBLIC_XANO_API_KEY;
//     const response = await axios.get<SkillStandardized[]>(`https://xwmq-s7x2-c3ge.f2.xano.io/api:mWh-8XyD/querySkills?query=${query}&filterSkills=${filterSkills.join(',')}`, {
//         headers: {
//             'Authorization': `Bearer ${authToken}`
//         }
//     });
//     return response.data;
// }
export async function querySkills(query: string, filterSkills: string[]): Promise<SkillStandardized[]> {
    try {
        const response = await fetch(`/api/skills?query=${query}&filterSkills=${filterSkills.join(',')}`);

        if(!response.ok) {
            throw new Error('Failed to fetch skills');
        }

        const skills = await response.json();
        return skills;
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
}