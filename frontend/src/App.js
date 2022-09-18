import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";
import Article from "./pages/Article";
import Reports from "./pages/Reports";

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
				<Route path="/reports" element={<Reports />}></Route>
			</Routes>
		</div>
	);
}

export default App;
