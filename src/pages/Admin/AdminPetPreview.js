import React, { useState, useEffect, useRef } from "react";
import "../../styles/AdminPetPreview.css";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
/*import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";*/
import { IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

function AdminPetPreview() {
  const petData = useLocation().state; //get previous page data
  const navigate = useNavigate();
  const getData = useSelector((state) => state.value);
  const token = getData.token;

  const [petInfo, setpetInfo] = useState([]);
  const [petImage, setpetImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [base64s, setbase64s] = useState([]);
  const [isChanged, setIsChanged] = useState(false); // State to track if changes were made

  useEffect(() => {
    setLoading(false);
    let array = Object.values(petImage);
    array = array.filter((item) => item !== null);
    setImages(Object.values(array));
  }, [petImage]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/admin/petDetails/${petData.pet_id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => setpetInfo(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:3001/admin/petImage/${petData.pet_id}`, {
        headers: {
          token: token,
        },
      })
      .then((result) => setpetImage(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();
    setIsChanged(true);
    const { name, value } = e.target;
    setpetInfo((prevState) => ({ ...prevState, [name]: value }));
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
    if (!images[0]) {
      // Remove the uploaded image
      alert("No image");
      setImages([]);
      return;
    }
    if (base64s[0]) {
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
          removeBlob(); // remove blob links from the images list
        }
        base64s.splice(0, 1);
        if (!base64s[0]) {
          update(petInfo, images);
        }
      });
    }
    if (!base64s[0]) {
      update(petInfo, images);
    }
  };

  const update = (info, imagess) => {
    axios
      .post("http://localhost:3001/admin/petInfoUpdate", {
        info: info,
        images: imagess,
        token: token,
      })
      .then((res) => {
        if (res.data === 0) {
          navigate(0);
          alert("Updated Successfully");
        } else {
          alert("Error Updating");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setbase64s(base64s.filter((_, i) => i !== index));
    setIsChanged(true);
  };

  const handleImageClick = (image) => {
    window.open(image, "_blank");
  };

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
                        name="name"
                        value={petInfo.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="infoSet TypeSet">
                      <label htmlFor="type">Type</label>
                      <input
                        readOnly
                        type="text"
                        id="type"
                        value={petInfo.category}
                      />
                    </div>
                  </div>
                  <div className="infoCont breed-color">
                    <div className="infoSet breedSet">
                      <label htmlFor="breed">Breed</label>
                      <input
                        readOnly
                        type="text"
                        id="breed"
                        value={petInfo.breed}
                      />
                    </div>
                    <div className="infoSet colorSet">
                      <label htmlFor="color">Color</label>
                      <input
                        type="text"
                        name="color"
                        value={petInfo.color}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="infoCont age-gender">
                    <div className="infoSet ageSet">
                      <label htmlFor="age">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={petInfo.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="infoSet genderSet">
                      <label htmlFor="gender">Gender</label>
                      <input readOnly type="text" value={petInfo.gender} />
                    </div>
                  </div>
                  <div className="textAreaConts">
                    <div className="TA-set behavior">
                      <label htmlFor="behavior">Behavior</label>
                      <textarea
                        name="behavior"
                        id="behavior"
                        maxLength="100"
                        value={petInfo.behavior}
                        onChange={handleInputChange}
                      ></textarea>
                      <p className="charCount"></p>
                    </div>
                    <div className="TA-set health">
                      <label htmlFor="health">Health</label>
                      <textarea
                        name="health"
                        id="health"
                        maxLength="200"
                        value={petInfo.health}
                        onChange={handleInputChange}
                      ></textarea>
                      <p className="charCount"></p>
                    </div>
                    <div className="TA-set description">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        maxLength="300"
                        value={petInfo.description}
                        onChange={handleInputChange}
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
