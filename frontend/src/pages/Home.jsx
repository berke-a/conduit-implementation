import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import Footer from "../components/Footer";
import { selectors } from "../store";
import { useSelector } from "react-redux";

const Home = () => {
	const loginInfo = useSelector(selectors.getLoginInfo);
	const profileInfo = useSelector(selectors.getProfileInfo).user;
	// Getting login informations from store.

	const [selectedPage, setSelectedPage] = React.useState(0);
	/**
	 *  selectedPage = 0 => personal feed
        selectedPage = 1 => global feed
    */

	const [tags, setTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState(null);
	/**
	 * selectedTag = null => no tag selected
	 * selectedTag = "tag" => tag selected
	 * If there is a selectedTag selectedPage will be ignored
	 * */

	const getTags = async () => {
		const requestOptions = {
			method: "GET",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
		};
		return await fetch("https://api.realworld.io/api/tags", requestOptions)
			.then((response) => response.json())
			.then((response) => response)
			.then((response) => {
				setTags(response.tags);
			});
	};

	useEffect(() => {
		getTags();
	}, []);

	if (!loginInfo) {
		return (
			<>
				<Navbar
					pageName="Home"
					isLoggedIn={loginInfo}
					profileInfo={profileInfo}
				/>
				<div className="h-64 w-full bg-conduit grid grid-rows-2 gap-4 place-items-center text-white">
					<div className="text-8xl font-bold drop-shadow-lg pt-10">conduit</div>
					<div className="text-2xl font-mono pb-10">
						A place to share your knowledge.
					</div>
				</div>
				<div className="sm:hidden md:hidden lg:hidden rounded-md w-full bg-gray-200 block">
					<div className="flex flex-col p-2">
						<div className="font-sans mx-2 mb-1 underline underline-offset-1 ">
							Populer Tags
						</div>
						<div className="flex flex-row flex-wrap items-center">
							{tags.map((tag) => {
								return (
									<div
										key={tag}
										className={
											"mb-1 mx-1 px-1 text-sm border rounded-xl ease-in-out duration-200 " +
											(selectedTag === tag
												? "border-conduit bg-conduit text-gray-200 hover:border-conduit hover:bg-gray-400 hover:cursor-pointer hover:text-base"
												: "border-gray-400 bg-gray-400 text-gray-200 hover:bg-conduit hover:border-conduit hover:cursor-pointer hover:text-base")
										}
										onClick={() => {
											setSelectedPage(1);
											if (selectedTag === tag) {
												setSelectedTag(null);
											} else {
												setSelectedTag(tag);
											}
										}}
									>
										{tag}
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-row h-20">
					<div className="float-left h-10 mt-8 pt-2 w-full ml-4 md:ml-16 border-b ">
						<div
							className={
								"inline px-6 h-18 ml-1 " +
								(!selectedTag
									? "text-conduit border-b-2 border-conduit py-2 cursor-default"
									: "text-gray-400 hover:text-gray-500 hover:border-b-2 hover:border-gray-400 py-2 hover:cursor-pointer")
							}
							onClick={() => {
								setSelectedTag(null);
								setSelectedPage(1);
							}}
						>
							Global Feed
						</div>
						<div
							className={
								selectedTag
									? "inline px-6 h-18 ml-1 text-conduit border-b-2 border-conduit py-2 cursor-default"
									: ""
							}
						>
							{selectedTag}
						</div>
					</div>
					<div className="hidden sm:block md:blcok lg:block rounded-md w-4/12 float-right bg-gray-200 inline-block ml-12 mr-8 md:mr-24 mt-36 md:mt-24 self-center">
						<div className="flex flex-col p-2">
							<div className="font-sans mx-2 mb-1 underline underline-offset-1 ">
								Populer Tags
							</div>
							<div className="flex flex-row flex-wrap items-center">
								{tags.map((tag) => {
									return (
										<div
											key={tag}
											className={
												"mb-1 mx-1 px-1 text-sm border rounded-xl ease-in-out duration-200 " +
												(selectedTag === tag
													? "border-conduit bg-conduit text-gray-200 hover:border-conduit hover:bg-gray-400 hover:cursor-pointer hover:text-base"
													: "border-gray-400 bg-gray-400 text-gray-200 hover:bg-conduit hover:border-conduit hover:cursor-pointer hover:text-base")
											}
											onClick={() => {
												setSelectedPage(1);
												if (selectedTag === tag) {
													setSelectedTag(null);
												} else {
													setSelectedTag(tag);
												}
											}}
										>
											{tag}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<div>
					{<Feed selectedPage={1} pageNum={0} selectedTag={selectedTag} />}
				</div>
				<Footer />
			</>
		);
	} else {
		return (
			<>
				<Navbar
					pageName="Home"
					isLoggedIn={loginInfo}
					profileInfo={profileInfo}
				/>
				<div className="sm:hidden md:hidden lg:hidden rounded-md w-full bg-gray-200 block">
					<div className="flex flex-col p-2">
						<div className="font-sans mx-2 mb-1 underline underline-offset-1 ">
							Populer Tags
						</div>
						<div className="flex flex-row flex-wrap items-center ">
							{tags.map((tag) => {
								return (
									<div
										key={tag}
										className={
											"mb-1 mx-1 px-1 text-sm border rounded-xl ease-in-out duration-200 " +
											(selectedTag === tag
												? "border-conduit bg-conduit text-gray-200 hover:border-conduit hover:bg-gray-400 hover:cursor-pointer hover:text-base"
												: "border-gray-400 bg-gray-400 text-gray-200 hover:bg-conduit hover:border-conduit hover:cursor-pointer hover:text-base")
										}
										onClick={() => {
											setSelectedPage(1);
											if (selectedTag === tag) {
												setSelectedTag(null);
											} else {
												setSelectedTag(tag);
											}
										}}
									>
										{tag}
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-row h-20">
					<div className="float-left h-10 mt-8 pt-2 w-full ml-4 md:ml-16 border-b ">
						<div
							className={
								"inline px-6 h-18 " +
								((!selectedTag && selectedPage) === 0
									? "text-conduit border-b-2 border-conduit py-2 cursor-default"
									: "text-gray-400 hover:text-gray-400 hover:border-b-2 hover:border-gray-400 py-2 hover:cursor-pointer")
							}
							onClick={() => {
								setSelectedTag(null);
								setSelectedPage(0);
							}}
						>
							Your Feed
						</div>
						<div
							className={
								"inline px-6 h-18 ml-1 " +
								((!selectedTag && selectedPage) === 1
									? "text-conduit border-b-2 border-conduit py-2 cursor-default"
									: "text-gray-400 hover:text-gray-500 hover:border-b-2 hover:border-gray-400 py-2 hover:cursor-pointer")
							}
							onClick={() => {
								setSelectedTag(null);
								setSelectedPage(1);
							}}
						>
							Global Feed
						</div>
						<div
							className={
								selectedTag
									? "inline px-6 h-18 ml-1 text-conduit border-b-2 border-conduit py-2 cursor-default"
									: ""
							}
						>
							{selectedTag}
						</div>
					</div>
					<div className="hidden sm:block md:blcok lg:block rounded-md w-4/12 float-right bg-gray-200 inline-block ml-12 mr-8 md:mr-24 mt-40 self-center">
						<div className="flex flex-col p-2">
							<div className="font-sans mx-2 mb-1 underline underline-offset-1 ">
								Populer Tags
							</div>
							<div className="flex flex-row items-center flex-wrap ">
								{tags.map((tag) => {
									return (
										<div
											key={tag}
											className={
												"mb-1 mx-1 px-1 text-sm border rounded-xl ease-in-out duration-200 " +
												(selectedTag === tag
													? "border-conduit bg-conduit text-gray-200 hover:border-conduit hover:bg-gray-400 hover:cursor-pointer hover:text-base"
													: "border-gray-400 bg-gray-400 text-gray-200 hover:bg-conduit hover:border-conduit hover:cursor-pointer hover:text-base")
											}
											onClick={() => {
												setSelectedPage(1);
												if (selectedTag === tag) {
													setSelectedTag(null);
												} else {
													setSelectedTag(tag);
												}
											}}
										>
											{tag}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<div>
					{
						<Feed
							selectedPage={selectedPage}
							pageNum={0}
							selectedTag={selectedTag}
						/>
					}
				</div>
				<Footer />
			</>
		);
	}
};

export default Home;
