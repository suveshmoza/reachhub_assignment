import Link from 'next/link';

const PlayerCard = ({ username, rating, rank }) => (
	<Link
		href={`/${username}`}
		className=" border hover:bg-slate-200 rounded-md shadow px-2 py-4 transition-all duration-300"
	>
		<h3 className="text-center font-bold border-b">Rank {rank}</h3>
		<div className="flex justify-between items-center mt-1">
			<p>{username}</p>
			<p>{rating}</p>
		</div>
	</Link>
);

export default PlayerCard;
