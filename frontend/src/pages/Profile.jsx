import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors, effects } from "../store";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import Feed from "../components/Feed";
import Footer from "../components/Footer";

const Porfile = () => {
	const params = useParams();
	const loginInfo = useSelector(selectors.getLoginInfo);
	const profileInfo = useSelector(selectors.getProfileInfo).user;

	const [selectedPage, setSelectedPage] = useState(2);
	/**
	 *  selectedPage = 2 => Own Articles
        selectedPage = 3 => Favorited Articles
    */

	const [otherProfile, setOtherProfile] = useState();
	//For viewing profiles other then our own.

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	let profileUserName = null;

	/**
	 * See if the user is viewing their own profile or another profile.
	 */
	if (!loginInfo) {
		profileUserName = params.username;
	}
	if (loginInfo) {
		if (
			params.username !== profileInfo.username &&
			params.username !== undefined
		) {
			profileUserName = params.username;
		}
	}

	useEffect(() => {
		createProfilePage();
	}, [params.username]);

	const createProfilePage = async () => {
		const requestOptions = {
			method: "GET",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		console.log("HERE");

		return await fetch(
			"https://api.realworld.io/api/profiles/" + profileUserName,
			requestOptions
		)
			.then((response) => response.json())
			.then((response) => {
				console.log("respnse ", response);
				setOtherProfile(response.profile);
			});
	};

	const toggleFollow = () => {
		console.log("entered toggle follow");
		if (!loginInfo) navigate("/signin");
		else {
			let requestOptions;
			if (otherProfile.following) {
				requestOptions = {
					method: "DELETE",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
			} else {
				requestOptions = {
					method: "POST",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
			}
			fetch(
				"https://api.realworld.io/api/profiles/" +
					otherProfile.username +
					"/follow",
				requestOptions
			)
				.then((response) => response.json())
				.then((response) => {
					if (response.errors) {
					} else {
						console.log(response);
						setOtherProfile(response.profile);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	if (profileUserName === null) {
		return (
			<>
				<Navbar
					pageName="Profile"
					isLoggedIn={loginInfo}
					profileInfo={profileInfo}
				/>
				<div className="md:h-72 h-64 w-full bg-gray-200 grid grid-rows-5 place-items-center text-white">
					<img
						className="drop-shadow-lg md:mt-20 mt-8 border-2 rounded-full md:h-24 md:w-24 h-16 w-16"
						src={profileInfo.image}
						alt="Profile"
					/>
					<div className="md:text-2xl text-xl font-sans md:mt-24 mt-10 font-semibold text-black">
						{profileInfo.username}
					</div>
					<div className="text-gray-400 mt-6 md:mt-10 font-sans">
						{profileInfo.bio}
					</div>
					<Link
						to="/settings"
						className="justify-self-end md:mr-24 mr-4 border rounded-md border-gray-400 text-gray-400 text-sm px-1 ml-8 hover:text-white hover:cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
					>
						<IoIosSettings className="pb-1 inline" />
						Edit Profile Settings
					</Link>
					<div
						className="justify-self-end md:mr-24 mr-4 border border-red-400 rounded-md text-sm ml-4 px-1 text-red-400 hover:cursor-pointer hover:bg-red-400 hover:text-white mb-4"
						onClick={() => {
							enqueueSnackbar("Logout successfully", {
								variant: "success",
								autoHideDuration: 1500,
								TransitionComponent: Zoom,
							});
							setTimeout(() => {
								dispatch(effects.signin("logout"));
								navigate("*");
							}, 1500);
						}}
					>
						Logout
					</div>
				</div>
				<div className="flex flex-row h-20">
					<div className="float-left h-18 mt-10 pt-2 md:w-8/12 md:ml-16 mx-4 md:mr-24 w-full border-b">
						<div
							className={
								"inline px-6 h-18 " +
								(selectedPage === 2
									? "text-conduit border-b-2 border-conduit py-2 cursor-default"
									: "text-gray-400 hover:text-black hover:cursor-pointer")
							}
							onClick={() => setSelectedPage(2)}
						>
							My Articles
						</div>
						<div
							className={
								"inline px-6 h-18 " +
								(selectedPage === 3
									? "text-conduit border-b-2 border-conduit py-2 cursor-default"
									: "text-gray-400 hover:text-black hover:cursor-pointer")
							}
							onClick={() => setSelectedPage(3)}
						>
							Favorited Articles
						</div>
					</div>
				</div>
				<div>
					{
						<Feed
							selectedPage={selectedPage}
							pageNum={0}
							userName={profileInfo.username}
						/>
					}
				</div>
				<Footer />
			</>
		);
	} else {
		// Fill for other profile
		//'https://api.realworld.io/api/profiles/berkeSINA'
		if (otherProfile === null) {
			return <></>;
		}
		if (otherProfile !== undefined) {
			console.log("Other profile is : ", otherProfile.image);
			console.log(otherProfile.image);
			return (
				<>
					<Navbar
						pageName="OtherProfiles"
						isLoggedIn={loginInfo}
						profileInfo={profileInfo}
					/>
					<div className="md:h-72 h-64 w-full bg-gray-200 grid grid-rows-4 place-items-center text-white">
						<img
							className="drop-shadow-lg md:mt-20 mt-8 border-2 rounded-full md:h-24 md:w-24 h-16 w-16"
							src={otherProfile.image}
							alt="Profile"
						/>
						<div className="md:text-2xl text-xl font-sans md:mt-24 mt-10 font-semibold text-black">
							{otherProfile.username}
						</div>
						<div className="text-gray-400 mt-6 md:mt-10 font-sans break-all">
							{otherProfile.bio}
						</div>
						<div
							className="justify-self-end mr-24 border rounded-md border-gray-400 text-gray-400 text-sm px-1 ml-8 text-white hover:cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
							onClick={toggleFollow}
						>
							<AiOutlinePlus className="inline pr-1" />
							{otherProfile.following ? "Unfollow " : "Follow "}
							{otherProfile.username}
						</div>
					</div>
					<div className="flex flex-row h-20">
						<div className="float-left h-18 mt-10 pt-2 md:w-8/12 md:ml-16 mx-4 md:mr-24 w-full border-b">
							<div
								className={
									"inline px-6 h-18 " +
									(selectedPage === 2
										? "text-conduit border-b-2 border-conduit py-2 cursor-default"
										: "text-gray-400 hover:text-black hover:cursor-pointer")
								}
								onClick={() => setSelectedPage(2)}
							>
								{otherProfile.username}'s Articles
							</div>
							<div
								className={
									"inline px-6 h-18 " +
									(selectedPage === 3
										? "text-conduit border-b-2 border-conduit py-2 cursor-default"
										: "text-gray-400 hover:text-black hover:cursor-pointer")
								}
								onClick={() => setSelectedPage(3)}
							>
								{otherProfile.username}'s Favorited Articles
							</div>
						</div>
					</div>
					<div>
						{
							<Feed
								selectedPage={selectedPage}
								pageNum={0}
								userName={otherProfile.username}
							/>
						}
					</div>
					<Footer />
				</>
			);
		}
	}
};
export default Porfile;
