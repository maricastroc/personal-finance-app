interface Props {
  percentage: number;
  color: string;
  target: number;
}

export function PotProgressBar({ percentage, color, target }: Props) {
  return (
    <>
      <div className="mt-4 w-full h-[0.9rem] p-[0.1rem] bg-beige-100 rounded-full">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, percentage)}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className="flex justify-between mt-3">
        <p className="text-gray-500 font-bold text-xs">{percentage}%</p>
        <p className="text-gray-500 text-xs">Target of ${target}</p>
      </div>
    </>
  );
}
