import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const RatingChart = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				width={400}
				height={300}
				data={data}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="date" />
				<YAxis dataKey="rating" />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="rating"
					stroke="#8884d8"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default RatingChart;
