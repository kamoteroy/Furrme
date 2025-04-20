import React, { useState, useEffect, useRef } from "react";
import "../../styles/Admin/PetEvaluation.css";
import AdminDashboardSidebar from "../../components/AdminSidebar";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../components/LoadingOverlay";
import catLoading2 from "../../assets/catLoading2.gif";
import CountDownModal from "../../components/CountdownModal";
import CONFIG from "../../data/config";

function PetEvaluation() {
	const [charCount, setCharCount] = useState(0);
	const [selectedButton, setSelectedButton] = useState(null);
	const [rejectButtonText, setRejectButtonText] = useState("Reject");
	const [showRejectReason, setShowRejectReason] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);
	const adoptRequest = useLocation().state;
	const navigate = useNavigate();
	const getData = useSelector((state) => state.value);
	const token = getData.token;
	const [accInfo, setaccInfo] = useState([]);
	const [petInfo, setpetInfo] = useState([]);
	const [adoptInfo, setAdoptInfo] = useState([]);
	const [color, setColor] = useState("");
	const maxChar = 500;
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleTextChange = (event) => {
		const input = event.target.value;
		if (input.length <= maxChar) {
			setCharCount(input.length);
		}
	};

	const handleButtonClick = (buttonType) => {
		if (buttonType === "approve") {
			setSelectedButton("Approved");
			setShowRejectReason(false);
			setRejectButtonText("Reject");
		} else if (buttonType === "reject") {
			if (selectedButton === "reject") {
				setSelectedButton(null);
				setShowRejectReason(false);
				setRejectButtonText("Reject");
			} else {
				setSelectedButton("Rejected");
				setShowRejectReason(true);
				setRejectButtonText("Cancel");
			}
		}
	};
	useEffect(() => {
		//setAdoptInfo(adoptRequest);
		axios
			.post(`${CONFIG.BASE_URL}/admin/evaluation/accDetails`, {
				email: adoptRequest.email,
				pet_Id: adoptRequest.pet_id,
				token: token,
			})
			.then((res) => {
				setaccInfo(res.data[0]);

				if (res.data[0] && petInfo) {
					setLoading(false);
				}
			})
			.catch((err) => console.log(err));

		axios
			.get(`${CONFIG.BASE_URL}/admin/petDetails/${adoptRequest.pet_id}`, {
				headers: {
					token: token,
				},
			})
			.then((res) => {
				setpetInfo(res.data);
				if (res.data && accInfo) {
					setLoading(false);
				}
			})
			.catch((err) => console.log(err));
		axios
			.get(`${CONFIG.BASE_URL}/admin/adoptReq/${adoptRequest.requestID}`, {
				headers: {
					token: token,
				},
			})
			.then((res) => {
				setAdoptInfo(res.data);
				if (res.data && accInfo) {
					setLoading(false);
				}
			})
			.catch((err) => console.log(err));
		if (adoptInfo.status === "Approved") {
			setColor("green");
		} else if (adoptInfo.status === "Pending") {
			setColor("#f29339");
		} else {
			setColor("red");
		}
		const textarea = document.getElementById("rejectionReason");
		if (textarea) {
			textarea.addEventListener("input", handleTextChange);
			return () => textarea.removeEventListener("input", handleTextChange);
		}
		const handleClickOutside = (event) => {
			if (event.target.closest(".dropdown") === null) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const toggleDropdown = (dropdownName) => {
		setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
	};

	const openImageInNewTab = () => {
		window.open(adoptInfo.image);
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
		if (!isModalOpen && modalContents.title != "") {
			//navigate("/admin/request");
			//window.location.reload();
			navigate(0);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isModalOpen, modalContents]);

	const Submit = () => {
		axios
			.post(`${CONFIG.BASE_URL}/admin/setStatus`, {
				status: selectedButton,
				email: adoptRequest.email,
				id: adoptRequest.pet_id,
			})
			.then((res) => {
				setmodalContents({
					title: res.data.Status,
				});
				setIsModalOpen(true);
			})
			.catch((err) => console.log(err));
	};

	const styles = {
		background: `${color}`,
	};

	useEffect(() => {
		if (adoptInfo.status === "Approved") {
			setColor("green");
		} else if (adoptInfo.status === "Pending") {
			setColor("#f29339");
		} else if (adoptInfo.status === "Rejected") {
			setColor("red");
		}
	}, [adoptInfo.status]);

	return (
		<>
			<CountDownModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
			>
				<p>{modalContents.contents}</p>
			</CountDownModal>
			{loading && <LoadingOverlay gifSrc={catLoading2} label="Loading . . ." />}
			<div className="adminEvaluation">
				<AdminDashboardSidebar />
				<div className="mainContent">
					<div className="applicantInfoHeader">
						<h1>Application Evaluation</h1>

						<p>
							Application Date:{" "}
							{new Date(adoptInfo.dates).toISOString().split("T")[0]}
						</p>
						<div className="appStatus">
							<p>Application Status: </p>
							<p className="appStatusVal" style={styles}>
								{adoptInfo.status}
							</p>
						</div>
					</div>
					<div className="InformationContainer applicantInfoCont">
						<h2>Applicant information</h2>
						<div className="applicantInfo namePrev">
							<div className="lbl-disp firstNamePrev">
								<p className="dispLabels">First Name</p>
								<input type="text" readOnly value={accInfo.fname} />
							</div>
							<div className="lbl-disp lastNamePrev">
								<p className="dispLabels">Last Name</p>
								<input type="text" readOnly value={accInfo.lname} />
							</div>
						</div>
						<div className="applicantInfo email-validID">
							<div className="lbl-disp email-ValidIDprev">
								<p className="dispLabels">Email</p>
								<input type="text" readOnly value={accInfo.email} />
							</div>
							<div className="lbl-disp validIdPrev">
								<p className="dispLabels">Valid ID</p>
								<input
									className="validID-fileName"
									onClick={openImageInNewTab}
									value={accInfo.image}
								/>
							</div>
						</div>
						<div className="applicantInfo address-cNumPrev">
							<div className="lbl-disp addressPrev">
								<p className="dispLabels">Address</p>
								<input type="text" readOnly value={adoptInfo.address} />
							</div>
							<div className="lbl-disp cNumPrev">
								<p className="dispLabels">Contact Number</p>
								<input type="text" readOnly value={adoptInfo.contact} />
							</div>
						</div>
						<div className="infoDropdownsContainer">
							<div className="dropdown householdInfo">
								<p onClick={() => toggleDropdown("householdInfo")}>
									Household Information
									{openDropdown === "householdInfo" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont houseinfoDP"
									style={{
										display:
											openDropdown === "householdInfo" ? "block" : "none",
									}}
								>
									{adoptInfo.household}
								</div>
							</div>
							<div className="dropdown employmentLifestyle">
								<p onClick={() => toggleDropdown("employmentLifestyle")}>
									Employment & Lifestyle
									{openDropdown === "employmentLifestyle" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont employmentLifestyleDP"
									style={{
										display:
											openDropdown === "employmentLifestyle" ? "block" : "none",
									}}
								>
									{adoptInfo.employment}
								</div>
							</div>
							<div className="dropdown petExperiences">
								<p onClick={() => toggleDropdown("petExperiences")}>
									Pet Experiences
									{openDropdown === "petExperiences" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont petExperiencesDP"
									style={{
										display:
											openDropdown === "petExperiences" ? "block" : "none",
									}}
								>
									{adoptInfo.pet_exp}
								</div>
							</div>
						</div>
					</div>
					<div className="informationContainer petInfoCont">
						<h2>Pet Information</h2>
						<div className="petInfo name-type">
							<div className="lbl-disp petNamePrev">
								<p className="dispLabels">Name</p>
								<input type="text" readOnly value={petInfo.name} />
							</div>
							<div className="lbl-disp petBreedPrev">
								<p className="dispLabels">Type</p>
								<input type="text" readOnly value={petInfo.category} />
							</div>
						</div>
						<div className="petInfo breed-color">
							<div className="lbl-disp breedColorPrev">
								<p className="dispLabels">Breed</p>
								<input type="text" readOnly value={petInfo.breed} />
							</div>
							<div className="lbl-disp petColorPrev">
								<p className="dispLabels">Color</p>
								<input type="text" readOnly value={petInfo.color} />
							</div>
						</div>
						<div className="petInfo age-gender">
							<div className="lbl-disp ageGenderPrev">
								<p className="dispLabels">Age</p>
								<input type="text" readOnly value={petInfo.age} />
							</div>
							<div className="lbl-disp petColorPrev">
								<p className="dispLabels">Gender</p>
								<input type="text" readOnly value={petInfo.gender} />
							</div>
						</div>
						<div className="infoDropdownsContainer">
							<div className="dropdown behaviorPrev">
								<p onClick={() => toggleDropdown("behaviorPrev")}>
									Behavior
									{openDropdown === "behaviorPrev" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont behaviorPrev"
									style={{
										display: openDropdown === "behaviorPrev" ? "block" : "none",
									}}
								>
									{petInfo.behavior}
								</div>
							</div>
							<div className="dropdown healthPrev">
								<p onClick={() => toggleDropdown("healthPrev")}>
									Health
									{openDropdown === "healthPrev" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont healthPrev"
									style={{
										display: openDropdown === "healthPrev" ? "block" : "none",
									}}
								>
									{petInfo.health}
								</div>
							</div>
							<div className="dropdown descriptionPrev">
								<p onClick={() => toggleDropdown("descriptionPrev")}>
									Description
									{openDropdown === "descriptionPrev" ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</p>
								<div
									className="dpCont descriptionPrev"
									style={{
										display:
											openDropdown === "descriptionPrev" ? "block" : "none",
									}}
								>
									{petInfo.description}
								</div>
							</div>
						</div>
					</div>
					{adoptInfo.status === "Pending" ? (
						<div className="evalResultCont">
							<div className="buttons">
								<button
									className={`btnApprove ${
										selectedButton === "approve" ? "selected" : ""
									}`}
									onClick={() => handleButtonClick("approve")}
									style={{
										backgroundColor:
											selectedButton === "Approved" ? "#3CB371" : "",
									}}
								>
									Approve
								</button>
								<button
									className={`btnReject ${
										selectedButton === "reject" ? "selected" : ""
									}`}
									onClick={() => handleButtonClick("reject")}
									style={{
										backgroundColor:
											selectedButton === "Rejected" ? "#C41E3A" : "",
									}}
								>
									{rejectButtonText}
								</button>
							</div>
							{showRejectReason && (
								<div className="rejectReasonCont">
									<textarea
										name="rejectionReason"
										id="rejectionReason"
										placeholder="Please state the reason for rejection"
										onChange={handleTextChange}
										maxLength={maxChar}
									></textarea>
									<p className="charCount">
										{charCount} / {maxChar}
									</p>
								</div>
							)}
							{selectedButton && (
								<button onClick={() => Submit()} className="evalSubmitButton">
									Submit
								</button>
							)}
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

export default PetEvaluation;
