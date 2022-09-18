import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import signinReducer, * as fromSigninReducer from "./signin.reducer";
import signupReducer, * as fromSignupReducer from "./signup.reducer";

const reducers = combineReducers({
	signin: signinReducer,
	signup: signupReducer,
});

const rootReducer = (state, action) => {
	if (action.type === "LOGOUT") {
		state = undefined;
		storage.removeItem("persist:root");
		storage.removeItem("persist:signin");
	}
	return reducers(state, action);
};

export { reducers, fromSigninReducer, fromSignupReducer, rootReducer };
