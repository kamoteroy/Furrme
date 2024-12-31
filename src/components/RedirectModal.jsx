import React from "react";
import "../styles/Components/RedirectModal.css";
import { useNavigate } from "react-router-dom";

const RedirectModal = ({ isOpen, onClose, title, children, link }) => {
	const navigate = useNavigate();

	const handleCloseModal = () => {
		onClose = false;
		// Perform the redirect after closing the modal
		setTimeout(() => {
			navigate(link); // Replace '/redirect-path' with your desired route
		}, 500); // Optional delay for better user experience
	};

	return (
		<div className={`rmodal-overlay ${isOpen ? "show" : ""}`}>
			<div className={`rmodal-content ${isOpen ? "slide-in" : "slide-out"}`}>
				<button className="rclose-button" onClick={handleCloseModal}>
					&times;
				</button>
				<h2>{title}</h2>
				<div className="rmodal-body">{children}</div>
				<button className="rokay-button" onClick={handleCloseModal}>
					Okay
				</button>
			</div>
		</div>
	);
};

export default RedirectModal;
