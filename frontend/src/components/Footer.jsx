import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();
	return (
		<div className="fixed bottom-0 left-0 right-0 h-6 mt-8 px-6 w-full grid grid-cols-2 justify-content-center font-sans bg-gray-200 text-conduit pr-5 text-xs">
			<div className="justify-self-start self-center ">
				Created by : Berke Sina Ahlatcı
			</div>
			<div
				className="justify-self-end self-center border border-conduit px-2 rounded-md hover:cursor-pointer hover:bg-conduit hover:text-gray-200"
				onClick={() => {
					navigate("/reports");
				}}
			>
				Show Reports
			</div>
		</div>
	);
};

export default Footer;
