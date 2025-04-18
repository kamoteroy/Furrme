import React, { useState, useEffect } from "react";
import "../../styles/User/Community.css";
import Navbar from "../../components/Navbar";
import { LuUpload } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import CommunityPostCard from "../../components/CommunityPostCard";
import axios from "axios";
import { useSelector } from "react-redux";
import CountDownModal from "../../components/CountdownModal";

function Community() {
	const [postContent, setPostContent] = useState("");
	const [uploadedImg, setUploadedImg] = useState("");
	const [showCreatePostBtn, setShowCreatePostBtn] = useState(false);
	let d = new Date();
	const todaysDate = d.toISOString().split("T")[0];
	const [postList, setList] = useState([]);
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const token = getData.token;
	const [refreshKey, setRefreshKey] = useState(0);
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const highestID = Math.max(...postList.map((item) => item.postNumber));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			const modalContent = document.querySelector(".modal-content");
			if (isModalOpen && modalContent && !modalContent.contains(e.target)) {
				toggleModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener("click", handleClickOutside);
		} else {
			document.removeEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isModalOpen]);

	const refreshComponent = () => {
		setRefreshKey((prevKey) => prevKey + 1);
	};

	useEffect(() => {
		axios
			.get("http://localhost:3001/community", {
				headers: {
					token: token,
				},
			})
			.then((res) => (res.data[0] ? setList(res.data) : setList([])))
			.catch((err) => console.log(err));
	}, [refreshKey]);

	const handleChange = (event) => {
		const textareaLineHeight = 24;
		const minRows = 3;
		event.target.rows = minRows;
		const currentRows = Math.floor(
			event.target.scrollHeight / textareaLineHeight
		);
		event.target.rows = currentRows;
		setPostContent(event.target.value);
		setShowCreatePostBtn(event.target.value.trim().length > 0 && uploadedImg);
	};

	const handleRemoveImage = () => {
		setUploadedImg(null);
		setShowCreatePostBtn(false);
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImg(reader.result);
				setShowCreatePostBtn(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCreatePost = async (e) => {
		e.preventDefault();
		if (!uploadedImg) {
			setUploadedImg(null);
			setShowCreatePostBtn(postContent.trim().length > 0);
		}
		try {
			const res = await axios.post("http://localhost:3001/upload", {
				image_url: uploadedImg,
			});
			await axios
				.post(
					"http://localhost:3001/addpost",
					{
						id: highestID + 1,
						image: res.data,
						description: postContent,
						date: todaysDate,
						user_name: user.fname + " " + user.lname,
						user_img: user.image,
						timePosted: hours + ":" + minutes,
					},
					{
						headers: {
							token: token,
						},
					}
				)
				.then((res) => {
					res.data[0] ? setList(res.data) : setList([]);
					refreshComponent();
					if (res.data.message) {
						setmodalContents({
							title: res.data.message,
						});
						setIsModalOpen(true);
					} else {
						setmodalContents({
							title: "Upload Successful",
						});
						setIsModalOpen(true);
						setShowCreatePostBtn(false);
					}
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log(err);
		}
		setUploadedImg(null);
		setShowCreatePostBtn(postContent.trim().length > 0);
		setPostContent("");
	};

	return (
		<>
			<CountDownModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
			>
				<p>{modalContents.contents}</p>
			</CountDownModal>
			<div>
				<Navbar />
				<div className="communityPosts">
					<div className="createPostContainer">
						<h2>Create Post</h2>
						<div className="createPostInputs">
							<div className="userAvatar">
								<img src={user.image} alt={user.fname} />
							</div>
							<textarea
								id="postContent"
								value={postContent}
								onChange={handleChange}
								placeholder={`Share us your Furry journey!`}
								className="responsive-textarea"
							></textarea>
							<label htmlFor="uploadImg" className="uploadImgBtn">
								<LuUpload />
								<span className="uploadText">Upload</span>
							</label>
							<input
								type="file"
								id="uploadImg"
								accept=".jpg,.jpeg,.png"
								style={{ display: "none" }}
								onChange={handleImageUpload}
							/>
						</div>
						<div className="uploadedImgContainer">
							{uploadedImg && (
								<>
									<IoCloseCircleOutline
										className="removeImgBtn"
										onClick={handleRemoveImage}
									/>
									<img src={uploadedImg} alt="uploadedimg" />
								</>
							)}
						</div>
						{showCreatePostBtn && (
							<button className="createPostBtn" onClick={handleCreatePost}>
								Create Post
							</button>
						)}
					</div>
					<div className="postsContainer">
						{postList.map((post, i) => {
							return (
								<CommunityPostCard
									key={i}
									userAvatar={post.user_img}
									accountName={post.user_name}
									datePosted={post.dates}
									postImage={post.image}
									postContent={post.description}
									timePosted={post.timePosted}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

export default Community;
