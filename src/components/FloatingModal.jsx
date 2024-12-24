import React, { useState, useEffect } from "react";
import "./FloatingModal.css"; // Import your CSS styles

const FloatingModal = ({ isOpen, onClose, title, countdownTime }) => {
	const [timeLeft, setTimeLeft] = useState(countdownTime);

	// Countdown logic
	useEffect(() => {
		if (!isOpen || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer); // Clean up the timer on component unmount
	}, [isOpen, timeLeft]);

	useEffect(() => {
		if (timeLeft <= 0) {
			onClose(); // Close the modal once the countdown reaches zero
		}
	}, [timeLeft, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="close-button" onClick={onClose}>
					X
				</button>
				<h2>{title}</h2>
				<p>Time left: {timeLeft} seconds</p>
			</div>
		</div>
	);
};

export default FloatingModal;
