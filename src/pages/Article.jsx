import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectors } from "../store";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useSnackbar } from "notistack";
import Moment from "moment";
import { useNavigate } from "react-router-dom";
import {
	AiFillHeart,
	AiOutlinePlus,
	AiFillDelete,
	AiFillEdit,
} from "react-icons/ai";
import Footer from "../components/Footer";

const Article = () => {
	const params = useParams();

	const loginInfo = useSelector(selectors.getLoginInfo);
	const profileInfo = useSelector(selectors.getProfileInfo).user;

	const { enqueueSnackbar } = useSnackbar();

	const [article, setArticle] = useState(null);

	const [isLiked, setIsLiked] = useState(false);
	const [isFollowed, setIsFollowed] = useState(false);
	const [favNumber, setFavNumber] = useState(0);

	const [comment, setComment] = useState(""); // For new comment
	const [commentList, setCommentList] = useState([]);

	const navigate = useNavigate();

	const articleSlug = params.articleSlug;

	const postComment = async () => {
		const reqCom = comment;

		const data = JSON.stringify({
			comment: {
				body: reqCom,
			},
		});
		const requestOptions = {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + profileInfo.token,
			},
			body: data,
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + articleSlug + "/comments",
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
					setCommentList([response.comment, ...commentList]);
					setComment("");
				}
			})
			.catch((error) => {
				console.log("Error in post comment ", error);
			});
	};

	const deleteComment = async (commentId) => {
		const requestOptions = {
			method: "DELETE",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + profileInfo.token,
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" +
				articleSlug +
				"/comments/" +
				commentId,
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
					setCommentList(
						commentList.map((comment) => {
							if (comment.id !== commentId) {
								return comment;
							}
						})
					);
				}
			})
			.catch((error) => {
				console.log("Error in post comment ", error);
			});
	};

	const getComments = async () => {
		const requestOptions = {
			method: "GET",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + articleSlug + "/comments",
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
					setCommentList(response.comments);
				}
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
			"https://api.realworld.io/api/articles/" + articleSlug,
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
					setFavNumber(response.article.favoritesCount);
					setIsLiked(response.article.favorited);
					setIsFollowed(response.article.author.following);
				}
			});
	};

	const deleteArticle = async () => {
		const requestOptions = {
			method: "DELETE",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + profileInfo.token,
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + articleSlug,
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
					enqueueSnackbar("Article deleted successfully", {
						variant: "success",
						autoHideDuration: 1500,
						TransitionComponent: Zoom,
					});
					setTimeout(() => {
						navigate("/user/@" + profileInfo.username);
					}, 1500);
				}
			});
	};

	const toggleFav = () => {
		if (!loginInfo) navigate("/signup");
		else {
			if (isLiked) {
				const requestOptions = {
					method: "DELETE",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
				fetch(
					"https://api.realworld.io/api/articles/" + articleSlug + "/favorite",
					requestOptions
				)
					.then((response) => response.json())
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
							setIsLiked(response.article.favorited);
							setFavNumber(response.article.favoritesCount);
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				const requestOptions = {
					method: "POST",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
				fetch(
					"https://api.realworld.io/api/articles/" + articleSlug + "/favorite",
					requestOptions
				)
					.then((response) => response.json())
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
							setIsLiked(response.article.favorited);
							setFavNumber(response.article.favoritesCount);
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	};

	const toggleFollow = () => {
		if (!loginInfo) navigate("/signup");
		else {
			let requestOptions;
			if (isFollowed) {
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
					article.author.username +
					"/follow",
				requestOptions
			)
				.then((response) => response.json())
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
						setIsFollowed(response.profile.following);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	useEffect(() => {
		getComments();
		getArticle();
	}, []);

	if (article !== null) {
		return (
			<>
				<Navbar
					profileInfo={profileInfo}
					isLoggedIn={loginInfo}
					pageName="Article"
				/>
				<div className="h-52 w-full bg-article text-white">
					<div className="grid grid-rows-2 h-full md:mr-24 justify-start items-center content-center ml-4 md:ml-24">
						<div className="font-semibold text-3xl md:text-5xl font-sans pt-4">
							{article.title}
						</div>
						<div className="self-center pb-4">
							<div className="flex flex-row items-center">
								<img
									className="justify-self-start rounded-full h-12 w-12 hover:cursor-pointer"
									src={article.author.image}
									alt="Profile"
									onClick={() => {
										navigate("/user/@" + article.author.username);
									}}
								/>
								<div className="flex flex-col ml-2">
									<div
										className="text-conduit font-sans hover:cursor-pointer"
										onClick={() => {
											navigate("/user/@" + article.author.username);
										}}
									>
										{article.author.username}
									</div>
									<div className="self-center text-gray-400 text-xs ">
										{Moment(article.updatedAt).format("MMMM Do, YYYY")}
									</div>
								</div>
								{loginInfo &&
								article.author.username === profileInfo.username ? (
									<>
										<div
											className="border rounded-md border-gray-400 text-gray-400 text-sm px-1 ml-8 text-white hover:cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
											onClick={() => {
												navigate("/editor/" + article.slug);
											}}
										>
											<AiFillEdit className="inline pb-0.5" /> Edit Article
										</div>
										<div
											className="justify-self-end text-red-500 text-sm px-1 ml-4 border border-red-500 rounded-md hover:bg-red-500 hover:text-gray-200 hover:cursor-pointer"
											onClick={deleteArticle}
										>
											<AiFillDelete className="inline pb-0.5" />{" "}
											<div className="inline ">Delete Article</div>
										</div>
									</>
								) : (
									<>
										<div
											className="border rounded-md border-gray-400 text-gray-400 text-sm px-1 ml-8 text-white hover:cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
											onClick={toggleFollow}
										>
											<AiOutlinePlus className="inline pr-1" />
											{isFollowed ? "Unfollow" : "Follow"}{" "}
											{article.author.username}
										</div>
										<div
											className={
												!isLiked
													? "border border-conduit rounded-md text-sm ml-4 px-1 text-conduit hover:cursor-pointer hover:bg-conduit hover:text-white"
													: "border border-red-300 rounded-md text-sm ml-4 px-1 text-red-300 hover:cursor-pointer hover:bg-red-300 hover:text-white"
											}
											onClick={toggleFav}
										>
											<AiFillHeart className="inline pb-1 pr-1" />
											{!isLiked ? "Favorite Article" : "Unfavorite Article"} (
											{favNumber})
										</div>
									</>
								)}
							</div>
						</div>
					</div>
					<div>
						<div className="whitespace-normal break-all text-black md:mx-24 mx-4 mt-8 font-sans">
							{article.body}
						</div>
					</div>
					<div className="md:mx-24 mx-4 mt-8 font-sans">
						{article.tagList.map((tag) => (
							<div className="inline-block border border-gray-400 rounded-xl px-2 mr-2 text-sm text-gray-400">
								{tag}
							</div>
						))}
					</div>
					<div className="md:mx-24 mt-8 border-b border-gray-400"></div>
					<div className="flex flex-col mt-8 md:mx-24 w-inherit items-center">
						{!loginInfo ? (
							<div className="text-black mb-8">
								<span
									className="inline text-conduit hover:cursor-pointer hover:underline underline-offset-1"
									onClick={() => {
										navigate("/signin");
									}}
								>
									Sign in
								</span>{" "}
								or{" "}
								<span
									className="inline text-conduit hover:cursor-pointer hover:underline underline-offset-1"
									onClick={() => {
										navigate("/signup");
									}}
								>
									sign up
								</span>{" "}
								to add comments on this article.
							</div>
						) : (
							<div className="border-l border-r border-b border-gray-300 mb-8 rounded-md w-9/12">
								<TextField
									id="outlined-multiline-static"
									label="Write a comment..."
									type="text"
									multiline
									fullWidth
									rows={4}
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<div className="h-12 bg-gray-200">
									<button
										className="text-md mt-3 mr-2 px-1 rounded-md float-right border border-conduit bg-conduit text-white"
										onClick={postComment}
									>
										Post Comment
									</button>
								</div>
							</div>
						)}
						{commentList.map((comment) => {
							if (comment === undefined) {
								return null;
							} else {
								return (
									<div
										className="mb-8 text-black w-9/12 border border-gray-300 rounded-md"
										key={comment.id}
									>
										<div className="p-4">{comment.body}</div>
										<div className="flex flex-row items-center h-12 bg-gray-200 px-2 ">
											<img
												className="rounded-full justify-self-start h-6 w-6 hover:cursor-pointer hover:border border-gray-400"
												src={comment.author.image}
												alt="Profile"
												onClick={() => {
													navigate("/user/@" + comment.author.username);
												}}
											/>
											<div
												className="pl-1 pr-2 justify-self-start text-conduit text-sm hover:underline underline-offset-1 hover:cursor-pointer"
												onClick={() => {
													navigate("/user/@" + comment.author.username);
												}}
											>
												{comment.author.username}
											</div>
											<div className="text-xs pr-2 justify-self-start text-gray-400">
												{Moment(comment.updatedAt).format("MMMM Do, YYYY")}
											</div>
											{loginInfo &&
											comment.author.username === profileInfo.username ? (
												<div
													className="justify-self-end text-red-500 text-sm px-1 border border-red-500 rounded-md hover:bg-red-500 hover:text-gray-200 hover:cursor-pointer"
													onClick={() => {
														deleteComment(comment.id);
													}}
												>
													<AiFillDelete className="inline pb-0.5" />{" "}
													<div className="inline ">Delete</div>
												</div>
											) : null}
										</div>
									</div>
								);
							}
						})}
					</div>
				</div>
				<Footer />
			</>
		);
	} else {
		<>
			<Navbar
				profileInfo={profileInfo}
				isLoggedIn={loginInfo}
				pageName="Article"
			/>
			<div className="h-56 w-full bg-article text-white">LOADING</div>
		</>;
	}
};

export default Article;
