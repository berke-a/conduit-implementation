import Navbar from "../components/Navbar";
import { useValidatableForm } from "react-validatable-form";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors, effects } from "../store";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const initialFormData = {};
const rules = [
	{
		path: "username",
		ruleSet: [
			{ rule: "required" },
			{
				rule: "length",
				lessThanOrEqualTo: 16,
			},
			{
				rule: "length",
				greaterThanOrEqualTo: 8,
			},
		],
	},
	{
		path: "profilePicture",
		ruleSet: [],
	},
	{
		path: "bio",
		ruleSet: [
			{
				rule: "length",
				lessThan: 50,
			},
		],
	},
	{ path: "email", ruleSet: [{ rule: "required" }, { rule: "email" }] },
	{
		path: "password",
		ruleSet: [
			{
				rule: "length",
				lessThan: 15,
			},
			{
				rule: "length",
				greaterThan: 7,
			},

			{
				rule: "regex",
				regex: /\d/,
			},
			{ rule: "regex", regex: /[$&+,:;=?@#|'<>.^*()%!-]/ },
		],
		dependantPaths: ["comparisonValue"],
	},
];

const Settings = () => {
	const {
		isValid,
		setPathValue,
		getValue,
		getError,
		setFormIsSubmitted,
		setPathIsBlurred,
	} = useValidatableForm({
		rules,
		initialFormData,
		hideBeforeSubmit: true,
	});

	const loginInfo = useSelector(selectors.getLoginInfo);
	const profileInfo = useSelector(selectors.getProfileInfo).user;

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	useEffect(() => {
		setPathValue("profilePicture", profileInfo.image);
		setPathValue("username", profileInfo.username);
		setPathValue("bio", profileInfo.bio);
		setPathValue("email", profileInfo.email);
	}, []);

	const updateProfile = async () => {
		const requestOptions = {
			method: "PUT",
			headers: {
				Authorization: "Bearer " + profileInfo.token,
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					email: getValue("email"),
					token: profileInfo.token,
					username: getValue("username"),
					bio: getValue("bio"),
					image: getValue("profilePicture"),
				},
			}),
		};
		return await fetch("https://api.realworld.io/api/user", requestOptions)
			.then((response) => response.json())
			.then((response) => response);
	};

	const handleSubmit = () => {
		setFormIsSubmitted();
		if (!isValid) {
			return;
		}
		updateProfile().then((response) => {
			if (response.errors) {
				for (var key in response.errors) {
					for (var i = 0; i < response.errors[key].length; i++) {
						enqueueSnackbar(key + " " + response.errors[key][i], {
							variant: "error",
							autoHideDuration: 3000,
							TransitionComponent: Zoom,
						});
					}
				}
			} else {
				enqueueSnackbar("Profile updated successfully", {
					variant: "success",
					autoHideDuration: 1500,
					TransitionComponent: Zoom,
				});
				profileInfo.username = getValue("username");
				profileInfo.bio = getValue("bio");
				profileInfo.image = getValue("profilePicture");
				profileInfo.email = getValue("email");

				setTimeout(() => {
					navigate("/user/@" + profileInfo.username);
				}, 1500);
			}
		});
	};

	return (
		<>
			<Navbar
				pageName="Settings"
				isLoggedIn={loginInfo}
				profileInfo={profileInfo}
			/>
			<div className="flex flex-col justify-center items-center">
				<div className="text-3xl m-2 text-conduit mt-5">Your Settings</div>
				<div className="my-3 w-96">
					<TextField
						id="outlined"
						error={getError("profilePicture")}
						helperText={getError("profilePicture")}
						label="URL of profile picture"
						type="text"
						fullWidth
						value={getValue("profilePicture") || ""}
						onChange={(e) => setPathValue("profilePicture", e.target.value)}
						onBlur={() => setPathIsBlurred("profilePicture")}
					/>
				</div>
				<div className="my-3 w-96">
					<TextField
						id="outlined"
						error={getError("username")}
						helperText={getError("username")}
						label="Username"
						type="text"
						fullWidth
						value={getValue("username") || ""}
						onChange={(e) => setPathValue("username", e.target.value)}
						onBlur={() => setPathIsBlurred("username")}
					/>
				</div>
				<div className="my-3 w-96 ">
					<TextField
						id="outlined-multiline-static"
						error={getError("bio")}
						helperText={getError("bio")}
						label="Short bio about you"
						type="text"
						multiline
						fullWidth
						rows={4}
						value={getValue("bio") || ""}
						onChange={(e) => setPathValue("bio", e.target.value)}
						onBlur={() => setPathIsBlurred("bio")}
					/>
				</div>
				<div className="my-3 w-96">
					<TextField
						id="outlined"
						error={getError("email")}
						helperText={getError("email")}
						label="E-mail"
						type="text"
						fullWidth
						value={getValue("email") || ""}
						onChange={(e) => setPathValue("email", e.target.value)}
						onBlur={() => setPathIsBlurred("email")}
					/>
				</div>
				<div className="my-3 w-96">
					<TextField
						id="outlined"
						error={getError("password")}
						helperText={getError("password")}
						label="New password"
						type="text"
						fullWidth
						value={getValue("password") || ""}
						onChange={(e) => setPathValue("password", e.target.value)}
						onBlur={() => setPathIsBlurred("password")}
					/>
				</div>
				<button
					className="border-2 font-semibold rounded-md mt-2 px-2 text-lg bg-conduit text-white border-conduit hover:bg-white hover:text-conduit"
					onClick={handleSubmit}
				>
					Update Profile
				</button>
				<button
					className="border-2 border-red-500 mt-4 font-semibold hover:cursor-pointer px-2 text-white hover:text-red-500 hover:bg-white rounded-md bg-red-500 text-lg"
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
				</button>
			</div>
			<Footer />
		</>
	);
};

export default Settings;
