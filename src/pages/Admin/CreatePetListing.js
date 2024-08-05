import React, { useState, useEffect, useRef } from "react";
import "../../styles/CreatePetListing.css";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
//import { useNavigate } from "react-router-dom";
import axios from 'axios';

function CreatePetListing() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [selectedPetType, setSelectedPetType] = useState("Select Pet Type");
    const [selectedPetGender, setSelectedPetGender] = useState("Select Gender");
    const [fileNames, setFileNames] = useState([]);
    const dropdownRef = useRef(null);
    const genderDropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const [formData, setformData] = useState({
        name: '',
        gender: '',
        category: '',
        breed: '',
        age: '',
        color: '',
        behavior: '',
        health: '',
        description: '',
    });

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleGenderDropdown = () => {
        setGenderDropdownOpen(!genderDropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const closeGenderDropdown = () => {
        setGenderDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            closeDropdown();
        }
        if (
            genderDropdownRef.current &&
            !genderDropdownRef.current.contains(event.target)
        ) {
            closeGenderDropdown();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter((file) => {
            return file.type === "image/jpeg" || file.type === "image/png";
        });
        const fileNamesArray = imageFiles.map((file) => file.name);
        if (fileNamesArray.length + fileNames.length <= 8) {
            setFileNames([...fileNames, ...fileNamesArray]);
        } else {
            alert("You can only upload a maximum of 8 images.");
        }
        fileInputRef.current.value = ""; // Clear the file input value after handling the upload
    };

    const handleRemoveFile = (fileNameToRemove) => {
        setFileNames(
            fileNames.filter((fileName) => fileName !== fileNameToRemove)
        );
    };

    const handleSelectPetType = (type) => {
        setSelectedPetType(type);
        closeDropdown();
    };

    const handleSelectPetGender = (gender) => {
        setSelectedPetGender(gender)
        closeGenderDropdown();
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setformData((prevState) => ({ ...prevState, [name]: value }));
      };

    /*const handleCharacterLimit = (event, setter, maxChars) => {
        if (event.target.value.length > maxChars) {
            event.target.value = event.target.value.slice(0, maxChars);
        }
        setter(event.target.value);
    };*/

    const create = async () => {
        await axios.post('http://localhost:3001/admin/create',{
            data: formData,
        })
        .then(res=>
            alert('Success'))
        .catch(err=>console.log(err));
    }

    return (
        <div className="createPetListing">
            <div className="sidebarComp">
                <AdminDashboardSidebar />
            </div>
            <div className="mainContent">
                <div className="inputsContainer">
                    <h2>Add New Pet Listing</h2>
                    <div className="basicInfo">
                        <div className="nameGenderContainer">
                            <div className="inputs petNamePrev">
                                <label htmlFor="petName">Name</label>
                                <input 
                                    id="firstname"
                                    type="text"
                                    name="fname"
                                    className="signup-firstname"
                                    placeholder="First Name"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div
                                className="inputs petGender"
                                ref={genderDropdownRef}
                            >
                                <label htmlFor="petGender">Gender</label>
                                <p
                                    className="petGenderHeader"
                                    onClick={toggleGenderDropdown}
                                >
                                    {selectedPetGender}
                                    {genderDropdownOpen ? (
                                        <MdOutlineKeyboardArrowUp />
                                    ) : (
                                        <MdOutlineKeyboardArrowDown />
                                    )}
                                </p>
                                {genderDropdownOpen && (
                                    <ul
                                        className="petGenderDropdown"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <li
                                            onClick={() =>
                                                handleSelectPetGender("Male")
                                            }
                                        >
                                            Male
                                        </li>
                                        <li
                                            onClick={() =>
                                                handleSelectPetGender("Female")
                                            }
                                        >
                                            Female
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="containers">
                            <div className="inputs type" ref={dropdownRef}>
                                <label htmlFor="petType">Pet Type</label>
                                <p
                                    className="petTypeDP-Header"
                                    onClick={toggleDropdown}
                                >
                                    {selectedPetType}
                                    {dropdownOpen ? (
                                        <MdOutlineKeyboardArrowUp />
                                    ) : (
                                        <MdOutlineKeyboardArrowDown />
                                    )}
                                </p>
                                {dropdownOpen && (
                                    <ul
                                        className="petTypeDropdown"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <li
                                            onClick={() =>
                                                handleSelectPetType("Cats")
                                            }
                                        >
                                            Cat
                                        </li>
                                        <li
                                            onClick={() =>
                                                handleSelectPetType("Dogs")
                                            }
                                        >
                                            Dog
                                        </li>
                                    </ul>
                                )}
                            </div>
                            <div className="inputs breed">
                                <label htmlFor="petBreed">Breed</label>
                                <input 
                                    id="breed"
                                    type="text"
                                    name="breed"
                                    placeholder="Breed"
                                    onChange={handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="containers">
                            <div className="inputs age">
                                <label htmlFor="petAge">Age</label>
                                <input
                                    id="age"
                                    type="text"
                                    name="age"
                                    placeholder="Age"
                                    onChange={handleInputChange}
                                    />
                            </div>
                            <div className="inputs color">
                                <label htmlFor="petColor">Color</label>
                                <input
                                    id="color"
                                    type="text"
                                    name="color"
                                    placeholder="Color"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="descriptionInfo">
                        <div className="descContainer behavior">
                            <label htmlFor="petBehavior">Behavior</label>
                            <textarea
                                name="behavior"
                                id="behavior"
                                value={formData.behavior}
                                type="text"
                                placeholder="Behavior Information"
                                onChange={handleInputChange}
                            ></textarea>
                            <p>{formData.behavior.length} / 100 characters</p>
                        </div>
                        <div className="descContainer health">
                            <label htmlFor="petHealth">Health</label>
                            <textarea
                                name="health"
                                id="health"
                                value={formData.health}
                                type="text"
                                placeholder="Health Information"
                                onChange={handleInputChange}
                            ></textarea>
                            <p>{formData.health.length} / 200 characters</p>
                        </div>
                        <div className="descContainer petDescription">
                            <label htmlFor="petDescription">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                type="text"
                                placeholder="Brief Description"
                                onChange={handleInputChange}
                            ></textarea>
                            <p>{formData.description.length} / 400 characters</p>
                        </div>
                    </div>
                    <div className="uploadImgContainer">
                        <label htmlFor="upload" className="uploadFilesBtn">
                            Upload Images{" "}
                            <input
                                id="upload"
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                multiple
                                onChange={handleFileUpload}
                                ref={fileInputRef} // Attach the ref to the file input
                            />
                        </label>
                        <div className="imgFileNames">
                            <ul>
                                {fileNames.map((fileName, index) => (
                                    <li key={index}>
                                        {fileName.length > 20
                                            ? `${fileName.substring(0, 20)}...`
                                            : fileName}
                                        <IoCloseCircleOutline
                                            className="removeImg"
                                            onClick={() =>
                                                handleRemoveFile(fileName)
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <button  onClick={()=> create()} className="addButton">Add Pet to Listings</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePetListing;
