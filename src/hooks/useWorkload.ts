import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from './useAuth';
import { supabase } from '../integrations/supabase/client';
import type { WeekData, WorkloadStatus } from '../types/workload';

const WEEKS_PER_YEAR = 52;

const WORKLOAD_QUERY_KEY = (year: number, userId: string) =>
	['workload', 'weeks', year, userId] as const;

export function useWorkloadWeeks(year: number) {
	const { session } = useSession();
	const queryClient = useQueryClient();

	const {
		data: weeks = [],
		isLoading,
		error,
	} = useQuery<WeekData[]>({
		queryKey: WORKLOAD_QUERY_KEY(year, session?.user.id ?? ''),
		queryFn: async () => {
			if (!session) {
				// Return empty weeks if no session
				return Array.from({ length: WEEKS_PER_YEAR }, (_, i) => ({
					weekNumber: i + 1,
					status: 'undefined' as WorkloadStatus,
				}));
			}

			const { data, error: fetchError } = await supabase
				.from('workload_weeks')
				.select('*')
				.eq('year', year)
				.eq('user_id', session.user.id);

			if (fetchError) throw fetchError;

			// Create all 52 weeks, filling in saved data where it exists
			const allWeeks: WeekData[] = Array.from(
				{ length: WEEKS_PER_YEAR },
				(_, i) => {
					const weekNumber = i + 1;
					const savedWeek = data?.find((w) => w.week_number === weekNumber);
					return {
						weekNumber,
						status: (savedWeek?.status as WorkloadStatus) || 'undefined',
						notes: savedWeek?.notes || undefined,
					};
				},
			);

			return allWeeks;
		},
		enabled: !!session,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	const updateStatusMutation = useMutation({
		mutationFn: async ({
			weekNumber,
			status,
		}: {
			weekNumber: number;
			status: WorkloadStatus;
		}) => {
			if (!session) throw new Error('No session');

			const { error } = await supabase.from('workload_weeks').upsert(
				{
					year,
					week_number: weekNumber,
					status,
					user_id: session.user.id,
				},
				{
					onConflict: 'year,week_number,user_id',
				},
			);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			// Optimistically update the cache
			queryClient.setQueryData<WeekData[]>(
				WORKLOAD_QUERY_KEY(year, session?.user.id ?? ''),
				(old) =>
					old?.map((week) =>
						week.weekNumber === variables.weekNumber
							? { ...week, status: variables.status }
							: week,
					) ?? [],
			);
		},
	});

	const updateNotesMutation = useMutation({
		mutationFn: async ({
			weekNumber,
			notes,
			currentStatus,
		}: {
			weekNumber: number;
			notes: string;
			currentStatus: WorkloadStatus;
		}) => {
			if (!session) throw new Error('No session');

			const { error } = await supabase.from('workload_weeks').upsert(
				{
					year,
					week_number: weekNumber,
					status: currentStatus,
					notes,
					user_id: session.user.id,
				},
				{
					onConflict: 'year,week_number,user_id',
				},
			);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			// Optimistically update the cache
			queryClient.setQueryData<WeekData[]>(
				WORKLOAD_QUERY_KEY(year, session?.user.id ?? ''),
				(old) =>
					old?.map((week) =>
						week.weekNumber === variables.weekNumber
							? { ...week, notes: variables.notes }
							: week,
					) ?? [],
			);
		},
	});

	return {
		weeks,
		isLoading,
		error,
		updateStatus: updateStatusMutation.mutate,
		updateStatusAsync: updateStatusMutation.mutateAsync,
		isUpdatingStatus: updateStatusMutation.isPending,
		updateNotes: updateNotesMutation.mutate,
		updateNotesAsync: updateNotesMutation.mutateAsync,
		isUpdatingNotes: updateNotesMutation.isPending,
	};
}
