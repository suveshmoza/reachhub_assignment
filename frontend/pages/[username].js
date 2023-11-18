import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/useAuth';
import RatingChart from '@/components/RatingChar';

const RatingHistory = () => {
	const router = useRouter();
	const { username } = router.query;
	const [ratingHistory, setRatingHistory] = useState([]);
	const { userToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/player/${username}/rating-history`,
					{
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${userToken}`,
						},
					}
				);

				setRatingHistory(response.data);
			} catch (error) {
				console.error('Error fetching rating history:', error);
			}
		};

		if (username) {
			fetchData();
		}
	}, [username, userToken]);

	const sortedRatingHistory = ratingHistory.sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	);

	return (
		<div className="max-w-8xl h-[calc(100vh-60px)] mx-auto pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
			<div>
				<h1 className="text-2xl font-bold mb-4">
					Rating History for {username}
				</h1>
				<ul className="overflow-y-scroll max-h-[80vh]">
					{sortedRatingHistory.map((entry) => (
						<li
							key={entry.date}
							className="mb-4 p-4 border border-gray-300 rounded"
						>
							<p className="text-gray-500">
								Date: {new Date(entry.date).toLocaleDateString()}
							</p>
							<p className="text-gray-500">Rating: {entry.rating}</p>
						</li>
					))}
				</ul>
			</div>
			<div className="h-full w-full">
				<RatingChart data={sortedRatingHistory} />
			</div>
		</div>
	);
};

export default RatingHistory;
