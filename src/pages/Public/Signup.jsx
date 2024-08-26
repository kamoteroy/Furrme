import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Icon from "react-icons-kit";
import { basic_eye } from "react-icons-kit/linea/basic_eye";
import { basic_eye_closed } from "react-icons-kit/linea/basic_eye_closed";
import { arrows_exclamation } from "react-icons-kit/linea/arrows_exclamation";
import { arrows_circle_check } from "react-icons-kit/linea/arrows_circle_check";
import { androidAlert } from "react-icons-kit/ionicons/androidAlert";

function Signup() {
	const [formData, setformData] = useState({
		fname: "",
		lname: "",
		email: "",
		password: "",
		cpass: "",
		image:
			"https://res.cloudinary.com/dmquudoki/image/upload/v1716289449/fmzaxpxgzginvhs4ljcn.jpg", //default image for new accounts
		role: "User",
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		setformData((prevState) => ({ ...prevState, [name]: value }));
	};

	function password_validate(password) {
		//check pass of at least 1 upper and lowercase, symbol and number
		var re = {
			upper: /(?=.*[A-Z])/,
			lower: /(?=.*[a-z])/,
			specialChar: /[ -/:-@[-`{-~]/,
			digit: /(?=.*[0-9])/,
		};
		return (
			re.upper.test(password) &&
			re.lower.test(password) &&
			re.specialChar.test(password) &&
			re.digit.test(password)
		);
	}

	function email_validate(email) {
		//check pass of at least 1 upper and lowercase, symbol and number
		var re = {
			check: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			lower: /(?=.*[a-z])/,
		};
		return re.check.test(email) && re.lower.test(email);
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = {};
		if (!formData.fname.trim()) {
			//if no string is cut means no text entered
			validationErrors.fname = "First Name is required";
		}
		if (!formData.lname.trim()) {
			//if no string is cut means no text entered
			validationErrors.lname = "Last Name is required";
		}
		if (!formData.email.trim()) {
			//if no string is cut means no text entered
			validationErrors.email = "Email is required";
		}
		if (!password_validate(formData.password)) {
			//returns true if it meets all conditions in password_validate
			validationErrors.password =
				"Must contain one upper, lower case, a symbol and a number";
		}
		if (!email_validate(formData.email)) {
			//returns true if it meets all conditions in password_validate
			validationErrors.email = "Invalid Email Format";
		}
		if (formData.password.length > 30) {
			//not exceed 16 char
			validationErrors.password = "Password too long";
		}
		if (formData.password.length < 8 && formData.password.length > 0) {
			//not below 8 but above 0
			validationErrors.password =
				"Password too short should be at least 8 characters";
		}
		if (!formData.password.trim()) {
			//no password entered
			validationErrors.password = "Password is required";
		}
		if (formData.password !== formData.cpass) {
			//password not match
			validationErrors.cpass = "Password is dont match";
		}
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			axios
				.post("http://localhost:3001/signup", formData) // Use formData directly as the data object
				.then((res) => {
					if (res.data.message !== "Success") {
						alert(res.data.message);
					} else {
						alert(
							"Registered Successfully you can log in now. Redirecting to Log In page!"
						);
						navigate("/login"); // redirect to log in page
					}
				})
				.catch((error) => {
					console.error(error); // Log any errors that occur during the request
				});
		}
	};

	const [type, setType] = useState("password");

	// validated states
	const [lowerValidated, setLowerValidated] = useState(false);
	const [upperValidated, setUpperValidated] = useState(false);
	const [numberValidated, setNumberValidated] = useState(false);
	const [specialValidated, setSpecialValidated] = useState(false);
	const [lengthValidated, setLengthValidated] = useState(false);

	const handleChange = (value) => {
		const lower = new RegExp("(?=.*[a-z])");
		const upper = new RegExp("(?=.*[A-Z])");
		const number = new RegExp("(?=.*[0-9])");
		const special = new RegExp("(?=.*[!@#$%^&*])");
		const length = new RegExp("(?=.{8,})");
		if (lower.test(value)) {
			setLowerValidated(true);
		} else {
			setLowerValidated(false);
		}
		if (upper.test(value)) {
			setUpperValidated(true);
		} else {
			setUpperValidated(false);
		}
		if (number.test(value)) {
			setNumberValidated(true);
		} else {
			setNumberValidated(false);
		}
		if (special.test(value)) {
			setSpecialValidated(true);
		} else {
			setSpecialValidated(false);
		}
		if (length.test(value)) {
			setLengthValidated(true);
		} else {
			setLengthValidated(false);
		}
	};

	const [isPopupVisible, setIsPopupVisible] = useState(false);

	// Function to toggle the popup visibility
	const handleTogglePopup = () => {
		setIsPopupVisible(!isPopupVisible);
	};

	return (
		<div>
			<Navbar />
			<div className="signup-page-container">
				<div className="signupbg"></div>
				<div className="signup-form">
					<div className="signup-header">
						<h1>Sign up</h1>
						<p>
							Join us in making a difference by opening your heart and home to a
							pet in need today. Together, we can create countless tail-wagging
							and purr-filled moments of joy!
						</p>
					</div>
					<div className="signup-inputs-container">
						<div className="signup-inputs-form">
							<input
								id="firstname"
								type="text"
								name="fname"
								className="signup-firstname"
								placeholder="First Name"
								onChange={handleInputChange}
							/>
							<h1>{errors.fname && <span> {errors.fname} </span>}</h1>
							<input
								id="lastname"
								type="text"
								name="lname"
								className="signup-firstname"
								placeholder="Last Name"
								onChange={handleInputChange}
							/>
							<h2>{errors.lname && <span> {errors.lname} </span>}</h2>
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
							/>
							<h4>{errors.email && <span> {errors.email} </span>}</h4>
							<input
								id="password"
								type={type}
								className="signup-password"
								placeholder="Password"
								name="password"
								onChange={(e) => handleChange(e.target.value)}
							/>
							{type === "password" ? (
								<span className="icon-span" onClick={() => setType("text")}>
									<Icon icon={basic_eye_closed} size={18} />
								</span>
							) : (
								<span className="icon-span" onClick={() => setType("password")}>
									<Icon icon={basic_eye} size={18} />
								</span>
							)}
							<main className="tracker-box">
								<div className={lowerValidated ? "validated" : "not-validated"}>
									{lowerValidated ? (
										<span className="list-icon green">
											<Icon icon={arrows_circle_check} />
										</span>
									) : (
										<span className="list-icon">
											<Icon icon={arrows_exclamation} />
										</span>
									)}
									At least one lowercase letter
								</div>
								<div className={upperValidated ? "validated" : "not-validated"}>
									{upperValidated ? (
										<span className="list-icon green">
											<Icon icon={arrows_circle_check} />
										</span>
									) : (
										<span className="list-icon">
											<Icon icon={arrows_exclamation} />
										</span>
									)}
									At least one uppercase letter
								</div>
								<div
									className={numberValidated ? "validated" : "not-validated"}
								>
									{numberValidated ? (
										<span className="list-icon green">
											<Icon icon={arrows_circle_check} />
										</span>
									) : (
										<span className="list-icon">
											<Icon icon={arrows_exclamation} />
										</span>
									)}
									At least one number
								</div>
								<div
									className={specialValidated ? "validated" : "not-validated"}
								>
									{specialValidated ? (
										<span className="list-icon green">
											<Icon icon={arrows_circle_check} />
										</span>
									) : (
										<span className="list-icon">
											<Icon icon={arrows_exclamation} />
										</span>
									)}
									At least one special character
								</div>
								<div
									className={lengthValidated ? "validated" : "not-validated"}
								>
									{lengthValidated ? (
										<span className="list-icon green">
											<Icon icon={arrows_circle_check} />
										</span>
									) : (
										<span className="list-icon">
											<Icon icon={arrows_exclamation} />
										</span>
									)}
									At least 8 characters
								</div>
							</main>

							<h5>{errors.password && <span> {errors.password} </span>}</h5>
							<input
								id="cnfrm-password"
								type="password"
								name="cpass"
								className="signup-cnfrmPassword"
								placeholder="Confirm Password"
								onChange={handleInputChange}
							/>
							<h6>{errors.cpass && <span> {errors.cpass} </span>}</h6>
						</div>
						<div className="signup-inputs-warning">
							<button className="fname-icon" onClick={handleTogglePopup}>
								<Icon icon={androidAlert} size={18} />
							</button>
							<button className="lname-icon" onClick={handleTogglePopup}>
								<Icon icon={androidAlert} size={18} />
							</button>
							<button className="email-icon" onClick={handleTogglePopup}>
								<Icon icon={androidAlert} size={18} />
							</button>
							<button className="pass-icon" onClick={handleTogglePopup}>
								<Icon icon={androidAlert} size={18} />
							</button>
							<button className="cpass-icon" onClick={handleTogglePopup}>
								<Icon icon={androidAlert} size={18} />
							</button>
						</div>
					</div>

					<div className="signupBtn-container">
						<Link>
							<button onClick={handleSubmit} className="btn-createAccnt">
								Create Account
							</button>
						</Link>
					</div>
					<p className="terms">
						By creating an account, you agree to FurrMe's{" "}
						<Link to="/terms">Terms of Service</Link> and{" "}
						<Link to="/terms">Privacy Policy</Link>
					</p>
					<h3>
						Already have an account?{" "}
						<Link to="/login" className="footer-login">
							Login
						</Link>
					</h3>
				</div>
			</div>
		</div>
	);
}

export default Signup;
