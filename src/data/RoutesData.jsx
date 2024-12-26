import PetPreview from "../pages/User/PetPreview";
import AdoptPage from "../pages/User/AdoptPage";
import Profile from "../pages/User/ManageProfile";
import Community from "../pages/User/Community";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdoptionRequests from "../pages/Admin/AdoptionRequests";
import CreatePetListing from "../pages/Admin/CreatePetListing";
import PetEvaluation from "../pages/Admin/PetEvaluation";
import PetDetails from "../pages/Admin/PetDetails";

export const RoutesData = [
	{ path: "/profile", element: <Profile /> },
	{ path: "/pets/:category/:id", element: <PetPreview /> },
	{ path: "/pets/:category/:id/adopt", element: <AdoptPage /> },
	{ path: "/community", element: <Community /> },
	{ path: "/admin/pets", element: <AdminDashboard /> },
	{ path: "/admin/request", element: <AdoptionRequests /> },
	{ path: "/admin/create", element: <CreatePetListing /> },
	{ path: "/admin/pets/:category/:name", element: <PetDetails /> },
	{ path: "/admin/evaluate/:name", element: <PetEvaluation /> },
];
