export interface VerifierProfile {
    id: number;
    created_at: number;
    user_id: number;
    profile_summary: string;
    profile_picture: {
        url: string;
    };
}