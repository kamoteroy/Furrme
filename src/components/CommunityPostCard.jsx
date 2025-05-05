import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Components/CommunityPostCard.css";

function CommunityPostCard(props) {
	const [showFullText, setShowFullText] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	const toggleText = () => {
		setShowFullText(!showFullText);
	};

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	const shouldRenderPostContent =
		props.postContent && props.postContent.trim() !== "";

	const shouldShowEllipsis =
		props.postContent && props.postContent.length > 150;

	return (
		<div className="postCard">
			<div className="postCardHeaders">
				<div className="postAvatar">
					<img src={props.userAvatar} alt="Avatar" />
				</div>
				<div className="postInfo">
					<h2 className="userAccntName">{props.accountName}</h2>
					<p className="datePosted">
						{new Date(props.timePosted).toLocaleString(undefined, {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "2-digit",
							hour12: true,
						})}
					</p>
				</div>
				<div className="postOptionsContainer">
					<button className="optionsArrow" onClick={toggleOptions}>
						&#9662; {/* Down arrow symbol */}
					</button>
					{showOptions && (
						<div className="optionsDropdown">
							<button className="editBtn" onClick={props.onEdit}>
								Edit
							</button>
							<button className="deleteBtn" onClick={props.onDelete}>
								Delete
							</button>
						</div>
					)}
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
