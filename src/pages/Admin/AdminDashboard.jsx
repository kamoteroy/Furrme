import React, { useState, useRef, useEffect } from "react";
import "../../styles/Admin/AdminDashboard.css";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaCat, FaDog } from "react-icons/fa6";
import AdminDashboardSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function AdminDashboard() {
	//Dropdown Functions
	const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState("All Pets");
	const [selectedStatus, setSelectedStatus] = useState("Status");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const navigate = useNavigate();
	const [petList, setList] = useState([]);
	const rowsPerPage = 10;
	const dropdownRef = useRef(null);
	const statusDropdownRef = useRef(null);
	const user = useSelector((state) => state.value);

	useEffect(() => {
		axios
			.get("http://localhost:3001/admin", {
				headers: {
					token: user.token,
				},
			})
			.then((res) => (res.data.message ? setList([]) : setList(res.data)))
			.catch((err) => console.log(err));
	}, []);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const toggleStatusDropdown = () => {
		setIsStatusDropdownOpen(!isStatusDropdownOpen);
	};

	//Page Reset on Dropdown Filter and Search Input Reset

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setIsDropdownOpen(false);
		setCurrentPage(1);
		setSearchInput("");
	};

	const handleStatusOptionClick = (status) => {
		setSelectedStatus(status);
		setIsStatusDropdownOpen(false);
		setCurrentPage(1);
		setSearchInput("");
	};

	//Page Navigation

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) =>
			Math.min(prevPage + 1, Math.ceil(petList.length / rowsPerPage))
		);
	};

	//Search Filtering and Dropdown Reset

	const handleSearchInputChange = (event) => {
		setSearchInput(event.target.value); // Update search input state
		setCurrentPage(1); // Reset currentPage to 1 when search input changes
		setSelectedOption("All Pets"); // Reset dropdown to default when search input changes
		setSelectedStatus("Status"); // Reset status dropdown to default when search input changes
	};

	const filteredPetList = petList.filter((pet) => {
		const typeMatch =
			selectedOption === "All Pets" || pet.category === selectedOption;
		const statusMatch =
			selectedStatus === "Status" || pet.status === selectedStatus;
		return typeMatch && statusMatch;
	});

	const searchedPets = searchInput
		? filteredPetList.filter((pet) =>
				pet.name.toLowerCase().includes(searchInput.toLowerCase())
			)
		: filteredPetList;

	//Page Number
	const startIndex = (currentPage - 1) * rowsPerPage;
	const currentPets = searchedPets.slice(startIndex, startIndex + rowsPerPage);

	//Dropdown Effect
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}

			if (
				statusDropdownRef.current &&
				!statusDropdownRef.current.contains(event.target)
			) {
				setIsStatusDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const createPet = () => {
		navigate("/admin/create");
	};

	const petPreview = (pet) => {
		navigate(`/admin/pets/${pet.category}/${pet.name}`, { state: pet });
	};

	return (
		<div className="adminDashboard">
			<div className="sidebarComp">
				<AdminDashboardSidebar />
			</div>
			<div className="mainContent">
				<div className="header">
					<div
						className={`searchBar ${isSearchBarFocused ? "highlighted" : ""}`}
					>
						<IoIosSearch className="searchIcon" />
						<input
							type="text"
							placeholder="Search pets..."
							onFocus={() => setIsSearchBarFocused(true)}
							onBlur={() => setIsSearchBarFocused(false)}
							value={searchInput}
							onChange={handleSearchInputChange}
						/>
					</div>
					<div className="tableFilters">
						<div className="category" ref={dropdownRef}>
							<p className="petCategory" onClick={toggleDropdown}>
								{selectedOption}{" "}
								{isDropdownOpen ? (
									<MdKeyboardArrowUp />
								) : (
									<MdKeyboardArrowDown />
								)}
							</p>
							{isDropdownOpen && (
								<div className="dropdown">
									<ul>
										<li onClick={() => handleOptionClick("All Pets")}>
											All Pets
										</li>
										<li onClick={() => handleOptionClick("Dogs")}>Dogs</li>
										<li onClick={() => handleOptionClick("Cats")}>Cats</li>
									</ul>
								</div>
							)}
						</div>
						<div className="category" ref={statusDropdownRef}>
							<p className="petCategory" onClick={toggleStatusDropdown}>
								{selectedStatus}{" "}
								{isStatusDropdownOpen ? (
									<MdKeyboardArrowUp />
								) : (
									<MdKeyboardArrowDown />
								)}
							</p>
							{isStatusDropdownOpen && (
								<div className="dropdown">
									<ul>
										<li onClick={() => handleStatusOptionClick("Status")}>
											Status
										</li>
										<li onClick={() => handleStatusOptionClick("Available")}>
											Available
										</li>
										<li onClick={() => handleStatusOptionClick("Adopted")}>
											Adopted
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
				<h1>Pet Listings</h1>
				<div className="tableContainer">
					<table>
						<thead>
							<tr>
								<th>Type</th>
								<th>Name</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{currentPets.length === 0 ? (
								<tr>
									<td colSpan="3">No Pet Listing Found</td>
								</tr>
							) : (
								currentPets.map((pet) => (
									<tr onClick={() => petPreview(pet)} key={pet.pet_id}>
										<td>
											{pet.category === "Dogs" && (
												<>
													<FaDog className="icon" /> Dog
												</>
											)}
											{pet.category === "Cats" && (
												<>
													<FaCat className="icon" /> Cat
												</>
											)}
										</td>
										<td>{pet.name}</td>
										<td>{pet.status}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="tableNav">
					<div className="pageNav" onClick={handlePreviousPage}>
						<FaAngleLeft className="navIcon" />
						<p>Previous</p>
					</div>
					<p className="pageNum">
						Page {currentPage} of {Math.ceil(petList.length / rowsPerPage)}
					</p>
					<div className="pageNav" onClick={handleNextPage}>
						<p>Next</p>
						<FaAngleRight className="navIcon" />
					</div>
				</div>
				<div className="buttonContainer">
					<button onClick={createPet}>Add New Pet Listing</button>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
