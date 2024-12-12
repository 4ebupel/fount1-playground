import { Job } from "../types/Job";

export default async function getAJob(jobId: string): Promise<Job | null> {
  try {
    const response = await fetch(`/api/aJob?jobId=${jobId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching job data:", error instanceof Error ? error.message : String(error));
    return null;
  }
}