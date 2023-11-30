import { useState } from 'react';

const InputField = ({
	label,
	type,
	id,
	name,
	value,
	onChange,
	autoComplete,
}) => {
	const [validationError, setValidationError] = useState(null);

	const isEmail = type === 'email';
	const isPassword = type === 'password';
	const isUsername = type === 'text';

	const handleInputChange = (e) => {
		const inputValue = e.target.value;

		if (isEmail) {
			const isValidEmail = /\S+@\S+\.\S+/.test(inputValue);
			setValidationError(isValidEmail ? null : 'Invalid email');
		}

		if (isPassword) {
			const isLengthValid = inputValue.length > 4;
			setValidationError(
				isLengthValid ? null : 'Password length should be greater than 4'
			);
		}

		if (isUsername) {
			const isLengthValid = inputValue.length >= 4;
			setValidationError(
				isLengthValid ? null : 'Username should be at least 4 characters'
			);
		}
		onChange(e);
	};

	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-600">
				{label}
			</label>
			<input
				type={type}
				id={id}
				name={name}
				autoComplete={autoComplete}
				value={value}
				onChange={handleInputChange}
				required
				className="mt-1 p-2 w-full border border-gray-300 rounded-md"
			/>
			{validationError && (
				<p className="text-red-500 text-xs mt-1">{validationError}</p>
			)}
		</div>
	);
};

export default InputField;
