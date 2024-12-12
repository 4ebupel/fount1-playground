export interface Job {
    id: number;
    created_at: number;
    edited_at: number;
    status: "Draft" | "Published" | "Staffed" | "Cancelled" | "Deleted";
    company_id: number;
    employer_id: number;
    employers_access?: number[];
    title: string;
    description: string;
    experience_level: "Junior" | "Middle" | "Senior";
    priority: "urgent" | "high" | "normal";
    employment_type: "Full Time" | "Part Time" | "Contract" | "Internship";
    remote_possibilities: "On-Site" | "Hybrid" | "Full Remote";
    starting_date: string;
    locations: string[];
    languages: { language: string; level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }[];
    salary_range: { start: number; end: number };
    skills: { skill_id: number; created_at: number; title: string; skill_type: "software" | "proffesional"; description: string }[];
    responsibilities: { dwa_id: number; DWA_Title: string }[];
    benefits: { icon:  { name: string; meta: { width: number; height: number; }; url: string; }; benefit: string }[];
  }