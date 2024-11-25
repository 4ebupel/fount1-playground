import { XanoMinPicture } from "./XanoMinPicture";

export interface CandidateProfile {
    id: number;
    created_at: number;
    user_id: number;
    accepted_terms_and_conditions: boolean;
    desired_salary: number;
    available_in: number;
    flexibility: "On-Site" | "Remote" | "Hybrid";
    career_level: string;
    profile_summary: string;
    profile_picture: XanoMinPicture;
}