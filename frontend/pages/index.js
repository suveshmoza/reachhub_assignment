import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/useAuth';

const PlayerListSkeleton = () => {
	return (
		<div className="animate-pulse border rounded-md shadow-md p-4 mb-4">
			<div className="h-7 text-xl font-semibold bg-slate-300"> </div>
			<div className="h-7 w-36 mt-2 text-lg bg-slate-300"></div>
			<div className="h-7 w-24 mt-2 text-lg bg-slate-300"></div>
		</div>
	);
};

const PlayerList = () => {
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('http://localhost:8080/top_players', {
					headers: {
						accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
				});

				setPlayers(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, [userToken]);

	if (loading) {
		return (
			<div className="container mx-auto mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
				<PlayerListSkeleton />
				<PlayerListSkeleton />
				<PlayerListSkeleton />
				<PlayerListSkeleton />
				<PlayerListSkeleton />
			</div>
		);
	}

	return (
		<>
			<h1 className="pt-5 pl-2 text-3xl font-semibold">
				Top 50 Classical Players
			</h1>
			<div className="container mx-auto mt-4 grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
				{players.map((player) => (
					<Link
						href={`/${player.username}`}
						key={player.id}
						className="border rounded-md shadow-md p-4 mb-4"
					>
						<p className="text-xl font-semibold">ID: {player.id}</p>
						<p className="text-lg">Username: {player.username}</p>
						<p className="text-lg">Rating: {player.rating}</p>
					</Link>
				))}
			</div>
		</>
	);
};

export default PlayerList;
