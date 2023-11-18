import { useState, useEffect } from 'react';
import { userSignUp, userLogIn } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/useAuth';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import Notification from '@/components/Notification';

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userCreated, setUserCreated] = useState(false);
	const { setTokenOnLogin, userToken } = useAuth();
	const [error, setError] = useState('');
	const router = useRouter();

	const hideNotifications = () => {
		setTimeout(() => {
			setError('');
			setUserCreated(false);
		}, 1000);
	};

	const resetValues = () => {
		setPassword('');
		setEmail('');
		setUsername('');
	};

	const validateInputs = () => {
		if (!username || !password || (isSignUp && !email)) {
			setError('All fields must be filled.');
			hideNotifications();
			return false;
		}
		return true;
	};

	const handleSignUp = async () => {
		const userData = {
			username,
			email,
			password,
		};

		try {
			await userSignUp(userData);
			setLoading(false);
			setUserCreated(true);
			setTimeout(() => {
				setUserCreated(false);
				setIsSignUp(!isSignUp);
			}, 1000);
			resetValues();
		} catch (error) {
			setError(error.response.data.detail);
			setLoading(false);
			hideNotifications();
		}
	};

	const handleLogIn = async () => {
		const loginData = {
			username,
			password,
		};

		try {
			const userData = await userLogIn(loginData);
			setTokenOnLogin(userData.access_token);
			router.push('/');
		} catch (error) {
			setError(
				'Something went wrong. Make sure you are using correct credentials'
			);
			hideNotifications();
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);

		if (!validateInputs()) {
			setLoading(false);
			return;
		}

		if (isSignUp) {
			await handleSignUp();
		} else {
			await handleLogIn();
		}
	};

	useEffect(() => {
		if (userToken) {
			router.push('/');
		}
	}, [router, userToken]);

	return (
		<div className="h-full flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full p-6 space-y-8 bg-white shadow-md rounded-md">
				<h2 className="text-2xl font-semibold text-center text-gray-800">
					{isSignUp ? 'Sign Up' : 'Log In'}
				</h2>
				{userCreated && (
					<Notification type="success" message="User created successfully!" />
				)}
				{error && <Notification type="error" message={error} />}
				<form onSubmit={handleSubmit} className="space-y-4">
					{isSignUp && (
						<InputField
							label="Email"
							type="email"
							id="email"
							name="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					)}

					<InputField
						label="Username"
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<InputField
						label="Password"
						type="password"
						id="password"
						name="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div>
						<Button
							type="submit"
							text={loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
							onClick={handleSubmit}
							disabled={loading}
						/>
					</div>
				</form>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						{isSignUp ? 'Already have an account?' : "Don't have an account?"}
						<button
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp);
								setUserCreated(false);
							}}
							className="text-indigo-600 hover:underline focus:outline-none pl-2 focus:ring focus:border-indigo-300"
						>
							{isSignUp ? 'Log In' : 'Sign Up'}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
