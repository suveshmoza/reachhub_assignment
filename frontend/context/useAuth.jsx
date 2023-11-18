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
		setLoading(false); // Set loading to false once the token is retrieved
	}, []);

	const setTokenOnLogin = (token) => {
		setUserToken(token);
		localStorage.setItem('userToken', token);
	};

	const removeTokenOnLogout = () => {
		setUserToken(null);
		localStorage.removeItem('userToken');
	};

	// Add the redirection logic here
	useEffect(() => {
		// Redirect only if the loading is false and the userToken is present
		if (!loading && !userToken) {
			router.push('/auth');
		}
	}, [userToken, loading, router]);

	if (loading) {
		// You can render a loading state if needed
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
