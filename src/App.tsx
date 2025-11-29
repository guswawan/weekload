import { RouterProvider } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useSession } from './hooks/useAuth';
import { router } from './routes/router';
import './App.css';

function App() {
	const { session, isLoading } = useSession();
	const prevSessionIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (isLoading) return;
		const nextSessionId = session?.user.id ?? null;
		if (prevSessionIdRef.current === nextSessionId) return;
		prevSessionIdRef.current = nextSessionId;
		router.invalidate();
	}, [isLoading, session]);

	if (isLoading) {
		return (
			<div
				style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}
			>
				<p>Loading...</p>
			</div>
		);
	}

	return <RouterProvider router={router} context={{ session }} />;
}

export default App;
