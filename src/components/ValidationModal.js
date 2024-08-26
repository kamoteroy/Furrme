import React from "react";
import "./ValidationModal.css";

const CustomModal = ({ onClose, children }) => {
	console.log("bonak");
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				{children} {/* Render the children passed from the parent */}
				<button onClick={onClose} className="close-modal-button">
					Close
				</button>
			</div>
		</div>
	);
};

export default CustomModal;
