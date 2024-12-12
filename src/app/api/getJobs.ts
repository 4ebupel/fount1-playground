export async function getJobs(company_id: number) {
  try {
    const response = await fetch(`/api/jobs/?company_id=${company_id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}