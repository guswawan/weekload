import type { WorkloadStatus } from '../types/workload';
import { workloadLabels } from '../types/workload';
import { Card } from './ui/card';

const statusOrder: WorkloadStatus[] = [
  'too-much',
  'heavy',
  'normal',
  'lazy-normal',
  'too-lazy',
  'unavailable',
  'undefined',
];

const statusClasses: Record<WorkloadStatus, string> = {
  'too-much': 'bg-[hsl(var(--status-too-much))]',
  heavy: 'bg-[hsl(var(--status-heavy))]',
  normal: 'bg-[hsl(var(--status-normal))]',
  'lazy-normal': 'bg-[hsl(var(--status-lazy-normal))]',
  'too-lazy': 'bg-[hsl(var(--status-too-lazy))]',
  unavailable: 'bg-[hsl(var(--status-unavailable))]',
  undefined: 'bg-[hsl(var(--status-undefined))]',
};

export const WorkloadLegend = () => {
  return (
    <Card className="border shadow-sm">
      <div className="p-6">
        <h3 className="font-semibold text-base mb-4 text-foreground">
          Workload Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {statusOrder.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${statusClasses[status]} shadow-sm`}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {workloadLabels[status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
