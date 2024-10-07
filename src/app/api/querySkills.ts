import { SkillStandardized } from "../types/SkillsStandardized";

export async function querySkills(query: string, filterSkills: string[]): Promise<SkillStandardized[]> {
    let errorTries = 3;
    try {
        const response = await fetch(`/api/skills?query=${query}&filterSkills=${filterSkills.join(',')}`);

        if(!response.ok) {
            throw new Error('Failed to fetch skills');
        }

        const skills = await response.json();
        return skills;
    } catch (error) {
        if(errorTries > 0) {
            errorTries--;
            return querySkills(query, filterSkills);
        }
        console.error('Error fetching skills:', error);
        return [];
    }
}