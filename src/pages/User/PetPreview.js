import React, { useRef, useState, useEffect} from "react";
import axios from 'axios';
import "../../styles/PetPreview.css";
import Navbar from "../../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function PetPreview() {
    const containerRef = useRef(null);
    const petData = useLocation();
    const [pets, setPets] = useState([]);
    const petID = parseInt(petData.state.pet.pet_id);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value);
    
    const handleWheel = (e) => {
        e.preventDefault();
        const container = containerRef.current;
        if (container) {
            container.scrollLeft += e.deltaY;
        }
    };
    
    const [selectedImg, setSelectedImg] = useState(petData.state.pet.image);

    const handleImageClick = (imgSrc) => {
        setSelectedImg(imgSrc);
    };

    const confirmAdoption = () => {
        if(window.localStorage.getItem("loggedUser")===''){
            navigate('/login');
        }
        else{
            navigate(`/pets/${petData.state.pet.category}/${petData.state.pet.name}/adopt` , {state: {pet: petData.state.pet} })
        }
    }

    useEffect(() => {
        axios.post(`http://localhost:3001/petpreview/:${petData.state.pet.name}`, {petID})
        .then(res=>
            setPets(res.data))
        .catch(err=>console.log(err));
    }, []);
    
    return (
        <div>
            <Navbar
                user = {window.localStorage.getItem("loggedUser")}
            />
            <div className="petPreview">
                <div className="petImgSec">
                    <div className="selectedImgContainer">
                        <img src={selectedImg} alt={petData.state.pet.name}/>
                    </div>
                    <div
                        className="petImgCollection"
                        ref={containerRef}
                        onWheel={handleWheel}
                    >
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(petData.state.pet.image)}
                        >
                            <img src={petData.state.pet.image} alt={"img1"}/>
                        </div>
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(pets.img2)}
                        >
                            <img src={pets.img2} alt={"img2"}/>
                        </div>
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(pets.img3)}
                        >
                            <img src={pets.img3} alt={"img3"}/>
                        </div>
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(pets.img4)}
                        >
                            <img src={pets.img4} alt={"img4"}/>
                        </div>
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(pets.img5)}
                        >
                            <img src={pets.img5} alt={"img5"}/>
                        </div>
                    </div>
                </div>
                <div className="petInfoContainer">
                    <h1 className="petNameInfo">{petData.state.pet.name}</h1>
                    <div className="petInfoList">
                        <h2>Pet Information:</h2>
                        <h3>Breed: {petData.state.pet.breed}</h3>
                        <h3>Color: {petData.state.pet.color}</h3>
                        <h3>Age: {petData.state.pet.age}</h3>
                        <h3>Gender: {petData.state.pet.gender}</h3>
                        <h3>Behavior: {petData.state.pet.behavior}</h3>
                        <h3>Health: {petData.state.pet.health}</h3>
                        <h3 className="petDescriptionInfo">Description: {petData.state.pet.description}</h3>
                    </div>
                    <button onClick={() => confirmAdoption()} className="adoptionInqBtn">
                        Inquire of Adoption
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PetPreview;
