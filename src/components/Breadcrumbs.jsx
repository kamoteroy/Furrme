import React from "react";
import "../styles/Components/Breadcrumbs.css";
import { useLocation, Link } from "react-router-dom";

function Breadcrumbs() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);

	// Helper function to capitalize the first letter and decode URI components
	const formatBreadcrumb = (str) =>
		decodeURIComponent(str.charAt(0).toUpperCase() + str.slice(1));

	return (
		<div className="breadcrumbs">
			{pathnames.map((value, index) => {
				const to = `/${pathnames.slice(0, index + 1).join("/")}`;
				const isLast = index === pathnames.length - 1;

				return isLast ? (
					<span key={to} className="breadcrumb-current">
						{formatBreadcrumb(value)}
					</span>
				) : (
					<>
						<Link key={to} to={to} className="breadcrumb-link">
							{formatBreadcrumb(value)}
						</Link>
					</>
				);
			})}
		</div>
	);
}

export default Breadcrumbs;
