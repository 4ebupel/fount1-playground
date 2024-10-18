import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type FiltersProps = {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterTag: string;
  setFilterTag: (value: string) => void;
};

export default function FiltersDropdown({ sortBy, setSortBy, filterTag, setFilterTag }: FiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] rounded-md">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="applicants">Most Applicants</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by skill..."
            className="pl-8 w-[200px]"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
