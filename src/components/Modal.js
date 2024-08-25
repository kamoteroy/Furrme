import React from "react";
import "./Modal.css";

const AnimatedModal = ({ isOpen, onClose, title, children }) => {
	return (
		<div className={`modal-overlay ${isOpen ? "show" : ""}`}>
			<div className={`modal-content ${isOpen ? "slide-in" : "slide-out"}`}>
				<button className="close-button" onClick={onClose}>
					&times;
				</button>
				<h2>{title}</h2>
				<div className="modal-body">{children}</div>
				<button className="okay-button" onClick={onClose}>
					Okay
				</button>
			</div>
		</div>
	);
};

export default AnimatedModal;
