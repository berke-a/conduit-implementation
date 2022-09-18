const post = (url, data, auth = null) => {
	let requestOptions;
	if (auth === null) {
		requestOptions = {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: data,
		};
	} else {
		requestOptions = {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + auth,
			},
			body: data,
		};
	}

	return fetch("https://api.realworld.io/api/" + url, requestOptions)
		.then((response) => response.json())
		.then((response) => response);
};

export { post };
