'use client'

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User } from "../types/UserInitialTest";
import { Experience } from "../types/Experience";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ExperienceDetailsDialog } from "./ExperienceDetailsDialog";
import { HoverCard, HoverCardContent } from '@/components/ui/hover-card';
import { HoverCardTrigger } from '@radix-ui/react-hover-card';

type Skill = {
  name: string;
  rating: number;
};

const RadarSkillChart = ({ skills }: { skills: Skill[] }) => {
  const total = Math.min(skills.length, 5);
  const levels = 7; // Number of rating levels
  const radius = 150;
  const center = 200;

  // Helper function to split long skill names
  const splitSkillName = (name: string) => {
    if (name.length <= 12) {return { line1: name, line2: '' };}
    
    const words = name.split(' ');
    if (words.length === 1) {
      // If it's a single long word, split in the middle
      const midpoint = Math.ceil(name.length / 2);
      return {
        line1: name.slice(0, midpoint),
        line2: name.slice(midpoint),
      };
    }

    // Try to split into two roughly equal parts
    if (words.length > 1) {
      const midIndex = Math.ceil(words.length / 2);
      return {
        line1: words.slice(0, midIndex).join(' '),
        line2: words.slice(midIndex).join(' '),
      };
    }

    return { line1: name, line2: '' };
  };

  return (
    <svg width="100%" height="300" viewBox="-25 -25 450 450" className="mx-auto">
      {[...Array(levels)].map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={((i + 1) / levels) * radius}
          fill="none"
          stroke="#8257D7"
          strokeWidth="1"
          opacity={0.2}
        />
      ))}

      {skills.slice(0, total).map((skill, index) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        const xOuter = center + radius * Math.cos(angle);
        const yOuter = center + radius * Math.sin(angle);
        const skillRadius = (radius * skill.rating) / levels;
        const x = center + skillRadius * Math.cos(angle);
        const y = center + skillRadius * Math.sin(angle);

        const labelRadius = radius + 30;
        const labelX = center + labelRadius * Math.cos(angle);
        const labelY = center + labelRadius * Math.sin(angle);

        const { line1, line2 } = splitSkillName(skill.name);

        return (
          <g key={skill.name}>
            <line
              x1={center}
              y1={center}
              x2={xOuter}
              y2={yOuter}
              stroke="#8257D7"
              strokeWidth="1"
              opacity={0.5}
            />

            <circle
              cx={x}
              cy={y}
              r="6"
              fill="#410293"
              stroke="#fff"
              strokeWidth="1"
              className="skill-point transition-transform duration-300 hover:scale-125"
            >
              <title>{`${skill.name}: ${skill.rating}/7`}</title>
            </circle>

            <text
              x={labelX}
              y={labelY - (line2 ? 8 : 0)}
              fontSize="12"
              fontWeight="bold"
              textAnchor={labelX > center ? "start" : "end"}
              alignmentBaseline="middle"
              fill="#410293"
            >
              {line1}
            </text>
            {line2 && (
              <text
                x={labelX}
                y={labelY + 8}
                fontSize="12"
                fontWeight="bold"
                textAnchor={labelX > center ? "start" : "end"}
                alignmentBaseline="middle"
                fill="#410293"
              >
                {line2}
              </text>
            )}
          </g>
        );
      })}

      <polygon
        points={skills.slice(0, total).map((skill, index) => {
          const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
          const skillRadius = (radius * skill.rating) / levels;
          const x = center + skillRadius * Math.cos(angle);
          const y = center + skillRadius * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ')}
        fill="#410293"
        fillOpacity="0.2"
        stroke="#410293"
        strokeWidth="2"
      />
    </svg>
  );
};

interface CandidateDetailsProps {
  selectedCandidate: User | null;
}

export default function CandidateDetails({ selectedCandidate }: CandidateDetailsProps) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!selectedCandidate) {
    return (
      <Card className="sticky top-0">
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">Select a candidate to view details</p>
        </CardContent>
      </Card>
    )
  }

  const sortedSkillsTalents = selectedCandidate.talents
    .filter((talent) => talent.talent_type === 'software_skill' || talent.talent_type === 'professional_skill')
    .sort((a, b) => parseInt(b.self_verified_level) - parseInt(a.self_verified_level));

  const radarChartData: Skill[] = sortedSkillsTalents
    .slice(0, 5)
    .map((talent) => ({
      name: talent.talent_title,
      rating: parseInt(talent.self_verified_level),
    }));

  // const CustomTick = ({ x, y, payload }: any) => {
  //   const truncateText = (text: string, maxLength: number) => {
  //     if (text.length > maxLength) {
  //       return text.slice(0, maxLength - 3) + '...';
  //     }
  //     return text;
  //   };

  //   return (
  //     <Text
  //       x={x}
  //       y={y}
  //       textAnchor="middle"
  //       verticalAnchor="middle"
  //       style={{ fontSize: 12, fill: 'currentColor' }}
  //     >
  //       {truncateText(payload.value, 18)}
  //     </Text>
  //   );
  // };

  const isLanguageTestAvailable = selectedCandidate.standardized_documents.filter((doc) => doc.type === 'Languages').length > 0;
  const isCertificatesAvailable = selectedCandidate.standardized_documents.filter((doc) => doc.type === 'Certificates').length > 0;

  return (
    <Card className="sticky top-0">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
              <img
                src={selectedCandidate?.profile_picture?.url || "../../images/emptyLogo.png"}
                alt={`Candidate ${selectedCandidate.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-semibold">
              {selectedCandidate.name_first || "No name"} 
              {' '}
              {selectedCandidate.name_last || "No last name"}
            </h2>
            {/* <h2 className="font-semibold">Candidate ID: {selectedCandidate.id}</h2> */}
          </div>
          <Button>Request Interview</Button>
        </div>
        <h3 className="font-semibold mb-2">Professional Summary:</h3>
        <p className="text-sm mb-4">{selectedCandidate.profile_summary || "No summary"}</p>
        <div className="flex justify-start mb-4 text-sm space-x-4">
          {isLanguageTestAvailable ? (
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger className="flex items-center">
                <span className="font-bold mr-1">Language test:</span>
                <span className="mr-1">{isLanguageTestAvailable ? "Available" : "Not Available"}</span>
                <div className={`w-3 h-3 rounded-full ${isLanguageTestAvailable ? "bg-green-500" : "bg-red-500"}`} />
              </HoverCardTrigger>
              <HoverCardContent>
                <ul className="mt-2">
                  {selectedCandidate.standardized_documents
                    .filter((doc) => doc.type === 'Languages')
                    .map((doc, index) => (
                      <li key={index} className="text-sm mb-1">
                        <span className="font-semibold">
                          {doc.title}
                          :
                        </span> 
                        {' '}
                        {doc.level || "N/A"}
                      </li>
                    ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div className="flex items-center">
              <span className="font-bold mr-1">Language test:</span>
              <span className="mr-1">Not Available</span>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          )}
          {isCertificatesAvailable ? (
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger className="flex items-center">
                <span className="font-bold mr-1">Certificates:</span>
                <span className="mr-1">{isCertificatesAvailable ? "Available" : "Not Available"}</span>
                <div className={`w-3 h-3 rounded-full ${isCertificatesAvailable ? "bg-green-500" : "bg-red-500"}`} />
              </HoverCardTrigger>
              <HoverCardContent>
                <ul className="mt-2">
                  {selectedCandidate.standardized_documents
                    .filter((doc) => doc.type === 'Certificates')
                    .map((doc, index) => (
                      <li key={index} className="text-sm mb-1">
                        <span className="font-semibold">{doc.title}</span>
                      </li>
                    ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div className="flex items-center">
              <span className="font-bold mr-1">Certificates:</span>
              <span className="mr-1">Not Available</span>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Previous Jobs:</h3>
          <div className={`space-y-4 ${selectedCandidate.experiences.length > 3 ? "max-h-[200px] overflow-y-auto" : ""}`}>
            {selectedCandidate.experiences.length > 0 ? (
              selectedCandidate.experiences.slice(0, 3).map((experience, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div 
                  key={index} 
                  className="flex items-center hover:shadow-lg transition-shadow duration-200 p-2 rounded-md w-1/2 cursor-pointer"
                  onClick={() => {
                    setSelectedExperience(experience);
                    setIsDialogOpen(true);
                  }}
                >
                  <Avatar className="flex-shrink-0">
                    <AvatarImage 
                      src={experience?.Company_Logo?.url || "../../images/emptyLogo.png"}
                      alt={`${experience.Employer_Name} Logo`}
                    />
                    <AvatarFallback>{experience.employers_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 overflow-hidden">
                    <h4 className="text-md font-medium truncate">{experience.employers_name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {experience.job_title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {experience.timeframe_start}
                      {' '}
                      -
                      {experience.is_current_position ? 'Present' : experience.timeframe_end}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No experiences available</p>
            )}
          </div>
        </div>
        {sortedSkillsTalents.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCandidate.talents.map((talent) => (
                <Badge key={talent.talent_title} variant="secondary">{talent.talent_title}</Badge>
              ))}
            </div>
          </div>
        )}
        {radarChartData.length > 0 && (
          <div className="flex flex-col items-stretch mt-6">
            <h2 className="font-semibold mb-2 text-left">Skills Radar</h2>
            <div className="flex justify-center items-center w-full h-[300px]">
              <RadarSkillChart skills={radarChartData} />
            </div>
          </div>
        )}
      </CardContent>
      <ExperienceDetailsDialog
        experience={selectedExperience}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  )
}