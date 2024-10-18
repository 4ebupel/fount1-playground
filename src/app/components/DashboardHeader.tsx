import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type HeaderProps = {
  user: any;
};

export default function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
      <p className="text-xl text-muted-foreground mb-4">Ready to find your next great hire?</p>
      <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
        <div>
          <p className="text-lg font-semibold">Dashboard Summary</p>
          <p>
            You have {user.openJobs} open jobs and {user.totalApplicants} total applicants.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Post a New Job
        </Button>
      </div>
    </header>
  );
}
