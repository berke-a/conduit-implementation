import { Link } from "react-router-dom";
import { HiPencilAlt } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectors } from "../store";


//Uses only the pageName prop. Other props where used on lower versions but are not used on this version.


const Navbar = ({ pageName }) => {
	const isLoggedIn = useSelector(selectors.getLoginInfo);
	let profileInfo = useSelector(selectors.getProfileInfo);
	if (isLoggedIn) {
		profileInfo = profileInfo.user;
	}
	if (!isLoggedIn) {
		return (
			<nav className="h-20 w-full font-sans pr-5 text-xl">
				<div className="float-left pt-5 ml-4 md:ml-16 text-conduit text-4xl font-bold filter-none">
					<Link to="/">conduit</Link>
				</div>
				<div className="float-right pt-6">
					{" "}
					<Link
						className={
							pageName === "Home" ? "pr-5 text-balck-500" : "pr-5 text-gray-400"
						}
						to="/"
					>
						Home
					</Link>
					<Link
						className={
							pageName === "SignIn"
								? "pr-5 text-balck-500"
								: "pr-5 text-gray-400"
						}
						to="/signin"
					>
						Sign In
					</Link>
					<Link
						className={
							pageName === "SignUp"
								? "md:pr-10 text-balck-500"
								: "md:pr-10 text-gray-400"
						}
						to="/signup"
					>
						Sign Up
					</Link>
				</div>
			</nav>
		);
	}
	return (
		<nav className="h-20 w-full pr-5 md:text-xl lg:text-xl sm:text-xl text-md">
			<div className="float-left pt-5 ml-4 md:ml-16 text-conduit text-4xl font-bold filter-none">
				<Link to="/">conduit</Link>
			</div>
			<div className="flex flex-rows flex-wrap content-center justify-end sm:flex-none sm:float-right pt-6">
				{" "}
				<Link
					className={
						pageName === "Home"
							? "md:pr-5 pr-2 text-balck-500"
							: "md:pr-5 pr-2 text-gray-400"
					}
					to="/"
				>
					Home
				</Link>
				<Link
					className={
						pageName === "Editor"
							? "md:pr-5 pr-2 text-balck-500"
							: "md:pr-5 pr-2 text-gray-400"
					}
					to="/editor"
				>
					<HiPencilAlt className="pb-1 inline" />
					New Article
				</Link>
				<Link
					className={
						pageName === "Settings"
							? "md:pr-5 pr-2 text-balck-500"
							: "md:pr-5 pr-2 text-gray-400"
					}
					to="/settings"
				>
					<IoIosSettings className="pb-1 inline" />
					Settings
				</Link>
				<Link
					className={
						pageName === "Profile"
							? "md:pr-10 pr-2 text-balck-500"
							: "md:pr-10 pr-2 text-gray-400"
					}
					to={"/user/@" + profileInfo.username}
				>
					{profileInfo.username}
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
