import * as services from "../service";
import * as actions from "../actions";

const signin = (data) => {
	if (data === "logout") {
		return (dispatch) => {
			dispatch(actions.logout());
		};
	}
	return async (dispatch) => {
		const response = await services.post("users/login", data);
		console.log("In effects response :", response.errors);
		if (response.errors !== undefined) {
			dispatch(actions.postExistingUserFail(response));
		} else {
			dispatch(actions.postExistingUserSuccess(response));
		}
	};
};

export { signin };
