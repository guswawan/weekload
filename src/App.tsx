import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	const googleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};

	if (!session) {
		return (
			<div
				style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}
			>
				<button type="button" onClick={googleLogin}>
					Login with Google
				</button>
			</div>
		);
	}

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>Halo, {session.user.user_metadata.full_name}!</h1>
			<p>{session.user.email}</p>
			<img
				src={session.user.user_metadata.avatar_url}
				alt="Avatar"
				style={{ borderRadius: '50%', width: '100px' }}
			/>
			<br />
			<br />
			<button type="button" onClick={logout}>
				Sign Out
			</button>
		</div>
	);
}

export default App;
