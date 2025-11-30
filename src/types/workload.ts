// ============================================================================
// TYPES - Type-only exports (compile-time only, removed at runtime)
// ============================================================================

export type WorkloadStatus =
	| 'too-much'
	| 'heavy'
	| 'normal'
	| 'lazy-normal'
	| 'too-lazy'
	| 'unavailable'
	| 'undefined';

export interface WeekData {
	weekNumber: number;
	status: WorkloadStatus;
	notes?: string;
}

// ============================================================================
// CONSTANTS - Runtime values (available at runtime)
// ============================================================================

export const workloadLabels: Record<WorkloadStatus, string> = {
	'too-much': 'Too Much Work',
	heavy: 'Work Heavy',
	normal: 'Normal Load',
	'lazy-normal': 'Lazy Normal',
	'too-lazy': 'Too Lazy',
	unavailable: 'Unavailable/Sick',
	undefined: 'Not Set',
};

export const workloadColors: Record<WorkloadStatus, string> = {
	'too-much': 'hsl(var(--status-too-much))',
	heavy: 'hsl(var(--status-heavy))',
	normal: 'hsl(var(--status-normal))',
	'lazy-normal': 'hsl(var(--status-lazy-normal))',
	'too-lazy': 'hsl(var(--status-too-lazy))',
	unavailable: 'hsl(var(--status-unavailable))',
	undefined: 'hsl(var(--status-undefined))',
};
