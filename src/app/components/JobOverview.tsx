"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  PauseCircle, 
  CheckCircle, 
  X, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Users, 
  Info, 
  Heart,
  Clipboard,
  Target
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const dummyJobData = {
  title: "Software Developer - Business Intelligence",
  keyResponsibilities: [
    "Develop and maintain data pipelines",
    "Collaborate with data scientists and analysts",
    "Optimize database performance",
  ],
  employmentType: "Full Time",
  location: "Berlin (60% Remote)",
  salaryRange: [60000, 85000],
  benefits: ["Health Insurance", "Remote Work Option", "Paid Time Off"],
  skills: ["Python", "SQL", "Data Modeling"],
  startingDate: "2023-01-10",
  status: "Draft",
};

const statusStyles = {
  'Draft': 'bg-yellow-100 text-yellow-800',
  'Published': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800',
};

function JobOverview() {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  
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

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(initialJobData.benefits);
  const [customBenefit, setCustomBenefit] = useState<string>('');

  const handleAddBenefit = () => {
    if (customBenefit && !selectedBenefits.includes(customBenefit)) {
      setSelectedBenefits([...selectedBenefits, customBenefit]);
      setCustomBenefit('');
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
              {[
                { 
                  icon: <MapPin className="h-5 w-5 text-gray-600" />, 
                  label: "Location", 
                  value: initialJobData.location 
                },
                { 
                  icon: <Briefcase className="h-5 w-5 text-gray-600" />, 
                  label: "Employment", 
                  value: initialJobData.employmentType 
                },
                { 
                  icon: <Clock className="h-5 w-5 text-gray-600" />, 
                  label: "Experience", 
                  value: initialJobData.experienceLevel 
                },
                { 
                  icon: <DollarSign className="h-5 w-5 text-gray-600" />, 
                  label: "Salary", 
                  value: `€${initialJobData.salaryRange[0]} - €${initialJobData.salaryRange[1]}` 
                },
                { 
                  icon: <Calendar className="h-5 w-5 text-gray-600" />, 
                  label: "Published", 
                  value: initialJobData.publishDate 
                },
                { 
                  icon: <Users className="h-5 w-5 text-gray-600" />, 
                  label: "Applicants", 
                  value: initialJobData.applicants 
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 ml-auto mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Job Details</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <PauseCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pause Job Listing</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Clipboard className="mr-2 h-5 w-5 text-gray-600" />
              Key Responsibilities
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {initialJobData.keyResponsibilities.map((responsibility, index) => (
                <li key={index} className="text-muted-foreground">{responsibility}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Target className="mr-2 h-5 w-5 text-gray-600" />
              Skills & Requirements
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Key skills and qualifications for this role
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>
            <div className="flex flex-wrap gap-2">
              {initialJobData.requirements.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section - Separate Row */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-gray-600" />
            Benefits
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedBenefits.map((benefit, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center"
              >
                {benefit}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => handleRemoveBenefit(benefit)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom benefit"
              value={customBenefit}
              onChange={(e) => setCustomBenefit(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
              className="flex-grow"
            />
            <Button onClick={handleAddBenefit}>Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobOverview;

