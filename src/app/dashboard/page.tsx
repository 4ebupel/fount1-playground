import { Code } from "lucide-react";
import { Globe } from "lucide-react";
import { Database } from "lucide-react";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login");
  }
      
  const jobListings = [
    {
      id: 1,
      title: "Software Developer BI",
      image: "/placeholder.svg?height=200&width=300",
      publishDate: "05.01.2023",
      applicants: 5,
      requirements: ["Python", "JavaScript", "SQL", "PowerBI"],
      description: "We're looking for a talented Software Developer with expertise in Business Intelligence...",
      status: "open",
      priority: "urgent",
    },
    {
      id: 2,
      title: "Transformation Manager",
      image: "/placeholder.svg?height=200&width=300",
      publishDate: "05.01.2023",
      applicants: 8,
      requirements: ["Python", "JavaScript", "SQL", "Change Management"],
      description: "Join our team as a Transformation Manager and lead our digital transformation initiatives...",
      status: "open",
      priority: "normal",
    },
    {
      id: 3,
      title: "Front-End Developer",
      image: "/placeholder.svg?height=200&width=300",
      publishDate: "05.01.2023",
      applicants: 6,
      requirements: ["JavaScript", "HTML/CSS", "React", "Angular"],
      description: "We're seeking a skilled Front-End Developer to create stunning user interfaces...",
      status: "open",
      priority: "high",
    },
    {
      id: 4,
      title: "Back-End Developer",
      image: "/placeholder.svg?height=200&width=300",
      publishDate: "05.01.2023",
      applicants: 5,
      requirements: ["Python", "Java", "Ruby", "SQL", "MongoDB", "API", "Data Security"],
      description: "Join our backend team to build robust and scalable server-side applications...",
      status: "closed",
      priority: "normal",
    },
  ];
      
  const skillIcons = {
    Python: <Code className="w-4 h-4" />,
    JavaScript: <Globe className="w-4 h-4" />,
    SQL: <Database className="w-4 h-4" />,
    // Add more skill icons as needed
  };
      
  const priorityColors = {
    urgent: "bg-red-100 text-red-800",
    high: "bg-yellow-100 text-yellow-800",
    normal: "bg-green-100 text-green-800",
  };
  return (
    <div>
      <Header />
      <Dashboard  
        jobListings={jobListings} 
        skillIcons={skillIcons} 
        priorityColors={priorityColors} 
      />
    </div>
  );
}
