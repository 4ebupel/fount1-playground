import { Company } from "./Company";
import { XanoMinPicture } from "./XanoMinPicture";

export interface EmployerProfile {
    id: number;
    created_at: number;
    user_id: number;
    accepted_terms_and_conditions: boolean;
    profile_summary: string;
    profile_picture: XanoMinPicture;
    companies: Company[];
    role: {
        id: number;
        created_at: number;
        name: string;
        description: string;
    }
}