import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../styles/ManageProfile.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

function ManageProfile() {
    const userData = JSON.parse(localStorage.getItem("loggedUser"))
    const [uploadedImg, setUploadedImg] = useState(userData.userData.image);
    const [showCreatePostBtn, setShowCreatePostBtn] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setformData] = useState({
        fname: userData.userData.fname,
        lname: userData.userData.lname,
        email: userData.userData.email,
        pass: ''
    });
    
    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setformData((prevState) => ({ ...prevState, [name]: value }));
      };

    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if(!formData.fname.trim()) { //if no string is cut means no text entered
          validationErrors.fname = 'First Name is required'
        }
        if(!formData.lname.trim()) { //if no string is cut means no text entered
          validationErrors.lname = 'Last Name is required'
        }
        if(!formData.email.trim()) { //if no string is cut means no text entered
          validationErrors.email = 'Email is required'
        }
        if(!formData.pass.trim()) { //no password entered
          validationErrors.pass = 'Password is required'
        }
        setErrors(validationErrors);
        if(Object.keys(validationErrors).length===0){
            if (!uploadedImg) {
                // Remove the uploaded image
                setUploadedImg(null);
            }
            try {
                const res = await axios.post("http://localhost:3001/upload",{
                    image_url: uploadedImg,
                });
                window.localStorage.removeItem("loggedUser")
                await axios.post("http://localhost:3001/manage",{
                    fname: formData.fname,
                    lname: formData.lname,
                    email: formData.email,
                    pass: formData.pass,
                    image: res.data,
                    token: userData.token,
                    prevEmail: userData.userData.email
                })
                .then(result=>{
                    alert(result.data.message);
                    window.localStorage.setItem("loggedUser", JSON.stringify(result.data))
                }
                )
                .catch(err=>console.log(err));
            }
            catch (err) {
                console.log(err);
            }
            navigate('/pets');
            setUploadedImg(null);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImg(reader.result);
                setShowCreatePostBtn(true);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle invalid file type
            alert("Please upload a valid JPEG or PNG image.");
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="manageProfile">
                <div className="container">
                    <h2>Profile</h2>
                    <p>
                        This information will be displayed publicly so be
                        careful what you share.
                    </p>
                    <hr />
                    <div className="profilePicture">
                        <label>Photo</label>
                        <div className="profilePictureContainer">
                            {uploadedImg ? (
                            <>
                                <img src={uploadedImg} alt={userData.userData.fname}/>
                            </>
                            ) : (
                            <>
                                <img src={userData.userData.image} alt={userData.userData.fname}/>
                            </>
                            )}
                        </div>
                        <label htmlFor="uploadImg" className="btnChangeDP">Change</label>
                        <input
                            type="file"
                            id="uploadImg"
                            accept=".jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </div>
                    <hr />
                    <div className="firstName">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" 
                        id="firstName" 
                        defaultValue={userData.userData.fname}
                        name="fname"
                        onChange={(e) => handleInputChange}/>
                    </div>
                    
                    <hr />
                    <div className="lastName">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" 
                        id="lastName" 
                        defaultValue={userData.userData.lname}
                        name="lname"
                        onChange={handleInputChange}/>
                    </div>
                    <hr />
                    <div className="email">
                        <label htmlFor="email">Email</label>
                        <input type="email" 
                        id="email" 
                        defaultValue={userData.userData.email}
                        name="email"
                        onChange={handleInputChange}/>
                    </div>
                    <hr />
                    <div className="password">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                        id="password"
                        name="pass"
                        onChange={handleInputChange}/>
                    </div>
                    <hr />
                    {/* Please lang ko add logic fre nga unclickable ang btnSaveChanges if walay na modify sa user information */}
                    {showCreatePostBtn && (
                        <button onClick={handleSubmit} className="btnSaveChanges">Save Changes</button>
                    )}
                </div>
            <div className="fnameWarning">{errors.fname && <span> {errors.fname} </span>}</div>
            <div className="lnameWarning">{errors.lname && <span> {errors.lname} </span>}</div>
            <div className="emailWarning">{errors.email && <span> {errors.email} </span>}</div>
            <div className="passWarning">{errors.pass && <span> {errors.pass} </span>}</div>
            </div>
        </div>
    );
}

export default ManageProfile;
