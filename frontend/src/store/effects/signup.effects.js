import * as services from "../service";
import * as actions from "../actions";

const signup = (data) => {
	return async (dispatch) => {
		const response = await services.post("users", data);
		if (response.errors !== undefined) {
			dispatch(actions.postExistingUserFail(response));
		} else {
			dispatch(actions.postExistingUserSuccess(response));
		}
	};
};

export { signup };
