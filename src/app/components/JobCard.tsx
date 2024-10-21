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

type JobCardProps = {
  job: any;
  skillIcons: any;
  priorityColors: any;
};

export default function JobCard({ job, skillIcons, priorityColors }: JobCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <Badge className={`${priorityColors[job.priority]} px-2 py-1 rounded-full text-xs`}>
            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Published:</span> 
          {' '}
          {job.publishDate}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Users className="mr-2 h-4 w-4" />
          <span className="font-semibold mr-2">Applicants:</span> 
          {' '}
          {job.applicants}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {/* @ts-expect-error  implicit any */}
          {job.requirements.map((req, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-1 bg-muted flex items-center space-x-1"
            >
              {skillIcons[req] && <span className="mr-1">{skillIcons[req]}</span>}
              <span>{req}</span>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{job.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {/* @ts-expect-error  implicit any */}
                {job.requirements.map((req, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 py-1 bg-muted flex items-center space-x-1"
                  >
                    {skillIcons[req] && <span className="mr-1">{skillIcons[req]}</span>}
                    <span>{req}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          size="sm"
          className="w-full ml-2 rounded-md hover:bg-muted transition-colors duration-200"
        >
          <MoreHorizontal className="mr-2 h-4 w-4" />
          More Options
        </Button>
      </CardFooter>
    </Card>
  );
}
