"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CandidateManagement from "./CandidateManagament"
import { Briefcase, Users, Mail } from 'lucide-react'
import JobOverview from "./JobOverview"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import getAJob from "../api/getAJob"
import { useEffect, useState } from "react"
import { Job } from "../types/Job"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "./Loader"

const statusStyles = {
  'Draft': 'bg-yellow-100 text-yellow-800',
  'Published': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800',
};

export function JobTabs() {
  const searchParams = useSearchParams();
  const [jobData, setJobData] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchJobData = async () => {
      const jobId = searchParams.get('jobId');
      if (!jobId || jobData?.id === Number(jobId)) { return; }

      setIsLoading(true);
      try {
        const job = await getAJob(jobId);
        if (isSubscribed && job) {
          setJobData(job);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : "Failed to fetch job data");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchJobData();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, jobData?.id]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {isLoading ? <Skeleton className="w-64 h-8" /> : (
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">{jobData?.title}</h1>
            <Badge
              className={`${statusStyles[jobData?.status as keyof typeof statusStyles]} px-3 py-1`}
            >
              {jobData?.status}
            </Badge>
            <p className="text-muted-foreground">
              #
              {' '}
              {jobData?.id}
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="job-details">
        <TabsList className="w-[600px] grid grid-cols-3 bg-muted/50 rounded-lg p-51">
          <TabsTrigger value="job-details" className="flex items-center justify-center">
            <Briefcase className="w-4 h-4 mr-2" />
            Job Details
          </TabsTrigger>
          <TabsTrigger value="talent-pool" className="flex items-center justify-center">
            <Users className="w-4 h-4 mr-2" />
            Talent Pool
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center justify-center">
            <Mail className="w-4 h-4 mr-2" />
            Applications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="job-details">
          {isLoading ? <Loader /> : <JobOverview jobData={jobData} />}
          {error && (
            <div>
              Error:
              {error}
            </div>
          )}
        </TabsContent>
        <TabsContent value="talent-pool">
          <CandidateManagement
            jobData={jobData || undefined}
            jobDetails={true}
          />
        </TabsContent>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content for Applications goes here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
