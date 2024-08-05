import React, { useState, useEffect, useRef } from "react";
import "../../styles/AllPets.css";
import PetCard from "../../components/PetCard";
import Navbar from '../../components/Navbar';
import { IoIosSearch } from "react-icons/io";
import axios from 'axios';
import { useSelector } from "react-redux";

function AllPets() {
    const [ageClick, setAgeClick] = useState(false);
    const [colorClick, setColorClick] = useState(false); // State for color filter
    const [ageCaretDirection, setAgeCaretDirection] = useState("down");
    const [colorCaretDirection, setColorCaretDirection] = useState("down"); // State for color caret direction
    const ageRef = useRef(null);
    const colorRef = useRef(null); // Ref for color dropdown
    const [petList, setList] = useState([]);
    const user = useSelector((state) => state.value)
    
    useEffect(() => {
            axios.get('http://localhost:3001/pets'/*, {
                headers: {
                  'Authorization': `Basic ${token}`
                }
              }*/)
            .then(res=>
                setList(res.data))
            .catch(err=>console.log(err));


        const handleClickOutside = (event) => {
            if (
                ageRef.current &&
                !ageRef.current.contains(event.target) &&
                colorRef.current && // Check if colorRef exists
                !colorRef.current.contains(event.target)
            ) {
                setAgeClick(false);
                setAgeCaretDirection("down");
                setColorClick(false); // Set colorClick to false
                setColorCaretDirection("down"); // Reset color caret direction
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFilterClick = (setState, setDirection, currentState, ) => {
        setState(!currentState);
        setDirection(currentState ? "down" : "up");
        if (currentState) {
            setAgeClick(false);
            setAgeCaretDirection("down");
            setColorClick(false);
            setColorCaretDirection("down");
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="allPets">
                <div className="allPetsHeader">
                    <div className="headerTitle">
                        <h1>All Pets for Adoption</h1>
                        <hr />
                        <div className="searchBarContainer">
                            <input type="text" className="searchBar" placeholder="Search..." />
                            <IoIosSearch className="searchIcon"/>
                        </div>
                    </div>
                    <div className="headerImgContainer">
                        <div className="bannerImg">
                            <p>
                                In the quiet shelter, amidst the echoing halls,
                                volunteers whisper stories of forever homes,
                                weaving dreams of love and belonging for every
                                lonely paw that wanders in. In their patient
                                hands, hope is not just a word but a promise,
                                whispered through gentle strokes and warm
                                embraces, guiding each forgotten soul towards a
                                brighter tomorrow
                            </p>
                        </div>
                    </div>
                </div>
                <div className="filter-dropdowns">
                    <div
                        className="petFilter ageFilter"
                        onClick={() => handleFilterClick(setAgeClick, setAgeCaretDirection, ageClick, ageCaretDirection)}
                        ref={ageRef}
                    >
                        <div className="filterTitle">
                            <p>Age</p>
                            <i
                                className={`fa-solid fa-caret-${ageCaretDirection}`}
                            ></i>
                        </div>
                        <ul
                            className={
                                ageClick ? "filterMenu active" : "filterMenu"
                            }
                        >
                            <li>Puppy</li>
                            <li>Middle-Aged</li>
                            <li>Adult</li>
                        </ul>
                    </div>
                    <div
                        className="petFilter colorFilter"
                        onClick={() => handleFilterClick(setColorClick, setColorCaretDirection, colorClick, colorCaretDirection)}
                        ref={colorRef}
                    >
                        <div className="filterTitle">
                            <p>Color</p>
                            <i
                                className={`fa-solid fa-caret-${colorCaretDirection}`}
                            ></i>
                        </div>
                        <ul
                            className={
                                colorClick ? "filterMenu active" : "filterMenu"
                            }
                        >
                            <li>Orange</li>
                            <li>White</li>
                            <li>Black</li>
                        </ul>
                    </div>
                </div>
                <div className="petsContainer">
                    {petList.map((pet, i) => {
                        return (
                            <PetCard
                                key={i}
                                data={pet}
                            />
                        ); 
                    })}
                </div>
            </div>
        </div>
    );
}

export default AllPets;
