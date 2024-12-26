import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/Public/Homepage";
import AllPets from "./pages/Public/AllPets";
import { RoutesData } from "./data/RoutesData";
import { PublicRoutes } from "./data/PublicRoutes";

function App() {
	const user = useSelector((state) => state.value);
	return (
		<Router>
			<Routes>
				<Route path="/" element={user ? <AllPets /> : <Homepage />} />
				{PublicRoutes.map((route, index) => (
					<Route key={index} path={route.path} element={route.element} />
				))}
				{RoutesData.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={route.element}
						//element={<RequireAuth>{route.element}</RequireAuth>}
					/>
				))}
			</Routes>
		</Router>
	);
}

export default App;
