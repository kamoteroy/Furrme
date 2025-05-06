import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Components/CommunityPostCard.css";
import { useSelector } from "react-redux";
import axios from "axios";
import CONFIG from "../data/config";

function CommunityPostCard(props) {
	const [showFullText, setShowFullText] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	const toggleText = () => {
		setShowFullText(!showFullText);
	};
	const dropdownRef = useRef(null);
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const token = getData.token;

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const shouldRenderPostContent =
		props.postContent && props.postContent.trim() !== "";

	const shouldShowEllipsis =
		props.postContent && props.postContent.length > 150;

	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete(
				`${CONFIG.BASE_URL}/deletepost/${props.post_id}`,
				{
					headers: {
						token: token,
					},
				}
			);

			console.log(response);
			setShowDeleteModal(false);
			props.onDeleteSuccess?.();
		} catch (error) {
			console.error(
				"Error deleting post:",
				error.response?.data?.message || error.message
			);
		}
	};

	return (
		<div className="postCard">
			<div className="postCardHeaders">
				<div className="postLeft">
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
				</div>
				<div className="postOptionsContainer" ref={dropdownRef}>
					<button className="optionsArrow" onClick={toggleOptions}>
						<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
					</button>
					{showOptions && (
						<div className="optionsDropdown">
							{user.email === props.email ? (
								<>
									<button className="editBtn" onClick={props.onEdit}>
										Edit
									</button>
									<button
										className="deleteBtn"
										onClick={() => setShowDeleteModal(true)}
									>
										Delete
									</button>
								</>
							) : (
								<button className="deleteBtn" onClick={props.onDelete}>
									Report
								</button>
							)}
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
			{showDeleteModal && (
				<div className="modalOverlay">
					<div className="deleteModal">
						<p>Delete post?</p>
						<div className="modalButtons">
							<button className="yesBtn" onClick={handleDeleteConfirm}>
								Yes
							</button>
							<button
								className="noBtn"
								onClick={() => setShowDeleteModal(false)}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default CommunityPostCard;
