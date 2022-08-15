import * as services from "../service";
import * as actions from "../actions";

const signin = (data) => {
    if (data === "logout") {
			return (dispatch) => {
				dispatch(actions.logout());
			};
		}
	return async (dispatch) => {
		const { response, error } = await services.post("users/login", data);
		if (error) {
			dispatch(actions.postExistingUserFail(error));
		}
		dispatch(actions.postExistingUserSuccess(response));
	};
};

export { signin };
