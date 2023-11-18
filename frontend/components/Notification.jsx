const Notification = ({ type, message }) => (
	<div
		className={`bg-${
			type === 'success' ? 'green' : 'red'
		}-100 border-l-4 border-${type === 'success' ? 'green' : 'red'}-500 text-${
			type === 'success' ? 'green' : 'red'
		}-700 p-4 my-4`}
	>
		<p>{message}</p>
	</div>
);

export default Notification;
