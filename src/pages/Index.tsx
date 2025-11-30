import { WorkloadLegend } from '../components/WorkloadLegend';
import { YearGrid } from '../components/YearGrid';
import { useLogout, useSession } from '../hooks/useAuth';

const Index = () => {
	const { session } = useSession();
	const logoutMutation = useLogout();

	const logout = () => {
		logoutMutation.mutate();
	};

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<header className="space-y-3">
						<h1 className="text-4xl font-bold tracking-tight text-foreground">
							Hi, {session?.user.user_metadata.full_name}! 👋
						</h1>
						<p className="text-muted-foreground">
							Track your weekly workload throughout the year
						</p>
					</header>

					<div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
						<div className="text-right">
							{/* <p className="text-sm font-semibold text-foreground">
                {session?.user.user_metadata.full_name}
              </p> */}
							<p className="text-xs text-muted-foreground">
								{session?.user.email}
							</p>
						</div>
						{session?.user.user_metadata.avatar_url ? (
							<img
								src={session.user.user_metadata.avatar_url}
								alt="Avatar"
								className="h-12 w-12 rounded-full object-cover"
							/>
						) : null}
						<button
							type="button"
							onClick={logout}
							disabled={logoutMutation.isPending}
							className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
						>
							{logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
						</button>
					</div>
				</div>

				<WorkloadLegend />
				<YearGrid />
			</div>
		</div>
	);
};

export default Index;
