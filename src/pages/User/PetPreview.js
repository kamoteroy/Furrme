import React, { useRef, useState, useEffect} from "react";
import axios from 'axios';
import "../../styles/PetPreview.css";
import Navbar from "../../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function PetPreview() {
    const containerRef = useRef(null);
    const location = useLocation();
    const petData = location.state
    const [pets, setPets] = useState([]);
    const petID = parseInt(petData.pet_id);
    const navigate = useNavigate();
    const user = useSelector((state) => state.value);
    
    const handleWheel = (e) => {
        const container = containerRef.current;
        if (container) {
            container.scrollLeft += e.deltaY;
        }
    };
    
    const [selectedImg, setSelectedImg] = useState(petData.image);

    const handleImageClick = (imgSrc) => {
        setSelectedImg(imgSrc);
    };

    const confirmAdoption = () => {
        if(user===null){
            navigate('/login');
        }
        else{
            navigate(`/pets/${petData.category}/${petData.name}/adopt` , {state: petData })
        }
    }

    useEffect(() => {
        axios.post(`http://localhost:3001/petpreview/:${petData.name}`, {petID})
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
                        <img src={selectedImg} alt={petData.name}/>
                    </div>
                    <div
                        className="petImgCollection"
                        ref={containerRef}
                        onWheel={handleWheel}
                    >
                        <div
                            className="imgBoxes"
                            onMouseEnter={() => handleImageClick(petData.image)}
                        >
                            <img src={petData.image} alt={"img1"}/>
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
                    <h1 className="petNameInfo">{petData.name}</h1>
                    <div className="petInfoList">
                        <h2>Pet Information:</h2>
                        <h3>Breed: {petData.breed}</h3>
                        <h3>Color: {petData.color}</h3>
                        <h3>Age: {petData.age}</h3>
                        <h3>Gender: {petData.gender}</h3>
                        <h3>Behavior: {petData.behavior}</h3>
                        <h3>Health: {petData.health}</h3>
                        <h3 className="petDescriptionInfo">Description: {petData.description}</h3>
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