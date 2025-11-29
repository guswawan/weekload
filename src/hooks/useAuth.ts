import type { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

const AUTH_QUERY_KEY = ['auth', 'session'] as const;

export function useSession() {
	const queryClient = useQueryClient();

	const { data: session, isLoading } = useQuery<Session | null>({
		queryKey: AUTH_QUERY_KEY,
		queryFn: async () => {
			const { data } = await supabase.auth.getSession();
			return data.session;
		},
		staleTime: Infinity, // Session doesn't become stale automatically
	});

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			queryClient.setQueryData(AUTH_QUERY_KEY, session);
		});

		return () => subscription.unsubscribe();
	}, [queryClient]);

	return { session, isLoading };
}

export function useGoogleLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
			});
			if (error) throw error;
		},
		onSuccess: () => {
			// The session will be updated via onAuthStateChange listener
			queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.setQueryData(AUTH_QUERY_KEY, null);
		},
	});
}
