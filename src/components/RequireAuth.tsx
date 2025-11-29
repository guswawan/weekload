import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useAuth';

interface RequireAuthProps {
	children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
	const { isLoading: loading, session } = useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !session) {
			navigate('/auth', { replace: true });
		}
	}, [loading, session, navigate]);

	if (loading) return null;
	if (!session) return null;

	return <>{children}</>;
};

export default RequireAuth;
