import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import type { WorkloadStatus } from '../types/workload';
import { workloadLabels } from '../types/workload';

const statusBadgeClasses: Record<WorkloadStatus, string> = {
  'too-much': 'bg-[hsl(var(--status-too-much))]',
  heavy: 'bg-[hsl(var(--status-heavy))]',
  normal: 'bg-[hsl(var(--status-normal))]',
  'lazy-normal': 'bg-[hsl(var(--status-lazy-normal))]',
  'too-lazy': 'bg-[hsl(var(--status-too-lazy))]',
  unavailable: 'bg-[hsl(var(--status-unavailable))]',
  undefined: 'bg-[hsl(var(--status-undefined))]',
};

interface WeekActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekNumber: number;
  status: WorkloadStatus;
  notes?: string;
  onEdit: () => void;
}

export const WeekActionDialog = ({
  open,
  onOpenChange,
  weekNumber,
  status,
  notes,
  onEdit,
}: WeekActionDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white max-w-md p-4 gap-3">
        <AlertDialogHeader className="space-y-1.5">
          <AlertDialogTitle className="flex items-center gap-2 text-base">
            Week {weekNumber}
            <Badge
              className={cn(
                'ml-auto font-normal text-card-foreground text-xs',
                statusBadgeClasses[status]
              )}
            >
              {workloadLabels[status]}
            </Badge>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-1.5">
              <p className="font-medium text-foreground text-xs">
                Notes & Insights:
              </p>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-md p-2 max-h-32 overflow-y-auto">
                {notes || 'No notes available'}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 pt-2">
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Close
          </AlertDialogCancel>
          <AlertDialogAction onClick={onEdit}>Edit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
