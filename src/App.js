import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import Editor from "./components/Editor";
import Article from "./components/Article";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="*" element={<Home />}></Route>
				<Route path="/signin" element={<SignIn />}></Route>
				<Route path="/signup" element={<SignUp />}></Route>
				<Route path="/settings" element={<Settings />}></Route>
				<Route path="/user/@:username" element={<Profile />}></Route>
				<Route path="/editor" element={<Editor />}></Route>
				<Route path="/editor/:articleSlug" element={<Editor />}></Route>
				<Route path="/article/:articleSlug" element={<Article />}></Route>
			</Routes>
		</div>
	);
}

export default App;
