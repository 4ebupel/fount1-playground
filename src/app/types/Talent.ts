export interface Talent {
    id: number;
    user_id: number;
    talent_title: string;
    talent_provider: string | null ;
    issuing_date: string | null;
    level: string;
    self_verified_level: string;
    talent_type: string;
    skill_id: number;
    years_of_experience: number;
    documents_ids: number[];
    experiences_ids: number[];
  }