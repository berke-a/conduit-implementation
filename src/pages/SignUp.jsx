import Navbar from "./Navbar";
import { useValidatableForm } from "react-validatable-form";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useNavigate } from "react-router-dom";

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
	{ path: "email", ruleSet: [{ rule: "required" }, { rule: "email" }] },
	{
		path: "password",
		ruleSet: [
			{ rule: "required" },
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

const SignUp = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
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

	const signupPOST = async () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				user: {
					username: getValue("username"),
					email: getValue("email"),
					password: getValue("password"),
				},
			}),
		};
		return await fetch("https://api.realworld.io/api/users", requestOptions)
			.then((response) => response.json())
			.then((response) => response);
	};

	const handleSubmit = () => {
		setFormIsSubmitted();
		if (!isValid) {
			return;
		}
		signupPOST().then((response) => {
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
				navigate("/signin");
			}
		});
	};

	return (
		<>
			<Navbar pageName={"SignUp"} />
			<div className="flex flex-col justify-center items-center ">
				<div className="flex flex-col md:flex-row justify-center items-center">
					<div className="text-6xl font-bold text-conduit mt-10">Sign up</div>
					<Link
						to="/signin"
						className="mt-2 text-conduit md:mt-8 md:pl-10 hover:drop-shadow-md hover:underline underline-offset-1"
					>
						Have an account?
					</Link>
				</div>
				<div className="h-auto bg-conduit w-64 rounded-3xl mt-20">
					<div className="grid grid-rows-4 w-full p-10 gap-4 place-items-center">
						<span>
							<TextField
								id="standard-basic"
								variant="standard"
								error={getError("username")}
								helperText={getError("username")}
								label="Username"
								type="text"
								value={getValue("username") || ""}
								onChange={(e) => setPathValue("username", e.target.value)}
								onBlur={() => setPathIsBlurred("username")}
							/>
						</span>
						<span>
							<TextField
								id="standard-basic"
								variant="standard"
								error={getError("email")}
								helperText={getError("email")}
								label="Email"
								type="text"
								value={getValue("email") || ""}
								onChange={(e) => setPathValue("email", e.target.value)}
								onBlur={() => setPathIsBlurred("email")}
							/>
						</span>
						<span>
							<TextField
								id="standard-basic"
								variant="standard"
								error={getError("password")}
								helperText={
									getError("password") === "Not a valid value"
										? "Password must contain at least one numeric digit and a special character."
										: getError("password")
								}
								label="Password"
								type="text"
								value={getValue("password") || ""}
								onChange={(e) => setPathValue("password", e.target.value)}
								onBlur={() => setPathIsBlurred("password")}
							/>
						</span>
						<button
							className="border rounded-md p-1 text-white hover:border-2 hover:drop-shadow-md hover:underline underline-offset-1"
							onClick={handleSubmit}
						>
							Sign up
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default SignUp;
