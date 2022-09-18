import Navbar from "../components/Navbar";
import { useValidatableForm } from "react-validatable-form";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectors, effects } from "../store";
import { useEffect } from "react";
import Footer from "../components/Footer";

const initialFormData = {};
const rules = [
	{ path: "email", ruleSet: [{ rule: "required" }, { rule: "email" }] },
	{ path: "password", ruleSet: [{ rule: "required" }] },
];

const SignIn = () => {
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

	const { enqueueSnackbar } = useSnackbar();

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const response = useSelector(selectors.getProfileInfo);
	const loginInfo = useSelector(selectors.getLoginInfo);

	function isEmpty(obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				return false;
			}
		}

		return JSON.stringify(obj) === JSON.stringify({});
	}
	useEffect(() => {
		console.log("in useEffect", isEmpty(response));
		if (isEmpty(response)) {
			return;
		}
		if (response.errors !== undefined) {
			dispatch(effects.signin("logout"));
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
			navigate("/");
		}
	}, [response]);

	const handleSubmit = () => {
		setFormIsSubmitted();
		if (!isValid) {
			return;
		}

		const data = JSON.stringify({
			user: {
				email: getValue("email"),
				password: getValue("password"),
			},
		});

		//Gets the data from the form and dispatches the action to the reducer
		dispatch(effects.signin(data));
		console.log("before check response", response);
		console.log(
			"?undefined: ",
			response.errors === undefined,
			" ?null: ",
			response.errors === null
		);
	};

	return (
		<>
			<Navbar pageName={"SignIn"} />
			<div className="flex flex-col justify-center items-center ">
				<div className="flex flex-col md:flex-row justify-center items-center">
					<div className="text-6xl font-bold text-conduit mt-10">Sign in</div>
					<Link
						to="/signup"
						className="mt-2 text-conduit md:mt-8 md:pl-10 hover:drop-shadow-md hover:underline underline-offset-1"
					>
						Need an account?
					</Link>
				</div>
				<div className="h-64 bg-conduit w-64 rounded-3xl h-full mt-20">
					<div className="grid grid-rows-3 w-full p-10 gap-4 place-items-center">
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
								helperText={getError("password")}
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
							Sign in
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};
export default SignIn;
