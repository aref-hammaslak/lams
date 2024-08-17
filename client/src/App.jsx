import "./App.css";
import { RootLayout } from "./layouts/RootLayout";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login";
import AdminLabs from "./pages/AdminLabs/AdminLabs";
import AdminProfile from "./pages/AdminProfile/AdminProfile";
import Equipment from "./pages/LabManagement/Equipment";
import Department from "./pages/Setting/Department";
import LogConfig from "./pages/LogConfig";
import RequireAuth from "./components/RequireAuth";
import { Route, Routes } from "react-router-dom";
import Surface from "./pages/LabManagement/Surface";
import Thermometer from "./pages/LabManagement/Termometer";
import Calibration from "./pages/Management/Calibration/Calibration";
import PMService from "./pages/Management/PMService/PMService";
import Reports from "./pages/Reports/Reports";
import LogFilling from "./pages/LogConfig/LogFilling/LogFilling";
import AutoLog from "./pages/LogConfig/AutoLog/AutoLog";
import { Calendar } from "./components/Calendar";
import { Box } from "@mui/material";
import UserProfile from "./pages/UserProfile/UserProfile";
import Scheduler from "./pages/Scheduler";
import Users from "./pages/Users";
import LogFillingProvider from "./contexts/LogFillingProvider.jsx";
import Unauthorized from "./pages/LabManagement/Unauthorized/Unauthorized.jsx";
import { LogLayout } from "./layouts/LogLayout/LogLayout.jsx";
import { ROLES } from "./consts/index.js"
import Dashboard from "./pages/Dashboard/Dashboard.jsx";


function App() {
	return (
		<>
			<Routes>
				<Route element={<RequireAuth allowedRolse={[ROLES.admin, ROLES.supervisor, ROLES.staff]} />}>
					<Route
						path="calendar"
						element={
							<Box margin="5rem" height="90vh">
								<Calendar />
							</Box>
						}
					/>

					<Route path="/" element={<RootLayout />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="home" element={<Home />} />
						<Route element={<RequireAuth allowedRolse={[ROLES.admin, ROLES.supervisor]} />} >
							<Route element={<RequireAuth allowedRolse={[ROLES.admin]} />}>

								<Route path="laboratory" element={<AdminLabs />} />
								<Route path="adminprofile" element={<AdminProfile />} />
							</Route>
							<Route path="lab">
								<Route path="users" element={<UserProfile />} />
								<Route path="schedule" element={<Scheduler />} />
							</Route>
							<Route path="settings">
								<Route path="equipment" element={<Equipment />} />
								<Route path="department" element={<Department />} />
								<Route path="surface" element={<Surface />} />
								<Route path="thermometer" element={<Thermometer />} />
							</Route>
						</Route>

						<Route path="users2/*" element={<Users />} />
						<Route path="log" >
							<Route element={<RequireAuth allowedRolse={[ROLES.admin, ROLES.supervisor]} />} >
								<Route path="autolog" element={<AutoLog />} />
								<Route path="config" element={<LogConfig />} />
								<Route />
							</Route>
							<Route path="logfilling" element={<LogFilling />}/>
						</Route>
					</Route>
				</Route>


				{/* PUBLIC ROUTES */}
				<Route path="/login" element={<Login />} />
				{/*<Route path="*" element={<NotFound />} /> */}
				<Route path="/unauthorized" element={<Unauthorized />} />
			</Routes>
		</>
	);
}

export default App;
