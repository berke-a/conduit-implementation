import { useSelector } from "react-redux";
import { selectors } from "../store";
import { useSnackbar } from "notistack";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useState, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import Moment from "moment";
import { useNavigate } from "react-router-dom";

/*
selectedPage=0 -> YourFeed
selectedPage=1 -> GlobalFeed
selectedPage=2 -> Own Articles
selectedPage=3 -> Favorited Articles
 */

const Feed = ({ selectedPage, pageNum, userName, selectedTag = null }) => {
	const profileInfo = useSelector(selectors.getProfileInfo).user;
	const loginInfo = useSelector(selectors.getLoginInfo);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const [articleList, setArticleList] = useState([]);
	// This state gets updated when the user likes/dislikes an article.

	const addFavorite = async (article) => {
		if (!loginInfo) {
			navigate("/signin");
		}
		const articleSlug = article.slug;
		const requestOptions = {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + profileInfo.token,
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + articleSlug + "/favorite",
			requestOptions
		)
			.then((response) => response.json())
			.then((response) => {
				return response;
			})
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
					const newList = articleList.map((article) => {
						if (article.slug === response.article.slug) {
							return response.article;
						}
						return article;
					});
					setArticleList(newList);
				}
			});
	};

	const removeFavorite = async (article) => {
		if (!loginInfo || profileInfo === undefined) {
			navigate("/signin");
		}
		const articleSlug = article.slug;
		const requestOptions = {
			method: "DELETE",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + profileInfo.token,
			},
		};
		return await fetch(
			"https://api.realworld.io/api/articles/" + articleSlug + "/favorite",
			requestOptions
		)
			.then((response) => response.json())
			.then((response) => {
				return response;
			})
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
					const newList = articleList.map((article) => {
						if (article.slug === response.article.slug) {
							return response.article;
						}
						return article;
					});
					setArticleList(newList);
				}
			});
	};

	const getFeed = async () => {
		let requestOptions;
		let url;
		if (selectedPage === 0 || selectedPage === 3 || selectedPage === 2) {
			if (loginInfo) {
				requestOptions = {
					method: "GET",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
			}
			if (!loginInfo) {
				requestOptions = {
					method: "GET",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
					},
				};
			}
			if (selectedPage === 0) {
				url =
					"https://api.realworld.io/api/articles/feed?limit=20&offset=" +
					pageNum * 20;
			}
			if (selectedPage === 2) {
				url =
					"https://api.realworld.io/api/articles?author=" +
					userName +
					"&limit=20&offset=" +
					pageNum * 20;
			}
			if (selectedPage === 3) {
				url =
					"https://api.realworld.io/api/articles?favorited=" +
					userName +
					"&limit=20&offset=" +
					pageNum * 20;
			}
		}
		if (selectedPage === 1) {
			if (loginInfo) {
				requestOptions = {
					method: "GET",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + profileInfo.token,
					},
				};
			} else {
				requestOptions = {
					method: "GET",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
					},
				};
			}
			url = "https://api.realworld.io/api/articles?limit=10&offset=";
		}
		return await fetch(url, requestOptions)
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
					if (response.articlesCount === 0) {
						const newList = ["empty"];
						setArticleList(newList);
					} else {
						const newArticleList = response.articles;

						setArticleList(newArticleList);
					}
				}
			});
	};
	useEffect(() => {
		setArticleList([]);
		getFeed();
	}, [pageNum, selectedPage]);

	if (articleList.length === 0) {
		return (
			<div key={1} className="text-conduit font-sm md:ml-16 ml-4 pt-4">
				Loading articles...
			</div>
		);
	}
	if (articleList.length === 1 && articleList[0] === "empty") {
		return (
			<div key={1} className="text-conduit font-sm md:ml-16 ml-4 pt-4">
				There isn't any articles...yet
			</div>
		);
	}
	return articleList.map((article, index) => {
		if (!selectedTag || article.tagList.some((tag) => tag === selectedTag)) {
			return (
				<div
					key={article.slug}
					className="md:ml-16 ml-4 md:w-8/12 lg:w-8/12 sm:w-8/12 w-11/12 md:pr-12 lg:pr-12 mr-10"
				>
					<div className="border-b pt-2">
						<div className="grid grid-cols-5">
							<div className="self-center">
								<div className="flex flex-row items-center">
									<img
										className="justify-self-start rounded-full h-10 w-10 md:h-12 md:w-12 hover:cursor-pointer"
										src={article.author.image}
										alt="Profile"
										onClick={() => {
											navigate("/user/@" + article.author.username);
										}}
									/>
									<div className="flex flex-col ml-2">
										<div
											className="text-conduit font-sans text-sm hover:cursor-pointer"
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
								</div>
							</div>
							<div className="col-span-3 mb-4 pl-4 pt-2 mx-4">
								<div
									className="text-md font-semibold font-sans hover:cursor-pointer"
									onClick={() => {
										navigate("/article/" + article.slug);
									}}
								>
									{article.title}
								</div>
								<div
									className="text-sm text-gray-400 font-sans hover:cursor-pointer"
									onClick={() => {
										navigate("/article/" + article.slug);
									}}
								>
									{article.description}
								</div>
								<div className="flex flex-row mt-2 content-center hover:cursor-pointer">
									<div
										className="text-gray-400 text-xs hover:underline underline-offset-1"
										onClick={() => {
											navigate("/article/" + article.slug);
										}}
									>
										Read more...
									</div>
									<div className="ml-8">
										{article.tagList.map((tag) => {
											return (
												<div
													key={tag}
													className="inline mr-1 text-xs border rounded-xl px-1 text-gray-400"
												>
													{tag}
												</div>
											);
										})}
									</div>
								</div>
							</div>
							<div
								className={
									"justify-self-end place-self-center hover:cursor-pointer border px-1 border-conduit rounded-md " +
									(article.favorited
										? "bg-conduit text-white"
										: "bg-white text-conduit")
								}
								onClick={() => {
									if (article.favorited) {
										removeFavorite(article);
									} else {
										addFavorite(article);
									}
								}}
							>
								<AiFillHeart
									className={
										article.favorited
											? "inline pb-1 pr-1 text-white"
											: "inline pb-1 pr-1 text-conduit"
									}
								/>
								{article.favoritesCount}
							</div>
						</div>
					</div>
				</div>
			);
		}
	});
};;;

export default Feed;
