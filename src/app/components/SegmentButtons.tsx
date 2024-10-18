type SegmentButtonsProps = {
    activeSegment: string;
    setActiveSegment: (value: string) => void;
  };
  
  export default function SegmentButtons({ activeSegment, setActiveSegment }: SegmentButtonsProps) {
    return (
      <div className="flex mb-6 bg-muted rounded-lg p-1">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeSegment === "open"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10"
          }`}
          onClick={() => setActiveSegment("open")}
        >
          Open Positions
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeSegment === "closed"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10"
          }`}
          onClick={() => setActiveSegment("closed")}
        >
          Closed Positions
        </button>
      </div>
    );
  }
  