import React, { useState, useEffect, useRef } from "react";
import "../../styles/CreatePetListing.css";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import AnimatedModal from "../../components/Modal";

function CreatePetListing() {
	const getData = useSelector((state) => state.value);
	const token = getData.token;
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
	const [selectedPetType, setSelectedPetType] = useState("Select Pet Type");
	const [selectedPetGender, setSelectedPetGender] = useState("Select Gender");
	const [uploading, setUploading] = useState(false);
	const [uploadingText, setUploadingText] = useState("");
	const [images, setImages] = useState([]);
	const [base64s, setbase64s] = useState([]);
	const dropdownRef = useRef(null);
	const genderDropdownRef = useRef(null);
	const [formData, setformData] = useState({
		name: "",
		breed: "",
		age: "",
		address: "",
		color: "",
		behavior: "",
		health: "",
		description: "",
	});
	const [shaking, setShaking] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errors, setErrors] = useState({
		name: false,
		breed: false,
		age: false,
		address: false,
		gender: false,
		type: false,
		color: false,
		behavior: false,
		health: false,
		description: false,
	});
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const [link, setLink] = useState("");

	const validateForm = () => {
		const newErrors = {
			name: formData.name.trim() === "",
			breed: formData.breed.trim() === "",
			age: formData.age.trim() === "",
			gender: selectedPetGender === "Select Gender",
			type: selectedPetType === "Select Pet Type",
			address: formData.address.trim() === "",
			color: formData.color.trim() === "",
			behavior: formData.behavior.trim() === "",
			health: formData.health.trim() === "",
			description: formData.description.trim() === "",
			//email: !/\S+@\S+\.\S+/.test(formData.email),
			//password: formData.password.length < 6,
		};
		setErrors(newErrors);

		// If any input is invalid, trigger the shake animation
		if (Object.values(newErrors).includes(true)) {
			setShaking(true);
			setTimeout(() => setShaking(false), 500); // Remove the shake class after 500ms
		} else return true;
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const toggleGenderDropdown = () => {
		setGenderDropdownOpen(!genderDropdownOpen);
	};

	const closeDropdown = () => {
		setDropdownOpen(false);
	};

	const closeGenderDropdown = () => {
		setGenderDropdownOpen(false);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			closeDropdown();
		}
		if (
			genderDropdownRef.current &&
			!genderDropdownRef.current.contains(event.target)
		) {
			closeGenderDropdown();
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSelectPetType = (type) => {
		setSelectedPetType(type);
		closeDropdown();
	};

	const handleSelectPetGender = (gender) => {
		setSelectedPetGender(gender);
		closeGenderDropdown();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setformData({
			...formData,
			[name]: value,
		});
		setErrors({
			...errors,
			[name]: false, // Reset error state on change
		});
	};

	/*const handleCharacterLimit = (event, setter, maxChars) => {
        if (event.target.value.length > maxChars) {
            event.target.value = event.target.value.slice(0, maxChars);
        }
        setter(event.target.value);
    };*/

	const create = (pictures) => {
		axios
			.post("http://localhost:3001/admin/create", {
				data: formData,
				gender: selectedPetGender,
				type: selectedPetType,
				images: pictures,
				token: token,
			})
			.then((res) =>
				res.data.warningCount === 0
					? (setIsModalOpen(!isModalOpen),
						setmodalContents({
							title: "Listing Successful!",
							contents: "",
						}),
						setUploadingText("Successful"),
						setUploading(false),
						setLink("/admin/pets"))
					: (setIsModalOpen(!isModalOpen),
						setmodalContents({
							title: "Listing Failed!",
							contents: "",
						}),
						setUploading(false),
						setLink(0),
						console.log(res))
			)
			.catch((err) => console.log(err));
	};

	const handleSumbit = async () => {
		var size = images.length;
		if (!validateForm()) {
			return;
		}
		if (!images[0]) {
			// Remove the uploaded image
			setImages([]);
			setmodalContents({
				title: "No image uploaded!",
				contents: "Upload at least one image",
			});
			setIsModalOpen(!isModalOpen);
			return;
		}
		if (base64s[0]) {
			setUploading(true);
			var ctr = 1;
			setUploadingText(`Uploading Images 1/${size}...`);
			base64s.forEach(async function (item, index) {
				try {
					const res = await axios.post("http://localhost:3001/upload", {
						image_url: item,
					});
					images.push(res.data);
				} catch (err) {
					console.log(err);
				}

				if (images.some((item) => item.includes("blob"))) {
					removeBlob(); // remove blob links from the images list
				}
				base64s.splice(0, 1);
				if (!base64s[0]) {
					setUploadingText("Adding Pet Listing");
					create(images);
				}
				if (ctr <= size) ctr = ctr + 1;
				setUploadingText(`Uploading Images ${ctr}/${size}...`);
			});
		}
	};

	const handleUploadClick = async () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.multiple = true;

		fileInput.onchange = (event) => {
			const files = Array.from(event.target.files);
			if (files.length + images.length > 5) {
				alert("You can only upload up to 5 photos.");
				return;
			}
			files.map(async (file) => {
				const result = await convertBlobToBase64(file);
				return result;
			});
			const newImages = files.map((file) => URL.createObjectURL(file));
			setImages((prevImages) => [...prevImages, ...newImages]);
		};
		fileInput.click();
	};

	function convertBlobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result); // This will be the Base64 string
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob); // Reads the Blob as a Data URL (base64)
		}).then((res) => base64s.push(res));
	}

	const removeBlob = () => {
		const index2 = images.findIndex((item) => item.includes("blob"));

		if (index2 !== -1) {
			images.splice(index2, 1); // Remove the item at the found index
		}
	};

	const handleRemoveImage = (index) => {
		setImages(images.filter((_, i) => i !== index));
		setbase64s(base64s.filter((_, i) => i !== index));
	};

	const handleImageClick = (image) => {
		window.open(image, "_blank");
	};

	return (
		<>
			<AnimatedModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
				link={link}
			>
				<p>{modalContents.contents}</p>
			</AnimatedModal>
			<div>
				{uploading && (
					<LoadingOverlay
						gifSrc={
							"https://res.cloudinary.com/dmquudoki/image/upload/v1724513882/output-onlinegiftools_2_mnt8b3.gif"
						}
						label={uploadingText}
					/>
				)}
				<div className="createPetListing">
					<div className="sidebarComp">
						<AdminDashboardSidebar />
					</div>
					<div className="mainContent">
						<div className="inputsContainer">
							<h2>Add New Pet Listing</h2>
							<div className="basicInfo">
								<div className="nameGenderContainer">
									<div
										className={`inputs petNamePrev ${shaking && errors.name ? "shake" : ""}`}
									>
										<label htmlFor="petName">Name</label>
										<input
											id="name"
											type="text"
											name="name"
											className={errors.name ? "error-input" : ""}
											style={errors.name ? { border: "1px solid red" } : {}}
											placeholder="Name"
											onChange={handleInputChange}
										/>
									</div>
									<div
										className={`inputs petGender ${shaking && errors.gender ? "shake" : ""}`}
										ref={genderDropdownRef}
									>
										<label htmlFor="petGender">Gender</label>
										<p
											style={errors.gender ? { border: "1px solid red" } : {}}
											className={`${errors.gender ? "error-input" : ""} petGenderHeader `}
											onClick={toggleGenderDropdown}
										>
											{selectedPetGender}
											{genderDropdownOpen ? (
												<MdOutlineKeyboardArrowUp />
											) : (
												<MdOutlineKeyboardArrowDown />
											)}
										</p>
										{genderDropdownOpen && (
											<ul
												className="petGenderDropdown"
												onClick={(e) => e.stopPropagation()}
											>
												<li onClick={() => handleSelectPetGender("Male")}>
													Male
												</li>
												<li onClick={() => handleSelectPetGender("Female")}>
													Female
												</li>
											</ul>
										)}
									</div>
								</div>
								<div className="containers">
									<div
										className={`inputs type ${shaking && errors.type ? "shake" : ""}`}
										ref={dropdownRef}
									>
										<label htmlFor="petType">Pet Type</label>
										<p
											style={errors.type ? { border: "1px solid red" } : {}}
											className={`${errors.type ? "error-input" : ""} petTypeDP-Header `}
											onClick={toggleDropdown}
										>
											{selectedPetType}
											{dropdownOpen ? (
												<MdOutlineKeyboardArrowUp />
											) : (
												<MdOutlineKeyboardArrowDown />
											)}
										</p>
										{dropdownOpen && (
											<ul
												className="petTypeDropdown"
												onClick={(e) => e.stopPropagation()}
											>
												<li onClick={() => handleSelectPetType("Cats")}>Cat</li>
												<li onClick={() => handleSelectPetType("Dogs")}>Dog</li>
											</ul>
										)}
									</div>
									<div
										className={`inputs breed ${shaking && errors.breed ? "shake" : ""}`}
									>
										<label htmlFor="petBreed">Breed</label>
										<input
											id="breed"
											type="text"
											name="breed"
											placeholder="Breed"
											className={errors.breed ? "error-input" : ""}
											style={errors.breed ? { border: "1px solid red" } : {}}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="containers">
									<div
										className={`inputs age ${shaking && errors.age ? "shake" : ""}`}
									>
										<label htmlFor="petAge">Age</label>
										<input
											id="age"
											type="text"
											name="age"
											placeholder="Age"
											className={errors.age ? "error-input" : ""}
											style={errors.age ? { border: "1px solid red" } : {}}
											onChange={handleInputChange}
										/>
									</div>
									<div
										className={`inputs color ${shaking && errors.age ? "shake" : ""}`}
									>
										<label htmlFor="petColor">Color</label>
										<input
											id="color"
											type="text"
											name="color"
											placeholder="Color"
											className={errors.color ? "error-input" : ""}
											style={errors.color ? { border: "1px solid red" } : {}}
											onChange={handleInputChange}
										/>
									</div>
								</div>
							</div>
							<div
								className={`addressContainer ${shaking && errors.address ? "shake" : ""}`}
							>
								<label htmlFor="petBehavior">Address</label>
								<textarea
									name="address"
									id="address"
									value={formData.address}
									type="text"
									placeholder="Address Information"
									className={errors.address ? "error-input" : ""}
									style={errors.address ? { border: "1px solid red" } : {}}
									onChange={handleInputChange}
								></textarea>
							</div>
							<div className="descriptionInfo">
								<div
									className={`descContainer behavior ${shaking && errors.behavior ? "shake" : ""}`}
								>
									<label htmlFor="petBehavior">Behavior</label>
									<textarea
										name="behavior"
										id="behavior"
										value={formData.behavior}
										type="text"
										placeholder="Behavior Information"
										className={errors.behavior ? "error-input" : ""}
										style={errors.behavior ? { border: "1px solid red" } : {}}
										onChange={handleInputChange}
									></textarea>
									<p>{formData.behavior.length} / 100 characters</p>
								</div>
								<div
									className={`descContainer health ${shaking && errors.health ? "shake" : ""}`}
								>
									<label htmlFor="petHealth">Health</label>
									<textarea
										name="health"
										id="health"
										value={formData.health}
										type="text"
										placeholder="Health Information"
										className={errors.health ? "error-input" : ""}
										style={errors.health ? { border: "1px solid red" } : {}}
										onChange={handleInputChange}
									></textarea>
									<p>{formData.health.length} / 200 characters</p>
								</div>
								<div
									className={`descContainer petDescription ${shaking && errors.description ? "shake" : ""}`}
								>
									<label htmlFor="petDescription">Description</label>
									<textarea
										name="description"
										id="description"
										value={formData.description}
										type="text"
										placeholder="Brief Description"
										className={errors.description ? "error-input" : ""}
										style={
											errors.description ? { border: "1px solid red" } : {}
										}
										onChange={handleInputChange}
									></textarea>
									<p>{formData.description.length} / 400 characters</p>
								</div>
							</div>
							<div className="uploadImgContainer">
								<button className="uploadFilesBtn" onClick={handleUploadClick}>
									Upload Photos
								</button>
								<div className="petImgBox">
									{images.map((image, index) => (
										<div className="img-container" key={index}>
											<img
												src={image}
												alt={`pet-${index}`}
												onClick={() => handleImageClick(image)}
											/>
											<IoCloseCircle
												className="closeIcon"
												onClick={() => handleRemoveImage(index)}
											/>
										</div>
									))}
								</div>
							</div>
							<button onClick={() => handleSumbit()} className="addButton">
								Add Pet to Listings
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreatePetListing;
