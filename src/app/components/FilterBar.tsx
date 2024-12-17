'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Filter, Plus, Trash2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DualRangeSlider } from "@/components/dualRangeSlider"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect, useRef } from "react"
import { debounce } from "@/lib/utils"
import { querySkills } from "@/app/api/querySkills"
import { SkillStandardized } from "../types/SkillsStandardized"
import { format, isSameDay, startOfDay } from "date-fns"
import { Job } from '../types/Job'
import { Skeleton } from "@/components/ui/skeleton"
import { getJobs } from "@/app/api/getJobs"
import { useUser } from '../contexts/UserContext'

interface FilterBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filters: {
    skills: string[];
    experienceLevel: string[];
    location: string;
    minRating: number;
    minSalary: number;
    maxSalary: number;
    availableIn?: number | undefined;
    jobId?: number | undefined;
  };
  setFilters: (filters: FilterBarProps['filters']) => void;
  job?: Partial<Job>;
}

export default function FilterBar({
  isOpen,
  setIsOpen,
  filters,
  setFilters,
  job,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SkillStandardized[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forJob, setForJob] = useState(false);
  const [jobData, setJobData] = useState<Partial<Job> | undefined>(undefined);
  const [isJobSelectorOpen, setIsJobSelectorOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const { userData } = useUser();
  const cardRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setLocalFilters(filters);

    // If job is provided, set forJob to true
    if (searchParams.get('jobId') !== null) {
      setForJob(true);
    }

    // Update selected date if availableIn exists
    if (filters.availableIn !== undefined && filters.availableIn !== null) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + filters.availableIn);
      setSelectedDate(targetDate);
    } else {
      setSelectedDate(undefined);
    }
  }, [filters]);

  // Update local filters without affecting parent state
  const handleLocalFilterChange = (
    newFilters: Partial<FilterBarProps['filters']>
  ) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // Apply filters to parent state and update URL parameters
  const applyFilters = () => {
    setFilters(localFilters);

    // Update URL parameters
    const searchParams = new URLSearchParams();
    if (localFilters.skills.length) { searchParams.set('skills', localFilters.skills.join(',')); }
    if (localFilters.experienceLevel.length) { searchParams.set('experienceLevel', localFilters.experienceLevel.join(',')); }
    if (localFilters.minRating) { searchParams.set('minRating', localFilters.minRating.toString()); }
    if (localFilters.minSalary) { searchParams.set('minSalary', localFilters.minSalary.toString()); }
    if (localFilters.maxSalary) { searchParams.set('maxSalary', localFilters.maxSalary.toString()); }
    if (localFilters.availableIn !== undefined) { searchParams.set('availableIn', localFilters.availableIn.toString()); }
    if (localFilters.jobId !== undefined) { searchParams.set('jobId', localFilters.jobId.toString()); }

    router.push(`${pathname}?${searchParams.toString()}`);

    // Clear suggestions after applying filters
    setSuggestions([]);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedQuerySkills = useCallback(
    debounce(async (query: string) => {
      if (query) {
        setIsLoading(true);
        const skills = await querySkills(query.toLowerCase(), localFilters.skills);
        const skillSuggestions = skills.filter((skill) => !localFilters.skills.includes(skill.skill_title));
        setSuggestions(skillSuggestions);
      } else {
        setSuggestions([]);
      }
      setIsLoading(false);
    }, 300),
    [localFilters.skills]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedQuerySkills(value);
  };

  const handleSuggestionClick = (skill: string) => {
    handleLocalFilterChange({
      skills: localFilters.skills.includes(skill)
        ? localFilters.skills.filter((s) => s !== skill)
        : [...localFilters.skills, skill],
    });
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleSkillRemove = (skill: string) => {
    handleLocalFilterChange({ skills: localFilters.skills.filter((s) => s !== skill) });
  };

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    handleLocalFilterChange({
      experienceLevel: checked
        ? [...localFilters.experienceLevel, level]
        : localFilters.experienceLevel.filter((l) => l !== level),
    });
  };

  // Function to check if any filters are applied
  const hasActiveFilters = () => {
    return (
      filters.skills.length > 0 ||
      filters.experienceLevel.length > 0 ||
      filters.minRating > 0 ||
      filters.location !== '' ||
      filters.minSalary > 0 ||
      filters.maxSalary < 200000 ||
      filters.availableIn !== undefined ||
      filters.jobId !== undefined
    );
  };

  const handleJobSelectorClick = async () => {
    console.log('Click handler triggered');
    setIsJobSelectorOpen(true);
    setIsLoadingJobs(true);
    try {
      const fetchedJobs = await getJobs(userData?.employer_profile?.companies[0]?.id || 0);
      console.log('Fetched jobs:', fetchedJobs);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isOpen ? '16rem' : '2rem', // Tailwind w-64 vs w-8
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      className="flex flex-col transition-all duration-200 relative"
    >
      <Card
        className={`mb-4 sticky top-0 overflow-hidden transition-all duration-200
          ${isOpen ? 'w-full' : 'w-8 h-8 ml-0 shadow-lg'}`}
      >
        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              key="open-filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 flex items-center justify-between">
                  Filters
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </h2>

                <div className="space-y-4 relative">
                  <div className="flex flex-row items-center justify-start gap-2">
                    <h2 className="text-sm font-medium">Filter for a Job</h2>
                    <Checkbox
                      id="jobId"
                      checked={forJob}
                      onCheckedChange={(checked) => setForJob(checked as boolean)}
                    />
                  </div>
                  {forJob && (
                    <div ref={cardRef} className="rounded-lg border bg-card p-3 flex items-center gap-3 relative group">
                      {!job?.id && jobData?.id && (
                        <div className="absolute inset-0 bg-gray-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 
                            className="h-16 w-16 text-red-400 cursor-pointer p-2 rounded-full bg-red-700" 
                            onClick={() => {
                              handleLocalFilterChange({ jobId: undefined });
                              setJobData(undefined);
                            }}
                          />
                        </div>
                      )}
                      {(job?.id || jobData?.id) && (
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                          <Briefcase className="h-8 w-8 text-muted-foreground bg-gray-200 rounded-full p-1 flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">
                              {job?.title?.slice(0, 25).concat('...') || jobData?.title?.slice(0, 25).concat('...') || "No job selected"}
                            </span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {job?.status || jobData?.status || "Draft"}
                            </Badge>
                          </div>
                        </div>
                      )}
                      {!job?.id && !jobData && (
                        <Popover open={isJobSelectorOpen} onOpenChange={setIsJobSelectorOpen}>
                          <PopoverTrigger asChild>
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <div 
                              className="flex items-center gap-2 flex-1 justify-center hover:cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-200"
                              onClick={handleJobSelectorClick}
                            >
                              <Plus className="h-16 w-16 text-muted-foreground bg-gray-200 rounded-full p-1" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-[500px]"
                            align="start"
                            sideOffset={8}
                          >
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ 
                                opacity: 1, 
                                height: jobs.length ? Math.ceil(jobs.length / 2) * 90 + (Math.ceil(jobs.length / 2) - 1) * 12 : 248,
                              }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-2 pt-2 pb-2 overflow-hidden" // Adjusted padding
                            >
                              <div className="grid grid-cols-2 gap-3">
                                {isLoadingJobs ? (
                                  <>
                                    {[...Array(4)].map((_, index) => (
                                      <Skeleton
                                        key={index}
                                        className="h-[72px] w-full rounded-lg" // Slightly reduced skeleton height
                                      />
                                    ))}
                                  </>
                                ) : (
                                  jobs.map((job) => (
                                    <div
                                      key={job.id}
                                      className="p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" // Reduced padding
                                      onClick={() => {
                                        handleLocalFilterChange({ jobId: job.id });
                                        setJobData(job);
                                        setIsJobSelectorOpen(false);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleLocalFilterChange({ jobId: job.id });
                                          setJobData(job);
                                          setIsJobSelectorOpen(false);
                                        }
                                      }}
                                      role="button"
                                      tabIndex={0}
                                    >
                                      <div className="flex items-center gap-3 h-[56px]"> 
                                        <Briefcase className="h-10 w-10 text-muted-foreground bg-gray-200 rounded-full p-1 flex-shrink-0" /> 
                                        <div className="flex flex-col min-w-0 justify-center">
                                          <span className="font-medium text-sm truncate">
                                            {job.title?.slice(0, 25).concat('...') || "Untitled"}
                                          </span>
                                          <Badge variant="outline" className="text-xs w-fit">
                                            {job.status || "Draft"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                  {/* Search Skills */}
                  <div>
                    <h2 className="text-sm font-medium">Search Skills</h2>
                    <div className="flex flex-row items-center justify-between gap-2">
                      <Input
                        placeholder="Search skills"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mt-1"
                      />
                      {isLoading && <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-6 w-7" />}
                    </div>
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 w-full border border-gray-300 mt-1 rounded-md shadow-lg bg-white">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.skill_id}
                            className="w-full text-left p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSuggestionClick(suggestion.skill_title)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSuggestionClick(suggestion.skill_title)
                              }
                            }}
                          >
                            {suggestion.skill_title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Selected Skills */}
                  <div>
                    <h2 className="text-sm font-medium">Selected Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {localFilters.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => handleSkillRemove(skill)}>
                          {`${skill} x`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* Experience Level */}
                  <div>
                    <h2 className="text-sm font-medium">Experience Level</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox
                        id="junior"
                        checked={localFilters.experienceLevel.includes('Junior')}
                        onCheckedChange={(checked) => handleExperienceLevelChange('Junior', checked as boolean)}
                      />
                      <label htmlFor="junior" className="text-sm">Junior</label>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox
                        id="mid"
                        checked={localFilters.experienceLevel.includes('Middle')}
                        onCheckedChange={(checked) => handleExperienceLevelChange('Middle', checked as boolean)}
                      />
                      <label htmlFor="mid" className="text-sm">Mid-level</label>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox
                        id="senior"
                        checked={localFilters.experienceLevel.includes('Senior')}
                        onCheckedChange={(checked) => handleExperienceLevelChange('Senior', checked as boolean)}
                      />
                      <label htmlFor="senior" className="text-sm">Senior</label>
                    </div>
                  </div>
                  {/* Available On */}
                  <div>
                    <h2 className="text-sm font-medium">Available On</h2>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Input
                          placeholder="Please, select date"
                          value={selectedDate ? format(selectedDate, 'PPP') : 'Please, select date'}
                          readOnly
                          className="mt-1"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onDayClick={(date) => {
                            if (date) {
                              // Normalize dates to start of the day
                              const normalizedDate = startOfDay(date);
                              const normalizedSelectedDate = selectedDate ? startOfDay(selectedDate) : undefined;

                              // If the selected date is the same as the currently selected date, clear the selection
                              if (normalizedSelectedDate && isSameDay(normalizedDate, normalizedSelectedDate)) {
                                setSelectedDate(undefined);
                                handleLocalFilterChange({ availableIn: undefined });
                              } else {
                                setSelectedDate(normalizedDate);
                                const today = startOfDay(new Date());

                                if (normalizedDate < today) {
                                  // If the selected date is in the past, do nothing
                                  return;
                                }

                                const diffTime = normalizedDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                handleLocalFilterChange({ availableIn: diffDays });
                              }

                              // Close the calendar popover after selection
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Salary Range */}
                  <div>
                    <h2 className="text-sm font-medium">Salary Range</h2>
                    <div className="mt-2 flex items-center space-x-2 flex-col w-full space-y-2 mb-10">
                      <div className="flex flex-row w-full justify-between">
                        <p>0</p>
                        <p>200,000</p>
                      </div>
                      <div className="flex-1 px-2 w-full">
                        <DualRangeSlider
                          label={(value) => value && value < 200000 ? value.toString() : ''}
                          labelPosition="bottom"
                          value={[localFilters.minSalary, localFilters.maxSalary]}
                          onValueChange={(value) => handleLocalFilterChange({ minSalary: value[0], maxSalary: value[1] })}
                          min={0}
                          max={200000}
                          step={1000}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Apply Filters Button */}
                  <div className="mt-4 flex justify-end">
                    <Button onClick={applyFilters}>Apply Filters</Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-filter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex items-center justify-center p-1 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="h-full w-full relative"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters() && (
                  <span
                    className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"
                    style={{
                      transform: 'translate(25%, -25%)',
                      boxShadow: '0 0 0 1px white',
                    }}
                  />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.aside>
  );
}