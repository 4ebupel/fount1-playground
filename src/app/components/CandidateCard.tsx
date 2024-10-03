import { MapPin, Clock, BarChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import CustomTooltip from './CustomTooltip'
import { User } from "../types/User"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface CandidateCardProps {
  candidate: User;
  isSelected: boolean;
  onClick: () => void;
}

export default function CandidateCard({ candidate, isSelected, onClick }: CandidateCardProps) {
  const sortedSkillsTalents = candidate.talents //in a perfect world we should copy the array and not mutate it
    .filter(talent => talent.talent_type === 'software_skill' || talent.talent_type === 'professional_skill')
    .sort((a, b) => parseInt(b.self_verified_level) - parseInt(a.self_verified_level));

  const pieChartData = sortedSkillsTalents
    .slice(0, 3)
    .map((talent, index) => ({
    name: talent.talent_title,
    value: parseInt(talent.self_verified_level)
    }))

  const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0)

  const pieChartDataWithPercentage = pieChartData.map(item => ({
    ...item,
    percentage: Number(((item.value / totalValue) * 100).toFixed(0))
  }))

  console.log(pieChartData);

  return (
    <div className="relative">
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-md
          ${isSelected ? 'scale-105 shadow-lg z-10' : 'hover:scale-102'}`}
        onClick={onClick}
      >
        <CardContent className="p-4 flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={candidate.profile_picture.url}
                  alt={`Candidate ${candidate.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-semibold">Candidate ID: {candidate.id}</h2>
            </div>
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center">
                <span className="text-sm text-muted-foreground mr-2">Top Skills: </span>
                <div className="flex flex-wrap justify-center">
                  {sortedSkillsTalents.slice(0, 3).map((talent, index) => {
                    const displayText = talent.talent_title.length > 12
                      ? `${talent.talent_title.slice(0, 12)}...`
                      : talent.talent_title;
                    return (
                      <span 
                        key={index} 
                        className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full mr-1"
                        title={talent.talent_title.length > 12 ? talent.talent_title : ''}
                      >
                        {displayText}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-sm mb-2">{candidate.profile_summary}</p>
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {candidate.flexibility}</p>
              <p className="flex items-center">
                <Clock className="h-4 w-4 mr-1" /> {`Available in: ${Math.floor(candidate.availableIn / 30) ? `${Math.floor(candidate.availableIn / 30)} Month(s), ${candidate.availableIn % 30} Day(s)` : `${candidate.availableIn % 30} Day(s)`}`}
              </p>
              <p className="flex items-center"><BarChart className="h-4 w-4 mr-1" /> {candidate.career_level}</p>
            </div>
          </div>
          <div className="w-24 h-24 ml-4 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartDataWithPercentage}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartDataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}