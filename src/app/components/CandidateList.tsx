import { User } from '../types/UserInitialTest';
import CandidateCard from './CandidateCard'

interface CandidateListProps {
  candidates: User[];
  selectedCandidate: User | null;
  onCandidateClick: (candidate: User) => void;
}

export default function CandidateList({ candidates, selectedCandidate, onCandidateClick }: CandidateListProps) {
  return (
    <div className="space-y-4 py-2 px-8">
      {candidates.map((candidate) => (
        <CandidateCard 
          key={candidate.id}
          candidate={candidate}
          isSelected={selectedCandidate?.id === candidate.id}
          onClick={() => onCandidateClick(candidate)}
        />
      ))}
    </div>
  )
}