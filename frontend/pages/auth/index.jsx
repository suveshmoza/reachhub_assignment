import { useState, useEffect } from 'react';
import { userSignUp, userLogIn } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/useAuth';

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userCreated, setUserCreated] = useState(false); // New state for user creation banner
	const { setTokenOnLogin, userToken } = useAuth();
	const [error, setError] = useState('');
	const router = useRouter();

	const resetValues = () => {
		setPassword('');
		setEmail('');
		setUsername('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true); // Set loading to true on form submission

		if (isSignUp) {
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
				}, 500);
				resetValues();
			} catch (error) {
				console.log(error);
				setError('Something went wrong. Please try again later');
				setLoading(false); // Set loading to false in case of an error
			}
		}

		if (!isSignUp) {
			const loginData = {
				username,
				password,
			};
			try {
				const userData = await userLogIn(loginData);
				setTokenOnLogin(userData.access_token);
				router.push('/');
			} catch (error) {
				console.log(error);
				setError(
					'Something went wrong. Make sure you are using correct credentials'
				);
				setLoading(false); // Set loading to false in case of an error
			}
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
					<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4">
						<p>User created successfully!</p>
					</div>
				)}
				{error && (
					<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
						<p>{error}</p>
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					{isSignUp && (
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-600"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1 p-2 w-full border border-gray-300 rounded-md"
							/>
						</div>
					)}

					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-600"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 p-2 w-full border border-gray-300 rounded-md"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-600"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 p-2 w-full border border-gray-300 rounded-md"
						/>
					</div>
					<div>
						<button
							type="submit"
							className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
							disabled={loading} // Disable the button during loading
						>
							{loading ? 'Loading....' : isSignUp ? 'Sign Up' : 'Log In'}
						</button>
					</div>
				</form>
				<div className="text-center">
					<p className="text-sm text-gray-600">
						{isSignUp ? 'Already have an account?' : "Don't have an account?"}
						<button
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp);
								setUserCreated(false); // Reset userCreated state when switching between sign up and log in
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
