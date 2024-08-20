import React, { useState, useEffect, useRef } from "react";
import "../../styles/AdminPetPreview.css";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
/*import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";*/
import { IoCloseCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function AdminPetPreview() {
  const petData = useLocation().state; //get previous page data
  const [petInfo, setpetInfo] = useState([]);
  const [petImage, setpetImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [base64s, setbase64s] = useState([]);

  useEffect(() => {
    setImages(Object.values(petImage));
    setLoading(false);
  }, [petImage, petInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/petDetails/${petData.pet_id}`)
      .then((res) => setpetInfo(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:3001/petImage/${petData.pet_id}`)
      .then((result) => setpetImage(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedType, setSelectedType] = useState(petInfo.type);
  const [selectedGender, setSelectedGender] = useState(petInfo.gender);
  const [name, setName] = useState(petInfo.name);
  const [breed, setBreed] = useState(petInfo.breed);
  const [color, setColor] = useState(petInfo.color);
  const [age, setAge] = useState(petInfo.age);
  const [behavior, setBehavior] = useState(petInfo.behavior);
  const [health, setHealth] = useState(petInfo.health);
  const [description, setDescription] = useState(petInfo.description);
  const [isChanged, setIsChanged] = useState(false); // State to track if changes were made

  const typeDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      typeDropdownRef.current &&
      !typeDropdownRef.current.contains(event.target)
    ) {
      //    setIsTypeDropdownOpen(false);
    }
    if (
      genderDropdownRef.current &&
      !genderDropdownRef.current.contains(event.target)
    ) {
      //    setIsGenderDropdownOpen(false);
    }
  };

  const handleUploadClick = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;

    fileInput.onchange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length + images.length > 5) {
        alert("You can only upload up to 5 photos.");
        return;
      }
      files.map(async (file) => {
        const result = await convertBlobToBase64(file);
        return result;
      });
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages((prevImages) => [...prevImages, ...newImages]);
      setIsChanged(true);
    };
    fileInput.click();
  };

  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // This will be the Base64 string
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Reads the Blob as a Data URL (base64)
    }).then((res) => base64s.push(res));
  }

  const removeBlob = () => {
    const index2 = images.findIndex((item) => item.includes("blob"));

    if (index2 !== -1) {
      images.splice(index2, 1); // Remove the item at the found index
    }
  };

  const handleSubmit = (e) => {
    const length = images.length;
    if (!images[0]) {
      // Remove the uploaded image
      alert("No image");
      setImages([]);
      return;
    }
    if (base64s) {
      console.log("base64s", base64s);
      console.log("images, ", images.length);
      base64s.forEach(async function (item, index) {
        try {
          const res = await axios.post("http://localhost:3001/upload", {
            image_url: item,
          });
          images.push(res.data);
        } catch (err) {
          console.log(err);
        }

        if (images.some((item) => item.includes("blob"))) {
          console.log(`naa pay blob`);
          removeBlob(); // remove blob links from the images list

          console.log(`${index}`, images);
        } else {
          axios
            .post("http://localhost:3001/admin/infoUpdate", {
              info: petInfo,
              images: images,
            })
            .then((res) => alert("Success"))
            .catch((err) => console.log(err));
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setbase64s(base64s.filter((_, i) => i !== index));
    setIsChanged(true);
  };

  const handleImageClick = (image) => {
    window.open(image, "_blank");
  };

  // Check for changes in the form inputs
  useEffect(() => {
    const isFormChanged =
      name !== petInfo.name ||
      selectedType !== petInfo.type ||
      selectedGender !== petInfo.gender ||
      breed !== petInfo.breed ||
      color !== petInfo.color ||
      age !== petInfo.age ||
      behavior !== petInfo.behavior ||
      health !== petInfo.health ||
      description !== petInfo.description ||
      images.length !== images.length || // Check if image count has changed
      !images.every((image, index) => image === images[index]); // Check if images are the same
  }, [
    name,
    selectedType,
    selectedGender,
    breed,
    color,
    age,
    behavior,
    health,
    description,
    images,
  ]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loading ? (
        <div>
          <ClipLoader color={"#123abc"} loading={loading} size={100} />
          <p>Loading, please wait...</p>
        </div>
      ) : (
        <div className="adminPetPreview">
          <div className="sidebarComp">
            <AdminDashboardSidebar />
          </div>
          <div className="mainContent">
            <div className="divider">
              <div className="petInfoCont">
                <h2>Pet Information</h2>
                <div className="allPetInfo">
                  <div className="infoCont name-type">
                    <div className="infoSet nameSet">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        defaultValue={petInfo.name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                    <div className="infoSet TypeSet" ref={typeDropdownRef}>
                      <label htmlFor="type">Type</label>
                      <input
                        type="text"
                        id="type"
                        value={petInfo.category}
                        onChange={(e) => {
                          setName(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="infoCont breed-color">
                    <div className="infoSet breedSet">
                      <label htmlFor="breed">Breed</label>
                      <input
                        type="text"
                        id="breed"
                        value={petInfo.breed}
                        onChange={(e) => {
                          setBreed(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                    <div className="infoSet colorSet">
                      <label htmlFor="color">Color</label>
                      <input
                        type="text"
                        defaultValue={petInfo.color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="infoCont age-gender">
                    <div className="infoSet ageSet">
                      <label htmlFor="age">Age</label>
                      <input
                        type="text"
                        defaultValue={petInfo.age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                    <div className="infoSet genderSet" ref={genderDropdownRef}>
                      <label htmlFor="gender">Gender</label>
                      <input
                        type="text"
                        value={petInfo.gender}
                        onChange={(e) => {
                          setAge(e.target.value);
                          setIsChanged(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="textAreaConts">
                    <div className="TA-set behavior">
                      <label htmlFor="behavior">Behavior</label>
                      <textarea
                        name="behavior"
                        id="behavior"
                        defaultValue={petInfo.behavior}
                        maxLength="100"
                        onChange={(e) => {
                          setBehavior(e.target.value);
                          setIsChanged(true);
                        }}
                      ></textarea>
                      <p className="charCount"></p>
                    </div>
                    <div className="TA-set health">
                      <label htmlFor="health">Health</label>
                      <textarea
                        name="health"
                        id="health"
                        defaultValue={petInfo.health}
                        maxLength="200"
                        onChange={(e) => {
                          setHealth(e.target.value);
                          setIsChanged(true);
                        }}
                      ></textarea>
                      <p className="charCount"></p>
                    </div>
                    <div className="TA-set description">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        defaultValue={petInfo.description}
                        maxLength="300"
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setIsChanged(true);
                        }}
                      ></textarea>
                      <p className="charCount"></p>
                    </div>
                  </div>
                  {isChanged && (
                    <button
                      onClick={() => handleSubmit()}
                      className="saveChanges"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
              <div className="petImagesContainer">
                <div className="petImgBox">
                  {images.map((image, index) => (
                    <div className="img-container" key={index}>
                      <img
                        src={image}
                        alt={`pet-${index}`}
                        onClick={() => handleImageClick(image)}
                      />
                      <IoCloseCircle
                        className="closeIcon"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  ))}
                </div>
                <button className="uploadPhotos" onClick={handleUploadClick}>
                  Upload Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPetPreview;
