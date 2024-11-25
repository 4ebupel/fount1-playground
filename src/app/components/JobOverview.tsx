"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, PauseCircle, CheckCircle, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const dummyJobData = {
  title: "Software Developer - Business Intelligence",
  keyResponsibilities: [
    "Develop and maintain data pipelines",
    "Collaborate with data scientists and analysts",
    "Optimize database performance"
  ],
  employmentType: "Full Time",
  location: "Berlin (60% Remote)",
  salaryRange: [60000, 85000],
  benefits: ["Health Insurance", "Remote Work Option", "Paid Time Off"],
  skills: ["Python", "SQL", "Data Modeling"],
  startingDate: "2023-01-10",
  status: "Draft",
};

function JobOverview() {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  
  // Merge URL params with dummy data
  const initialJobData = {
    ...dummyJobData,
    title: searchParams.get('title') || dummyJobData.title,
    id: searchParams.get('id') || "JOB-001",
    requirements: searchParams.get('requirements')?.split(',') || dummyJobData.skills,
    description: searchParams.get('description') || "",
    status: searchParams.get('status') || dummyJobData.status,
    priority: searchParams.get('priority') || "normal",
    publishDate: searchParams.get('publishDate') || dummyJobData.startingDate,
    applicants: searchParams.get('applicants') || "0",
    experienceLevel: searchParams.get('experienceLevel') || "Mid-Level",
  };

  const [editedData, setEditedData] = useState(initialJobData);

  // Add state for benefits and custom benefit input
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(initialJobData.benefits);
  const [customBenefit, setCustomBenefit] = useState<string>('');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  // Function to handle adding a new benefit
  const handleAddBenefit = () => {
    if (customBenefit && !selectedBenefits.includes(customBenefit)) {
      setSelectedBenefits([...selectedBenefits, customBenefit]);
      setCustomBenefit('');
    }
  };

  // Function to handle removing an existing benefit
  const handleRemoveBenefit = (benefit: string) => {
    setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
  };

  return (
    <Card>
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{initialJobData.title}</h2>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Job ID: {initialJobData.id}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(!isEditing)}
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Pause"
            >
              <PauseCircle className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </Button>
            <Button variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Job Details Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
              <div className="space-y-1">
                <div>
                  <strong>Employment Type:</strong>
                  <br />
                  {initialJobData.employmentType}
                </div>
                <div>
                  <strong>Location:</strong>
                  <br />
                  {initialJobData.location}
                </div>
                <div>
                  <strong>Experience Level:</strong>
                  <br />
                  {initialJobData.experienceLevel}
                </div>
                <div><strong>Salary Range:</strong> €{initialJobData.salaryRange[0]} - €{initialJobData.salaryRange[1]}</div>
                <div><strong>Status:</strong> <Badge>{initialJobData.status}</Badge></div>
                {initialJobData.priority && (
                  <div><strong>Priority:</strong> <Badge>{initialJobData.priority}</Badge></div>
                )}
                <div><strong>Published:</strong> {initialJobData.publishDate}</div>
                <div><strong>Applicants:</strong> {initialJobData.applicants}</div>
              </div>
            </div>

            {/* Skills/Requirements */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Skills & Requirements</h4>
              <div className="flex flex-wrap gap-2">
                {initialJobData.requirements.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            {initialJobData.description && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p>{initialJobData.description}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {benefit}
                    <button onClick={() => handleRemoveBenefit(benefit)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Input
                  className="mr-2"
                  placeholder="Add custom benefit"
                  value={customBenefit}
                  onChange={(e) => setCustomBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddBenefit();
                    }
                  }}
                />
                <Button onClick={handleAddBenefit}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobOverview;
