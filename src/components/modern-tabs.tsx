"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, Users, Mail, Hash } from 'lucide-react'
import { cn } from "@/lib/utils"

interface JobDetails {
  id: string
  title: string
}

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: "job-details",
    label: "Job Details",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: "talent-pool",
    label: "Talent Pool",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "applications",
    label: "Applications",
    icon: <Mail className="h-4 w-4" />,
  },
]

interface ModernTabsProps {
  jobDetails: JobDetails
}

export function ModernTabs({ jobDetails }: ModernTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{jobDetails.title}</h1>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Hash className="w-4 h-4 mr-1" />
            <span>{jobDetails.id}</span>
          </div>
        </div>
      </div>
      <nav
        className="relative flex items-center gap-1 rounded-full p-1 bg-muted"
        role="tablist"
        aria-label="Job Management Tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-content`}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:pointer-events-none disabled:opacity-50",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-background shadow-sm rounded-full"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${tab.id}-content`}
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">{tab.label}</h2>
                <p className="text-muted-foreground">
                  Content for {tab.label} goes here. This is a placeholder content area that
                  demonstrates the tab panel transition.
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

