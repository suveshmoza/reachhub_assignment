import axios from 'axios';

const userSignUp = async (userData) => {
	await axios.post('http://localhost:8080/user/signup', userData, {
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	});
};

const userLogIn = async (loginData) => {
	const res = await axios.post('http://localhost:8080/user/login', loginData, {
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	});
	if (res.status === 200) {
		return await res.data;
	}
};

export { userSignUp, userLogIn };
