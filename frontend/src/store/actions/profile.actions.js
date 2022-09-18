export const POST_EXISTING_USER = "[Profile] Post Existing User";
export const POST_EXISTING_USER_SUCCESS =
	"[Profile] Post Existing User Success";
export const POST_EXISTING_USER_FAIL = "[Profile] Post Existing User Fail";
export const POST_NEW_USER = "[Profile] Post Existing User";
export const POST_NEW_USER_SUCCESS = "[Profile] Post Existing User Success";
export const POST_NEW_USER_FAIL = "[Profile] Post Existing User Fail";

export const postNewUser = () => ({
	type: POST_NEW_USER,
});

export const postNewUserSuccess = (payload) => ({
	type: POST_NEW_USER_SUCCESS,
	payload,
});

export const postNewUserFail = (payload) => ({
	type: POST_NEW_USER_FAIL,
	payload,
});
export const postExistingUser = () => ({
	type: POST_EXISTING_USER,
});

export const postExistingUserSuccess = (payload) => ({
	type: POST_EXISTING_USER_SUCCESS,
	payload,
});

export const postExistingUserFail = (payload) => ({
	type: POST_EXISTING_USER_FAIL,
	payload,
});

export const logout = () => ({
	type: "LOGOUT",
});
