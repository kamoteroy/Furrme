import Login from "../pages/Public/Login";
import Register from "../pages/Public/Register";
import AllPets from "../pages/Public/AllPets";
import Resources from "../pages/Public/Resources";
import FAQS from "../pages/Public/FAQs";
import Dogs from "../pages/Public/DogsPage";
import Cats from "../pages/Public/CatsPage";
import Terms from "../pages/Public/TermsAndConditions";
import ForgotPassword from "../pages/Public/ForgotPassword";

export const PublicRoutes = [
	{ path: "/", element: <Login /> },
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
	{ path: "/pets", element: <AllPets /> },
	{ path: "/pets/Dogs", element: <Cats /> },
	{ path: "/pets/Cats", element: <Dogs /> },
	{ path: "/forgot", element: <ForgotPassword /> },
	{ path: "/resources", element: <Resources /> },
	{ path: "/terms", element: <Terms /> },
	{ path: "/FAQs", element: <FAQS /> },
];
