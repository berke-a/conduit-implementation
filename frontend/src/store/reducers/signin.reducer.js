import * as actions from "../actions";

const initialState = {
	isLoggedIn: false,
	response: {},
};

function signinReducer(state = initialState, action) {
	console.log(
		"Reducer action : " + action.payload + " state: " + JSON.stringify(state)
	);
	switch (action.type) {
		case actions.POST_EXISTING_USER:
			return {
				...state,
				isLoggedIn: false,
			};
		case actions.POST_EXISTING_USER_SUCCESS:
			return {
				...state,
				isLoggedIn: true,
				response: action.payload,
			};
		case actions.POST_EXISTING_USER_FAIL:
			return {
				...state,
				isLoggedIn: false,
				response: action.payload,
			};
		default:
			return state;
	}
}

export const getSigninState = (state) => state.signin;
export const getProfileInfo = (signinState) => signinState.response;
export const getLoginInfo = (signinState) => signinState.isLoggedIn;
export const setProfileInfo = (signinState, updatedProfile) =>
	(signinState.response = updatedProfile);
export default signinReducer;
