import { createSelector } from "reselect";
import { fromSignupReducer } from "../reducers";

export const getSignupState = createSelector(
	fromSignupReducer.getSignupState,
	(state) => state
);

export const getSignupResponse = createSelector(
	getSignupState,
	fromSignupReducer.getSignupResponse
);
