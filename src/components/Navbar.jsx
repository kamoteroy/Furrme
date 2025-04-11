import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Components/Navbar.css";
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineKeyboardArrowUp,
	MdOutlineDocumentScanner,
} from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FiBook } from "react-icons/fi";
import { FaTiktok, FaQuestion } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdContactSupport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Users";

function Navbar() {
	const [openDropdown, setOpenDropdown] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const navbarRef = useRef(null);
	const navigate = useNavigate();
	const user = useSelector((state) => state.value);
	const dispatch = useDispatch();

	const toggleDropdown = (dropdown) => {
		setOpenDropdown(openDropdown === dropdown ? null : dropdown);
	};

	const closeDropdown = () => {
		setOpenDropdown(null);
	};

	const handleLogin = () => {
		navigate("/login");
	};

	useEffect(() => {
		if (user === null) {
		} else {
			setIsLoggedIn(!isLoggedIn);
		}

		const handleClickOutside = (event) => {
			if (navbarRef.current && !navbarRef.current.contains(event.target)) {
				closeDropdown();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const Logout = () => {
		dispatch(logout());
		setIsLoggedIn(!isLoggedIn);
		navigate("/");
	};

	const navCommunity = () => {
		if (user === null) {
			navigate("/login");
		} else {
			navigate("/community");
		}
	};

	const Home = () => {
		if (user === null) {
			navigate("/");
		} else {
			navigate("/pets");
		}
	};
	const navPets = () => {
		navigate("/pets");
	};

	return (
		<div className="navbar" ref={navbarRef}>
			<div className="logo">
				<img
					src={
						"https://res.cloudinary.com/dmquudoki/image/upload/v1716127273/FurrMe_Logo_sba9mx.png"
					}
					alt="FurrMe Logo"
				/>
				<a onClick={() => Home()}>
					<h2>FurrMe</h2>
				</a>
			</div>
			<div className="burger">
				<div className={`navList ${menuOpen ? "open" : ""}`}>
					<div className="navItem pets">
						<p onClick={() => navPets()}>Pets </p>
					</div>

					<div className="navItem community">
						<p onClick={() => navCommunity()}>Community</p>
					</div>

					<div className="navItem resources">
						<p onClick={() => toggleDropdown("resources")}>
							Resources{" "}
							{openDropdown === "resources" ? (
								<MdOutlineKeyboardArrowUp />
							) : (
								<MdOutlineKeyboardArrowDown />
							)}
						</p>
						{openDropdown === "resources" && (
							<ul className="dropdown resources" onClick={closeDropdown}>
								<Link to="/FAQS">
									<FaQuestion />
									FAQs <FaAngleRight className="rightIcon" />
								</Link>
								<Link to="/terms">
									<MdOutlineDocumentScanner />
									Terms <FaAngleRight className="rightIcon" />
								</Link>
								<Link to="/resources">
									<FiBook />
									Education <FaAngleRight className="rightIcon" />
								</Link>
							</ul>
						)}
					</div>

					<div className="navItem socials">
						<p onClick={() => toggleDropdown("socials")}>
							Socials{" "}
							{openDropdown === "socials" ? (
								<MdOutlineKeyboardArrowUp />
							) : (
								<MdOutlineKeyboardArrowDown />
							)}
						</p>
						{openDropdown === "socials" && (
							<ul className="dropdown socials" onClick={closeDropdown}>
								<Link to="/">
									<i className="fa-brands fa-instagram"></i>
									Instagram <FaAngleRight className="rightIcon" />
								</Link>
								<Link to="/">
									<i className="fa-brands fa-facebook"></i>
									Facebook <FaAngleRight className="rightIcon" />
								</Link>
								<Link to="/">
									<FaTiktok />
									Tiktok <FaAngleRight className="rightIcon" />
								</Link>
							</ul>
						)}
					</div>
				</div>
			</div>
			<div className="loginBtn-accountIcon">
				{isLoggedIn ? (
					<div className="DP-Icon" onClick={() => toggleDropdown("user")}>
						<img src={user.user.image} alt={user.user.name} />
					</div>
				) : (
					<button onClick={handleLogin}>Login</button>
				)}
				{openDropdown === "user" && (
					<ul className="userDropdown" onClick={closeDropdown}>
						<Link to="/profile" className="colorDrop">
							<CgProfile />
							Profile
							<FaAngleRight className="rightIcon-UDP" />
						</Link>
						<Link to="/help" className="colorDrop">
							<MdContactSupport />
							Help
							<FaAngleRight className="rightIcon-UDP" />
						</Link>
						<button onClick={() => Logout()}>Logout</button>
					</ul>
				)}
			</div>
		</div>
	);
}

export default Navbar;
