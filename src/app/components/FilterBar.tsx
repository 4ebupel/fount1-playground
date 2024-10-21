import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DualRangeSlider } from "@/components/dualRangeSlider";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "@/lib/utils";
import { querySkills } from "@/app/api/querySkills";
import { SkillStandardized } from "../types/SkillsStandardized";
import { format, isSameDay, startOfDay } from "date-fns";

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
  };
  setFilters: (filters: FilterBarProps['filters']) => void;
}

export default function FilterBar({ isOpen, setIsOpen, filters, setFilters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SkillStandardized[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [, setAvailableInDays] = useState<number | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setLocalFilters(filters);

    // Update selected date if availableIn exists
    if (filters.availableIn !== undefined && filters.availableIn !== null) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + filters.availableIn);
      setSelectedDate(targetDate);
      setAvailableInDays(filters.availableIn);
    } else {
      setSelectedDate(undefined);
      setAvailableInDays(undefined);
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
    if (localFilters.skills.length) {searchParams.set('skills', localFilters.skills.join(','));}
    if (localFilters.experienceLevel.length) {searchParams.set('experienceLevel', localFilters.experienceLevel.join(','));}
    if (localFilters.minRating) {searchParams.set('minRating', localFilters.minRating.toString());}
    if (localFilters.minSalary) {searchParams.set('minSalary', localFilters.minSalary.toString());}
    if (localFilters.maxSalary) {searchParams.set('maxSalary', localFilters.maxSalary.toString());}
    if (localFilters.availableIn !== undefined) {searchParams.set('availableIn', localFilters.availableIn.toString());}

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

  return (
    <aside className={`flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-8'}`}>
      <Card className={`mb-4 sticky top-0 overflow-hidden transition-all duration-300 ${isOpen ? '' : 'w-64 -ml-56 shadow-lg'}`}>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4 flex items-center justify-between">
            Filters
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </h2>
          <div className="space-y-4 relative">
            {/* Search Skills */}
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium">Search Skills</label>
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
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      key={suggestion.skill_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion.skill_title)}
                    >
                      {suggestion.skill_title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Selected Skills */}
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium">Selected Skills</label>
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
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium">Experience Level</label>
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
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium">Available On</label>
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
                          setAvailableInDays(undefined);
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
                          setAvailableInDays(diffDays);
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
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium">Salary Range</label>
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
      </Card>
    </aside>
  )
}