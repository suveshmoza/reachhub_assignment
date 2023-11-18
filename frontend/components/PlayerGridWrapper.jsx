const PlayerGridWrapper = ({ children }) => {
	return (
		<div className="container mx-auto mt-4 grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
			{children}
		</div>
	);
};

export default PlayerGridWrapper;
