import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Experience } from "../types/Experience"
import { MapPin, Briefcase, Calendar, Clock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface ExperienceDetailsDialogProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExperienceDetailsDialog({ experience, isOpen, onClose }: ExperienceDetailsDialogProps) {
  if (!experience) {return null;}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="flex-shrink-0 w-12 h-12 rounded-full">
              <AvatarImage 
                src={experience?.Company_Logo?.url || "../../images/emptyLogo.png"}
                alt={`${experience.Employer_Name} Logo`}
                className="rounded-full"
              />
              <AvatarFallback className="rounded-full">{experience.employers_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl font-semibold">{experience.job_title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{experience.employers_name}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{experience.working_location}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{experience.career_level}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {experience.timeframe_start}
              {' '}
              — 
              {' '}
              {experience.is_current_position ? 'today' : experience.timeframe_end}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{experience.working_time}</span>
          </div>
        </div>
        {experience.dwa_reference_id && ( //check if dwa_reference_id is not empty
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Tasks:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {experience.dwa_reference_id.map((task, index) => (
                <li key={index}>{task.DWA_Title}</li>
              ))}
            </ul>
          </div>
        )}
        {experience.technology_skills_id && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Software Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {experience.technology_skills_id.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  {skill.Example}
                </span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}