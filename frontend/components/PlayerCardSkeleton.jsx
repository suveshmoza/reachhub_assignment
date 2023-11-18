const PlayerCardSkeleton = () => {
	return (
		<div className="animate-pulse border rounded-md shadow-md p-4 mb-4">
			<div className="h-7 text-xl font-semibold bg-slate-300"> </div>
			<div className="h-7 w-36 mt-2 text-lg bg-slate-300"></div>
			<div className="h-7 w-24 mt-2 text-lg bg-slate-300"></div>
		</div>
	);
};

export default PlayerCardSkeleton;
