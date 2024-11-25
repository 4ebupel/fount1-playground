"use client"

import React, { useEffect, useState } from "react";
import SegmentButtons from "./SegmentButtons";
import FiltersDropdown from "./FiltersDropdown";
import JobCard from "./JobCard";
import Skeleton from "react-loading-skeleton";
import { useUser } from "@/app/contexts/UserContext";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  jobListings: any[];
  skillIcons: any;
  priorityColors: any;
};

export default function StartupJobDashboard({
  jobListings,
  skillIcons,
  priorityColors,
}: Props) {
  const [activeSegment, setActiveSegment] = useState("open");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const { userData, setUserData } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUserData]);

  const filteredJobs = jobListings.filter(
    (job) =>
      (activeSegment === "open" ? job.status === "open" : job.status === "closed") &&
      (filterTag === "" || job.requirements.includes(filterTag))
  );

  const priorityOrder: { [key: string]: number } = { urgent: 3, high: 2, normal: 1 };

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    } else if (sortBy === "applicants") {
      return b.applicants - a.applicants;
    } else {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">
        {loading ? <Skeleton width={300} /> : `Welcome back, ${userData?.name_first}! 👋`}
      </h1>
      <p className="text-xl text-muted-foreground mb-4">Ready to find your next great hire?</p>
      <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
        <div>
          <p className="text-lg font-semibold">Dashboard Summary</p>
          {/* <p>
            You have 
            {' '}
            {user.openJobs}
            {' '}
            open jobs and 
            {' '}
            {user.totalApplicants}
            {' '}
            total applicants.
          </p> */}
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Post a New Job
        </Button>
      </div>
      <SegmentButtons activeSegment={activeSegment} setActiveSegment={setActiveSegment} />
      <FiltersDropdown sortBy={sortBy} setSortBy={setSortBy} filterTag={filterTag} setFilterTag={setFilterTag} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} skillIcons={skillIcons} priorityColors={priorityColors} />
        ))}
      </div>
    </div>
  );
}
