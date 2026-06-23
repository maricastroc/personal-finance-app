type Props = { height?: number };

export function ChartSkeleton({ height = 260 }: Props) {
  return (
    <div
      className="w-full rounded-lg bg-surface-600 animate-pulse"
      style={{ height }}
      aria-busy="true"
    />
  );
}
