import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const storedToken = localStorage.getItem('userToken');
		if (storedToken) {
			setUserToken(storedToken);
		}
		setLoading(false);
	}, []);

	const setTokenOnLogin = (token) => {
		setUserToken(token);
		localStorage.setItem('userToken', token);
	};

	const removeTokenOnLogout = () => {
		setUserToken(null);
		localStorage.removeItem('userToken');
	};

	useEffect(() => {
		if (!loading && !userToken && router.pathname !== '/auth') {
			router.push('/auth');
		}
	}, [userToken, loading, router]);

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<AuthContext.Provider
			value={{ userToken, setTokenOnLogin, removeTokenOnLogout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
