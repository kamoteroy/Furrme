import "../styles/PetCard.css";
import { Link } from "react-router-dom";

function PetCard(pet) {
    return (
        <Link to={`/pets/${pet.data.category}/${pet.data.name}`} state={pet.data} className="petCard">
            <div className="petImgContainer">
            <img src={pet.data.image} alt={pet.data.name} className="petImage" />

            </div>
            <div className="petName">
                <i class="fa-solid fa-paw"></i>
                <h2>{pet.data.name}</h2>
            </div>
            <div className="petAddress">
                <i class="fa-solid fa-location-dot"></i>
                <p>{pet.data.address}</p>
            </div>
        </Link>
    );
}
export default PetCard;