import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useValidatableForm } from "react-validatable-form";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { selectors } from "../store";

const rules = [
	{
		path: "title",
		ruleSet: [
			{ rule: "required" },
			{
				rule: "length",
				greaterThan: 8,
			},
		],
	},
	{
		path: "description",
		ruleSet: [
			{
				rule: "required",
			},
			{
				rule: "length",
				greaterThan: 16,
			},
		],
	},
	{
		path: "text",
		ruleSet: [
			{
				rule: "required",
			},
			{
				rule: "length",
				greaterThan: 50,
			},
		],
	},
	{
		path: "tags",
		ruleSet: [
			"required",
			{
				rule: "listSize",
				greaterThanOrEqualTo: 1,
			},
		],
	},
	{
		listPath: "tags",
		ruleSet: [{ rule: "required" }],
	},
];
const Editor = () => {
	const {
		isValid,
		formData,
		setPathValue,
		getValue,
		getError,
		setFormIsSubmitted,
		setPathIsBlurred,
	} = useValidatableForm({
		rules,
		initialFormData: { tags: [""] },
		hideBeforeSubmit: true,
	});

	const loginInfo = useSelector(selectors.getLoginInfo);
	const profileInfo = useSelector(selectors.getProfileInfo).user;
	const params = useParams();

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [article, setArticle] = useState(null);

	// If the user is not logged in, redirect to the login page
	if (!loginInfo) {
		navigate("/signin");
	}

	const isEmpty = (params) => {
		for (var key in params) {
			return false;
		}
		return true;
	};

	/**
	 * These two functions are for the tags input.
	 */
	const handleAddElement = () => {
		const newTag = [...formData.tags];
		newTag.push("");
		setPathValue("tags", newTag);
	};

	const handleDeleteElement = (index) => {
		const newTag = formData.tags.filter((el, ind) => ind !== index);
		setPathValue("tags", newTag);
	};

	let tagsJsx = null;

	if (formData.tags && formData.tags.length > 0) {
		tagsJsx = formData.tags.map((lc, index) => {
			return (
				<div className="inline-block w-24 h-auto" key={index}>
					<div className="flex flex-col">
						<TextField
							error={!!getError(`tags{${index}}`)}
							helperText={getError(`tags{${index}}`) || " "}
							label=""
							type="text"
							size="small"
							hiddenLabel
							id="filled-hidden-label-small"
							fullWidth
							value={getValue(`tags[${index}]`) || ""}
							onChange={(e) => setPathValue(`tags[${index}]`, e.target.value)}
						/>
						<div className="self-center justify-self-center">
							<button onClick={() => handleDeleteElement(index)}>
								<BiTrash />
							</button>
						</div>
					</div>
				</div>
			);
		});
	}

	const newArticle = async () => {
		const requestOptions = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + profileInfo.token,
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				article: {
					title: getValue("title"),
					description: getValue("description"),
					body: getValue("text"),
					tagList: getValue("tags"),
				},
			}),
		};
		return await fetch("https://api.realworld.io/api/articles", requestOptions)
			.then((response) => response.json())
			.then((response) => response);
	};

	const handleSubmit = () => {
		setFormIsSubmitted();

		if (!isValid) {
			return;
		}

		newArticle()
			.then((response) => {
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
					enqueueSnackbar("Article added successfully", {
						variant: "success",
						autoHideDuration: 1500,
						TransitionComponent: Zoom,
					});
					setTimeout(() => {
						navigate("/user/@" + profileInfo.username);
					}, 1500);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getArticle = async () => {
		const requestOptions = {
			method: "GET",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + params.articleSlug,
			requestOptions
		)
			.then((response) => response.json())
			.then((response) => response)
			.then((response) => {
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
					return null;
				} else {
					setArticle(response.article);
				}
			});
	};

	const handleUpdate = async () => {
		setFormIsSubmitted();

		const requestOptions = {
			method: "PUT",
			headers: {
				Authorization: "Bearer " + profileInfo.token,
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				article: {
					title: getValue("title"),
					description: getValue("description"),
					body: getValue("text"),
				},
			}),
		};

		return await fetch(
			"https://api.realworld.io/api/articles/" + params.articleSlug,
			requestOptions
		)
			.then((response) => response.json())
			.then((response) => response)
			.then((response) => {
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
					enqueueSnackbar("Article updated successfully", {
						variant: "success",
						autoHideDuration: 1500,
						TransitionComponent: Zoom,
					});
					setTimeout(() => {
						navigate("/user/@" + profileInfo.username);
					}, 1500);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		if (!isEmpty(params)) getArticle();
		if (article != null) {
			setPathValue("title", article.title);
			setPathValue("description", article.description);
			setPathValue("text", article.body);
		}
	}, [article != null]);

	if (isEmpty(params)) {
		return (
			<>
				<Navbar
					pageName="Editor"
					isLoggedIn={loginInfo}
					profileInfo={profileInfo}
				/>
				<div className="flex flex-col justify-center items-center">
					<div className="text-3xl m-2 text-conduit mt-5">New Article</div>
					<div className="my-3 w-6/12">
						<TextField
							id="outlined"
							error={getError("title")}
							helperText={getError("title")}
							label="Article Title"
							type="text"
							fullWidth
							value={getValue("title") || ""}
							onChange={(e) => setPathValue("title", e.target.value)}
							onBlur={() => setPathIsBlurred("title")}
						/>
					</div>
					<div className="my-3 w-6/12">
						<TextField
							id="outlined"
							error={getError("description")}
							helperText={getError("description")}
							label="What is this article about?"
							type="text"
							fullWidth
							value={getValue("description") || ""}
							onChange={(e) => setPathValue("description", e.target.value)}
							onBlur={() => setPathIsBlurred("description")}
						/>
					</div>
					<div className="mt-3 mb-6 w-6/12 ">
						<TextField
							id="outlined-multiline-static"
							error={getError("text")}
							helperText={getError("text")}
							label="Write your article (in markdown)"
							type="text"
							multiline
							fullWidth
							rows={4}
							value={getValue("text") || ""}
							onChange={(e) => setPathValue("text", e.target.value)}
							onBlur={() => setPathIsBlurred("text")}
						/>
					</div>
					<button className="myAddButton" onClick={() => handleAddElement()}>
						<span className="border-2 font-semibold rounded-md mt-6 px-2 text-lg bg-conduit text-white border-conduit hover:bg-white hover:text-conduit">
							Add Tag
						</span>
					</button>
					<div className="flex flex-row mt-2">
						<span className="self-center p-3 text-lg text-conduit font-base">
							Tags:{" "}
						</span>
						<div className="flex flex-row border rounded-md border-gray-300 p-4">
							<div>{tagsJsx}</div>
						</div>
					</div>
					<div className="text-red-600 text-xs mb-6">{getError("tags")}</div>
					<button
						className="border-2 font-semibold rounded-md mt-2 px-2 text-lg bg-conduit text-white border-conduit hover:bg-white hover:text-conduit"
						onClick={handleSubmit}
					>
						Publish Article
					</button>
				</div>
				<Footer />
			</>
		);
	} else {
		if (article != null) {
			return (
				<>
					<Navbar
						pageName="CustomEditor"
						isLoggedIn={loginInfo}
						profileInfo={profileInfo}
					/>
					<div className="flex flex-col justify-center items-center">
						<div className="text-3xl m-2 text-conduit mt-5">Update Article</div>
						<div className="my-3 w-6/12">
							<TextField
								id="outlined"
								error={getError("title")}
								helperText={getError("title")}
								label="Article Title"
								type="text"
								fullWidth
								value={getValue("title") || ""}
								onChange={(e) => setPathValue("title", e.target.value)}
								onBlur={() => setPathIsBlurred("title")}
							/>
						</div>
						<div className="my-3 w-6/12">
							<TextField
								id="outlined"
								error={getError("description")}
								helperText={getError("description")}
								label="What is this article about?"
								type="text"
								fullWidth
								value={getValue("description") || ""}
								onChange={(e) => setPathValue("description", e.target.value)}
								onBlur={() => setPathIsBlurred("description")}
							/>
						</div>
						<div className="my-3 w-6/12 ">
							<TextField
								id="outlined-multiline-static"
								error={getError("text")}
								helperText={getError("text")}
								label="Write your article (in markdown)"
								type="text"
								multiline
								fullWidth
								rows={4}
								value={getValue("text") || ""}
								onChange={(e) => setPathValue("text", e.target.value)}
								onBlur={() => setPathIsBlurred("text")}
							/>
						</div>

						<div className="text-red-600 text-xs mb-6">{getError("tags")}</div>
						<button
							className="border rounded-md mt-2 p-2 text-lg bg-conduit text-white hover:border hover:underline underline-offset-1"
							onClick={handleUpdate}
						>
							Update Article
						</button>
					</div>
					<Footer />
				</>
			);
		}
	}
};

export default Editor;
