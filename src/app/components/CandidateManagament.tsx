'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from './Header'
import FilterBar from './FilterBar'
import CandidateList from './CandidateList'
import CandidateDetails from './CandidateDetails'
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUsers } from '../api/getUsers'
import { User } from '../types/User'
import Loader from './Loader'
import { useSearchParams } from 'next/navigation'

//  end of a month or end of a quarter + X amount of days or months.
//  candidate has either a notice period or an availability day.

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
  
  const fetchUsers = async (currentFilters: { skills: string[]; experienceLevel: string[]; minRating: number; location: string; minSalary: number; maxSalary: number; availableIn: number | undefined; }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams(searchParams);
      if (currentFilters.skills.length) queryParams.set('skills_string', currentFilters.skills.join(','));
      if (currentFilters.experienceLevel.length) queryParams.set('experienceLevel', currentFilters.experienceLevel.join(','));
      if (currentFilters.minRating) queryParams.set('minRating', currentFilters.minRating.toString());
      if (currentFilters.location) queryParams.set('location', currentFilters.location);
      if (currentFilters.minSalary) queryParams.set('minSalary', currentFilters.minSalary.toString());
      if (currentFilters.maxSalary) queryParams.set('maxSalary', currentFilters.maxSalary.toString());
      if (currentFilters.availableIn !== undefined) queryParams.set('availableIn', currentFilters.availableIn.toString());
      const fetchedUsers = await getUsers(queryParams.toString());
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
      fetchUsers(newFilters);
  }, [searchParams]);

  const handleCandidateClick = (candidate: User) => {
    if (selectedCandidate && selectedCandidate.id === candidate.id) {
      setSelectedCandidate(null)
    } else {
      setSelectedCandidate(candidate)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex gap-6 overflow-hidden">
        <FilterBar isOpen={isFilterBarOpen} setIsOpen={setIsFilterBarOpen} filters={filters} setFilters={setFilters} />
        <div className="flex-1 flex gap-6">
          <ScrollArea className="flex-1 overflow-visible">
            {isLoading ? (
              <Loader />
            ) : (
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