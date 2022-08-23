import { createSelector } from "reselect";
import { fromSigninReducer } from "../reducers";

export const getSigninState = createSelector(
	fromSigninReducer.getSigninState,
	(state) => state
);

export const getProfileInfo = createSelector(
	getSigninState,
	fromSigninReducer.getProfileInfo
);

export const getLoginInfo = createSelector(
	getSigninState,
	fromSigninReducer.getLoginInfo
);

export const setProfileInfo = createSelector(
	getSigninState,
	fromSigninReducer.setProfileInfo
);
