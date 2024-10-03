interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: any;
    name: string;
    value: number;
    percentage: number;
  }>;
}

export default function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    // console.log(payload);
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow-md rounded-md">
        <p className="text-sm">{`${data.name}: ${data.percentage}%`}</p>
      </div>
    );
  }
  return null;
}