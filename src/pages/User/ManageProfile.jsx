import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/User/ManageProfile.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/Users";
import CountDownModal from "../../components/CountdownModal";
import uploadingImg from "../../assets/uploadingImg.gif";

function ManageProfile() {
	const dispatch = useDispatch();
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const [uploadedImg, setUploadedImg] = useState(user.image);
	const [showSaveBtn, setSaveBtn] = useState(false);
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});
	const defaultValues = {
		fname: user.fname,
		lname: user.lname,
		email: user.email,
		pass: "",
	};
	const [formData, setformData] = useState(defaultValues);
	const token = getData.token;
	const [access, setAccess] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});

	const [isUploading, setIsUploading] = useState(false);
	const [uploadMessage, setUploadMessage] = useState("Uploading...");

	const handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		setformData((prevState) => ({ ...prevState, [name]: value }));
	};

	useEffect(() => {
		if (access === 1) {
			navigate("/manage");
			setSaveBtn(false);
			setformData(defaultValues);
		}
	}, [access]);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);

		if (!isModalOpen) {
			setformData((prevState) => ({
				...prevState,
				pass: "",
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = {};

		// Validate the form fields
		if (!formData.fname.trim()) {
			validationErrors.fname = "First Name is required";
		}
		if (!formData.lname.trim()) {
			validationErrors.lname = "Last Name is required";
		}
		if (!formData.email.trim()) {
			validationErrors.email = "Email is required";
		}
		if (!formData.pass.trim()) {
			validationErrors.pass = "Password is required";
		}

		setErrors(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			try {
				let imageUrl = uploadedImg;

				if (!uploadedImg || uploadedImg === user.image) {
					imageUrl = user.image;
					setUploadMessage("Updating...");
				} else {
					setIsUploading(true);
					setUploadMessage("Uploading...");

					const res = await axios.post("http://localhost:3001/upload", {
						image_url: uploadedImg,
					});

					imageUrl = res.data;
					setUploadMessage("Upload complete!");
					setUploadedImg("");
					setIsUploading(false);
				}

				await axios
					.post("http://localhost:3001/manage", {
						fname: formData.fname,
						lname: formData.lname,
						newEmail: formData.email,
						pass: formData.pass,
						image: imageUrl,
						prevEmail: user.email,
						token: token,
					})
					.then((result) => {
						setAccess(result.data.access);
						setmodalContents({
							title: result.data.message,
						});
						setIsModalOpen(true);
						setformData({
							...formData,
							pass: "",
						});

						result.data.access === 1
							? dispatch(
									login({
										token: result.data.token,
										user: result.data.userData,
									})
								)
							: dispatch(login({ token: token, user: user }));
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log(err);
				setIsUploading(false);
			}
		}
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		const isValidPassword = formData.pass.trim() !== "";
		const isValidForm =
			formData.fname.trim() &&
			formData.lname.trim() &&
			formData.email.trim() &&
			isValidPassword;

		setSaveBtn(isValidForm);
	}, [formData]);

	return (
		<div>
			<CountDownModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
			>
				<p>{modalContents.contents}</p>
			</CountDownModal>

			<Navbar />
			<div className="manageProfile">
				<div className="container">
					<h2>Profile</h2>
					<p>
						This information will be displayed publicly so be careful what you
						share.
					</p>
					<hr />
					<div className="profilePicture">
						<label>Photo</label>
						<div className="profilePictureContainer">
							{uploadedImg ? (
								<img src={uploadedImg} alt={user.fname} />
							) : (
								<img src={user.image} alt={user.fname} />
							)}
						</div>
						<label htmlFor="uploadImg" className="btnChangeDP">
							Change
						</label>
						<input
							type="file"
							id="uploadImg"
							accept=".jpg,.jpeg,.png"
							style={{ display: "none" }}
							onChange={handleImageUpload}
						/>
					</div>
					<hr />
					<div className="firstName">
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							id="firstName"
							value={formData.fname}
							name="fname"
							onChange={handleInputChange}
						/>
					</div>

					<hr />
					<div className="lastName">
						<label htmlFor="lastName">Last Name</label>
						<input
							type="text"
							id="lastName"
							value={formData.lname}
							name="lname"
							onChange={handleInputChange}
						/>
					</div>
					<hr />
					<div className="email">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							name="email"
							onChange={handleInputChange}
						/>
					</div>
					<hr />
					<div className="password">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={formData.pass}
							name="pass"
							onChange={handleInputChange}
						/>
					</div>
					<hr />
					{showSaveBtn && (
						<button onClick={handleSubmit} className="btnSaveChanges">
							Save Changes
						</button>
					)}
				</div>
				<div className="fnameWarning">
					{errors.fname && <span>{errors.fname}</span>}
				</div>
				<div className="lnameWarning">
					{errors.lname && <span>{errors.lname}</span>}
				</div>
				<div className="emailWarning">
					{errors.email && <span>{errors.email}</span>}
				</div>
				<div className="passWarning">
					{errors.pass && <span>{errors.pass}</span>}
				</div>

				{/* Loading overlay with an image */}
				{isUploading && (
					<div className="loadingOverlay">
						<img src={uploadingImg} alt="loading" className="loadingImage" />
						<p>{uploadMessage}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default ManageProfile;
