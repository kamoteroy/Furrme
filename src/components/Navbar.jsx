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
import { FaTiktok, FaQuestion, FaCat, FaDog } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdContactSupport } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Users";

function Navbar(props) {
	const [openDropdown, setOpenDropdown] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false); //For Simulation (Please replace with correct authentication logic)
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

	const Community = () => {
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
			<div className="navList">
				<div className="navItem pets">
					<p onClick={() => toggleDropdown("pets")}>
						Pets{" "}
						{openDropdown === "pets" ? (
							<MdOutlineKeyboardArrowUp />
						) : (
							<MdOutlineKeyboardArrowDown />
						)}
					</p>
					{openDropdown === "pets" && (
						<ul className="dropdown pets" onClick={closeDropdown}>
							<Link to="/pets/Cats" className="colorText">
								<FaCat className="dropdownIcon" />
								Cats <FaAngleRight className="rightIcon" />
							</Link>
							<Link to="/pets/Dogs" className="colorText">
								<FaDog />
								Dogs <FaAngleRight className="rightIcon" />
							</Link>
						</ul>
					)}
				</div>
				<div className="navItem community">
					<p onClick={() => Community()}>Community</p>
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
							<Link to="/FAQS" className="colorText">
								<FaQuestion />
								FAQs <FaAngleRight className="rightIcon" />
							</Link>
							<Link to="/terms" className="colorText">
								<MdOutlineDocumentScanner />
								Terms & Conditions <FaAngleRight className="rightIcon" />
							</Link>
							<Link to="/resources" className="colorText">
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
							<li>
								<i class="fa-brands fa-instagram"></i>
								Instagram <FaAngleRight className="rightIcon" />
							</li>
							<li>
								<i class="fa-brands fa-facebook"></i>
								Facebook <FaAngleRight className="rightIcon" />
							</li>
							<li>
								<FaTiktok />
								Tiktok <FaAngleRight className="rightIcon" />
							</li>
						</ul>
					)}
				</div>
			</div>
			<div className="loginBtn-accountIcon">
				{/* From Here */}
				{isLoggedIn ? (
					<div className="DP-Icon" onClick={() => toggleDropdown("user")}>
						<img src={user.user.image} alt={user.user.name} />
					</div>
				) : (
					<button onClick={handleLogin}>Login</button>
				)}
				{/*To here : Replace with <Button>Login<Button/> kay gi modify rana pang simulation sa Login Button og Avatar Icon if naka login or wala */}
				{openDropdown === "user" && (
					<ul className="userDropdown" onClick={closeDropdown}>
						<Link to="/profile" className="colorDrop">
							<CgProfile className="dropdownIcon" />
							My Profile
							<FaAngleRight className="rightIcon-UDP" />
						</Link>
						<Link to="/help" className="colorDrop">
							<MdContactSupport className="dropdownIcon" />
							Help & Support
							<FaAngleRight className="rightIcon-UDP" />
						</Link>
						<button onClick={() => Logout()}>
							<IoIosLogOut className="dropdownIcon" />
							Logout
						</button>
					</ul>
				)}
			</div>
		</div>
	);
}

export default Navbar;
