'use client'

import { useEffect, useState } from 'react'
import FilterBar from './FilterBar'
import CandidateList from './CandidateList'
import CandidateDetails from './CandidateDetails'
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCandidates } from '../api/getCandidates'
import { User } from '../types/User'
import Loader from './Loader'
import { useSearchParams } from 'next/navigation'

export default function CandidateManagement() {
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    skills: string[];
    experienceLevel: string[];
    minRating: number;
    location: string;
    minSalary: number;
    maxSalary: number;
    availableIn?: number | undefined;
  }>({
    skills: [],
    experienceLevel: [],
    minRating: 0,
    location: '',
    minSalary: 0,
    maxSalary: 200000,
    availableIn: undefined,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const newFilters = {
      skills: searchParams.get('skills')?.split(',') || [],
      experienceLevel: searchParams.get('experienceLevel')?.split(',') || [],
      minRating: Number(searchParams.get('minRating')) || 0,
      location: searchParams.get('location') || '',
      minSalary: Number(searchParams.get('minSalary')) || 0,
      maxSalary: Number(searchParams.get('maxSalary')) || 200000,
      availableIn: searchParams.get('availableIn') !== null ? Number(searchParams.get('availableIn')) : undefined,
    };
    setFilters(newFilters);

    async function fetchUsers(currentFilters: {
      skills: string[];
      experienceLevel: string[];
      minRating: number;
      location: string;
      minSalary: number;
      maxSalary: number;
      availableIn: number | undefined;
    }): Promise<User[]> {
      const queryParams = new URLSearchParams();

      if (currentFilters.skills.length) { queryParams.set('skills', currentFilters.skills.join(',')); }
      if (currentFilters.experienceLevel.length) { queryParams.set('experienceLevel', currentFilters.experienceLevel.join(',')); }
      if (currentFilters.minRating) { queryParams.set('minRating', currentFilters.minRating.toString()); }
      if (currentFilters.location) { queryParams.set('location', currentFilters.location); }
      if (currentFilters.minSalary) { queryParams.set('minSalary', currentFilters.minSalary.toString()); }
      if (currentFilters.maxSalary) { queryParams.set('maxSalary', currentFilters.maxSalary.toString()); }
      if (currentFilters.availableIn !== undefined) { queryParams.set('availableIn', currentFilters.availableIn.toString()); }

      const fetchedUsers = await getCandidates(queryParams.toString());
      return fetchedUsers;
    }

    setIsLoading(true);
    fetchUsers(newFilters)
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleCandidateClick = (candidate: User) => {
    if (selectedCandidate && selectedCandidate.id === candidate.id) {
      setSelectedCandidate(null)
    } else {
      setSelectedCandidate(candidate)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 container mx-auto px-4 py-8 flex gap-6 overflow-y-auto">
        <FilterBar isOpen={isFilterBarOpen} setIsOpen={setIsFilterBarOpen} filters={filters} setFilters={setFilters} />
        <div className="flex-1 flex gap-6">
          <ScrollArea className="flex-1 overflow-hidden">
            {isLoading && (
              <Loader />
            )}
            {users.length <= 0 && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p>No candidates found for your search</p>
                <p className="text-muted-foreground">Try to clear some filters or remove the search query</p>
              </div>
            )}
            {users.length > 0 && !isLoading && (
              <CandidateList
                candidates={users}
                selectedCandidate={selectedCandidate}
                onCandidateClick={handleCandidateClick}
              />
            )}
          </ScrollArea>
          <div className="w-1/2">
            <CandidateDetails selectedCandidate={selectedCandidate} />
          </div>
        </div>
      </main>
    </div>
  )
}