import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '@/context/authContext';
import {
	PlayerCard,
	PlayerCardSkeleton,
	PlayerGridWrapper,
} from '@/components/PlayerCard';

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
			<PlayerGridWrapper>
				<PlayerCardSkeleton />
				<PlayerCardSkeleton />
				<PlayerCardSkeleton />
				<PlayerCardSkeleton />
				<PlayerCardSkeleton />
			</PlayerGridWrapper>
		);
	}

	return (
		<>
			<h1 className="pt-5 pl-2 text-3xl font-semibold">
				Top 50 Classical Players
			</h1>
			<PlayerGridWrapper>
				{players.map((player, index) => (
					<PlayerCard key={player.id} {...player} rank={index + 1} />
				))}
			</PlayerGridWrapper>
		</>
	);
};

export default PlayerList;
