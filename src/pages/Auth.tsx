import { useGoogleLogin } from '../hooks/useAuth';

const Auth = () => {
	const googleLoginMutation = useGoogleLogin();

	const googleLogin = () => {
		googleLoginMutation.mutate();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold text-foreground">
						Workload Tracker
					</h1>
					<p className="text-muted-foreground">
						Sign in to start tracking your weekly workload.
					</p>
				</div>
				<button
					type="button"
					onClick={googleLogin}
					disabled={googleLoginMutation.isPending}
					className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{googleLoginMutation.isPending
						? 'Logging in...'
						: 'Login with Google'}
				</button>
			</div>
		</div>
	);
};

export default Auth;
