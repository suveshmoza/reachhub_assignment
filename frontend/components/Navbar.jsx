import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/useAuth';
import { useState } from 'react';

const Navbar = () => {
	const { userToken, removeTokenOnLogout } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);

		try {
			await removeTokenOnLogout();
			router.push('/auth');
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-between items-center h-[60px] border-b shadow px-8">
			<Link href="/" className="font-semibold">
				LiChess Dashboard
			</Link>
			<div className="flex items-center">
				{userToken && (
					<button
						onClick={handleLogout}
						className="ml-4 rounded-md cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-800 text-white relative"
					>
						{loading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
							</div>
						)}
						Logout
					</button>
				)}
			</div>
		</div>
	);
};

export default Navbar;
