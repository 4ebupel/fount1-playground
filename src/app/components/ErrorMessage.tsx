import { X } from "lucide-react";

export const ErrorMessage = ({ error, setError }: { error: string, setError: (error: string) => void }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <X className="h-5 w-5 text-red-400 cursor-pointer" onClick={() => setError('')} />
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          {error}
        </p>
      </div>
    </div>
  </div>
);
