import Link from 'next/link';

const PlayerCard = ({ id, username, rating }) => (
	<Link
		href={`/${username}`}
		className="border hover:bg-slate-200 rounded-md shadow-md p-4 mb-4"
	>
		<p className="text-xl font-semibold">ID: {id}</p>
		<p className="text-lg">Username: {username}</p>
		<p className="text-lg">Rating: {rating}</p>
	</Link>
);

export default PlayerCard;
