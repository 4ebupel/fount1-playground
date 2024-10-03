import axios from "axios";
import { SkillStandardized } from "../types/SkillsCombined";

export async function querySkills(query: string, filterSkills: string[]): Promise<SkillStandardized[]> {
    const authToken = process.env.NEXT_PUBLIC_XANO_API_KEY;
    const response = await axios.get<SkillStandardized[]>(`https://xwmq-s7x2-c3ge.f2.xano.io/api:mWh-8XyD/querySkills?query=${query}&filterSkills=${filterSkills.join(',')}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    return response.data;
}