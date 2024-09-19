import React, { useEffect, useState } from "react";
import "../../styles/Login.css";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/Users";
import LoginModal from "../../components/LoginModal";
import RedirectModal from "../../components/RedirectModal";

function Login() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [link, setLink] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	const emailPlaceholder = windowWidth < 960 ? "Email" : "";
	const passwordPlaceholder = windowWidth < 960 ? "Password" : "";

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const validate = () => {
		const validationErrors = {};
		if (!email.trim()) {
			//if no string is cut means no text entered
			validationErrors.email = "Email is required";
		}
		if (!password.trim()) {
			//if no string is cut means no text entered
			validationErrors.password = "Password is required";
		}
		if (password.length < 8 && password.length > 0) {
			//not below 8 but above 0
			validationErrors.password =
				"Password too short should be at least 8 characters";
		}
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			console.log(password);
			axios
				.post("http://localhost:3001/login", { email, password })
				.then((res) => {
					if (res.data.message) {
						setmodalContents({
							title: "Login Unsuccessful",
							contents: res.data.message,
						});
						setIsModalOpen(!isModalOpen);
					} else {
						dispatch(login({ token: res.data.token, user: res.data.userData }));
						setmodalContents({
							title: "Login Successful",
							contents: res.data.message,
						});
						setIsModalOpen(!isModalOpen);
						setLink("/pets");

						//alert("Success redirecting to dashboard");
					}
				})
				.catch((error) => {
					console.error(error); // Log any errors that occur during the request
				});
		}
	};

	return (
		<div>
			{link === "" ? (
				<LoginModal
					isOpen={isModalOpen}
					onClose={toggleModal}
					title={modalContents.title}
				>
					<p>{modalContents.contents}</p>
				</LoginModal>
			) : (
				<RedirectModal
					isOpen={isModalOpen}
					onClose={toggleModal}
					title={modalContents.title}
					link={link}
				>
					<p>{modalContents.contents}</p>
				</RedirectModal>
			)}
			<Navbar />
			<div className="page-container">
				<div className="bg-container"></div>
				<div className="login-form">
					<h1 className="login-header">Login</h1>
					<div className="tagline-container">
						<p className="tagline">
							Homeless to Loved: Adopting Joy, One Paw at a Time
						</p>
					</div>
					<form onSubmit={handleSubmit} className="login-form">
						<div className="input-container">
							<div className="inputs email">
								<label className="signin-input-label" htmlFor="email">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									className="tbxEmail"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={emailPlaceholder}
								/>
								<h3 className="login-error">
									{errors.email && <span> {errors.email} </span>}
								</h3>
							</div>
							<div className="inputs password">
								<label className="signin-input-label" htmlFor="email">
									Password
								</label>

								<input
									name="password"
									id="password"
									type="password"
									className="tbxPassword"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={passwordPlaceholder}
								/>
								<h4 className="login-error">
									{errors.password && <span> {errors.password} </span>}
								</h4>
							</div>
							<Link to="/forgotpassword" className="forgotPassword">
								Forgot Password
							</Link>
						</div>
						<div className="button-container">
							<button type="submit" className="login-button">
								Login
							</button>
						</div>
					</form>
					<div className="login-footer">
						<p>
							Don't have an account?{" "}
							<Link to="/signup" className="lblCreateAccount">
								Create an Account
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
