export interface Experience {
    id: number;
    job_title: string;
    employers_name: string;
    career_level: string;
    working_time: string;
    flexibility: string;
    timeframe_start: string;
    timeframe_end: string;
    is_current_position: boolean;
    working_location: string;
    employers_id: number;
    dwa_reference_id: { id: number; DWA_Title: string }[];
    technology_skills_id: { id: number; Example: string }[];
    Employer_Name?: string;
    Company_Logo?: {
        url: string;
    };
}
  