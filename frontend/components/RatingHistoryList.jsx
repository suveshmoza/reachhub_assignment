const RatingEntry = ({ date, rating }) => (
	<li className="flex justify-between items-center mb-4 p-4 border border-gray-300 hover:bg-slate-200 rounded transition-all duration-300">
		<p className="text-black-500">
			Date: {new Date(date).toLocaleDateString()}
		</p>
		<p className="text-black-500">Rating: {rating}</p>
	</li>
);

const RatingHistoryList = ({ sortedRatingHistory }) => (
	<ul className="overflow-y-scroll max-h-[80vh] px-4">
		{sortedRatingHistory.map((entry) => (
			<RatingEntry key={entry.date} {...entry} />
		))}
	</ul>
);

export default RatingHistoryList;
