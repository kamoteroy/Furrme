import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//PUBLIC
import Login from "./pages/Public/Login";
import Signup from "./pages/Public/Signup";
import Homepage from "./pages/Public/Homepage";
import AllPets from "./pages/Public/AllPets";
import Resources from "./pages/Public/Resources";
import FAQS from "./pages/Public/FAQs";
import Dogs from "./pages/Public/DogsPage";
import Cats from "./pages/Public/CatsPage";
import Terms from "./pages/Public/TermsAndConditions";
import Forgot from "./pages/Public/ForgotPassword";
//USER
import PetPreview from "./pages/User/PetPreview";
import Adoption from "./pages/User/Adoption";
import ManageProfile from "./pages/User/ManageProfile";
import Community from "./pages/User/Community";
//ADMIN
import Admin from "./pages/Admin/AdminDashboard";
import AdminRequest from "./pages/Admin/AdminAdoptionRequests";
import CreatePetListing from "./pages/Admin/CreatePetListing";
import AdminEvaluation from "./pages/Admin/AdminEvaluation";
import AdminPetPreview from "./pages/Admin/AdminPetPreview";

function App() {

    const login = window.localStorage.getItem("isLogged");

    return (
        <Router>
            <Routes>
                <Route path="/" element={login ? <Homepage /> : <AllPets />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pets" element={<AllPets />} />
                <Route path="/pets/:category/:name" element={<PetPreview />} />
                <Route path="/pets/Dogs" element={<Dogs />} />
                <Route path="/pets/Cats" element={<Cats />} />
                <Route path="/pets/:category/:name/adopt" element={<Adoption />} />
                <Route path="/community" element={<Community />} />
                <Route path="/forgotpassword" element={<Forgot />} />
                <Route path="/manage" element={<ManageProfile />} />
                <Route path="/education" element={<Resources />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/FAQS" element={<FAQS />} />
                <Route path="/admin/pets" element={<Admin />} />
                <Route path="/admin/request" element={<AdminRequest />} />
                <Route path="/admin/create" element={<CreatePetListing />} />
                <Route path="/admin/pets/:category/:name" element={<AdminPetPreview />} />
                <Route path="/admin/evaluate/:name" element={<AdminEvaluation />} />
            </Routes>
        </Router>
    );
}

export default App;