import { createSelector } from "reselect";
import { fromSigninReducer } from "../reducers";

export const getSigninState = createSelector(
	fromSigninReducer.getSigninState,
	(state) => state
);

export const getResponse = createSelector(
	getSigninState,
	fromSigninReducer.getResponse
);

export const getLoginInfo = createSelector(
	getSigninState,
	fromSigninReducer.getLoginInfo
);

export const setProfileInfo = createSelector(
	getSigninState,
	fromSigninReducer.setProfileInfo
);
