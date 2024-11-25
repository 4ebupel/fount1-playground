import { Experience } from "./Experience";
import { Standardized_doc } from "./Standardized_doc";
import { Talent } from "./Talent";

export interface User {
    id: number;
    created_at: number;
    name_first: string;
    name_last: string;
    email: string;
    desired_salary: number;
    talents: Talent[];
    experiences: Experience[];
    standardized_documents: Standardized_doc[];
    availableIn: number;
    flexibility: string;
    career_level: string;
    profile_summary: string;
    profile_picture: {
      url: string;
    };
  }