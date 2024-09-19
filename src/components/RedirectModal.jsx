import React from "react";
import "./RedirectModal.css";
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
		<div className={`modal-overlay ${isOpen ? "show" : ""}`}>
			<div className={`modal-content ${isOpen ? "slide-in" : "slide-out"}`}>
				<button className="close-button" onClick={handleCloseModal}>
					&times;
				</button>
				<h2>{title}</h2>
				<div className="modal-body">{children}</div>
				<button className="okay-button" onClick={handleCloseModal}>
					Okay
				</button>
			</div>
		</div>
	);
};

export default RedirectModal;
