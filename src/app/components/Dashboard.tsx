"use client"

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import SegmentButtons from "./SegmentButtons";
import FiltersDropdown from "./FiltersDropdown";
import JobCard from "./JobCard";

type Props = {
  user: any;
  jobListings: any[];
  skillIcons: any;
  priorityColors: any;
};

export default function StartupJobDashboard({
  user,
  jobListings,
  skillIcons,
  priorityColors,
}: Props) {
  const [activeSegment, setActiveSegment] = useState("open");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");

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
      <DashboardHeader user={user} />
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
