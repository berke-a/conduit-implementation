import React, { useState, useEffect } from "react";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import { useSnackbar } from "notistack";
import Moment from "moment";
import Zoom from "../../node_modules/@mui/material/Zoom/Zoom";
import { useNavigate } from "react-router-dom";

const Reports = () => {
	const [articleList, setArticleList] = useState([]);
	const [tags, setTags] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [pieData, setPieData] = useState({
		labels: [],
		datasets: [],
	});
	const [barData, setBarData] = useState({
		labels: [],
		datasets: [],
	});
	const [lineData, setLineData] = useState({
		labels: [],
		datasets: [],
	});
	let tagData = [];
	let tagLabels = [];
	let createdDateData = [];
	let createdDateLabels = [];
	let updatedDateData = [];
	let updatedDateLabels = [];

	const getFeed = async () => {
		let requestOptions;
		let url;

		requestOptions = {
			method: "GET",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
		};
		url = "https://api.realworld.io/api/articles?limit=20&offset=0";
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
					if (response.articlesCount !== 0) {
						const newArticleList = response.articles;

						setArticleList(newArticleList);
					}
				}
			});
	};
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
		getFeed();
		getTags();
	}, []);

	useEffect(() => {
		// Configuration for the pie char
		if (articleList.length > 0 && tags.length > 0) {
			for (let i = 0; i < tags.length; i++) {
				tagData.push(0);
				tagLabels.push(tags[i]);
			}
			for (let i = 0; i < articleList.length; i++) {
				for (let j = 0; j < tags.length; j++) {
					if (articleList[i].tagList.includes(tags[j])) {
						tagData[j]++;
					}
				}
			}
			setPieData({
				labels: tagLabels,
				datasets: [
					{
						label: "Articles per tag",
						data: tagData,
						backgroundColor: [
							"#5CB85C",
							"#9CA3AF",
							"#EF4444",
							"#FF8C00",
							"#FFD700",
						],
					},
				],
			});

			// Configuration for the bar chart (Created at)
			for (let i = 0; i < articleList.length; i++) {
				if (
					!createdDateLabels.includes(
						Moment(articleList[i].createdAt).format("YYYY-MM-DD")
					)
				) {
					createdDateLabels.push(
						Moment(articleList[i].createdAt).format("YYYY-MM-DD")
					);
					createdDateData.push(0);
				}
			}
			for (let i = 0; i < createdDateLabels.length; i++) {
				for (let j = 0; j < articleList.length; j++) {
					if (
						createdDateLabels[i] ===
						Moment(articleList[j].createdAt).format("YYYY-MM-DD")
					) {
						createdDateData[i]++;
					}
				}
			}
			setBarData({
				labels: createdDateLabels,
				datasets: [
					{
						label: "Article Count",
						data: createdDateData,
						backgroundColor: [
							"#5CB85C",
							"#9CA3AF",
							"#EF4444",
							"#FF8C00",
							"#FFD700",
						],
					},
				],
			});

			for (let i = 0; i < articleList.length; i++) {
				if (
					!updatedDateLabels.includes(
						Moment(articleList[i].updatedAt).format("YYYY-MM-DD")
					)
				) {
					updatedDateLabels.push(
						Moment(articleList[i].updatedAt).format("YYYY-MM-DD")
					);
					updatedDateData.push(0);
				}
			}
			for (let i = 0; i < updatedDateLabels.length; i++) {
				for (let j = 0; j < articleList.length; j++) {
					if (
						updatedDateLabels[i] ===
						Moment(articleList[j].updatedAt).format("YYYY-MM-DD")
					) {
						updatedDateData[i]++;
					}
				}
			}
			setLineData({
				labels: updatedDateLabels,
				datasets: [
					{
						label: "Article Count",
						data: updatedDateData,
						backgroundColor: [
							"#5CB85C",
							"#9CA3AF",
							"#EF4444",
							"#FF8C00",
							"#FFD700",
						],
					},
				],
			});
		}
	}, [articleList, tags]);

	console.log("Here");

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="text-3xl m-2 mb-8 font-semibold text-conduit mt-5 ">
				Reports
			</div>
			<div className="flex flex-row border-2 p-2 rounded-lg border-conduit">
				{pieData.labels.length > 0 ? (
					<div className="flex flex-col items-center">
						<PieChart chartData={pieData} />
						<div className="text-sm text-conduit italic text-border">
							Article counts per tag
						</div>
					</div>
				) : (
					<div className="text-conduit m-2 italic">Loading Pie Chart</div>
				)}

				<div className="flex flex-col items-center">
					{barData.labels.length > 0 ? (
						<div className="flex flex-col items-center">
							<BarChart chartData={barData} />
							<div className="text-sm text-conduit italic text-border">
								Articles{" "}
								<span className="underline decoration-wavy">created</span> per
								date
							</div>
						</div>
					) : (
						<div className="text-conduit m-2 italic">Loading Bar Chart</div>
					)}

					{lineData.labels.length > 0 ? (
						<div className="flex flex-col items-center">
							<LineChart chartData={lineData} />
							<div className="text-sm text-conduit italic text-border">
								Articles{" "}
								<span className="underline decoration-wavy">updated</span> per
								date
							</div>
						</div>
					) : (
						<div className="text-conduit m-2 italic ">Loading Line Chart</div>
					)}
				</div>
			</div>
			<button
				className="self-end border-2 mx-4 font-semibold rounded-md mt-8 px-2 text-base bg-conduit text-white border-conduit hover:bg-white hover:text-conduit"
				onClick={() => {
					navigate("/");
				}}
			>
				Go Home
			</button>
		</div>
	);
};

export default Reports;
