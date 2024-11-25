"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CandidateManagement from "./CandidateManagament"
import { Briefcase, Users, Mail } from 'lucide-react'
import JobOverview from "./JobOverview"
import { useSearchParams } from "next/navigation"

export function ModernTabs() {
  const searchParams = useSearchParams()
  
  const jobDetails = {
    id: searchParams.get('id') || "JOB-001",
    title: searchParams.get('title') || "Job Title"
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
      <p className="text-muted-foreground mb-6"># {jobDetails.id}</p>
      
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
          <JobOverview />
        </TabsContent>
        <TabsContent value="talent-pool">
          <CandidateManagement />
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
