const Button = ({ type, text, onClick, disabled }) => (
	<button
		type={type}
		onClick={onClick}
		disabled={disabled}
		className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
	>
		{text}
	</button>
);

export default Button;
