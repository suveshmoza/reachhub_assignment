const PlayerCardSkeleton = () => {
	return (
		<div className="animate-pulse border rounded-md shadow-md p-4 mb-4">
			<div className="flex justify-center items-center">
				<div className="h-4 w-24 mt-2 text-lg bg-slate-300"></div>
			</div>

			<div className="flex justify-between items-center">
				<div className="h-4 w-24 mt-2 text-lg bg-slate-300"></div>
				<div className="h-4 w-24 mt-2 text-lg bg-slate-300"></div>
			</div>
		</div>
	);
};

export default PlayerCardSkeleton;
