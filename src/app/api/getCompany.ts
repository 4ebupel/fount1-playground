import { Company } from "../types/Company";

export default async function getCompany(companyId: string): Promise<Company | null> {
  try {
    const response = await fetch(`/api/company?companyId=${companyId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching company data:", error instanceof Error ? error.message : String(error));
    return null;
  }
}