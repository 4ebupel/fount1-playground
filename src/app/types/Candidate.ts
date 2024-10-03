export interface Candidate {
  id: number;
  rating: number;
  skills: string;
  summary: string;
  location: string;
  available: string;
  level: string;
  skillDistribution: Array<{
    name: string;
    value: number;
  }>;
}