import { XanoMinPicture } from "./XanoMinPicture";

export interface VerifierProfile {
    id: number;
    created_at: number;
    user_id: number;
    accepted_terms_and_conditions: boolean;
    profile_picture: XanoMinPicture;
}