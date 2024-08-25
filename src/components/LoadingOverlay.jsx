import React from "react";
import "../styles/LoadingOverlay.css";

const LoadingOverlayWithGif = ({ gifSrc, label }) => {
	return (
		<div className="overlay">
			<div className="loading-content">
				<img src={gifSrc} alt="Loading..." className="loading-gif" />
				{label && <p className="loading-label">{label}</p>}
			</div>
		</div>
	);
};

export default LoadingOverlayWithGif;
