import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import type { WorkloadStatus } from '../types/workload';
import { workloadLabels } from '../types/workload';

interface StatusSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekNumber: number;
  currentStatus: WorkloadStatus;
  currentNotes?: string;
  onStatusChange: (status: WorkloadStatus) => void;
  onNotesChange: (notes: string) => void;
}

const statusOrder: WorkloadStatus[] = [
  'normal',
  'lazy-normal',
  'too-lazy',
  'unavailable',
  'heavy',
  'too-much',
  'undefined',
];

const statusDotClasses: Record<WorkloadStatus, string> = {
  'too-much': 'bg-[hsl(var(--status-too-much))]',
  heavy: 'bg-[hsl(var(--status-heavy))]',
  normal: 'bg-[hsl(var(--status-normal))]',
  'lazy-normal': 'bg-[hsl(var(--status-lazy-normal))]',
  'too-lazy': 'bg-[hsl(var(--status-too-lazy))]',
  unavailable: 'bg-[hsl(var(--status-unavailable))]',
  undefined: 'bg-[hsl(var(--status-undefined))]',
};

export const StatusSelector = ({
  open,
  onOpenChange,
  weekNumber,
  currentStatus,
  currentNotes = '',
  onStatusChange,
  onNotesChange,
}: StatusSelectorProps) => {
  const [notes, setNotes] = useState(currentNotes);

  useEffect(() => {
    setNotes(currentNotes);
  }, [currentNotes, open]);

  const handleSave = () => {
    onNotesChange(notes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Workload Status
          </DialogTitle>

          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              Week {weekNumber}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Select Workload Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOrder.map((status) => {
                const isSelected = currentStatus === status;
                return (
                  <Button
                    key={status}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'justify-start h-auto py-2.5 px-3',
                      isSelected && 'ring-2 ring-ring ring-offset-2'
                    )}
                    onClick={() => onStatusChange(status)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full shadow-sm flex-shrink-0',
                          statusDotClasses[status]
                        )}
                      />
                      <span className="text-sm font-medium">
                        {workloadLabels[status]}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-sm font-semibold">✓</span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-semibold text-foreground"
            >
              Notes & Insights
            </Label>
            <Textarea
              id="notes"
              placeholder="What happened this week? Wins, challenges, learnings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none text-sm leading-relaxed border-border focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-9 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-9 text-sm font-medium"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
