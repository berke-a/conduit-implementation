import * as actions from "../actions";

const initialState = {
	response: {},
};

function signupReducer(state = initialState, action) {
	switch (action.type) {
		case actions.POST_NEW_USER:
			return {
				...state,
			};
		case actions.POST_NEW_USER_SUCCESS:
			return {
				...state,
				response: action.payload,
			};
		case actions.POST_NEW_USER_FAIL:
			return {
				...state,
				response: action.payload,
			};
		default:
			return state;
	}
}

export const getSignupState = (state) => state.signup;
export const getSignupResponse = (signupState) => signupState.response;
export default signupReducer;
