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
import { getJobs } from "../api/getJobs";
import { Job } from "../types/Job";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeSegment, setActiveSegment] = useState("open");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.employer_profile?.companies) {
      getJobs(userData?.employer_profile?.companies[0].id || 0)
        .then((jobs) => {
          setJobs(jobs);
        })
        .catch((error) => {
          console.error('Failed to fetch jobs:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userData?.employer_profile?.companies]);

  const filteredJobs = jobs.filter(
    (job) =>
      (activeSegment === "open" ? job.status === "Published" : job.status === "Staffed") &&
      (filterTag === "" || job.skills.includes(filterTag))
  );

  const priorityOrder: { [key: string]: number } = { urgent: 3, high: 2, normal: 1 };

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
