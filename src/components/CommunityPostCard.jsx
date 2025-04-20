import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Components/CommunityPostCard.css";

function CommunityPostCard(props) {
	const [showFullText, setShowFullText] = useState(false);

	const toggleText = () => {
		setShowFullText(!showFullText);
	};

	const shouldRenderPostContent =
		props.postContent && props.postContent.trim() !== "";

	const shouldShowEllipsis =
		props.postContent && props.postContent.length > 150;

	function convertTo12HourFormat(time) {
		let [hours, minutes] = time.split(":").map(Number);
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
	}

	const timePosted = convertTo12HourFormat(props.timePosted);

	return (
		<div className="postCard">
			<div className="postCardHeaders">
				<div className="postAvatar">
					<img src={props.userAvatar} alt="Avatar" />
				</div>
				<div className="postInfo">
					<h2 className="userAccntName">{props.accountName}</h2>
					<p className="datePosted">
						{props.datePosted?.split("T")[0]}
						<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
						{timePosted}
					</p>
				</div>
			</div>
			{shouldRenderPostContent && (
				<p className="postTextDesc">
					{showFullText
						? props.postContent
						: `${props.postContent?.split(" ").slice(0, 50).join(" ")}${
								shouldShowEllipsis ? "... " : ""
							}`}

					{shouldShowEllipsis && !showFullText && (
						<span className="readMore" onClick={toggleText}>
							Read More
						</span>
					)}

					{showFullText && (
						<span className="showLess" onClick={toggleText}>
							Show Less
						</span>
					)}
				</p>
			)}
			<Link to={props.postImage} target="_blank">
				<div className="comPostImg">
					<img src={props.postImage} alt="Post" />
				</div>
			</Link>
		</div>
	);
}

export default CommunityPostCard;
