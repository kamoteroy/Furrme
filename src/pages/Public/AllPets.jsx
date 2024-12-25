import React, { useState, useEffect, useRef } from "react";
import "../../styles/AllPets.css";
import PetCard from "../../components/PetCard";
import Navbar from "../../components/Navbar";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AllPets() {
	const [ageClick, setAgeClick] = useState(false);
	const [colorClick, setColorClick] = useState(false);
	const [ageCaretDirection, setAgeCaretDirection] = useState("down");
	const [colorCaretDirection, setColorCaretDirection] = useState("down");
	const ageRef = useRef(null);
	const colorRef = useRef(null);
	const [petList, setPetList] = useState([]);
	const [filteredPets, setFilteredPets] = useState([]);
	const user = useSelector((state) => state.value);
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAge, setSelectedAge] = useState("");
	const [selectedColor, setSelectedColor] = useState("");

	useEffect(() => {
		if (user) {
			user.user.role === "Admin" ? navigate("/admin/pets") : navigate("/pets");
		}

		axios
			.get("http://localhost:3001/pets")
			.then((res) => {
				setPetList(res.data); // Store the fetched pet data in state
				setFilteredPets(res.data); // Initially, show all pets
			})
			.catch((err) => console.log(err));

		const handleClickOutside = (event) => {
			if (
				ageRef.current &&
				!ageRef.current.contains(event.target) &&
				colorRef.current &&
				!colorRef.current.contains(event.target)
			) {
				setAgeClick(false);
				setAgeCaretDirection("down");
				setColorClick(false);
				setColorCaretDirection("down");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [user, navigate]);

	const handleFilterClick = (setState, setDirection, currentState) => {
		setState(!currentState);
		setDirection(currentState ? "down" : "up");
		if (currentState) {
			setAgeClick(false);
			setAgeCaretDirection("down");
			setColorClick(false);
			setColorCaretDirection("down");
		}
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleAgeSelect = (age) => {
		setSelectedAge(age);
	};

	const handleColorSelect = (color) => {
		setSelectedColor(color);
	};

	const applyFilters = () => {
		let filteredList = petList;

		if (searchTerm) {
			filteredList = filteredList.filter(
				(pet) =>
					pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.address.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredPets(filteredList);
	};

	useEffect(() => {
		applyFilters();
	}, [searchTerm, selectedAge, selectedColor, petList]);

	return (
		<div>
			<Navbar />
			<div className="allPets">
				<div className="allPetsHeader">
					<div className="headerTitle">
						<h1>All Pets for Adoption</h1>
						<hr />
						<div className="searchBarContainer">
							<input
								type="text"
								className="searchBar"
								placeholder="Search name, breed, or location"
								value={searchTerm}
								onChange={handleSearchChange}
							/>
							<IoIosSearch className="searchIcon" />
						</div>
					</div>
					<div className="headerImgContainer">
						<div className="bannerImg">
							<p>
								In the quiet shelter, amidst the echoing halls, volunteers
								whisper stories of forever homes, weaving dreams of love and
								belonging for every lonely paw that wanders in. In their patient
								hands, hope is not just a word but a promise, whispered through
								gentle strokes and warm embraces, guiding each forgotten soul
								towards a brighter tomorrow.
							</p>
						</div>
					</div>
				</div>
				<div className="filter-dropdowns">
					{/* Age filter dropdown */}
					<div
						className="petFilter ageFilter"
						onClick={() =>
							handleFilterClick(setAgeClick, setAgeCaretDirection, ageClick)
						}
						ref={ageRef}
					>
						<div className="filterTitle">
							<p>Age</p>
							<i className={`fa-solid fa-caret-${ageCaretDirection}`}></i>
						</div>
						<ul className={ageClick ? "filterMenu active" : "filterMenu"}>
							<li onClick={() => handleAgeSelect("Puppy")}>Puppy</li>
							<li onClick={() => handleAgeSelect("Middle-Aged")}>
								Middle-Aged
							</li>
							<li onClick={() => handleAgeSelect("Adult")}>Adult</li>
						</ul>
					</div>

					{/* Color filter dropdown */}
					<div
						className="petFilter colorFilter"
						onClick={() =>
							handleFilterClick(
								setColorClick,
								setColorCaretDirection,
								colorClick
							)
						}
						ref={colorRef}
					>
						<div className="filterTitle">
							<p>Color</p>
							<i className={`fa-solid fa-caret-${colorCaretDirection}`}></i>
						</div>
						<ul className={colorClick ? "filterMenu active" : "filterMenu"}>
							<li onClick={() => handleColorSelect("Orange")}>Orange</li>
							<li onClick={() => handleColorSelect("White")}>White</li>
							<li onClick={() => handleColorSelect("Black")}>Black</li>
						</ul>
					</div>
				</div>
				<div className="petsContainer">
					{filteredPets.length === 0 ? (
						<h1 className="noPetsMessage">
							No pets available for adoption at the moment.
						</h1>
					) : (
						filteredPets.map((pet, i) => {
							return <PetCard key={i} data={pet} />;
						})
					)}
				</div>
			</div>
		</div>
	);
}

export default AllPets;
