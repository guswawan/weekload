import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getIsoWeek } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import { useWorkloadWeeks } from '../hooks/useWorkload';
import type { WorkloadStatus } from '../types/workload';
import { StatusSelector } from './StatusSelector';
import { Button } from './ui/button';
import { WeekActionDialog } from './WeekActionDialog';
import { WeekCircle } from './WeekCircle';

export const YearGrid = () => {
	const [year, setYear] = useState(new Date().getFullYear());
	const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
	const [showActionDialog, setShowActionDialog] = useState(false);
	const [showStatusSelector, setShowStatusSelector] = useState(false);
	const currentWeek = getIsoWeek(new Date());
	const { toast } = useToast();

	const { weeks, isLoading, error, updateStatus, updateNotes } =
		useWorkloadWeeks(year);

	useEffect(() => {
		if (error) {
			toast({
				title: 'Error loading data',
				description: 'Failed to load workload data from database',
				variant: 'destructive',
			});
		}
	}, [error, toast]);

	const handleStatusChange = (weekNumber: number, status: WorkloadStatus) => {
		updateStatus(
			{ weekNumber, status },
			{
				onError: (error) => {
					console.error('Error updating status:', error);
					toast({
						title: 'Error updating status',
						description: 'Failed to save status to database',
						variant: 'destructive',
					});
				},
			},
		);
	};

	const handleNotesChange = (weekNumber: number, notes: string) => {
		const currentStatus =
			weeks.find((w) => w.weekNumber === weekNumber)?.status || 'undefined';
		updateNotes(
			{ weekNumber, notes, currentStatus },
			{
				onError: (error) => {
					console.error('Error updating notes:', error);
					toast({
						title: 'Error updating notes',
						description: 'Failed to save notes to database',
						variant: 'destructive',
					});
				},
			},
		);
	};

	const handleWeekClick = (weekNumber: number) => {
		const week = weeks.find((w) => w.weekNumber === weekNumber);
		const hasNotes = week?.notes && week.notes.trim().length > 0;

		setSelectedWeek(weekNumber);

		if (hasNotes) {
			setShowActionDialog(true);
		} else {
			setShowStatusSelector(true);
		}
	};

	const handleEdit = () => {
		setShowActionDialog(false);
		setShowStatusSelector(true);
	};

	const handleCloseStatusSelector = () => {
		setShowStatusSelector(false);
		setSelectedWeek(null);
	};

	if (isLoading) {
		return (
			<div className="w-full max-w-7xl mx-auto">
				<div className="bg-card rounded-lg border shadow-sm p-6">
					<div className="flex items-center justify-center py-12">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto">
			<div className="bg-card rounded-lg border shadow-sm p-6">
				<div className="flex items-center justify-between mb-6">
					<Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<h2 className="text-3xl font-semibold text-foreground">{year}</h2>
					<Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>

				<div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-[13] gap-4 justify-items-center">
					{weeks.map((week) => (
						<WeekCircle
							key={week.weekNumber}
							weekNumber={week.weekNumber}
							status={week.status}
							hasNotes={!!week.notes && week.notes.trim().length > 0}
							isCurrentWeek={
								year === new Date().getFullYear() &&
								week.weekNumber === currentWeek
							}
							onClick={() => handleWeekClick(week.weekNumber)}
						/>
					))}
				</div>
			</div>

			{selectedWeek && (
				<>
					<WeekActionDialog
						open={showActionDialog}
						onOpenChange={setShowActionDialog}
						weekNumber={selectedWeek}
						status={
							weeks.find((w) => w.weekNumber === selectedWeek)?.status ||
							'undefined'
						}
						notes={weeks.find((w) => w.weekNumber === selectedWeek)?.notes}
						onEdit={handleEdit}
					/>

					<StatusSelector
						open={showStatusSelector}
						onOpenChange={handleCloseStatusSelector}
						weekNumber={selectedWeek}
						currentStatus={
							weeks.find((w) => w.weekNumber === selectedWeek)?.status ||
							'undefined'
						}
						currentNotes={
							weeks.find((w) => w.weekNumber === selectedWeek)?.notes
						}
						onStatusChange={(status) =>
							handleStatusChange(selectedWeek, status)
						}
						onNotesChange={(notes) => handleNotesChange(selectedWeek, notes)}
					/>
				</>
			)}
		</div>
	);
};
