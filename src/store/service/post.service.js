const post = (url, data) => {
	const requestOptions = {
		method: "POST",
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
		},
		body: data,
	};

	return fetch("https://api.realworld.io/api/" + url, requestOptions)
		.then((response) => response.json())
		.then((response) => ({ response, error: null }))
		.catch((error) => ({ response: null, error }))
		.then((response) => response);
};

export { post };
