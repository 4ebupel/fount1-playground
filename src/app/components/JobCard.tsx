import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Calendar, Users } from "lucide-react";
import { Job } from "../types/Job";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobCard(job: Job) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/jobdetails?jobId=${job.id}`);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <Badge className={`${job.priority === "urgent" ? "bg-red-500 text-white" : job.priority === "high" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"} px-2 py-1 rounded-full text-xs`}>
            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Published:</span> 
          {' '}
          {new Date(job.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Users className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Applicants:</span> 
          {' '}
          {Math.floor(Math.random() * 100)}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-1 bg-muted flex items-center space-x-1"
            >
              <span>{skill.title}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="w-full mr-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>{job.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 py-1 bg-muted flex items-center space-x-1"
                  >
                    <span>{skill.title}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Link
          href={`/jobdetails?jobId=${job.id}`}
          onClick={handleNavigate}
          // eslint-disable-next-line max-len
          className={`w-full ml-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center justify-center h-10 border border-muted ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <MoreHorizontal className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Loading...' : 'More Options'}
        </Link>
      </CardFooter>
    </Card>
  );
}
