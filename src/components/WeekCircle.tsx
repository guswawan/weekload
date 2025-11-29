import { cn } from '../lib/utils';
import type { WorkloadStatus } from '../types/workload';

interface WeekCircleProps {
  weekNumber: number;
  status: WorkloadStatus;
  isCurrentWeek: boolean;
  hasNotes: boolean;
  onClick: () => void;
}

const statusClasses: Record<WorkloadStatus, string> = {
  'too-much':
    'bg-[hsl(var(--status-too-much))] border-[hsl(var(--status-too-much))]',
  heavy: 'bg-[hsl(var(--status-heavy))] border-[hsl(var(--status-heavy))]',
  normal: 'bg-[hsl(var(--status-normal))] border-[hsl(var(--status-normal))]',
  'lazy-normal':
    'bg-[hsl(var(--status-lazy-normal))] border-[hsl(var(--status-lazy-normal))]',
  'too-lazy':
    'bg-[hsl(var(--status-too-lazy))] border-[hsl(var(--status-too-lazy))]',
  unavailable:
    'bg-[hsl(var(--status-unavailable))] border-[hsl(var(--status-unavailable))]',
  undefined: 'bg-transparent border-border border-2',
};

export const WeekCircle = ({
  weekNumber,
  status,
  isCurrentWeek,
  hasNotes,
  onClick,
}: WeekCircleProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        statusClasses[status],
        isCurrentWeek &&
          'ring-2 ring-primary ring-offset-2 ring-offset-card scale-105 shadow-md'
      )}
      title={`Week ${weekNumber}`}
    >
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {weekNumber}
      </span>
      {hasNotes && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm" />
      )}
    </button>
  );
};
