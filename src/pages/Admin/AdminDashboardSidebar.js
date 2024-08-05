import React from "react";
import "../../styles/AdminDashboardSidebar.css";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoPawOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboardSidebar() {
    const navigate = useNavigate();

    const Logout = () => {
        window.localStorage.setItem("loggedUser", '')
        navigate("/")
    }

    return (
        <div className="sidebar">
            <div className="header">
                <Link to="/admin/pets" className="logo">
                    <img src={"https://res.cloudinary.com/dmquudoki/image/upload/v1716127273/FurrMe_Logo_sba9mx.png"} className="webLogo" />
                    <h2>FurrMe</h2>
                </Link>
                <IoNotificationsOutline className="notificationIcon" />
            </div>
            <div className="sidebarNav">
                <ul>
                    <Link to="/admin/pets">
                        <li><IoPawOutline className="navIcon" />
                        Pets</li>
                    </Link>
                    <Link to="/admin/request">
                        <li><IoPeopleOutline className="navIcon" />
                        Adoption Requests</li>
                    </Link>
                    <Link to="/admin/create">
                        <li><CiCirclePlus className="navIcon" />
                        Create Pet Listing</li>
                    </Link>
                    <button onClick={()=> Logout()} className="logout">
                        <li><CiLogout  className="navIcon" />
                        Logout</li>
                    </button>
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboardSidebar;
